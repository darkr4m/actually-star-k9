import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

// Simple NavBar Component
export default function Navbar(){
    const { authState, handleLogout } = useContext(AuthContext)

    return (
        <nav>
            <span>5 Star K9</span>
            <Link to="/">Home</Link>
            {authState.isAuthenticated ? (
                <>
                    <span> Welcome {authState.user?.first_name}</span>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </>
            )}
        </nav>
    )
}