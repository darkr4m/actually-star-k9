from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core import validators as v
from common_app.validators import validate_name

class Client(models.Model):
    """Represents a client (dog owner) in the system."""
    first_name = models.CharField(
        verbose_name=_("First Name"),
        max_length=100,
        validators=[
            v.MinLengthValidator(
                2, message=_("First name must be at least 2 characters long.")
            ),
            v.MaxLengthValidator(100, message=_("First name cannot exceed 100 characters.")),
            validate_name,
        ],
        help_text=_("Enter the first name of the client (2-100 characters)."),
    )
    last_name = models.CharField(
        verbose_name=_("Last Name"),
        max_length=100,
        validators=[
            v.MinLengthValidator(
                2, message=_("Last name must be at least 2 characters long.")
            ),
            v.MaxLengthValidator(100, message=_("Last name cannot exceed 100 characters.")),
            validate_name,
        ],
        help_text=_("Enter the last name of the client (2-100 characters)."),
    )
    email = models.EmailField(
        verbose_name=_("Email Address"),
        unique=True
    ),
    phone_number = models.CharField(
        verbose_name=_("Phone Number"),
        max_length=20,
        blank=True,
        null=True,
        help_text=_("Enter the client's phone number (Max 20 characters).")
    )
    address = models.CharField(
        verbose_name=_("Address"),
        blank=True,
        null=True,
        help_text=_("Enter the client's home address."),
    )
    emergency_contact_name = models.CharField(
        verbose_name=_("Emergency Contact Name"),
        max_length=100,
        blank=True,
        null=True,
        help_text=_("Enter the name of the client's emergency contact."),
    )
    emergency_contact_phone = models.CharField(
        verbose_name=_("Emergency Contact Phone Number"),
        max_length=20,
        blank=True,
        null=True,
        help_text=_("Enter the phone number of the client's emergency contact."),
    )
    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _('Client')
        verbose_name_plural = _('Clients')
        ordering = ['last_name', 'first_name']

    @property
    def get_full_name(self):
        """Returns a human-readable string of the client's full name."""
        return f"{self.first_name} {self.last_name}"