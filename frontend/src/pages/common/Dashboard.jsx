import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useGoogle } from '../../hooks/useGoogle';
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    const { authState } = useAuth()
    const { 
        connected,
        statusMessage,
        events,
        isConnecting,
        isDisconnecting,
        connectGoogle,
        disconnectGoogle,
        fetchEvents
     } = useGoogle()
    const [googleStatus, setGoogleStatus] = useState({ connected: authState.user?.has_google_credentials, message: '' });
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        return date.toLocaleString('en-US', options);
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {authState.user?.username}!</p>
            <Link to='/dogs'>Dogs</Link> <Link to='/clients'>Clients</Link>
            <hr />

            <h3>Google Calendar Integration</h3>
            {googleStatus.message && <p style={{ color: googleStatus.connected && !googleStatus.message.includes('Failed') ? 'green' : 'red' }}>{googleStatus.message}</p>}

            {!googleStatus.connected ? (
                <Button variant='contained' onClick={connectGoogle} disabled={isConnecting}>Connect Your Google Account</Button>
            ) : (
                <div>
                     <p style={{color: 'green'}}>Google Calendar Connected!</p>
                     <Button variant="contained" onClick={fetchEvents} disabled={isLoadingEvents}>
                         {isLoadingEvents ? 'Loading Events...' : 'Fetch Upcoming Events'}
                     </Button>
                     <br />
                     <Button variant='outlined' onClick={disconnectGoogle} disabled={isDisconnecting}>
                        Disconnect Google Account</Button>

                     <h4>Upcoming Events:</h4>
                     {events.length > 0 ? (
                         <ul>
                             {events.map(event => (
                                 <li key={event.id}>
                                    {event.title} - {event.description} - {formatDateTime(event.start)} to {formatDateTime(event.end)}
                                 </li>
                             ))}
                         </ul>
                     ) : (
                         !isLoadingEvents && <p>No upcoming events found.</p>
                     )}
                </div>
            )}
             <hr />
        </div>
    );
}
