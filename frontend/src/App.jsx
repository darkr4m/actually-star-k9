import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './contexts/AuthContext.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    // <p>hi</p>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <CssBaseline />
        <Outlet />
      </AuthProvider>
    </LocalizationProvider>
  )
}

export default App
