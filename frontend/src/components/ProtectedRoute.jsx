import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function ProtectedRoute({ isAuthenticated, children }){
    const { authState } = useContext(AuthContext)
    const location = useLocation();

    if(!authState?.isAuthenticated){
        // Redirect user to the /login page, but save the current location they were trying to go to when they were redirected. 
        // Allows app to send user to that page after they login
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children;
}