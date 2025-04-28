from django.db import models
from django.core import validators as v
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from dateutil.relativedelta import relativedelta
import datetime
from .validators import validate_name
from clients_app.models import Client


class Dog(models.Model):
    """Represents a dog in the system."""

    class SexChoices(models.TextChoices):
        MALE = "MALE", _("Male")
        FEMALE = "FEMALE", _("Female")
        UNKNOWN = "UNKNOWN", _("Unknown")

    class StatusChoices(models.TextChoices):
        ACTIVE = "ACTIVE", _("Active")  # currently in training/boarding
        INACTIVE = "INACTIVE", _(
            "Inactive"
        )  # Completed training, not currently servicing, alumni
        WAITLIST = "WAITLIST", _("Waitlist")
        PROSPECTIVE = "PROSPECTIVE", _("Prospective")

    name = models.CharField(
        verbose_name=_("Dog's Name"),
        max_length=100,
        validators=[
            v.MinLengthValidator(
                2, message=_("Name must be at least 2 characters long.")
            ),
            v.MaxLengthValidator(100, message=_("Name cannot exceed 100 characters.")),
            validate_name,
        ],
        help_text=_("Enter the full name of the dog (2-100 characters)."),
    )

    owner = models.ForeignKey(
        Client, 
        on_delete=models.PROTECT, # Protects against deleting a Client with Dogs
        related_name="dogs",
        verbose_name=_("Owner"),
        null=True, # Allow dog records without an owner temporarily or if owner is hard-deleted
        blank=True, # Allow owner to be blank in forms
        help_text=_("Select the client who owns this dog. Only active clients are shown by default.")
        )
    
    # IMPROVEMENT: Consider a ForeignKey to a Breed model for consistency,
    # or use a library for breed lists. CharField is simple for now.
    breed = models.CharField(
        verbose_name=_("Breed"),
        max_length=100,
        blank=True,
        null=True,
        help_text=_(
            "Specify the breed(s) of the dog (e.g., Labrador Retriever, Mixed). Max 100 characters."
        ),
    )  # TODO: CHOICES
    date_of_birth = models.DateField(
        verbose_name=_("Approximate Date of Birth"),
        blank=True,
        help_text=_(
            "Enter the dog's approximate date of birth. Leave blank if unknown."
        ),
    )
    sex = models.CharField(
        verbose_name=_("Sex"),
        max_length=7,
        choices=SexChoices.choices,
        blank=True,
        default=SexChoices.UNKNOWN,
        help_text=_("Select the dog's sex."),
    )
    is_altered = models.BooleanField(
        verbose_name=_("Is Spayed/Neutered"),
        blank=True,
        null=True,
        help_text=_(
            "Is the dog spayed (female) or neutered (male)? Leave blank if unknown."
        ),
    )
    color_markings = models.CharField(
        verbose_name=_("Color & Markings"),
        max_length=150,
        blank=True,
        help_text=_(
            "Describe the dog's primary colors and any distinct markings (e.g., 'Black with white chest patch'). Max 150 characters."
        ),
    )
    weight_kg = models.DecimalField(
        verbose_name=_("Weight (kg)"),
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[v.MinValueValidator(0.1, message=_("Weight must be a positive value."))],
        help_text=_("Enter the dog's approximate weight in kilograms."),
    )
    
    # TODO:
    # IMPROVEMENT: Changed skills from CharField to TextField for more space.
    # Consider a ManyToManyField to a Skill model for structured skill tracking.
    skills = models.CharField(
        verbose_name=_("Known Skills / Commands"),
        blank=True,
        help_text=_("List any known commands or skills the dog possesses (Sit, Stay, Fetch)."),
    )  
    status = models.CharField(
        verbose_name=_("Status"),
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PROSPECTIVE, # Sensible default
        help_text=_("Select the current status of the dog within the system."),
    )  # TODO:
    photo = models.ImageField(
        verbose_name=_("Photo"),
        upload_to='dog_photos/',
        blank=True,
        null=True,
        help_text=_("Upload a photo of the dog.")
    )
    behavioral_notes = models.TextField(
        verbose_name=_("Behavioral Notes"),
        max_length=1000,
        blank=True,
        help_text=_(
            "Describe any known behavioral issues (anxiety, reactivity, resource guarding, bite history). Max 1000 characters."
        ),
    )
    training_goals = models.TextField(
        verbose_name=_("Training Goals"),
        max_length=1000,
        blank=True,
        help_text=_(
            "Describe the owner's specific training goals for this dog. Max 1000 characters."
        ),
    )
    previous_training = models.TextField(
        verbose_name=_("Previous Training"),
        max_length=1000,
        blank=True,
        help_text=_(
            "Describe any previous training classes, private sessions, or known commands/skills the dog has. Max 1000 characters."
        ),
    )
    # --- Medical Information
    vaccination_rabies = models.DateField(
        verbose_name=_("Rabies Vaccination Date"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known Rabies vaccination."),
    )
    vaccination_dhpp = models.DateField(
        verbose_name=_("DHPP Vaccination Date"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known DHPP vaccination."),
    )
    vaccination_bordetella = models.DateField(
        verbose_name=_("Bordetella Vaccination Date"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known Bordetella vaccination."),
    )
    parasites = models.DateField(
        verbose_name=_("Parasite Screening Date"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known parasite screening."),
    )
    veterinarian_name = models.CharField(
        verbose_name=_("Veterinarian Name"),
        max_length=100,
        blank=True,
        null=True,
        validators=[v.MinLengthValidator(2), v.MaxLengthValidator(100), validate_name],
        help_text=_("Please enter the name of the dog's primary veterinarian/clinic."),
    )
    veterinarian_phone = PhoneNumberField(
        verbose_name=_("Veterinarian Phone Number"),
        max_length=25,
        blank=True,
        null=True,
        help_text=_("Please enter the phone number of the dog's primary veterinarian/clinic."),
    )
    medical_notes = models.TextField(
        verbose_name=_("Medical Notes / Allergies"),
        max_length=1000,
        blank=True,
        help_text=_(
            "Note any ongoing medical conditions, past surgeries, allergies, or medication requirements. Max 1000 characters."
        ),
    )
    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    # --- Meta Options and string representation ---
    class Meta:
        verbose_name = _('Dog')
        verbose_name_plural = _('Dogs')
        ordering = ['name', 'owner']

    def __str__(self):
        return f"{self.name} - {self.breed} ({self.get_sex_display()})"
    
    # --- Helper Properties & Methods ---
    @property
    def age(self):
        """Calculates the approximate age of the dog."""
        if not self.date_of_birth:
            return None
        today = timezone.now().date()
        # Ensure dob is a date object
        if isinstance(dob, datetime.datetime):
             dob = dob.date()
        try:
            dob = self.date_of_birth
            days = (today - dob).days
            return relativedelta(today, dob)
        except (TypeError, ValueError):
            return None
        
    @property
    def age_display(self):
        """Returns a human-readable string of the dog's age."""
        calculated_age = self.age
        if calculated_age is None:
            return _("Unknown")
        
        years = calculated_age.years
        months = calculated_age.months
        days = calculated_age.days

        if years > 0:
            year_str = f"{years} year{'s' if years != 1 else ''}"
            # Show months only if years > 0 and months > 0
            month_str = f"{months} month{'s' if months != 1 else ''}" if months > 0 else ""
            return f"{year_str}{', ' + month_str if month_str else ''}"
        elif months > 0:
            month_str = f"{months} month{'s' if months != 1 else ''}"
            # Show days only if months > 0 and days > 0
            day_str = f"{days} day{'s' if days != 1 else ''}" if days > 0 else ""
            return f"{month_str}{', ' + day_str if day_str else ''}"
        else:
            # Handle age in days for puppies under a month
             return f"{days} day{'s' if days != 1 else ''} old" # Handles 0 days correctly
    
    # --- Vaccination Status Methods ---
    def _is_date_current(self, date_field_value, expiry_duration):
        """Helper method to check if a date is within the expiry duration."""
        if not date_field_value:
            return False # Unknown or never occurred
        # Ensure we have a date object
        event_date = date_field_value
        # if isinstance(event_date, datetime.datetime):
        #     event_date = event_date.date() # Not needed for DateField

        # Calculate expiry date using relativedelta for accuracy
        try:
            expiry_date = event_date + expiry_duration
            return timezone.now().date() <= expiry_date
        except (TypeError, ValueError):
            return False # Error during calculation


    def is_rabies_vaccine_current(self, expiry_years=1):
        """Checks if the rabies vaccine is current (assumes 1 or 3 year validity)."""
        expiry=relativedelta(years=expiry_years)
        return self._is_date_current(self.vaccination_rabies, expiry)
    
    def is_dhpp_vaccine_current(self, expiry_years=1):
        """
        Checks if the DHPP vaccine is current.
        Default expiry is 1 year, pass relativedelta(years=3) for 3-year boosters.
        """
        expiry=relativedelta(years=expiry_years)
        return self._is_date_current(self.vaccination_dhpp, expiry)
    
    def is_bordetella_vaccine_current(self, expiry_years=1):
        """
        Checks if the Bordetella vaccine is current.
        Default expiry is 6 months, adjust as needed (e.g., relativedelta(years=1)).
        """
        expiry=relativedelta(years=expiry_years)
        return self._is_date_current(self.vaccination_bordetella, expiry)
    
    def is_parasite_screen_current(self, expiry_years=1):
        """
        Checks if the parasite screening/prevention is current.
        Default expiry is 1 year.
        """
        expiry=relativedelta(years=expiry_years)
        return self._is_date_current(self.parasites, expiry)
    
    def is_vaccination_cleared(self, expiry_years=1):
        """Checks if the all vaccines and parasite screening are current (assumes 1 or 3 year validity)."""
        if(self.is_rabies_vaccine_current(expiry_years) & 
           self.is_dhpp_vaccine_current(expiry_years) & 
           self.is_bordetella_vaccine_current(expiry_years) & 
           self.is_parasite_screen_current(expiry_years)):
            return True
        return False
    
    @property
    def short_description(self):
        """Provides a brief description of the dog."""
        sex_display = self.get_sex_display() if self.sex else 'Unknown sex'
        # Handle the NullBooleanField for is_altered
        if self.is_altered is True:
            altered_display = "Altered"
        elif self.is_altered is False:
            altered_display = "Intact"
        else: # is_altered is None
            altered_display = "Altered Status Unknown"
        breed_display = self.breed or "Mixed Breed" # Handle blank breed
        return f"{breed_display} - {altered_display} ({sex_display})"
