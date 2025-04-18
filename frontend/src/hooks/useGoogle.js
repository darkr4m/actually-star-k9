import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import {
    startGoogleAuth,
    disconnectGoogle,
    fetchGoogleEvents
} from '../services/googleAuthService'

/**
 * Custom hook to manage Google integration status and calendar events.
 */
export function useGoogle() {
    const { authState, fetchUser } = useAuth(); // Get auth state and potentially a way to refresh user data
    const location = useLocation();
    const navigate = useNavigate();

    // State managed by the hook
    const [isConnected, setIsConnected] = useState(!!authState.user?.has_google_credentials);
    const [statusMessage, setStatusMessage] = useState('');
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false); // Track connection initiation
    const [isDisconnecting, setIsDisconnecting] = useState(false); // Track disconnection

    // --- Effect to handle messages from redirects ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const googleConnected = params.get('google_connected');
        const googleError = params.get('google_error');
        let message = '';

        if (googleConnected === 'true') {
            message = 'Successfully connected Google Calendar!';
            // Optionally refresh user data if backend updates has_google_credentials
            // fetchUser?.(); // Assuming fetchUser exists in AuthContext to refetch user data
        } else if (googleError === 'true') {
            // You might want more specific error messages from the backend if possible
            message = 'Failed to connect Google Calendar. Please try again.';
        }

        if (message) {
            setStatusMessage(message);
            // Clean the URL query parameters
            navigate(location.pathname, { replace: true });
        }

        // Update connection status based on authState (might change after fetchUser)
        // This ensures status reflects backend reality if authState is updated elsewhere
        setIsConnected(!!authState.user?.has_google_credentials);

    }, [location.search, location.pathname, navigate, authState.user?.has_google_credentials]); // Add fetchUser if used


    // --- Function to initiate Google Connection ---
    const connectGoogle = useCallback(async () => {
        console.log("useGoogleIntegration: Initiating Google connection...");
        setIsConnecting(true);
        setStatusMessage(''); // Clear previous messages
        try {
            await startGoogleAuth(); // This function redirects the user
            setStatusMessage('Google Account Connected')
            // No need to set state here, the redirect/callback flow handles it
        } catch (error) {
            console.error("useGoogleIntegration: Failed to initiate Google connection", error);
            setStatusMessage(`Failed to start Google connection: ${error.message || 'Unknown error'}`);
            setIsConnecting(false); // Stop loading on error
        }
        // No finally needed as success results in redirect
    }, []); // No dependencies needed

    // --- Function to disconnect Google ---
    const disconnect = useCallback(async () => {
        // --- ADDED LOG ---
        console.log(">>> Entering disconnect function..."); // Log 0
        setIsDisconnecting(true);
        setStatusMessage('');
        try {
            console.log("useGoogleIntegration: Calling disconnectGoogle service..."); // Log 2 (Keep Log 1 name consistent)
            // --- ADDED LOG ---
            console.log(">>> Attempting await disconnectGoogle()..."); // Log 2.5
            const response = await disconnectGoogle(); // Service call
            console.log("useGoogleIntegration: Received response from service:", response); // - Check response structure

            // Check if response exists and set message accordingly
            const messageFromServer = response?.message; // Safely access message
            setStatusMessage(messageFromServer || 'Successfully disconnected Google.');
            console.log("useGoogleIntegration: Status message set.");

            setIsConnected(false); // Update connection state
            console.log("useGoogleIntegration: isConnected set to false.");

            setEvents([]); // Clear events immediately
            console.log("useGoogleIntegration: Events cleared.");

            // Optionally refresh user data from your backend if needed
            // fetchUser?.();

            // Reload the page to ensure a clean state after disconnection.
            console.log("useGoogleIntegration: Preparing to reload page...");
            window.location.reload();

        } catch (error) {
            // --- SIMPLIFIED CATCH LOG ---
            // Log a simple message first to ensure console.error works
            console.error("!!! Hook catch block reached!"); // Log 8 (Simplified)
            // Log the actual error separately
            console.error("useGoogleIntegration: Disconnect Error Object:", error); // Log 9
            setStatusMessage(`Failed to disconnect Google: ${error?.message || 'Unknown error'}`);
             // Ensure loading state is reset even on error
            setIsDisconnecting(false);
        }
    }, []); // Add fetchUser if used

    // --- Function to fetch calendar events ---
    // Renamed for clarity within the hook context
    const fetchEvents = useCallback(async () => {
        if (!isConnected) {
            console.log("useGoogleIntegration: Cannot fetch events, Google not connected.");
            return;
        }
        console.log("useGoogleIntegration: Fetching calendar events...");
        setIsLoadingEvents(true);
        setEvents([]); // Clear previous events
        setStatusMessage(''); // Clear status message
        try {
            const fetchedEvents = await fetchGoogleEvents();
            console.log(fetchedEvents)
            setEvents(fetchedEvents || []);
        } catch (error) {
            console.error("useGoogleIntegration: Failed to fetch calendar events", error);
            let errorMsg = "Failed to fetch calendar events.";
            if (error.response?.status === 400 || error.response?.status === 401) {
                errorMsg = "Connection issue. Please try disconnecting and reconnecting your Google account.";
                setIsConnected(false);
            } else if (error.response?.status === 500) {
                 errorMsg = "Server error fetching Google Calendar events.";
            }
             setStatusMessage(errorMsg);
             setEvents([]);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [isConnected]); // Depends on isConnected status

    // --- Effect to fetch events automatically when connected ---
    useEffect(() => {
        if (isConnected) {
            fetchEvents();
        } else {
            setEvents([]);
        }
    }, [isConnected, fetchEvents]);


    // --- Return values ---
    return {
        isConnected,
        statusMessage,
        events,
        isLoadingEvents,
        isConnecting,
        isDisconnecting,
        connectGoogle,
        disconnectGoogle: disconnect,
        fetchEvents
    };
}
