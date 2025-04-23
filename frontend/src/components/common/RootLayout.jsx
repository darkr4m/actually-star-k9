import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

export default function RootLayout() {
    const { authState } = useAuth();
    const location = useLocation();

    // Handle the root path redirect logic here
    // If user is at EXACTLY '/' path, redirect based on auth state
    if (location.pathname === '/') {
        return <Navigate to={authState.isAuthenticated ? "/dashboard" : "/login"} replace />;
    }

    return (
        <>
            <Navbar />
            <main className="container">
                { authState.isAuthenticated && (
                    <>
                    <p>Sidebar component</p>
                    </>
                )}
                {/* Child routes will render here */}
                <Outlet />
            </main>
        </>
    );
}