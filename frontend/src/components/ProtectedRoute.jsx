import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }){
    const location = useLocation();

    if(!isAuthenticated){
        // Redirect user to the /login page, but save the current location they were trying to go to when they were redirected. 
        // Allows app to send user to that page after they login
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children;
}