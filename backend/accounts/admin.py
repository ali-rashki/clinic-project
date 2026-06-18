from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html  # ← این خط رو اضافه کن
from .models import User


class PatientFilter(admin.SimpleListFilter):
    """فیلتر برای نمایش فقط بیماران"""
    title = 'نقش کاربر'
    parameter_name = 'role'

    def lookups(self, request, model_admin):
        return (
            ('patient', 'بیمار'),
            ('clinic_admin', 'مدیر کلینیک'),
            ('super_admin', 'مدیر سایت'),
        )

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(role=self.value())
        return queryset


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    پنل مدیریت کاربران - فقط بیماران و ادمین‌ها
    پزشکان از طریق specialties/doctorprofile مدیریت میشن
    """

    list_display = ('username', 'get_full_name', 'phone', 'role_badge', 'is_active', 'date_joined')
    list_filter = (PatientFilter, 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'phone', 'email')
    ordering = ('-date_joined',)
    list_per_page = 25

    fieldsets = (
        ('اطلاعات ورود', {'fields': ('username', 'password')}),
        ('اطلاعات شخصی', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('نقش و وضعیت', {'fields': ('role', 'is_active', 'is_verified')}),
        ('عکس پروفایل', {'fields': ('profile_picture', 'profile_picture_url'), 'classes': ('collapse',)}),
        ('دسترسی‌ها', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions'), 'classes': ('collapse',)}),
        ('تاریخ‌ها', {'fields': ('last_login', 'date_joined'), 'classes': ('collapse',)}),
    )

    add_fieldsets = (
        ('اطلاعات ورود', {
            'fields': ('username', 'password1', 'password2'),
        }),
        ('اطلاعات شخصی', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'role'),
        }),
    )

    readonly_fields = ('last_login', 'date_joined')

    def get_queryset(self, request):
        """فقط کاربران غیر پزشک نمایش داده میشن - پزشکان از DoctorProfile مدیریت میشن"""
        return super().get_queryset(request).exclude(role='doctor')

    def role_badge(self, obj):
        colors = {
            'patient': '#28a745',
            'clinic_admin': '#fd7e14',
            'super_admin': '#dc3545',
        }
        labels = {
            'patient': 'بیمار',
            'clinic_admin': 'مدیر کلینیک',
            'super_admin': 'مدیر سایت',
        }
        color = colors.get(obj.role, '#6c757d')
        label = labels.get(obj.role, obj.role)
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:12px">{}</span>',
            color, label
        )
    role_badge.short_description = 'نقش'

    def get_full_name(self, obj):
        return obj.get_full_name() or '—'
    get_full_name.short_description = 'نام کامل'