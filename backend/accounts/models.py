from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'بیمار'),
        ('doctor', 'پزشک'),
        ('clinic_admin', 'مدیر کلینیک'),
        ('super_admin', 'مدیر سایت'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone = models.CharField(max_length=11, unique=True)
    profile_picture_url = models.URLField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def get_profile_picture(self):
        if self.profile_picture:
            return self.profile_picture.url
        elif self.profile_picture_url:
            return self.profile_picture_url
        else:
            return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'

    def get_role_display(self):
        role_map = {
            'patient': 'بیمار',
            'doctor': 'پزشک',
            'clinic_admin': 'مدیر کلینیک',
            'super_admin': 'مدیر سایت',
        }
        return role_map.get(self.role, self.role)

    def __str__(self):
        full_name = self.get_full_name().strip()
        if full_name:
            return f"{full_name} ({self.username})"
        return f"{self.username} - {self.get_role_display()}"
