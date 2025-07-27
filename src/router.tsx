import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { createBrowserHistory } from '@tanstack/history';

import App from './App';
import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserGameList from './components/UserGameList';

// Root layout route
const rootRoute = createRootRoute({
  component: () => <div><Outlet /></div>,
});

// Login route with redirect if already logged in
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/app';
      return null;
    }
    return <LoginForm />;
  },
});

// Signup route
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => {
    const navigate = useNavigate();
    return (
      <Signup
        onSignupSuccess={() => navigate({ to: '/' })}
        onback={() => navigate({ to: '/' })}
      />
    );
  },
});

// Forgot password route
const forgotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => {
    const navigate = useNavigate();
    return <ForgotPassword onback={() => navigate({ to: '/' })} />;
  },
});

// Reset password route
const resetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || '';
    const token = params.get('token') || '';

    if (!email || !token) return <div>Invalid reset link</div>;

    return (
      <ResetPassword
        email={email}
        token={token}
        onDone={() => navigate({ to: '/' })}
      />
    );
  },
});

//app route 
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: () => <App />,
});

// Protected /my-games route
const userGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-games',
  component: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return null;
    }
    return <UserGameList />;
  },
});

// Create router instance
export const router = createRouter({
  history: createBrowserHistory(),
  routeTree: rootRoute.addChildren([
    loginRoute,
    signupRoute,
    forgotRoute,
    resetRoute,
    appRoute,
    userGameRoute,
  ]),
});

// Provide router
export function AppRouter() {
  return <RouterProvider router={router} />;
}
