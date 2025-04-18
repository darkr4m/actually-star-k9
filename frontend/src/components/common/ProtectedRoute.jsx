import React from "react";
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({children}){
    const { authState } = useAuth()
    const location = useLocation()
    
    if(!authState.isAuthenticated){
        // User not logged in, redirect to login page
        // state={{ from: location }} preserves the intended destination
        console.log("ProtectedRoute: Not authenticated, redirecting to login.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children
}