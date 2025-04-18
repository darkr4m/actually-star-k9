import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
            isAuthenticated: false,
            user: null,
            token: null
        }   
    )
    const handleLogin = () => {
        console.log("LOGIN SIM")
        setAuthState({ isAuthenticated: true, user: { name: "Test User" }, token: "dummytoken" });
    }

    const handleLogout = () => {
        // ... your logout logic ...
        console.log("Logging out");
        setAuthState({ isAuthenticated: false, user: null, token: null });
        // Clear local storage, etc.
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
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}