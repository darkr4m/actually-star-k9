import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// 1. Create the context
export const AuthContext = createContext(null)

// 2. Create a Provider component
export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
        isAuthenticated: !!localStorage.getItem('access_token'), // Initial check based on token presence
        isAuthLoading: true, // Start in loading state
        user: null,
    }   
)
    const navigate = useNavigate();
    // Effect to fetch user data on initial load
    useEffect(() =>{
        const tokenToUse = authState.token // Use token from state
        console.log("AuthProvider useEffect triggered. Token:", tokenToUse);
        fetchUser(tokenToUse)
    },[authState.token]) // Run only on initial mount

    const fetchUser = async (currentToken) => {
        // Only proceed if there's a token and user data isn't already loaded for this token
        // Or simply fetch if token exists, assuming backend handles verification
         if (currentToken) {
            console.log("AuthProvider: fetchUser called with token.");
            // Set loading true only if user is not already set for this token? Or always?
            // Let's assume we fetch whenever token exists but user is null
             if (!authState.user) {
                 setAuthState(prev => ({ ...prev, isAuthLoading: true })); // Indicate loading user data
             }

            try {
                // Use the API instance; interceptor adds the token
                const response = await api.get('/users/me/');
                setAuthState(prev => ({
                    ...prev,
                    user: response.data,
                    isAuthenticated: true, // Ensure isAuthenticated is true
                    isAuthLoading: false // Finished loading user data
                }));
                console.log("AuthProvider: USER FETCHED:", response.data);
            } catch (error) {
                console.error("AuthProvider: FAILED TO FETCH USER (token might be invalid/expired)", error);
                // If fetching user fails, the token is likely invalid. Logout.
                // Use the internal logout logic but prevent navigation if interceptor handles it.
                 handleLogout(false); // Clear state without navigating from here
                 setAuthState(prev => ({ ...prev, isAuthLoading: false })); // Ensure loading stops
                 // The API interceptor might have already redirected via window.location.href
            }
        } else {
            // No token, ensure clean state and stop loading
            console.log("AuthProvider: No token found in fetchUser, ensuring logged out state.");
            setAuthState(prev => ({
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                user: null,
                isAuthLoading: false
            }));
        }
    };




    const handleLogin = (tokens, userData) => {
        // --- DEBUG LOGGING ---
        console.log("AuthContext.jsx/handleLogin():")
        console.log("Attempting to log in...")
        console.log(`Setting access token to: ${tokens.access}.`)
        console.log(`Setting access token to: ${tokens.refresh}.`)
        // --- Set Access and refresh tokens in local storage
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        console.log(`Setting authState...`)
        // Update state: mark as authenticated, store tokens, clear user initially
        // The useEffect listening to authState.token will trigger fetchUser.
        setAuthState({
            ...authState,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
            isAuthLoading: false,
            user: userData
        })
        console.log("AuthProvider: Login successful, authState updated:", authState );
        // Navigation after login should ideally happen in the LoginPage component
        // using `Maps(location.state?.from?.pathname || '/dashboard', { replace: true });`
    }

    const handleLogout = (shouldNavigate=true) => {
        // --- DEBUG LOGGING ---
        console.log("AuthContext.jsx/handleLogout():")
        console.log("Attempting to log out...")
        console.log(`Removing tokens.`)
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthState({ 
            token: null,
            refreshToken: null, 
            isAuthenticated: false,
            isAuthLoading: false,
            user: null, 
        });
        console.log("AuthProvider: Logged out, authState cleared.")
        // Use navigate hook for redirection if requested
        if (shouldNavigate) navigate('/login')
    };

    useEffect(() => {
        // Check for existing token/session on load
        console.log("AuthProvider mounted - check initial auth state here");
     }, []);

     const contextValue = {
        authState,
        handleLogin, // Make sure to export functions needed by consumers
        handleLogout
    };

    if(authState.isAuthLoading) {
        return <div>Loading authentication...</div>
    }
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for consuming the context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}