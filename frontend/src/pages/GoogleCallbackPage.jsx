import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { completeGoogleOAuth } from '../services/api';

function GoogleCallbackPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [hasRun, setHasRun] = useState(false)

    useEffect(() => {
        if (hasRun) return;
        setHasRun(true);
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        console.log('Google redirect params:', { code, state });  // Debug
        if (code && state) {
            completeGoogleOAuth()
                .then(() => {
                    navigate('/dashboard?google_connected=true', { replace: true });
                })
                .catch((error) => {
                    console.error('Google OAuth callback failed:', error);
                    navigate('/dashboard?google_error=callback_failed', { replace: true });
                });
        } else {
            console.error('Missing code or state in redirect URL');
            navigate('/dashboard?google_error=missing_params', { replace: true });
        }
    }, [navigate, location.search]);

    return <div>Connecting to Google Calendar...</div>;
}

export default GoogleCallbackPage;