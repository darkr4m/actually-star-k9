import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SignupPage(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if(password !== password2){
            setError("Passwords do not match")
        }

        try {
            console.log("Attempting signup...");
            await api.post('/users/signup/', {
                username,
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                password2
            })
            console.log('Sign up successful.')
            setSuccess("Sign up successful. Redirecting to login...")
            setTimeout(()=>{
                navigate('/login')
            }, 2000) // Redirect after 2 seconds
        } catch (error) {
            console.error("Signup Failed: ", error.response?.data || error.message )
            let errorMsg = "Registration failed. Please try again."
            if(error.response?.data && typeof error.response.data === 'object'){
                // Extract specific errors from DRF response
                const errors = error.response.data
                const messages = Object.keys(errors).map(
                    key => {
                        const errorValue = errors[key]
                        if (Array.isArray(errorValue)) {
                            return `${key}: ${errors[key].join(', ')}`            
                        } else {
                            return `${key}: ${String(errorValue)}`;
                        }
                    })
                errorMsg = messages.join(' | ');
            } else if (typeof error.response?.data === 'string') {
                // Handle cases where the entire error response data is just a string
                errorMsg = error.response.data;
            }
            setError(errorMsg);
        }
    }

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {/* <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" value={ username } onChange={(e) => setUsername(e.target.value)} required />
                </div> */}
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="text" name="email" value={ email } onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="firstName">First Name: </label>
                    <input type="text" name="firstName" value={ firstName } onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name: </label>
                    <input type="text" name="lastName" value={ lastName } onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" value={ password } onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password2">Confirm Password: </label>
                    <input type="password" name="password2" value={ password2 } onChange={(e) => setPassword2(e.target.value)} required />
                </div>
                { error && <p>{ error }</p> }
                { success && <p>{ success }</p> }
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}