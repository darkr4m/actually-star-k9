import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import api from './services/api'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DogsPage from './pages/DogsPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import './App.css'

// Create Auth Context
export const AuthContext = createContext(null);

function App() {
  const [ authState, setAuthState] = useState({
    token: localStorage.getItem('access_token'), // Check local storage on initial load
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'), // Checks if an access token exists (not an empty string) in localStorage and sets the isAuthenticated variable to true/false
    isAuthLoading: true,
    user:null
  })
  const navigate = useNavigate();

  const fetchUser = async () => {
    if(authState.token){
      try {
        const response = await api.get('/users/me/'); // Fetch user details
        setAuthState(prev => ({
          ...prev,
          user: response.data,
          isAuthenticated: true,
          isAuthLoading: false
        }));
        console.log("USER FETCHED:", response.data);
      } catch (error) {
        console.error("FAILED TO FETCH USER // TOKEN EXPIRED", error)
        // Token might be invalid/expired, clear state
        handleLogout(); // Use logout function to clear everything
      }
    } else {
      setAuthState(prev => ({
        ...prev,
        isAuthLoading:false // No token, stop loading
      }))
    }
  }
  
  useEffect(() => {
    fetchUser();
  },[]) // Run only once on mount

  const handleLogin = (tokens, userData) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setAuthState({
      token:tokens.access,
      refreshToken:tokens.refresh,
      isAuthenticated:true,
      isAuthLoading:false,
      user: userData // Store user data obtained after login
    })
    console.log("Login successful, authState updated:", { token: tokens.access, user: userData });
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthState({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAuthLoading: false,
      user: null
    })
    console.log("Logged out, authState cleared");
    navigate('/login');
  }

  if(authState.isAuthLoading) {
    return <div>Loading authentication status...</div> // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path='/login' element={ <LoginPage /> }/>
            <Route path='/signup' element={ <SignupPage /> } />
            <Route path='/dashboard' element={ 
              <ProtectedRoute>
                <DashboardPage /> 
              </ProtectedRoute>
            } />
            <Route path='/dogs' element={
                <ProtectedRoute>
                  <DogsPage/>
                </ProtectedRoute>
              }
            />
            {/* Redirect base path */}
            <Route 
            path='/'
            element={<Navigate to={ authState.isAuthenticated ? "/dashboard" : "/login" } replace />}
            />
            <Route path="/google-callback" element={<GoogleCallbackPage />} />
            {/* Catch-all for 404 */}
            <Route path="*" element={ <div>404 Not Found</div> }/>
          </Routes>
        </div>
    </AuthContext.Provider>
  )
}

export default App
