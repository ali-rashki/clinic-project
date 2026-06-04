from django.urls import path
from .views import AppointmentCreateView, PatientAppointmentsView, DoctorAppointmentsView, DoctorAvailabilityView

urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('my/', PatientAppointmentsView.as_view(), name='patient-appointments'),
    path('doctor/', DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('availability/<int:doctor_id>/', DoctorAvailabilityView.as_view(), name='doctor-availability'),
]
