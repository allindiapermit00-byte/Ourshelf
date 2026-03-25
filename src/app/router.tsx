import { createBrowserRouter } from 'react-router-dom'
import SignInPage from '@/features/auth/SignInPage'
import ProtectedRoute from './ProtectedRoute'
import HomePage from './HomePage'

export const router = createBrowserRouter([
  // Public routes
  { path: '/sign-in', element: <SignInPage /> },

  // Protected routes — unauthenticated users are redirected to /sign-in
  {
    element: <ProtectedRoute />,
    children: [{ path: '/', element: <HomePage /> }],
  },
])
