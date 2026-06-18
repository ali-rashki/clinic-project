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
        print("📥 [validate] Received data:", attrs)

        if attrs['password'] != attrs['password2']:
            print("❌ [validate] Passwords don't match")
            raise serializers.ValidationError({"password": "رمز عبور با تکرار آن مطابقت ندارد"})

        # اگه نقش پزشک هست، فیلدهای مربوطه رو چک کن
        if attrs.get('role') == 'doctor':
            print("📥 [validate] Role is doctor, checking required fields...")
            if not attrs.get('license_number'):
                print("❌ [validate] Missing license_number")
                raise serializers.ValidationError({"license_number": "شماره نظام پزشکی الزامی است"})
            if not attrs.get('specialty_id'):
                print("❌ [validate] Missing specialty_id")
                raise serializers.ValidationError({"specialty_id": "تخصص الزامی است"})
            if not attrs.get('consultation_fee'):
                print("❌ [validate] Missing consultation_fee")
                raise serializers.ValidationError({"consultation_fee": "هزینه ویزیت الزامی است"})
            print("✅ [validate] All doctor fields validated OK!")
        else:
            print("📥 [validate] Role is NOT doctor, skipping doctor validation")

        return attrs

    def create(self, validated_data):
        print("📥 [create] Starting create with validated_data:", validated_data)

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

        print(
            f"📥 [create] Extracted doctor fields: specialty_id={specialty_id}, license_number={license_number}, consultation_fee={consultation_fee}")

        role = validated_data.get('role', 'patient')
        print(f"📥 [create] Role: {role}")

        # اگه کاربر نقش پزشک داره، فقط is_verified=False بذار (نقش رو عوض نکن)
        if role == 'doctor':
            validated_data['is_verified'] = False
            print("📥 [create] Set is_verified=False for doctor")

        # ساخت کاربر
        user = User.objects.create_user(**validated_data)
        print(f"✅ [create] User created: {user.username} (ID: {user.id})")

        # اگه کاربر پزشک هست و اطلاعات لازم رو داده، یه DoctorProfile بساز/به‌روزرسانی کن
        if role == 'doctor':
            print("📥 [create] Creating/updating DoctorProfile for doctor...")
            specialty = None
            if specialty_id:
                try:
                    specialty = Specialty.objects.get(id=specialty_id)
                    print(f"✅ [create] Found specialty: {specialty.name}")
                except Specialty.DoesNotExist:
                    print(f"❌ [create] Specialty with id {specialty_id} not found")
                    specialty = None

            fallback_specialty = Specialty.objects.first()
            print(f"📥 [create] Fallback specialty: {fallback_specialty}")

            doctor_profile, created = DoctorProfile.objects.get_or_create(
                user=user,
                defaults={
                    'specialty': specialty or fallback_specialty,
                    'consultation_fee': consultation_fee or 0,
                    'gender': gender or 'male',
                    'visit_type': visit_type or 'both',
                    'bio': bio or '',
                    'experience_years': experience_years or 0,
                    'license_number': license_number or '',
                    'city': city or '',
                    'address': address or '',
                    'is_verified': False,
                    'is_approved': False,
                },
            )
            print(f"📥 [create] DoctorProfile {'created' if created else 'updated'}")

            if not created:
                print("📥 [create] Updating existing DoctorProfile...")
                if specialty:
                    doctor_profile.specialty = specialty
                if consultation_fee is not None:
                    doctor_profile.consultation_fee = consultation_fee
                if gender:
                    doctor_profile.gender = gender
                if visit_type:
                    doctor_profile.visit_type = visit_type
                if bio is not None:
                    doctor_profile.bio = bio
                if experience_years is not None:
                    doctor_profile.experience_years = experience_years
                if license_number:
                    doctor_profile.license_number = license_number
                if city is not None:
                    doctor_profile.city = city
                if address is not None:
                    doctor_profile.address = address
                doctor_profile.is_verified = False
                doctor_profile.is_approved = False
                doctor_profile.save()
                print("✅ [create] DoctorProfile updated and saved")

        print(
            f"✅ [create] DoctorProfile exists for user {user.username}: {DoctorProfile.objects.filter(user=user).exists()}")

        return user