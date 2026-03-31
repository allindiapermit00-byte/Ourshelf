import { createBrowserRouter } from 'react-router-dom'
import SignInPage from '@/features/auth/SignInPage'
import ProtectedRoute from './ProtectedRoute'
import AppShell from './AppShell'
import HomePage from './HomePage'
import CreateGroupPage from '@/features/groups/CreateGroupPage'
import JoinGroupPage from '@/features/groups/JoinGroupPage'
import GroupCatalogPage from '@/features/groups/GroupCatalogPage'
import GroupListPage from '@/features/groups/GroupListPage'

export const router = createBrowserRouter([
  // Public routes
  { path: '/sign-in', element: <SignInPage /> },

  // Protected routes — unauthenticated users are redirected to /sign-in
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/groups', element: <GroupListPage /> },
          { path: '/groups/new', element: <CreateGroupPage /> },
          { path: '/groups/:groupId', element: <GroupCatalogPage /> },
          { path: '/join', element: <JoinGroupPage /> },
          { path: '/join/:code', element: <JoinGroupPage /> },
        ],
      },
    ],
  },
])
