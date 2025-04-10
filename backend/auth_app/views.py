import os
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import authentication
from google_auth_oauthlib.flow import Flow
from .models import GoogleCredentials
import logging 
logger = logging.getLogger(__name__)

def get_google_flow(scopes=settings.GOOGLE_CALENDAR_SCOPES):
    """Initializes and configures the Google OAuth 2.0 authorization flow.

    This helper function creates a Flow object using application credentials
    (client ID, client secret) and configuration (auth URI, token URI, redirect URI)
    loaded from the application settings. It sets up the necessary parameters
    for initiating the OAuth 2.0 dance with Google APIs.

    Args:
        scopes (list[str], optional): A list of strings representing the Google API
            scopes (permissions) the application is requesting. Defaults to
            `settings.GOOGLE_CALENDAR_SCOPES`. Example:
            ['https://www.googleapis.com/auth/calendar.readonly']

    Returns:
        google_auth_oauthlib.flow.Flow: A configured Flow object ready to be used
            for generating the authorization URL and exchanging the authorization
            code for access tokens.
    """
    return Flow.from_client_config(
        # create and configure an OAuth 2.0 "Flow" object
        client_config={
            "web": { #  These settings are for a web application flow.
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID, # The application's unique public identifier, obtained from Google Cloud Console
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET, # The application's secret key, also from Google Cloud Console
                "auth_uri": "https://accounts.google.com/o/oauth2/auth", # The Google endpoint URL where the user will be sent to log in and grant consent to the application.
                # The Google endpoint URL the application will use (behind the scenes) 
                # to exchange an authorization code (received after user consent) for an access token and potentially a refresh token.
                "token_uri": "https://oauth2.googleapis.com/token",
                #  A list containing the URI(s) within the application where Google will redirect the user back after they have authenticated and granted (or denied) permission. 
                # This URI must be pre-registered in the Google Cloud Console project settings. The code receives the authorization code at this endpoint.
                "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI],
                # Lists the allowed origins for JavaScript requests, often relevant for client-side operations or CORS (Cross-Origin Resource Sharing) validation
                "javascript_origins": ["http://127.0.0.1:5173"], 
            }
        },
        # This passes the scopes argument (either the default or the one provided when calling the function) to the Flow object. 
        # The Flow object will use these scopes when constructing the authorization URL, telling Google what permissions are being requested.
        scopes=scopes,
        # This explicitly tells the Flow object which redirect URI to use when generating the authorization URL and validating the callback
        redirect_uri=settings.GOOGLE_OAUTH2_REDIRECT_URI,
    )


