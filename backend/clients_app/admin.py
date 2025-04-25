from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Client
from common_app.models import Address

class AddressInline(admin.StackedInline):
    model = Address
    fields = ('client', 'address_type', 'street_address_1', 'street_address_2', 'city', 'state', 'country', 'postal_code')
    extra = 1 # Number of empty forms to display by default
    verbose_name = _("Address")
    verbose_name_plural = _("Addresses")

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
            'classes': ('collapse',), # Make this section collapsible
            'fields': ('is_active', 'created_at', 'updated_at'),
        }),
    )

    # Make timestamp fields read-only in the admin
    readonly_fields = ('created_at', 'updated_at')

    # Include the Address inline editing form on the Client page
    inlines = [AddressInline]

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