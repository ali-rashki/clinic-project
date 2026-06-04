from rest_framework import generics, permissions
from .models import Specialty, DoctorProfile
from .serializers import SpecialtySerializer, DoctorProfileSerializer


class SpecialtyListView(generics.ListAPIView):
    """لیست تمام تخصص‌ها"""
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.AllowAny]


class DoctorListView(generics.ListAPIView):
    """لیست پزشکان تأیید شده"""
    queryset = DoctorProfile.objects.filter(is_approved=True)
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]