# calendar_app/views.py
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import authentication
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from auth_app.models import GoogleCredentials
from .models import CalendarEvent
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class GoogleCalendarEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.JWTAuthentication]

    def get(self, request):
        try:
            g_creds_obj = GoogleCredentials.objects.get(user=request.user)
            creds = Credentials(
                token=g_creds_obj.access_token,
                refresh_token=g_creds_obj.refresh_token,
                token_uri=g_creds_obj.token_uri,
                client_id=g_creds_obj.client_id,
                client_secret=g_creds_obj.client_secret,
                scopes=g_creds_obj.scopes.split()
            )

            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
                g_creds_obj.access_token = creds.token
                g_creds_obj.expires_at = creds.expiry.replace(tzinfo=timezone.utc) if creds.expiry else None
                g_creds_obj.save(update_fields=['access_token', 'expires_at'])
                logger.info(f"Refreshed Google token for user: {request.user.email}")

            service = build('calendar', 'v3', credentials=creds)
            events_result = service.events().list(
                calendarId='primary',
                timeMin=datetime.now(timezone.utc).isoformat(),
                maxResults=10,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            events = events_result.get('items', [])
            event_list = []
            for event in events:
                start_str = event.get('start', {}).get('dateTime', event.get('start', {}).get('date'))
                end_str = event.get('end', {}).get('dateTime', event.get('end', {}).get('date'))
                logger.debug(f"Raw start: {start_str}, Raw end: {end_str}")

                # Parse start and end times with offset support
                try:
                    if 'T' in start_str:
                        if start_str.endswith('Z'):
                            start_time = datetime.strptime(start_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                        else:
                            start_time = datetime.strptime(start_str, '%Y-%m-%dT%H:%M:%S%z')  # Handles -05:00
                    else:
                        start_time = datetime.strptime(start_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
                    logger.debug(f"Parsed start_time: {start_time}")
                except ValueError as e:
                    logger.error(f"Failed to parse start_time {start_str}: {e}")
                    raise

                try:
                    if 'T' in end_str:
                        if end_str.endswith('Z'):
                            end_time = datetime.strptime(end_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
                        else:
                            end_time = datetime.strptime(end_str, '%Y-%m-%dT%H:%M:%S%z')  # Handles -05:00
                    else:
                        end_time = datetime.strptime(end_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
                    logger.debug(f"Parsed end_time: {end_time}")
                except ValueError as e:
                    logger.error(f"Failed to parse end_time {end_str}: {e}")
                    raise

                cal_event, created = CalendarEvent.objects.update_or_create(
                    google_event_id=event['id'],
                    # user=request.user,
                    defaults={
                        'title': event.get('summary', 'No title'),
                        'description': event.get('description', ''),
                        'start_time': start_time,
                        'end_time': end_time,
                        'synced_with_google': True
                    }
                )
                event_list.append({
                    'id': cal_event.id,
                    'google_event_id': cal_event.google_event_id,
                    'title': cal_event.title,
                    'description': cal_event.description,
                    'start': cal_event.start_time.isoformat(),
                    'end': cal_event.end_time.isoformat(),
                    # 'address': str(cal_event.address) if cal_event.address else None
                })

            logger.info(f"Fetched and synced {len(events)} events for user: {request.user.email}")
            return Response({"events": event_list}, status=status.HTTP_200_OK)

        except GoogleCredentials.DoesNotExist:
            logger.warning(f"No Google credentials found for user: {request.user.username}")
            return Response({"error": "Google account not connected"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error fetching Google Calendar events: {e}")
            return Response({"error": "Failed to fetch events"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)