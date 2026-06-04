from django.urls import path
from .views import ClinicListView

urlpatterns = [
    path('', ClinicListView.as_view(), name='clinic-list'),
]