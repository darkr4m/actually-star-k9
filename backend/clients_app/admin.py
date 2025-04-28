from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Client
from dogs_app.models import Dog
from common_app.models import Address

class AddressInline(admin.StackedInline):
    model = Address
    fields = ('client', 'address_type', 'street_address_1', 'street_address_2', 'city', 'state', 'country', 'postal_code')
    extra = 0 # Number of empty forms to display by default
    verbose_name = _("Address")
    verbose_name_plural = _("Addresses")

class DogInline(admin.StackedInline): # Or admin.StackedInline for a different layout
    """Allows adding/editing Dogs directly on the Client admin page."""
    model = Dog
    fields = ('name', 'breed', 'sex', 'date_of_birth', 'status', 'is_altered') # Fields to show inline
    extra = 0 # Number of empty forms to display
    show_change_link = True # Allows clicking to the full Dog change form
    # Optional: Limit fields further or add readonly fields for inline view
    readonly_fields = ('age_display',)
    verbose_name = _("Dog")
    verbose_name_plural = _("Owned Dogs")

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
        'dog_count',
    )

    list_filter = [
        'is_active',
        'is_deleted'
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
        (_('Status'), {
            'fields': ('is_active', 'is_deleted'), # Include soft delete fields
            'classes': ('collapse',) # Make this section collapsible
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )

    # Customize ordering in the admin list view if different from model's Meta
    ordering = ('last_name', 'first_name')
    # Make timestamp fields read-only in the admin
    readonly_fields = ('created_at', 'updated_at', 'deleted_at') # Show timestamps

    # Include the Address inline editing form on the Client page
    inlines = [DogInline, AddressInline]

    # --- Actions ---
    actions = ['make_active', 'make_inactive', 'soft_delete_clients', 'restore_clients']

    def get_queryset(self, request):
        # Important: Use the manager that includes deleted objects
        # so they can be viewed/restored in the admin
        return Client.all_objects.get_queryset()

    def dog_count(self, obj):
        # Display count of dogs owned by the client
        # Note: This will count dogs even if the client is marked as deleted
        return obj.dogs.count()
    dog_count.short_description = _("Owned Dogs")

    @admin.action(description=_("Mark selected clients as deleted (Soft Delete)"))
    def soft_delete_clients(self, request, queryset):
        """Admin action to soft delete selected clients."""
        for client in queryset:
            client.delete() # Calls our overridden delete method
        self.message_user(request, _(f"{queryset.count()} client(s) marked as deleted."))

    @admin.action(description=_("Restore selected deleted clients"))
    def restore_clients(self, request, queryset):
        """Admin action to restore soft-deleted clients."""
        restored_count = 0
        for client in queryset.filter(is_deleted=True): # Only restore those actually deleted
            client.restore()
            restored_count += 1
        if restored_count > 0:
            self.message_user(request, _(f"{restored_count} client(s) restored."))
        else:
             self.message_user(request, _("No clients selected were marked as deleted."), level='WARNING')

    @admin.action(description=_('Mark selected clients as active'))
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, _("Selected clients have been marked as active."))

    @admin.action(description=_('Mark selected clients as inactive (archive)'))
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, _("Selected clients have been marked as inactive."))
