import os
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import authentication
from google_auth_oauthlib.flow import Flow

import logging # Use logging instead of print for better practice
logger = logging.getLogger(__name__)

from .models import GoogleCredentials


# Create your views here.
def get_google_flow(scopes=settings.GOOGLE_CALENDAR_SCOPES):
    """Creates and returns the Google OAuth Flow object."""
    return Flow.from_client_config(
        client_config={
            "web": {
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI],
                "javascript_origins": ["http://127.0.0.1:5173"],
            }
        },
        scopes=scopes,
        redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI,
    )


class GoogleLoginRedirectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.JWTAuthentication]

    def get(self, request):
        flow = get_google_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',  # Request refresh token
            prompt='consent',       # Force consent screen for refresh token
            include_granted_scopes='true'
        )

        # Ensure session exists
        if not request.session.session_key:
            request.session.create()
        # Store state in session for later verification
        request.session['google_oauth_state'] = state
        request.session.save() # Explicitly save the session
        logger.info(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        logger.info(f"Set session state: {state}, Session ID: {request.session.session_key}")
        # Return JSON for frontend to handle
        return Response({
            "authorization_url": authorization_url
        }, status=status.HTTP_200_OK)  


class GoogleLoginCallbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.JWTAuthentication]

    def post(self, request):
        # --- Security Check: Validate state parameter ---
        logger.info(f"Request data: {request.data}")
        state = request.data.get('state')
        logger.info(f"Extracted state directly: {state}")
        # if state is None:
        #     logger.warning("State not found with get('state'), inspecting request.data")
        #     logger.info(f"Full request.data: {request.data}")
        #     state = request.data.get('state', None)  # Double-check
        session_state = request.session.get('google_oauth_state')
        logger.info(f"Received state: {state}, Session state: {session_state}, Session ID: {request.session.session_key}") 
        # if not state or state != session_state:
        #     logger.info(f"Received state: {state}, Session state: {session_state}, Session ID: {request.session.session_key}")
        #     logger.error(f"State mismatch: Received={state}, Session={session_state}")
        #     return Response({"error": "Invalid state parameter."}, status=status.HTTP_400_BAD_REQUEST)
        # Clear state from session after use
        request.session.pop('google_oauth_state', None)

        # Check for errors from Google
        # error = request.GET.get('error')
        # if error:
        #      return Response({"error": f"Google OAuth Error: {error}"}, status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')
        if not code:
            return Response({"error": "Authorization code not found."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Exchange code for tokens ---
        try:
            flow = get_google_flow()
            flow.fetch_token(code=code)
            g_creds = flow.credentials
            logger.info(f"Google credentials fetched: Access Token={g_creds.token[:10]}...")

        except Exception as e:
            logger.error(f"Error fetching token: {e}") # Log the error
            if 'invalid_grant' in str(e):
                return Response({"error": "Authorization code invalid or already used"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": f"Failed to fetch token: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Get User Info (Requires Authentication on Callback) ---
        # This part assumes the user *is already logged in* to your Django app
        # when they initiate the Google connection.
        if not request.user.is_authenticated:
             # Handle scenario where user isn't logged in during callback
            logger.error("User not authenticated during Google callback.")
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            #  frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
            #  return redirect(f"{frontend_url}/login?error=auth_required")


        # --- Store Credentials ---
        try:
            expiry_datetime = g_creds.expiry.replace(tzinfo=timezone.utc) if g_creds.expiry else None
            # Use update_or_create to handle both initial connection and re-authentication
            credentials_obj, created = GoogleCredentials.objects.update_or_create(
                user=request.user,
                defaults={
                    'access_token': g_creds.token,
                    'refresh_token': g_creds.refresh_token, # Might be None on subsequent auths if not requested/granted
                    'expires_at': expiry_datetime,
                    'token_uri': g_creds.token_uri,
                    'client_id': g_creds.client_id,
                    'client_secret': g_creds.client_secret,
                    'scopes': " ".join(g_creds.scopes or []), # Ensure scopes is a string
                }
            )
            # If the refresh token wasn't updated (is None from Google but exists in DB), keep the old one
            if not g_creds.refresh_token and not created and credentials_obj.refresh_token:
                credentials_obj.refresh_token = GoogleCredentials.objects.get(pk=credentials_obj.pk).refresh_token
                credentials_obj.save(update_fields=['refresh_token'])

            logger.info(f"Google credentials {'created' if created else 'updated'} for user {request.user.username}")

            # Redirect user back to the frontend dashboard/settings page
            # frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
            # return redirect(f"{frontend_url}/dashboard?google_connected=true")
            return Response({"message": "Google account linked successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error storing credentials: {e}")
             # Redirect back to frontend with error message
            #  frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
            #  return redirect(f"{frontend_url}/dashboard?google_error=storage_failed")
            return Response({"error": "Failed to store credentials"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
