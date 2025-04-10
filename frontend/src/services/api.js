import axios from 'axios'

// Use environment variable for API base URL, fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// --- Axios Interceptor for adding JWT token to requests ---
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// --- Axios Interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response, // return response if successful
    async (error) => {
        const originalRequest = error.config;
        // Check if it's a 401 error and not a retry request
        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true // Mark as retried
            const refreshToken = localStorage.getItem('refresh_token');

            if(refreshToken){
                try {
                    console.log("Attempting token refresh...")
                    const response = await axios.post(`${API_BASE_URL}/users/login/refresh/`, {
                        refresh: refreshToken,
                    })
                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken)
                    console.log("Token refreshed successfully.")
                    // Update Authorization header for the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    // Re-run the original request with the new token
                    return api(originalRequest)
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError)
                    // If refresh fails, logout the user (or redirect to login)
                     // This requires access to the logout function (Context or Zustand)
                     // reject the promise.
                     // In App.jsx, the failed subsequent api call will trigger logout
                     localStorage.removeItem('access_token');
                     localStorage.removeItem('refresh_token');
                     window.location.href = '/login' // Force redirect
                     return Promise.reject(refreshError)
                }
            } else {
                console.log("No refresh token available, redirecting to login.")
                // No refresh token, logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // window.location.href = '/login'; // Force redirect
            }
        }
        // For other errors, just reject the promise
        return Promise.reject(error);
    }
)

export default api;

export async function startGoogleAuth() {
    try {
        const response = await api.get('auth/google/redirect/');
        const { authorization_url } = response.data
        window.location.href = authorization_url
    } catch (error) {
        console.error('Failed to start Google OAuth:', error);
        throw error;
    }
}

export async function completeGoogleOAuth() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        console.log('Sending to backend:', { code, state });  // Debug
        if (!code || !state) {
            throw new Error('Missing code or state in callback URL');
        }

        const response = await api.post('auth/google/callback/', { code, state }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response.data.message);
        window.location.href = '/dashboard?google_connected=true';
    } catch (error) {
        console.error('Failed to complete Google OAuth:', error);
        // window.location.href = '/dashboard?google_error=true';
        throw error;
    }
}