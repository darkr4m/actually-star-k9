import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from '../App' // Import context
import api from "../services/api";

export default function LoginPage() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin } = useContext(AuthContext) // Get login handler from context

    const from = location.state?.from?.pathname || "/dashboard" // Redirect destination

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')// Clear previous errors
        try {
            console.log("Attempting login...")
            // 1. get JWT Tokens
            const response = await api.post('/users/login/', {email, password});
            const tokens = response.data
            console.log("Tokens received: ", tokens)
            // Store tokens temporarily to make the next request
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            // 2. Fetch user details
            const userResponse = await api.get('/users/me')  // API instance now uses the new token
            const userData = userResponse.data;
            console.log("User data received: ", userData)

            // 3. Update auth state via context
            handleLogin(tokens, userData)

            // 4. Redirect User
            console.log(`Login successful, navigating to: ${from}`);
            navigate(from, { replace: true })

        } catch (error) {
            console.error("Login failed: ", error.response?.data || error.message );
            localStorage.removeItem('access_token'); // Clean up partial login attempt
            localStorage.removeItem('refresh_token');
            setError(error.response?.data?.detail || 'Login failed. Please check credentials.');
        }
            
        }
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input type="text" name="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    { error && <p>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }