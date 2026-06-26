from django.db import models
from django.conf import settings
from django.utils import timezone


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

    # ارتباطات
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile',
                                verbose_name='کاربر')
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='doctors', verbose_name='تخصص')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='doctors', verbose_name='کلینیک')

    # موقعیت مکانی
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="شهر")
    address = models.TextField(blank=True, null=True, verbose_name="آدرس مطب")

    # اطلاعات حرفه‌ای
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="هزینه ویزیت")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name="جنسیت")
    visit_type = models.CharField(max_length=10, choices=VISIT_TYPE_CHOICES, default='both', verbose_name="نوع ویزیت")
    bio = models.TextField(blank=True, null=True, verbose_name="بیوگرافی")
    experience_years = models.PositiveIntegerField(default=0, verbose_name="سال سابقه")
    license_number = models.CharField(max_length=50, unique=True, verbose_name="شماره نظام پزشکی")

    # عکس پروفایل پزشک
    profile_picture = models.ImageField(upload_to='doctors/', blank=True, null=True, verbose_name="عکس پروفایل")
    profile_picture_url = models.URLField(blank=True, null=True, verbose_name="لینک عکس پروفایل")

    # وضعیت تایید
    is_verified = models.BooleanField(default=False, verbose_name="تایید شده توسط ادمین")
    is_approved = models.BooleanField(default=False, verbose_name="تایید شده (قدیمی)")
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name="تاریخ تایید")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='approved_doctors', verbose_name='تایید شده توسط')

    def get_profile_picture(self):
        """برگرداندن عکس پروفایل با اولویت: آپلودی > لینک خارجی > پیش‌فرض"""
        if self.profile_picture:
            return self.profile_picture.url
        elif self.profile_picture_url:
            return self.profile_picture_url
        return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'

    def save(self, *args, **kwargs):
        if self.is_verified:
            self.is_approved = True
            if not self.approved_at:
                self.approved_at = timezone.now()
        elif self.is_approved and not self.is_verified:
            self.is_verified = True

        super().save(*args, **kwargs)

    def __str__(self):
        return f"دکتر {self.user.get_full_name()} - {self.specialty.name}"

    class Meta:
        verbose_name = "پزشک"
        verbose_name_plural = "پزشکان"
