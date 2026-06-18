from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import models as db_models
from .models import Appointment, DoctorAvailability
from .serializers import AppointmentSerializer, DoctorAvailabilitySerializer


class IsPatient(permissions.BasePermission):
    """فقط کاربران با نقش بیمار"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'patient'


class IsDoctor(permissions.BasePermission):
    """فقط کاربران با نقش پزشک"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'doctor'


class AppointmentCreateView(generics.CreateAPIView):
    """رزرو نوبت جدید توسط بیمار"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsPatient]

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class PatientAppointmentsView(generics.ListAPIView):
    """مشاهده لیست نوبت‌های بیمار لاگین شده"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):
        # FIX 7: select_related برای جلوگیری از N+1 query
        return Appointment.objects.filter(
            patient=self.request.user
        ).select_related(
            'doctor__user',
            'doctor__specialty',
            'patient'
        ).order_by('-appointment_date', 'appointment_time')


class DoctorAppointmentsView(generics.ListAPIView):
    """مشاهده لیست نوبت‌های پزشک لاگین شده"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        # FIX 7: select_related برای جلوگیری از N+1 query
        return Appointment.objects.filter(
            doctor__user=self.request.user
        ).select_related(
            'doctor__user',
            'doctor__specialty',
            'patient'
        ).order_by('-appointment_date', 'appointment_time')


class AppointmentCancelView(generics.UpdateAPIView):
    """لغو نوبت توسط بیمار یا پزشک"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'patient':
            return Appointment.objects.filter(patient=user)
        elif getattr(user, 'role', None) == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.none()

    def patch(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user

        if appointment.status in ['completed', 'cancelled_by_patient', 'cancelled_by_doctor']:
            return Response(
                {"error": "این نوبت قابل لغو نیست."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if getattr(user, 'role', None) == 'patient':
            appointment.status = 'cancelled_by_patient'
        else:
            appointment.status = 'cancelled_by_doctor'

        appointment.cancellation_reason = request.data.get('cancellation_reason', '')
        appointment.save()

        return Response(AppointmentSerializer(appointment).data)


class DoctorAvailabilityView(generics.ListAPIView):
    """دریافت ساعات کاری یک پزشک خاص"""
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return DoctorAvailability.objects.filter(
            doctor_id=doctor_id,
            is_active=True
        ).select_related('doctor__user')
