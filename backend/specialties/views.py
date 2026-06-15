from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Specialty, DoctorProfile
from .serializers import SpecialtySerializer, DoctorProfileSerializer


class SpecialtyListView(generics.ListAPIView):
    """لیست تمام تخصص‌ها"""
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [permissions.AllowAny]


class DoctorListView(generics.ListAPIView):
    """لیست پزشکان تأیید شده با قابلیت جستجو و فیلتر"""
    queryset = DoctorProfile.objects.filter(is_approved=True, user__is_verified=True)
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # فیلترهای دقیق
    filterset_fields = {
        'specialty__id': ['exact'],
        'specialty__name': ['icontains'],  # تغییر کرد
        'gender': ['exact'],
        'visit_type': ['exact'],
        'city': ['icontains'],  # تغییر کرد
        'consultation_fee': ['lte', 'gte'],
        'experience_years': ['gte', 'lte'],
        'clinic__id': ['exact'],
        'clinic__city': ['icontains'],  # تغییر کرد
    }

    # جستجوی متنی
    search_fields = [
        'user__first_name',
        'user__last_name',
        'specialty__name',
        'city',
        'clinic__name',
        'clinic__city'
    ]

    ordering_fields = ['consultation_fee', 'experience_years', 'user__first_name']
    ordering = ['user__first_name']