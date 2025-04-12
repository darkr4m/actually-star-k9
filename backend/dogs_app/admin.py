from django.contrib import admin
from django.utils.html import format_html, mark_safe
from django.utils import timezone
import datetime
from django.utils.translation import gettext_lazy as _

from .models import Dog

@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Dog model.
    Provides a structured interface for managing dog records.
    """

    # --- List View Configuration ---
    list_display = (
        'name',
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
                'vaccination_rabies',
                'vaccination_dhpp',
                'vaccination_bordetella',
                'parasites',
                'veterinarian_name',
                'veterinarian_phone',
                'medical_notes',
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

    # --- Custom Methods for Display ---
    # def display_owner(self, obj):
    #     """Displays owner's full name or username."""
    #     if obj.owner:
    #         return obj.owner.get_full_name() or obj.owner.username
    #     return _("No Owner Assigned")
    # display_owner.short_description = _('Owner')
    # display_owner.admin_order_field = 'owner' # Allow sorting by owner

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
            return format_html('<img src="{}" style="width: 45px; height: auto;" />', obj.photo.url)
        return "" # Return empty string if no photo
    display_photo_thumbnail.short_description = _('Photo')


    # --- QuerySet Optimization ---
    # def get_queryset(self, request):
    #     """Optimize database queries."""
    #     queryset = super().get_queryset(request)
    #     # Pre-fetch owner details to avoid extra queries per row
    #     queryset = queryset.select_related('owner')
    #     return queryset