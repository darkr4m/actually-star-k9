from django.contrib import admin
from .models import K9User

# Register your models here.
@admin.register(K9User)
class K9UserAdmin(admin.ModelAdmin):
    # --- List View Customization (Client list page) ---
    list_display = ('last_name', 'first_name', 'email', 'phone_number', 'is_active')
    list_filter = ['is_active']
    search_fields = ('last_name', 'email', 'phone_number')  # Enable searching across these fields
    ordering = ('last_name', 'first_name') # Default sorting 