class GoogleLoginRedirectView(APIView):
    """
    API view to initiate the Google OAuth 2.0 flow for account linking.

    Handles the first step of the OAuth process: generating the authorization URL
    and sending it back to the client (frontend) for redirection.
    Requires the user to be already authenticated via JWT in this application.
    """
    # Specify that only authenticated users can access this view.
    permission_classes = [permissions.IsAuthenticated]
    # Specify that JWT authentication is used to verify the user's identity.
    authentication_classes = [authentication.JWTAuthentication]

    def get(self, request):
        """
        Handles GET requests to generate and return the Google OAuth authorization URL.

        Args:
            request: The HttpRequest object, containing user and session info.

        Returns:
            Response: A DRF Response object containing the authorization URL in JSON format (status 200),
                      or an error response if something goes wrong (though errors are typically handled
                      by DRF's default exception handling for auth/permissions).
        """

        # 1. Obtain the pre-configured Google OAuth Flow object.
        # This object holds the client ID, client secret, scopes, redirect URI etc.
        flow = get_google_flow() # Assumes default scopes are used here

        # 2. Generate the Google Authorization URL.
        # This URL is where the user will be sent to authenticate with Google and grant permissions.
        # Also generate a 'state' value for CSRF protection.
        authorization_url, state = flow.authorization_url(
            # Request 'offline' access to get a refresh token.
            # Refresh tokens allow accessing Google APIs when the user is not present.
            access_type='offline',
            # Force the consent screen to be shown even if user previously granted permissions.
            # This is often necessary to ensure a refresh token is issued by Google.
            prompt='consent',
            # Include scopes the user has already granted in the consent prompt
            include_granted_scopes='true'
        )

        # 3. Store the 'state' value in the user's session for later verification.
        # This prevents Cross-Site Request Forgery (CSRF) attacks. The callback view
        # will compare the 'state' returned by Google with the one stored here.
        if not request.session.session_key:
            request.session.create()
        # Store the generated state parameter in the session.
        request.session['google_oauth_state'] = state
        # Explicitly save the session to ensure the state is persisted immediately.
        request.session.save()

        # --- Logging for debugging ---
        # Log relevant information for tracking the flow initiation.        
        logger.info(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        logger.info(f"Set session state: {state}, Session ID: {request.session.session_key}")
        # --- End Logging ---

        # 4. Return the Authorization URL to the client.
        # The frontend (JavaScript/React) will receive this JSON response
        # and then redirect the user's browser to the authorization_url.
        return Response({
            "authorization_url": authorization_url
        }, status=status.HTTP_200_OK) # Return 200 OK status indicating success.


class GoogleLoginCallbackView(APIView):
    """
    API view to handle the callback from Google after user authentication/authorization.

    This view receives the authorization code and state from the frontend
    (which extracted them from the URL Google redirected to), verifies the state,
    exchanges the code for tokens, and stores these tokens securely, associating
    them with the currently authenticated application user (JWT).
    """
    # Specify that only authenticated users can access this view.
    permission_classes = [permissions.IsAuthenticated]
    # Specify that JWT authentication is used to verify the user's identity.
    authentication_classes = [authentication.JWTAuthentication]

    def post(self, request):
        """
        Handles POST requests containing the authorization code and state from Google redirect.

        Args:
            request: The HttpRequest object, containing the code and state in request.data,
                     and the authenticated user via JWT.

        Returns:
            Response: A DRF Response indicating success (200) or failure (400, 401, 500),
                      or potentially a Redirect response (currently commented out).
        """
        # --- 1. Security Check: Validate the 'state' parameter (CSRF Protection) ---
        logger.info(f"Callback received for User: {request.user}, Session ID: {request.session.session_key}")
        logger.debug(f"Request data: {request.data}") # Log full data only in debug

        # Extract the 'state' parameter from the POST request data.
        state = request.data.get('state')
        logger.info(f"Extracted state directly: {state}")

        # Retrieve the 'state' value that was stored in the session earlier.
        session_state = request.session.get('google_oauth_state')
        logger.info(f"Received state: {state}, Session state: {session_state}, Session ID: {request.session.session_key}") 

        # Attempt to remove the 'google_oauth_state' from the session after retrieving it
        request.session.pop('google_oauth_state', None)


        # --- 2. Extract Authorization Code ---
        # Get the authorization code from the POST request data.
        code = request.data.get('code')
        # If the code is missing, return a Bad Request response
        if not code:
            return Response({"error": "Authorization code not found."}, status=status.HTTP_400_BAD_REQUEST)

        # --- 3. Exchange code for tokens ---
        try:
            # Get the configured Google OAuth Flow object.
            flow = get_google_flow()
            # Use the received authorization code to fetch access and refresh tokens from Google.
            # This involves a server-to-server call to Google's token endpoint.
            flow.fetch_token(code=code)
            # Store the obtained credentials (tokens, expiry, scopes etc.) in the 'g_creds' object.
            g_creds = flow.credentials
            logger.info(f"Google credentials fetched: Access Token={g_creds.token[:10]}...")

        # Handle errors during the token exchange process.
        except Exception as e:
            logger.error(f"Error fetching token: {e}") 
            # Specifically check if the error is due to an invalid/expired code.
            if 'invalid_grant' in str(e):
                return Response({"error": "Authorization code invalid or already used"}, status=status.HTTP_400_BAD_REQUEST)
            # Return a generic server error for other token exchange issues
            return Response({"error": f"Failed to fetch token: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- 4. Get User Info (Requires Authentication on Callback) ---
        # Check if the user associated with the JWT is still considered authenticated.
        # This is largely handled by the authentication_classes, but provides an explicit check point.
        if not request.user.is_authenticated:
            # This case might occur if the JWT expired between the redirect and callback handling.
            logger.error("User not authenticated during Google callback.")
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)


        # --- 5. Store Credentials ---
        try:
            # Convert the token expiry time to a timezone-aware datetime object (UTC).
            expiry_datetime = g_creds.expiry.replace(tzinfo=timezone.utc) if g_creds.expiry else None
            # Store or update the Google credentials in the database, linked to the Django user.
            # `update_or_create` finds a record based on `user=request.user` or creates a new one.
            # `defaults` specifies the fields to set/update.
            credentials_obj, created = GoogleCredentials.objects.update_or_create(
                user=request.user,
                defaults={
                    'access_token': g_creds.token,
                    'refresh_token': g_creds.refresh_token, # Store the refresh token if available.
                    'expires_at': expiry_datetime,
                    'token_uri': g_creds.token_uri,
                    'client_id': g_creds.client_id,
                    'client_secret': g_creds.client_secret,
                    'scopes': " ".join(g_creds.scopes or []), # Convert scopes list to string.
                }
            )

            # --- 6. Attempt to Preserve Existing Refresh Token ---
            # If Google didn't send a refresh token this time (`g_creds.refresh_token` is None),
            # AND if this wasn't the first time linking (`created` is False),
            # AND if the object retrieved/updated (`credentials_obj`) currently holds a refresh token...
            if not g_creds.refresh_token and not created and credentials_obj.refresh_token:
                # ...then explicitly re-fetch the object from the DB to get the *stored* refresh token...
                 # (This assumes `update_or_create` might have temporarily set it to None in memory based on `defaults`)
                 # ...and save it back to the object, updating only that field in the DB.
                 # This prevents losing the original refresh token on subsequent authentications.
                credentials_obj.refresh_token = GoogleCredentials.objects.get(pk=credentials_obj.pk).refresh_token
                credentials_obj.save(update_fields=['refresh_token'])

            logger.info(f"Google credentials {'created' if created else 'updated'} for user {request.user.email}")
            # Return a JSON success message to the frontend.
            return Response({"message": "Google account linked successfully"}, status=status.HTTP_200_OK)

        # Handle potential errors during database interaction (saving credentials).
        except Exception as e:
            logger.error(f"Error storing credentials: {e}")
            # Return a JSON error message.
            return Response({"error": "Failed to store credentials"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
