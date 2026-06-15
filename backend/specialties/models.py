from django.db import models
from django.conf import settings


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "تخصص"
        verbose_name_plural = "تخصص‌ها"
        ordering = ['name']


class DiseaseCategory(models.Model):
    name = models.CharField(max_length=200, verbose_name="نام بیماری")
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='diseases')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.specialty.name}"

    class Meta:
        verbose_name = "دسته‌بندی بیماری"
        verbose_name_plural = "دسته‌بندی بیماری‌ها"
        ordering = ['name']


class DoctorProfile(models.Model):
    GENDER_CHOICES = (
        ('male', 'آقا'),
        ('female', 'خانم'),
    )

    VISIT_TYPE_CHOICES = (
        ('in_person', 'حضوری'),
        ('online', 'آنلاین'),
        ('both', 'هر دو'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile',
                                verbose_name='کاربر')
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='doctors', verbose_name='تخصص')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='doctors', verbose_name='کلینیک')

    # فیلدهای مستقل برای مطب شخصی پزشک
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="شهر")
    address = models.TextField(blank=True, null=True, verbose_name="آدرس مطب")

    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="هزینه ویزیت")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name="جنسیت")
    visit_type = models.CharField(max_length=10, choices=VISIT_TYPE_CHOICES, default='both', verbose_name="نوع ویزیت")

    bio = models.TextField(blank=True, null=True, verbose_name="بیوگرافی")
    experience_years = models.PositiveIntegerField(default=0, verbose_name="سال سابقه")
    license_number = models.CharField(max_length=50, unique=True, verbose_name="شماره نظام پزشکی")
    is_approved = models.BooleanField(default=False, verbose_name="تایید شده")

    def __str__(self):
        return f"دکتر {self.user.get_full_name()} - {self.specialty.name}"

    class Meta:
        verbose_name = "پزشک"
        verbose_name_plural = "پزشکان"