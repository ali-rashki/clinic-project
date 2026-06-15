from django.contrib import admin
from .models import Specialty, DiseaseCategory, DoctorProfile
from accounts.models import User


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(DiseaseCategory)
class DiseaseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty')
    list_filter = ('specialty',)
    search_fields = ('name',)


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'clinic', 'consultation_fee', 'is_approved')
    list_filter = ('specialty', 'is_approved', 'gender', 'visit_type')
    search_fields = ('user__first_name', 'user__last_name', 'license_number')

    # همه فیلدها قابل ویرایش
    fields = ('user', 'specialty', 'clinic', 'city', 'address',
              'consultation_fee', 'gender', 'visit_type',
              'experience_years', 'license_number', 'bio', 'is_approved')

    # فقط فیلد user فقط خواندنی باشه (قابل تغییر نباشه)
    readonly_fields = ('user',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(role='doctor', is_verified=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)