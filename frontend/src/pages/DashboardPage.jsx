import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../services/api'; // Use the configured api instance

export default function DashboardPage(){
    const { authState } = useContext(AuthContext)
    // const [googleStatus, setGoogleStatus] = useState({ connected: authState.user?.has_google_credentials, message: '' });
    // const [calendarEvents, setCalendarEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    console.log(authState.user)

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {authState.user?.first_name}</p>
            <hr />
            <h3>GOOGLE CAL NYI</h3>
            <button>LINK GOOGLE ACCOUNT</button>
        </div>
    )
}