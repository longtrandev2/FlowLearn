import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/layouts/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import { OverviewPage } from '@/pages/OverviewPage'
import RegisterPage from '@/pages/RegisterPage'
import LibraryPage from '@/pages/LibraryPage'
import StudyPage from '@/pages/StudyPage'
import SettingsPage from '@/pages/SettingsPage'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminLoginPage from '@/pages/AdminLoginPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/features/admin/layouts/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import { MSWTestPage } from '@/pages/MSWTestPage'

export const router = createBrowserRouter([
    // Landing Page (public)
    {
        path: '/landing',
        element: <LandingPage />,
    },
    // MSW Test Page (dev only)
    {
        path: '/msw-test',
        element: <MSWTestPage />,
    },
    // Auth
    {
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
        ],
    },
    // User Protected Routes
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
                    { path: 'study', element: <StudyPage /> },
                ],
            },
        ],
    },
    // Admin Routes
    {
        path: '/admin',
        children: [
            { path: 'login', element: <AdminLoginPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <AdminDashboardPage /> },
                            { path: 'users', element: <AdminUsersPage /> },
                        ],
                    },
                ],
            },
        ],
    },
    // Settings Route
    {
        path: '/settings',
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [{ index: true, element: <SettingsPage /> }],
            },
        ],
    },
    // Fallback
    { path: '*', element: <Navigate to="/landing" replace /> },
])
