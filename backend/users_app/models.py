from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class K9User(AbstractUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=254,
        unique=True,
        null=False,
        blank=False
    )
    first_name = models.CharField(
        verbose_name='first Name',
        max_length=255,
        null=False,
        blank=False
    )
    last_name = models.CharField(
        verbose_name='last Name',
        max_length=255,
        null=False,
        blank=False
    )
    phone_number = models.CharField(
        verbose_name='phone number',
        max_length=20,
        blank=True,
        null=True
    )


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.get_full_name()}"
    
    {
        "email": "k@k9.com",
        "password": "kendr1ck!!",
        "password2": "kendr1ck!!",
        "first_name": "Keith",
        "last_name": "Hiamond"
    }