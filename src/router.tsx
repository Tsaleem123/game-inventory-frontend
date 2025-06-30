// Import required TanStack Router modules and components
import {
    RouterProvider,
    createRouter,
    createRoute,
    createRootRoute,
} from '@tanstack/react-router'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { createBrowserHistory } from '@tanstack/history'

// Import application components
import App from './App'
import LoginForm from './components/LoginForm'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

/* ─────────────────────────────────────────────────────────────
 * 1) Create the root route
 * This serves as the parent route and wraps all child routes
 * with <Outlet /> so nested routes render properly.
 * ───────────────────────────────────────────────────────────── */
const rootRoute = createRootRoute({
    component: () => <div><Outlet /></div>,
})

/* ─────────────────────────────────────────────────────────────
 * 2) Define child routes (login, signup, forgot/reset password, app)
 * Each route declares its path and component, with optional 
 * redirection or token handling logic.
 * ───────────────────────────────────────────────────────────── */

// Login route (default landing route)
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LoginForm,
})

// Signup route with navigation callbacks
const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: () => {
        const navigate = useNavigate()
        return (
            <Signup
                onSignupSuccess={() => navigate({ to: '/' })} // Redirect to login on success
                onback={() => navigate({ to: '/' })}         // Allow navigating back to login
            />
        )
    },
})

// Forgot Password route with back navigation
const forgotRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/forgot-password',
    component: () => {
        const navigate = useNavigate()
        return (
            <ForgotPassword onback={() => navigate({ to: '/' })} />
        )
    },
})

// Reset Password route with token/email validation
const resetRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    component: () => {
        const navigate = useNavigate()

        // Extract token and email from URL query params
        const params = new URLSearchParams(window.location.search)
        const email = params.get('email') || ''
        const token = params.get('token') || ''

        // Show error if either is missing
        if (!email || !token) {
            return <div>Invalid reset link</div>
        }

        return (
            <ResetPassword
                email={email}
                token={token}
                onDone={() => navigate({ to: '/' })} // Redirect to login when done
            />
        )
    },
})

// Protected /app route that checks for JWT token in localStorage
const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app',
    component: () => {
        const token = localStorage.getItem('token')
        if (!token) {
            // Redirect to login if token is missing
            window.location.href = '/'
            return null
        }
        return <App />
    },
})

/* ─────────────────────────────────────────────────────────────
 * 3) Create the router instance
 * Adds all routes as children to the root route
 * ───────────────────────────────────────────────────────────── */
export const router = createRouter({
    history: createBrowserHistory(),
    routeTree: rootRoute.addChildren([
        loginRoute,
        signupRoute,
        forgotRoute,
        resetRoute,
        appRoute,
    ]),
})

/* ─────────────────────────────────────────────────────────────
 * 4) Provide the router to your app
 * This is the entry point used in main.tsx or App.tsx
 * ───────────────────────────────────────────────────────────── */
export function AppRouter() {
    return <RouterProvider router={router} />
}
