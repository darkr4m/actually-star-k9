from django.contrib import admin
from django.utils.html import format_html, mark_safe
from django.utils import timezone
import datetime
from django.utils.translation import gettext_lazy as _

from .models import Dog
from clients_app.models import Client

@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Dog model.
    Provides a structured interface for managing dog records.
    """

    # --- List View Configuration ---
    list_display = (
        'name',
        'owner_link',
        # 'display_owner', # Use custom method for owner display
        'breed',
        'age_display_in_list',
        'sex',
        'status',
        'is_altered',
        'display_photo_thumbnail'
    )

    list_filter = (
        'status',
        'sex',
        'is_altered',
    )
    search_fields = ('name', 'breed', 'owner__first_name', 'owner__last_name', 'owner__email') # Search by owner fields
    autocomplete_fields = ['owner'] # Use autocomplete for owner selection (more scalable)
    ordering = ('name',)

    fieldsets = (
        # Section 1: Basic Information
        (_('Basic Information'), {
            'fields': (
                'name',
                'owner',
                'breed',
                'date_of_birth',
                'age_display', # Show calculated age (read-only)
                'sex',
                'is_altered',
                'color_markings',
                'weight_kg',
                'photo',
                'display_photo', # Show current photo (read-only)
            )
        }),
        # Section 2: Behavioral & Training
        (_('Behavioral & Training'), {
            'fields': (
                'behavioral_notes',
                'training_goals',
                'previous_training',
                # 'skills', # Uncomment when Skill model and M2M field are added
            )
        }),
        # Section 3: Medical Information
        (_('Medical Information'), {
            'fields': (
                'veterinarian_name',
                'veterinarian_phone',
                'medical_notes',
                'vaccination_rabies',
                'vaccination_dhpp',
                'vaccination_bordetella',
                'parasites',
            )
        }),
        # Section 4: Status & System Info
        (_('Status & System Info'), {
            'classes': ('collapse',), # Make this section collapsible
            'fields': (
                'status',
                'created_at',
                'updated_at',
            )
        }),
    )

    # --- Read-only Fields ---
    readonly_fields = (
        'created_at',
        'updated_at',
        'age_display', # Make calculated age read-only
        'display_photo', # Make photo display read-only
        # 'is_rabies_vaccine_current_display', # Make vaccine status read-only
        # Add other calculated/display fields here
    )

        # Display owner as a link to the client admin page
    def owner_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        if obj.owner:
            link = reverse("admin:clients_app_client_change", args=[obj.owner.id])
            # Display owner name, indicate if deleted
            owner_str = str(obj.owner) # Uses the Client __str__ method which includes status
            return format_html('<a href="{}">{}</a>', link, owner_str)
        return _("No Owner Assigned")
    owner_link.short_description = _("Owner")
    owner_link.admin_order_field = 'owner' # Allow sorting by owner

    def age_display(self, obj):
        """Displays the calculated age from the model property."""
        return obj.age_display
    age_display.short_description = _('Approx. Age')

    def age_display_in_list(self, obj):
        """Displays a shorter age version for the list view."""
        calculated_age = obj.age
        if calculated_age is None:
            return _("Unknown")
        years = calculated_age.years
        months = calculated_age.months
        if years > 0:
            return f"{years}y" + (f" {months}m" if months > 0 else "")
        elif months > 0:
             return f"{months}m"
        else:
            # Calculate days if less than a month old
            today = timezone.now().date()
            dob = obj.date_of_birth
            if isinstance(dob, datetime.datetime):
                dob = dob.date()
            days = (today - dob).days
            return f"{days}d"

    age_display_in_list.short_description = _('Age')
    # Note: Sorting directly on age_display_in_list might be complex; consider sorting by date_of_birth instead

    def display_photo(self, obj):
        """Displays the dog's photo as an image tag in the admin."""
        if obj.photo:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 150px;" />', obj.photo.url)
        return _("No photo available.")
    display_photo.short_description = _('Current Photo')

    def display_photo_thumbnail(self, obj):
        """Displays a smaller thumbnail in the list view."""
        if obj.photo:
            return format_html('<img src="{}" style="width: 45px; height: 45px; border-radius: 50%;" />', obj.photo.url)
        return "" # Return empty string if no photo
    display_photo_thumbnail.short_description = _('Photo')


    # Ensure owner dropdown only shows active, non-deleted clients
    # The limit_choices_to on the model's ForeignKey helps, but this reinforces it
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Ensure the owner field queryset only contains active clients
        # This uses the default manager 'objects' which excludes deleted clients
        form.base_fields['owner'].queryset = Client.objects.all()
        return form


    # --- QuerySet Optimization ---
    # def get_queryset(self, request):
    #     """Optimize database queries."""
    #     queryset = super().get_queryset(request)
    #     # Pre-fetch owner details to avoid extra queries per row
    #     queryset = queryset.select_related('owner')
    #     return queryset