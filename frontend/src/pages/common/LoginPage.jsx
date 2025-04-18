import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';





export default function LoginPage() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
    const [isLoading, setIsLoading] = useState(false); //loading state
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin } = useAuth() // Get login handler from context
    const [showPassword, setShowPassword] = React.useState(false); // Material UI SHOW/HIDE password adornment

    // Determine where to redirect after login
    const from = location.state?.from?.pathname || "/dashboard" // Redirect destination

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('') // Clear previous errors
        setIsLoading(true); // Set loading true

            try {
                console.log("Attempting login...")
                // 1. get JWT Tokens - Call the login API endpoint
                const response = await api.post('/users/login/', {email, password});
                const tokens = response.data
                console.log("Tokens received: ", tokens)
                // 2. Call handleLogin from context with the received tokens
                
                handleLogin(tokens)
                console.log("User data received: ", response.data)

                // 4. Redirect User
                console.log(`Login successful, navigating to: ${from}`);
                navigate(from, { replace: true })

            } catch (error) {
                // Handle login errors
                console.error("Login failed: ", error.response?.data || error.message );
                localStorage.removeItem('access_token'); // Clean up partial login attempt
                localStorage.removeItem('refresh_token');
                setError(error.response?.data?.detail || 'Login failed. Please check credentials.');
                setIsLoading(false); // Set loading false on error
            }
        }

        // --- Material UI Component Functions
        const handleClickShowPassword = () => setShowPassword((show) => !show);
        const handleMouseDownPassword = (event) => {
          event.preventDefault();
        };
        const handleMouseUpPassword = (event) => {
          event.preventDefault();
        };

        return (
            <Container component="main" maxWidth="xs" >
                <Paper elevation={2} square>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1, display: 'flex', flexDirection:'column', p:3, gap:2, alignItems:'center'}} >
                        <Typography>LOG IN</Typography>
                        <TextField
                            variant="outlined"
                            size="small"
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth />
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        { error && <p>{error}</p>}
                        <Button variant="contained" type="submit" fullWidth>Login</Button>
                        {/* <Button size="small">Forgot Password</Button> */}
                        <Box sx={{display: 'flex', flexDirection:'column', alignItems:'center'}} >
                            <Typography variant="overline" component="span">Don't have an account?</Typography>
                            <Button variant="outlined" component={Link} to='/signup'>Sign Up</Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        )
    }