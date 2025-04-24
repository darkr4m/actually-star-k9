from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core import validators as v
from clients_app.models import Client
# Import CountryField
from django_countries.fields import CountryField

class Address(models.Model):
    """
    Represents a physical address associated with a client.
    A client can have multiple addresses (physical, mailing).
    Uses django-countries for the country field.
    """
    class AddressTypeChoices(models.TextChoices):
        PHYSICAL = "PHYSICAL", _("Physical")
        MAILING = "MAILING", _("Mailing")
        BILLING = "BILLING", _("Billing")
        OTHER = "OTHER", _("Other")


    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="addresses",
        verbose_name=_(Client)
    )

    street_address_1 = models.CharField(
        max_length=255,
        verbose_name=_("Street Address Line 1")
    )

    street_address_2 = models.CharField(
        max_length=255,
        verbose_name=_("Street Address Line 2"),
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        verbose_name=_("City")
    )

    state = models.CharField(
        max_length=100,
        verbose_name=_("State / Province / Region"),
        blank=True, # Making state optional as not all countries use them
        null=True,
    )
    postal_code = models.CharField(
        max_length=20,
        verbose_name=_("Postal/ZIP Code"),
        blank=True, # Making postal code optional as not all countries use them
        null=True,
    )

    country = CountryField(
        verbose_name=_("Country"),
        blank_label=_("Select Country"), # Adds a blank option to the dropdown
        max_length=100,
        # Set blank=False, null=False if country is always required
        blank=False,
        null=False,
    )

    address_type = models.CharField(
        max_length=50,
        verbose_name=_("Address Type"),
        help_text=_("Type of address (Physical, Mailing, Billing)"),
        choices=AddressTypeChoices.choices,
        default=AddressTypeChoices.PHYSICAL
    )

    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    class Meta:
        verbose_name = _("Address")
        verbose_name_plural = _("Addresses")
        ordering = ['client', 'address_type']

    def __str__(self):
        """String representation for the Address model."""
        addr_parts = [self.street_address_1]
        if self.street_address_2:
            addr_parts.append(self.street_address_2)
        if self.state:
            addr_parts.append(self.state)
        if self.postal_code:
            addr_parts.append(self.postal_code)
        # Add country name using the CountryField's built-in property
        addr_parts.append(self.country.name if self.country else '')
        # Join non-empty parts
        addr_line = ", ".join(filter(None, addr_parts))
        # Get client name
        client_name = str(self.client) if self.client else _("Unknown client")
        # Display the address type using the human-readable choice value
        return f"{self,client_name} - {self.get_address_type_display()}: {self.addr_line}"