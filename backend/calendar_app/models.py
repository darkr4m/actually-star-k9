from django.db import models


class CalendarEvent(models.Model):
    # user = models.ForeignKey() # NYI
    # Google Calendar event ID
    google_event_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    # TODO: Check Google title requirements/restrictions for event names
    title = models.CharField(max_length=255)  
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # address = models.ForeignKey() # NYI
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    synced_with_google = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.start_time}) - ADDRESS"
