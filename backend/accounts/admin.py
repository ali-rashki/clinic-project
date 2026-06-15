from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User
from specialties.models import DoctorProfile


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'get_full_name', 'phone', 'role', 'is_verified', 'is_active')
    list_filter = ('role', 'is_verified', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'phone')

    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات اضافی', {'fields': ('role', 'phone', 'profile_picture_url', 'profile_picture')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('اطلاعات اضافی', {'fields': ('role', 'phone')}),
    )

    readonly_fields = ('get_specialty', 'get_license_number', 'get_consultation_fee',
                       'get_gender', 'get_visit_type', 'get_experience_years', 'get_bio')

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)

        # فقط برای کاربرانی که DoctorProfile دارند
        if obj and hasattr(obj, 'doctor_profile'):
            doctor_fieldsets = (
                ('اطلاعات پزشکی', {
                    'fields': ('get_specialty', 'get_license_number', 'get_consultation_fee',
                               'get_gender', 'get_visit_type', 'get_experience_years', 'get_bio',
                               'is_verified'),
                    'description': 'این اطلاعات توسط پزشک ثبت شده است.'
                }),
            )
            # تغییر نام نمایشی is_verified
            self.fieldsets = list(self.fieldsets)
            for fieldset in self.fieldsets:
                if fieldset[0] == 'اطلاعات اضافی':
                    break
            fieldsets = fieldsets + doctor_fieldsets

            # تغییر verbose_name فیلد is_verified برای نمایش در فرم
            self.formfield_overrides = {
                User._meta.get_field('is_verified'): {'label': 'وضعیت تأیید پزشک'}
            }
        else:
            # اگه کاربر پزشک نیست
            fieldsets = list(fieldsets)
            for i, fieldset in enumerate(fieldsets):
                if fieldset[0] == 'اطلاعات اضافی':
                    fieldsets[i] = ('اطلاعات اضافی', {
                        'fields': ('role', 'phone', 'profile_picture_url', 'profile_picture', 'is_verified')})
                    break
            fieldsets = tuple(fieldsets)

        return fieldsets

    def get_specialty(self, obj):
        try:
            return obj.doctor_profile.specialty.name
        except:
            return '-'

    get_specialty.short_description = 'تخصص'

    def get_license_number(self, obj):
        try:
            return obj.doctor_profile.license_number
        except:
            return '-'

    get_license_number.short_description = 'شماره نظام پزشکی'

    def get_consultation_fee(self, obj):
        try:
            return f"{obj.doctor_profile.consultation_fee:,.0f} تومان"
        except:
            return '-'

    get_consultation_fee.short_description = 'هزینه ویزیت'

    def get_gender(self, obj):
        try:
            return dict(DoctorProfile.GENDER_CHOICES).get(obj.doctor_profile.gender, '-')
        except:
            return '-'

    get_gender.short_description = 'جنسیت'

    def get_visit_type(self, obj):
        try:
            return dict(DoctorProfile.VISIT_TYPE_CHOICES).get(obj.doctor_profile.visit_type, '-')
        except:
            return '-'

    get_visit_type.short_description = 'نوع ویزیت'

    def get_experience_years(self, obj):
        try:
            return f"{obj.doctor_profile.experience_years} سال"
        except:
            return '-'

    get_experience_years.short_description = 'سال سابقه'

    def get_bio(self, obj):
        try:
            bio = obj.doctor_profile.bio
            return bio[:100] + '...' if len(bio) > 100 else bio
        except:
            return '-'

    get_bio.short_description = 'بیوگرافی'


admin.site.register(User, CustomUserAdmin)