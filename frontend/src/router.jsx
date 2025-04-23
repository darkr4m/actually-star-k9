import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import RootLayout from "./components/common/RootLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from './pages/common/LoginPage'
import SignupPage from "./pages/common/SignupPage";
import DashboardPage from "./pages/common/Dashboard";
import GoogleCallbackPage from "./pages/common/googleCallbackPage";

import HomePage from "./components/Home";
import DogsListPage from "./pages/dogs/DogsListPage";
import DogDetailPage from './pages/dogs/DogDetailPage';
import DogFormPage from "./pages/dogs/DogFormPage";

const router = createBrowserRouter([
    {
        element: <App/>,
        children: [
            // --- Routes Rendered within RootLayout (have Navbar) ---
            // Public routes accessible to everyone
            {
                path:'/', // Matches all paths starting with /
                element: <RootLayout/>,
                children: [
                    {
                        path: '/login', // Matches '/login'
                        element: <LoginPage />
                    },
                    {
                        path: '/signup', // Matches '/signup'
                        element: <SignupPage />
                    },
                    {
                        path: '/google-callback', // Matches '/signup'
                        element: <GoogleCallbackPage />
                    },
                    // Protected routes accessible to only authenticated users
                    {
                        path: '/dashboard', 
                        element: (
                            <ProtectedRoute>
                                <DashboardPage/>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: '/dogs', 
                        element: (
                            <ProtectedRoute>
                                <DogsListPage/>
                            </ProtectedRoute>
                        )  
                    },
                    { path: '/dogs/add', element: <DogFormPage />},
                    { path: '/dogs/:id', element: <DogDetailPage />},
                    { path: '/dogs/:id/edit', element: <DogFormPage />},
 
                ]
            }
        ]
    }
])

export default router;