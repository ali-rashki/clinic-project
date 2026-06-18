from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from specialties.models import DoctorProfile


class DoctorAvailability(models.Model):
    DAYS_OF_WEEK = (
        (0, 'شنبه'),
        (1, 'یک‌شنبه'),
        (2, 'دوشنبه'),
        (3, 'سه‌شنبه'),
        (4, 'چهارشنبه'),
        (5, 'پنج‌شنبه'),
        (6, 'جمعه'),
    )

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK, verbose_name="روز هفته")
    start_time = models.TimeField(verbose_name="ساعت شروع")
    end_time = models.TimeField(verbose_name="ساعت پایان")
    slot_duration = models.IntegerField(default=30, verbose_name="مدت هر نوبت (دقیقه)")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    def clean(self):
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError("ساعت شروع باید قبل از ساعت پایان باشد.")

    def __str__(self):
        return f"{self.doctor.user.get_full_name()} - {self.get_day_of_week_display()} {self.start_time} تا {self.end_time}"

    class Meta:
        verbose_name = "ساعت کاری"
        verbose_name_plural = "ساعت‌های کاری"
        ordering = ['doctor', 'day_of_week', 'start_time']
        unique_together = ['doctor', 'day_of_week']


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'در انتظار تایید پزشک'),
        ('confirmed', 'تایید شده'),
        ('completed', 'انجام شده'),
        ('cancelled_by_patient', 'لغو شده توسط بیمار'),
        ('cancelled_by_doctor', 'لغو شده توسط پزشک'),
        ('no_show', 'حضور نیافته (بیمار)'),
    )

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments',
        limit_choices_to={'role': 'patient'}
    )
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField(verbose_name="تاریخ نوبت")
    appointment_time = models.TimeField(verbose_name="ساعت نوبت")
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending', verbose_name="وضعیت")
    cancellation_reason = models.TextField(blank=True, null=True, verbose_name="دلیل کنسلی")
    symptoms = models.TextField(blank=True, null=True, verbose_name="علائم بیماری")
    note = models.TextField(blank=True, null=True, verbose_name="توضیحات اضافی")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    def clean(self):
        # FIX 1: چک کردن تاریخ نوبت در آینده باشه
        if self.appointment_date and self.appointment_date < timezone.now().date():
            raise ValidationError("تاریخ نوبت نمیتواند در گذشته باشد.")

        # FIX 2: چک کردن ساعت کاری پزشک
        if self.appointment_date and self.appointment_time and self.doctor_id:
            # روز هفته به فرمت ایرانی (شنبه=0)
            weekday = self.appointment_date.weekday()  # Mon=0..Sun=6
            # تبدیل به فرمت ایرانی: شنبه=0 ... جمعه=6
            iranian_day = (weekday + 2) % 7

            availability = DoctorAvailability.objects.filter(
                doctor_id=self.doctor_id,
                day_of_week=iranian_day,
                is_active=True
            ).first()

            if not availability:
                raise ValidationError("پزشک در این روز ویزیت ندارد.")

            if not (availability.start_time <= self.appointment_time <= availability.end_time):
                raise ValidationError(
                    f"ساعت نوبت باید بین {availability.start_time} و {availability.end_time} باشد."
                )

    def __str__(self):
        return f"{self.patient.get_full_name()} - دکتر {self.doctor.user.get_full_name()} - {self.appointment_date} {self.appointment_time}"

    class Meta:
        verbose_name = "نوبت"
        verbose_name_plural = "نوبت‌ها"
        ordering = ['-appointment_date', 'appointment_time']
        # FIX 1: جلوگیری از double booking در سطح database
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
