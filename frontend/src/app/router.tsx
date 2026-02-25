import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/layouts/ProtectedRoute'
import FolderDetailsPage from '@/pages/FolderDetailsPage'
import LoginPage from '@/pages/LoginPage'
import { OverviewPage } from '@/pages/OverviewPage'
import RegisterPage from '@/pages/RegisterPage'
import { StudyFolderPage } from '@/pages/StudyFolderPage'
import {createBrowserRouter} from 'react-router-dom'
export const router = createBrowserRouter([
    //Auth
    {
        element: <AuthLayout/>,
        children:[
            {path: '/login', element:<LoginPage/>},
            {path: '/register', element: <RegisterPage/>}
        ]
    },
    {
        element: <ProtectedRoute/>,
        children: [
            {
                path:'/',
                element: <MainLayout/>,
                children: [
                    {index : true,  element:<OverviewPage/>},
                    {path : '/study-folder',  element:<StudyFolderPage/>},
                    { path: 'study-folder/:id', element: <FolderDetailsPage /> },
                    {index : true,  element:<OverviewPage/>}
                ]
            }
        ]
    }
    
])
