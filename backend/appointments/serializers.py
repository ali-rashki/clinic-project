from rest_framework import serializers
from django.db import transaction
from .models import DoctorAvailability, Appointment


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = DoctorAvailability
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient', 'created_at', 'updated_at', 'status')

    def validate(self, attrs):
        doctor = attrs.get('doctor')
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')

        if doctor and appointment_date and appointment_time:
            # FIX 1: چک double booking - نوبت تکراری نباشه
            qs = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status__in=['pending', 'confirmed']
            )
            # هنگام update، instance فعلی رو exclude کن
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    "این نوبت قبلاً رزرو شده است. لطفاً ساعت دیگری انتخاب کنید."
                )

            # FIX 2: چک تایید بودن پزشک
            if not doctor.is_verified:
                raise serializers.ValidationError("این پزشک هنوز تایید نشده است.")

        return attrs

    def create(self, validated_data):
        # FIX 1: استفاده از select_for_update برای جلوگیری از race condition
        with transaction.atomic():
            doctor = validated_data['doctor']
            appointment_date = validated_data['appointment_date']
            appointment_time = validated_data['appointment_time']

            # Lock کردن رکوردهای مرتبط برای جلوگیری از همزمانی
            conflicting = Appointment.objects.select_for_update().filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status__in=['pending', 'confirmed']
            )

            if conflicting.exists():
                raise serializers.ValidationError(
                    "این نوبت همین لحظه توسط کاربر دیگری رزرو شد. لطفاً دوباره تلاش کنید."
                )

            return Appointment.objects.create(**validated_data)
