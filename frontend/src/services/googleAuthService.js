import api from '../../../frontend_old/src/services/api'

// --- Google Authentication ---

/**
 * Initiates the Google OAuth flow by fetching the authorization URL from the backend.
 * Redirects the user to the Google consent screen.
 * @throws {Error} Throws an error if fetching the authorization URL fails.
 */
export async function startGoogleAuth() {
    try {
        console.log('Starting Google Auth flow')
        const response = await api.get('/auth/google/redirect');
        const { authorization_url } = response.data
        
        if (!authorization_url) {
            throw new Error("startGoogleAuth(): Auth URL not received from backend")
        }
        console.log('Received auth data:', authorization_url)
        // Redirect the user's browser to Google's OAuth page
        console.log("Redirecting browser to Google's OAuth page...")
        window.location.href = authorization_url
    } catch (error) {
        console.error('Failed to start Google OAuth:', error.response?.data || error.message)
        // Re-throw to allow UI to potentially display an error
        throw error;
    }
}

/**
 * Completes the Google OAuth flow by sending the code and state from the callback URL
 * to the backend for verification and token exchange.
 * Handles redirection based on the backend response.
 * NOTE: This function reads directly from window.location.search and causes redirects,
 * making it suitable for use directly in the Google Callback Page component.
 * @throws {Error} Throws an error if the callback parameters are missing or the backend call fails.
 */
export async function completeGoogleAuth() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        console.log('Google Callback - Sending to backend:', { code, state }); // Debug

        if (!code || !state) {
            throw new Error('Missing code or state in callback URL');
        }

        // Send code and state to your backend endpoint
        const response = await api.post('/auth/google/callback/', { code, state }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('Google OAuth completed:', response.data.message || 'Success');
        // Redirect on success
        window.location.href = '/dashboard?google_connected=true';

    } catch (error) {
        console.error('Failed to complete Google OAuth:', error.response?.data || error.message);
        // Redirect on error
         window.location.href = '/dashboard?google_error=true';
         // Re-throw might not be useful here due to redirect, but included for consistency
        throw error;
    }
}

/**
 * Sends a request to the backend to disconnect the user's Google account.
 * @returns {Promise<object>} A promise that resolves to the backend response data.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function disconnectGoogle() {
    try {
        const response = await api.post('/auth/google/disconnect/');
        console.log('Google account disconnected:', response.data.message || 'Success');
        return response.data; // Return data which might include success message or status
    } catch (error) {
        console.error('Failed to disconnect Google:', error.response?.data || error.message);
        throw error;
    }
}

// --- Google Calendar ---

/**
 * Fetches Google Calendar events from the backend API.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of event objects.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function fetchGoogleEvents() {
    try {
        console.log('Fetching Google events via googleService...');
        const response = await api.get('/api/v1/calendar/events/'); // Ensure correct endpoint
        console.log(response.data)
        // Assuming backend returns { events: [...] } structure based on original code
        return response.data.events || [];
    } catch (error) {
        console.error('fetchGoogleEvents() - API Error:', error.response?.data || error.message);
        throw error;
    }
}