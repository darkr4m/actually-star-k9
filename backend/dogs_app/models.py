from django.db import models
from django.core import validators as v
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from dateutil.relativedelta import relativedelta
import datetime
from .validators import validate_name


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
    owner = models.CharField()  # TODO
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
        null=True,
        help_text=_(
            "Enter the dog's approximate date of birth. Leave blank if unknown."
        ),
    )
    sex = models.CharField(
        verbose_name=_("Sex"),
        max_length=7,
        choices=SexChoices.choices,
        blank=True,
        null=True,
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
        validators=[v.MinValueValidator(0.1)],
        help_text=_("Enter the dog's approximate weight in kilograms."),
    )
    skills = models.CharField()  # TODO:
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
        verbose_name=_("Rabies Vaccination"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known Rabies vaccination."),
    )
    vaccination_dhpp = models.DateField(
        verbose_name=_("DHPP Vaccination"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known DHPP vaccination."),
    )
    vaccination_bordetella = models.DateField(
        verbose_name=_("Bordetella Vaccination"),
        blank=True,
        null=True,
        help_text=_("Enter the date of the last known Bordetella vaccination."),
    )
    parasites = models.DateField(
        verbose_name=_("Parasite Testing"),
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
    veterinarian_phone = models.CharField(
        verbose_name=_("Veterinarian Phone Number"),
        max_length=20,
        blank=True,
        null=True,
        validators=[v.MinLengthValidator(10)],
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
        try:
            dob = self.date_of_birth
            if isinstance(dob, datetime.datetime):
                dob = dob.date()
            days = (today - dob).days
            return relativedelta(today, dob)
        except TypeError:
            return None
        
    @property
    def age_display(self):
        """Returns a human-readable string of the dog's age."""
        calculated_age = self.age
        if calculated_age is None:
            return _("Unknown")
        
        years = calculated_age.years
        months = calculated_age.months

        if years > 0:
            year_str = f"{years} year{'s' if years > 1 else ''}"
            month_str = f"{months} month{'s' if months > 1 else ''}" if months > 0 else ""
            return f"{year_str}{', ' + month_str if month_str else ''}"
        elif months > 0:
            return f"{months} month{'s' if months > 1 else ''}"
        else:
            # Calculate days if less than a month old
            today = timezone.now().date()
            dob = self.date_of_birth
            if isinstance(dob, datetime.datetime):
                dob = dob.date()
            days = (today - dob).days
            return f"{days} day{'s' if days != 1 else ''} old"
        
    def is_rabies_vaccine_current(self, expiry_years=1):
        """Checks if the rabies vaccine is current (assumes 1 or 3 year validity)."""
        if not self.vaccination_rabies:
            return False # Unknown or never vaccinated
        vax_date = self.vaccination_rabies
        if isinstance(vax_date,datetime.datetime):
            vax_date.date()
        expiry_date = vax_date + datetime.timedelta(days=expiry_years * 365)
        return timezone.now().date() <= expiry_date
    
    def is_dhpp_vaccine_current(self, expiry_years=1):
        """Checks if the dhpp vaccine is current (assumes 1 or 3 year validity)."""
        if not self.vaccination_dhpp:
            return False # Unknown or never vaccinated
        vax_date = self.vaccination_dhpp
        if isinstance(vax_date,datetime.datetime):
            vax_date.date()
        expiry_date = vax_date + datetime.timedelta(days=expiry_years * 365)
        return timezone.now().date() <= expiry_date
    
    def is_bordetella_vaccine_current(self, expiry_years=1):
        """Checks if the bordetella vaccine is current (assumes 1 or 3 year validity)."""
        if not self.vaccination_bordetella:
            return False # Unknown or never vaccinated
        vax_date = self.vaccination_bordetella
        if isinstance(vax_date,datetime.datetime):
            vax_date.date()
        expiry_date = vax_date + datetime.timedelta(days=expiry_years * 365)
        return timezone.now().date() <= expiry_date
    
    def is_parasite_screen_current(self, expiry_years=1):
        """Checks if the parasite screening is current (assumes 1 or 3 year validity)."""
        if not self.parasites:
            return False # Unknown or never vaccinated
        vax_date = self.parasites
        if isinstance(vax_date,datetime.datetime):
            vax_date.date()
        expiry_date = vax_date + datetime.timedelta(days=expiry_years * 365)
        return timezone.now().date() <= expiry_date
    
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
        altered_display = "Altered" if self.is_altered else ("Intact" if self.is_altered is False else "Altered Status Unknown")
        return f"{self.breed or "Mixed Breed"} - {altered_display} ({sex_display})"
