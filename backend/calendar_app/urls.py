from django.urls import path
from .views import GoogleCalendarEventView


urlpatterns = [
    path('events/', GoogleCalendarEventView.as_view(), name='google_calendar_events')
]