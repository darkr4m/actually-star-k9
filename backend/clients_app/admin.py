from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Client model.
    """

    # --- List Display Configuration ---
    list_display = (
        'last_name',
        'first_name',
        'email',
        'phone_number',
        'is_active',
    )

    list_filter = [
        'is_active'
    ]

    search_fields = (
        'first_name',
        'last_name',
        'email',
        'phone_number'
    )

    # --- Detail/Edit View Configuration ---
    fieldsets = (
        (_('Client Information'), {
            'fields': ('first_name', 'last_name', 'email', 'phone_number')
        }),
        (_('Emergency Contact'), {
            'classes': ('collapse',), # Make this section collapsible
            'fields': ('emergency_contact_name', 'emergency_contact_phone'),
        }),
        (_('Status & Metadata'), {
            'fields': ('is_active', 'created_at', 'updated_at'),
        }),
    )

    # Make timestamp fields read-only in the admin
    readonly_fields = ('created_at', 'updated_at')

    # --- Actions ---
    actions = ['make_active', 'make_inactive']

    @admin.action(description=_('Mark selected clients as active'))
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, _("Selected clients have been marked as active."))

    @admin.action(description=_('Mark selected clients as inactive (archive)'))
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, _("Selected clients have been marked as inactive."))

    # Customize ordering in the admin list view if different from model's Meta
    ordering = ('last_name', 'first_name')