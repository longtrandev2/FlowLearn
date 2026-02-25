import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/layouts/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import { OverviewPage } from '@/pages/OverviewPage'
import RegisterPage from '@/pages/RegisterPage'
import LibraryPage from '@/pages/LibraryPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'

export const router = createBrowserRouter([
    // Landing Page (public)
    {
        path: '/landing',
        element: <LandingPage />,
    },
    // Auth
    {
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
        ],
    },
    // Protected
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    { index: true, element: <OverviewPage /> },
                    { path: 'library', element: <LibraryPage /> },
                    { path: 'library/:folderId', element: <LibraryPage /> },
                ],
            },
        ],
    },
    // Fallback
    { path: '*', element: <Navigate to="/landing" replace /> },
])
