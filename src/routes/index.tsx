import { PATH } from '@/constants/path'
import { createBrowserRouter } from 'react-router-dom'
import CreatePlaylistPage from '@/pages/CreatePlaylistPage'
import FollowPage from '@/pages/FollowPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PlaylistPage from '@/pages/PlaylistPage'
import ProfilePage from '@/pages/ProfilePage'
import SearchPage from '@/pages/SearchPage'
import RootLayout from '@/layout/Root'
import ChatPage from '@/pages/ChatPage'
import HomePage from '@/pages/HomePage'
import ResetPwPage from '@/pages/ResetPwPage'
import SignUpPage from '@/pages/SignUpPage'
import PrivateRoute from '@/routes/PrivateRoute'

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: PATH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATH.SIGNUP,
        element: <SignUpPage />,
      },
      { path: PATH.EDITPW, element: <ResetPwPage /> },
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          { path: PATH.PLAYLIST, element: <PlaylistPage /> },
          { path: PATH.USER_PROFILE, element: <ProfilePage /> },
          { path: PATH.CREATEPLAYLIST, element: <CreatePlaylistPage /> },
          { path: PATH.FOLLOW, element: <FollowPage /> },
          { path: PATH.CHAT, element: <ChatPage /> },
          { path: PATH.SEARCH, element: <SearchPage /> },
        ],
      },
    ],
  },
])

export default router
