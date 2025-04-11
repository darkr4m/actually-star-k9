import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api, {startGoogleAuth, completeGoogleOAuth, disconnectGoogle} from '../services/api'; // Use the configured api instance

function DashboardPage() {
    const { authState } = useContext(AuthContext);
    const [googleStatus, setGoogleStatus] = useState({ connected: authState.user?.has_google_credentials, message: '' });
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();


    const handleGoogleOAuthCallback = () => {
        const params = new URLSearchParams(location.search);
        const googleConnected = params.get('google_connected')
        const googleError = params.get('google_error')

        if (params.get('code') && params.get('state')){
            completeGoogleOAuth()
                .then(()=> {
                    setGoogleStatus({ connected: true, message: 'Successfully connected to Google.' })
                    navigate('/dashboard', { replace: true })
                })
                .catch((error) => {
                    setGoogleStatus({ connected: false, message: `Failed to connect Google: ${error.message || 'Unknown error'}` })
                })
        } else if (googleConnected === 'true') {
            setGoogleStatus({ connected: true, message: 'Successfully connected Google Calendar!' });
            navigate(location.pathname, { replace: true });
        } else if (googleError) {
            setGoogleStatus({ connected: false, message: `Failed to connect Google Calendar: ${googleError}` });
            navigate(location.pathname, { replace: true });
        } else {
            setGoogleStatus(prev => ({ ...prev, connected: authState.user?.has_google_credentials }));
        }
    }

    useEffect(() =>{
        handleGoogleOAuthCallback()
    }, [location.search, navigate, authState.user?.has_google_credentials])

    // // Check for query params from Google OAuth redirect
    //  useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     if (params.get('google_connected') === 'true') {
    //         setGoogleStatus({ connected: true, message: 'Successfully connected Google Calendar!' });
    //         // Optionally refetch user data if needed, or rely on initial load
    //          // Remove query params from URL without reloading page
    //          navigate(location.pathname, { replace: true });
    //     } else if (params.get('google_error')) {
    //          setGoogleStatus({ connected: false, message: `Failed to connect Google Calendar: ${params.get('google_error')}`});
    //           navigate(location.pathname, { replace: true });
    //     } else {
    //         // Update status based on potentially updated user data from context
    //          setGoogleStatus(prev => ({ ...prev, connected: authState.user?.has_google_credentials }));
    //     }
    //  }, [location.search, navigate, authState.user?.has_google_credentials]); // Rerun if search params or user cred status changes

    const handleConnectGoogle = async () => {
        // Redirect the user to the backend endpoint which will trigger Google OAuth
        // The backend will handle the flow and redirect back here
        console.log("Initiating Google connection...");
        try {
            await startGoogleAuth();
        } catch (error) {
            setGoogleStatus({ connected: false, message: `Failed to initiate Google connection: ${error.message || 'Unknown error'}` });
        }
    };

    const handleDisconnectGoogle = async () => {
        try {
            const response = await disconnectGoogle();
            setGoogleStatus({ connected: true, message: response.message }) // Display success message
            // Optional: Refresh the page or update UI
            window.location.reload();
        } catch (error) {
            setGoogleStatus({ connected: true, message: `Failed to disconnect Google connection: ${error.message || 'Unknown error'}` });
        }
    };

    const handleFetchCalendarEvents = async () => {
         if (!googleStatus.connected) {
             setGoogleStatus(prev => ({ ...prev, message: "Please connect Google Calendar first."}));
             return;
         }
         setIsLoadingEvents(true);
         setCalendarEvents([]);
         setGoogleStatus(prev => ({ ...prev, message: ''})); // Clear previous messages
         try {
             console.log("Fetching calendar events...");
             const response = await api.get('/calendar/events/');
             console.log("Events received:", response.data);
             setCalendarEvents(response.data || []);
             setGoogleStatus(prev => ({ ...prev, message: `Workspaceed ${response.data?.length || 0} events.` }));
         } catch (error) {
              console.error("Failed to fetch calendar events:", error.response?.data || error.message);
              let errorMsg = "Failed to fetch calendar events.";
              if (error.response?.status === 403) {
                  errorMsg = "Google account not connected or permission issue. Try reconnecting.";
                  // Optionally update connection status if backend indicated disconnect
                  // setGoogleStatus({ connected: false, message: errorMsg });
              } else if (error.response?.status === 503) {
                   errorMsg = "Could not connect to Google Calendar service. Maybe a token issue? Try reconnecting.";
              }
              setGoogleStatus(prev => ({ ...prev, message: errorMsg }));
              // Consider prompting re-authentication if error indicates token issues
         } finally {
             setIsLoadingEvents(false);
         }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {authState.user?.username}!</p>

            <hr />

            <h3>Google Calendar Integration</h3>
            {googleStatus.message && <p style={{ color: googleStatus.connected && !googleStatus.message.includes('Failed') ? 'green' : 'red' }}>{googleStatus.message}</p>}

            {!googleStatus.connected ? (
                <button onClick={handleConnectGoogle}>Connect Google Calendar</button>
            ) : (
                <div>
                     <p style={{color: 'green'}}>Google Calendar Connected!</p>
                    {/* Add button to disconnect later if needed */}
                     <button onClick={handleFetchCalendarEvents} disabled={isLoadingEvents}>
                         {isLoadingEvents ? 'Loading Events...' : 'Fetch Upcoming Events'}
                     </button>
                     <br />
                     <button onClick={handleDisconnectGoogle}>Disconnect Google</button>

                     <h4>Upcoming Events:</h4>
                     {calendarEvents.length > 0 ? (
                         <ul>
                             {calendarEvents.map(event => (
                                 <li key={event.id}>
                                     {event.summary} ({new Date(event.start.dateTime || event.start.date).toLocaleString()})
                                 </li>
                             ))}
                         </ul>
                     ) : (
                         !isLoadingEvents && <p>No upcoming events found.</p>
                     )}
                </div>
            )}

             <hr />

             {/* Add other CRM components and functionality here */}
             <p>Your dog training CRM content goes here...</p>

        </div>
    );
}

export default DashboardPage;