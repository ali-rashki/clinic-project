from django.contrib import admin
from django.utils import timezone
from django.contrib import messages
from .models import Specialty, DiseaseCategory, DoctorProfile
from accounts.models import User


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name', 'doctor_count')
    search_fields = ('name',)

    def doctor_count(self, obj):
        count = obj.doctors.filter(is_approved=True).count()
        return f"{count} پزشک"
    doctor_count.short_description = 'تعداد پزشکان تایید شده'


@admin.register(DiseaseCategory)
class DiseaseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty')
    list_filter = ('specialty',)
    search_fields = ('name',)


class VerificationStatusFilter(admin.SimpleListFilter):
    title = 'وضعیت تایید'
    parameter_name = 'verification'

    def lookups(self, request, model_admin):
        return (
            ('pending', '⏳ در انتظار تایید'),
            ('verified', '✅ تایید شده'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'pending':
            return queryset.filter(is_approved=False)
        if self.value() == 'verified':
            return queryset.filter(is_approved=True)
        return queryset


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = (
        'doctor_full_name',
        'specialty',
        'license_number',
        'city',
        'consultation_fee_display',
        'experience_years',
        'visit_type',
        'verification_status',
        'registered_at',
    )

    list_filter = (VerificationStatusFilter, 'specialty', 'gender', 'visit_type')
    search_fields = ('user__first_name', 'user__last_name', 'license_number', 'user__phone')
    ordering = ('-is_approved', '-user__date_joined')
    list_per_page = 20

    actions = ['approve_doctors', 'reject_doctors']

    readonly_fields = ('registered_at',)

    fieldsets = (
        ('👤 اطلاعات کاربر', {
            'fields': ('user',),
        }),
        ('🏥 اطلاعات پزشکی', {
            'fields': (
                'specialty',
                'license_number',
                'experience_years',
                'consultation_fee',
                'gender',
                'visit_type',
                'bio',
            ),
        }),
        ('📍 مکان', {
            'fields': ('clinic', 'city', 'address'),
        }),
        ('✅ وضعیت تایید', {
            'fields': ('is_approved',),
            'description': 'برای تایید پزشک، تیک "تایید شده" را بزنید.',
        }),
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'user':
            kwargs['queryset'] = User.objects.filter(role='doctor')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if obj.is_approved:
            User.objects.filter(pk=obj.user_id).update(is_verified=True)
            messages.success(request, f'✅ دکتر {obj.user.get_full_name()} با موفقیت تایید شد.')
        else:
            User.objects.filter(pk=obj.user_id).update(is_verified=False)
        super().save_model(request, obj, form, change)

    def doctor_full_name(self, obj):
        name = obj.user.get_full_name() or obj.user.username
        phone = obj.user.phone or ''
        return f"{name} - {phone}"
    doctor_full_name.short_description = 'نام پزشک'

    def verification_status(self, obj):
        if obj.is_approved:
            return "✅ تایید شده"
        return "⏳ در انتظار تایید"
    verification_status.short_description = 'وضعیت'

    def consultation_fee_display(self, obj):
        return f"{int(obj.consultation_fee):,} تومان"
    consultation_fee_display.short_description = 'هزینه ویزیت'

    def registered_at(self, obj):
        return obj.user.date_joined.strftime('%Y/%m/%d')
    registered_at.short_description = 'تاریخ ثبت‌نام'

    @admin.action(description='✅ تایید پزشکان انتخاب شده')
    def approve_doctors(self, request, queryset):
        count = 0
        for doctor in queryset.filter(is_approved=False):
            doctor.is_approved = True
            doctor.save()
            User.objects.filter(pk=doctor.user_id).update(is_verified=True)
            count += 1
        self.message_user(request, f'✅ {count} پزشک با موفقیت تایید شدند.', messages.SUCCESS)

    @admin.action(description='❌ لغو تایید پزشکان انتخاب شده')
    def reject_doctors(self, request, queryset):
        count = queryset.filter(is_approved=True).count()
        queryset.update(is_approved=False)
        user_ids = queryset.values_list('user_id', flat=True)
        User.objects.filter(pk__in=user_ids).update(is_verified=False)
        self.message_user(request, f'❌ تایید {count} پزشک لغو شد.', messages.WARNING)