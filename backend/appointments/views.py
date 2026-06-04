from rest_framework import generics, permissions
from .models import Appointment, DoctorAvailability
from .serializers import AppointmentSerializer, DoctorAvailabilitySerializer


class AppointmentCreateView(generics.CreateAPIView):
    """رزرو نوبت جدید توسط بیمار"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class PatientAppointmentsView(generics.ListAPIView):
    """مشاهده لیست نوبت‌های بیمار لاگین شده"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)


class DoctorAppointmentsView(generics.ListAPIView):
    """مشاهده لیست نوبت‌های پزشک لاگین شده"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(doctor__user=self.request.user)


class DoctorAvailabilityView(generics.ListAPIView):
    """دریافت ساعات کاری یک پزشک خاص (بدون نیاز به لاگین)"""
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return DoctorAvailability.objects.filter(doctor_id=doctor_id, is_active=True)