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

    class Meta:
        model = DoctorProfile
        fields = '__all__'
