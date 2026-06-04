from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'get_full_name', 'phone', 'role', 'is_verified', 'is_active')
    list_filter = ('role', 'is_verified', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'phone')

    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات اضافی', {'fields': ('role', 'phone', 'profile_picture_url', 'profile_picture', 'is_verified')}),
    )

    # این بخش را اضافه کنید تا فیلدهای role و phone در صفحه Add user نمایش داده شوند
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('اطلاعات اضافی', {'fields': ('role', 'phone')}),
    )


admin.site.register(User, CustomUserAdmin)
