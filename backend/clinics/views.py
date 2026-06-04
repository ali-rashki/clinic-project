from rest_framework import generics, permissions
from .models import Clinic
from .serializers import ClinicSerializer


class ClinicListView(generics.ListAPIView):
    """لیست کلینیک‌های فعال"""
    queryset = Clinic.objects.filter(is_active=True)
    serializer_class = ClinicSerializer
    permission_classes = [permissions.AllowAny]