import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function SignupPage(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = React.useState(false); // Material UI SHOW/HIDE password adornment
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

    // --- Material UI Component Functions
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1, display: 'flex', flexDirection:'column', p:3, gap:2, alignItems:'center'}}>
                <Typography>Sign Up</Typography>
                    {/* <div>
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" value={ username } onChange={(e) => setUsername(e.target.value)} required />
                    </div> */}
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
                        fullWidth 
                        required/>
                        <TextField
                            variant="outlined"
                            size="small"
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            required />
                        <TextField
                            variant="outlined"
                            size="small"
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            autoFocus
                            value={firstName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            required />
                        <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    required
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
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password2"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    required
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
                                    label="Confirm Password"
                                    
                                />
                            </FormControl>
                    { error && <p>{ error }</p> }
                    { success && <p>{ success }</p> }
                    <Button variant="contained" type="submit" fullWidth>Sign Up</Button>
                    <Button size="small" fullWidth>Cancel</Button>
                    <Box sx={{display: 'flex', flexDirection:'column', alignItems:'center'}} >
                        <Typography variant="overline" component="span">Already have an account?</Typography>
                        <Button variant="outlined" component={Link} to='/login'>Sign In</Button>
                    </Box>
                    
                </Box>
            </Paper>
        </Container>
    )
}