from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User
from specialties.models import Specialty, DoctorProfile


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                  'phone', 'role', 'role_display', 'profile_picture', 'is_verified')
        read_only_fields = ('id', 'is_verified')

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_role_display(self, obj):
        return obj.get_role_display()

    def get_profile_picture(self, obj):
        return obj.get_profile_picture()


class RegisterSerializer(serializers.ModelSerializer):
    """ثبت‌نام کاربر جدید (بیمار یا پزشک)"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    # فیلدهای اضافی مخصوص پزشک (اختیاری برای بیمار)
    specialty_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    gender = serializers.ChoiceField(choices=[('male', 'آقا'), ('female', 'خانم')], required=False, allow_blank=True)
    visit_type = serializers.ChoiceField(choices=[('in_person', 'حضوری'), ('online', 'آنلاین'), ('both', 'هر دو')],
                                         required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(required=False, allow_null=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'phone', 'role',
                  'specialty_id', 'consultation_fee', 'gender', 'visit_type', 'bio', 'experience_years',
                  'license_number', 'city', 'address')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "رمز عبور با تکرار آن مطابقت ندارد"})

        # اگه نقش پزشک هست، فیلدهای مربوطه رو چک کن
        if attrs.get('role') == 'doctor':
            if not attrs.get('license_number'):
                raise serializers.ValidationError({"license_number": "شماره نظام پزشکی الزامی است"})
            if not attrs.get('specialty_id'):
                raise serializers.ValidationError({"specialty_id": "تخصص الزامی است"})
            if not attrs.get('consultation_fee'):
                raise serializers.ValidationError({"consultation_fee": "هزینه ویزیت الزامی است"})

        return attrs

    def create(self, validated_data):
        # حذف فیلد تایید رمز
        validated_data.pop('password2')

        # استخراج فیلدهای پزشک
        specialty_id = validated_data.pop('specialty_id', None)
        consultation_fee = validated_data.pop('consultation_fee', None)
        gender = validated_data.pop('gender', None)
        visit_type = validated_data.pop('visit_type', None)
        bio = validated_data.pop('bio', None)
        experience_years = validated_data.pop('experience_years', None)
        license_number = validated_data.pop('license_number', None)
        city = validated_data.pop('city', None)
        address = validated_data.pop('address', None)

        role = validated_data.get('role', 'patient')

        # اگه کاربر نقش پزشک داره، فقط is_verified=False بذار (نقش رو عوض نکن)
        if role == 'doctor':
            validated_data['is_verified'] = False
            # نقش doctor حفظ می‌شود، تغییر نمی‌کند

        # ساخت کاربر
        user = User.objects.create_user(**validated_data)

        # اگه کاربر پزشک هست و اطلاعات لازم رو داده، یه DoctorProfile بساز
        if role == 'doctor' and license_number and specialty_id:
            try:
                specialty = Specialty.objects.get(id=specialty_id)
                DoctorProfile.objects.create(
                    user=user,
                    specialty=specialty,
                    consultation_fee=consultation_fee or 0,
                    gender=gender or 'male',
                    visit_type=visit_type or 'both',
                    bio=bio or '',
                    experience_years=experience_years or 0,
                    license_number=license_number,
                    city=city or '',
                    address=address or '',
                    is_approved=False  # منتظر تایید ادمین
                )
            except Specialty.DoesNotExist:
                pass

        return user
