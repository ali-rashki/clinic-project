from rest_framework import serializers
from .models import Specialty, DiseaseCategory, DoctorProfile


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = '__all__'


class DiseaseCategorySerializer(serializers.ModelSerializer):
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)

    class Meta:
        model = DiseaseCategory
        fields = '__all__'


class DoctorProfileSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True, allow_null=True)
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = (
            'id', 'user', 'user_full_name',
            'specialty', 'specialty_name',
            'clinic', 'clinic_name',
            'city', 'address',
            'consultation_fee',
            'gender', 'visit_type',
            'bio', 'experience_years', 'license_number',
            'profile_picture', 'profile_picture_url',
            'is_verified', 'is_approved',
            'approved_at', 'approved_by'
        )
        read_only_fields = ('id', 'is_verified', 'is_approved', 'approved_at', 'approved_by')

    def get_profile_picture(self, obj):
        return obj.get_profile_picture()
