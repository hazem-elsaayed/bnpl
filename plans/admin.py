from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PaymentPlan, Installment


class UserAdmin(UserAdmin):
    # Fields to display in list view
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "role")
    search_fields = ("username", "email")
    ordering = ("username",)

    # Fieldsets for edit view
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
        ("Custom Fields", {"fields": ("role",)}),  # Add your custom fields here
    )

    # Fieldsets for add view
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "role", "password1", "password2"),
            },
        ),
    )


admin.site.register(User, UserAdmin)
admin.site.register(PaymentPlan)
admin.site.register(Installment)
