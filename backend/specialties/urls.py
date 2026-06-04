from django.urls import path
from .views import SpecialtyListView, DoctorListView

urlpatterns = [
    path('', SpecialtyListView.as_view(), name='specialty-list'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
]