from django.db import models
from users_app.models import K9User

# Create your models here.
class GoogleCredentials(models.Model):
    user = models.OneToOneField(K9User, on_delete=models.CASCADE, related_name='google_credentials')
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)  # Refresh tokens are crucial
    expires_at = models.DateTimeField() # Store expiry time
    token_uri = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255)
    client_secret = models.CharField(max_length=255)
    scopes = models.TextField() # Store the scopes granted

    def __str__(self):
        return f"Google credentials for {self.user.get_full_name()}"