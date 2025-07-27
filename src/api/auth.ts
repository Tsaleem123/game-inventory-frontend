import axios from 'axios'

// Base URL for authentication-related endpoints
const API_BASE = `${import.meta.env.VITE_ENDPOINT}api/auth`;

// Interface for login and register requests
export interface LoginRequest {
  email: string
  password: string
}

// Interface for requests that only require an email
export interface EmailOnly {
  email: string
}

// — LOGIN —
// Sends a login request and returns a JWT token on success
export async function loginUser(data: LoginRequest): Promise<string> {
  const res = await axios.post<{ token: string }>(
    `${API_BASE}/login`,
    data
  )
  return res.data.token
}

// — REGISTER —
// Sends a registration request and returns a confirmation message
export async function registerUser(data: LoginRequest): Promise<string> {
  const res = await axios.post<{ message: string }>(
    `${API_BASE}/register`,
    data
  )
  return res.data.message
}

// — FORGOT PASSWORD —
// Sends a request to trigger a password reset email
export async function forgotPassword(data: EmailOnly): Promise<string> {
  const res = await axios.post<{ message: string }>(
    `${API_BASE}/forgot-password`,
    data
  )
  return res.data.message
}

// — RESET PASSWORD —
// Sends a request to reset the password using a token from email
export async function resetPassword(data: {
  email: string
  token: string
  newPassword: string
}): Promise<string> {
  const res = await axios.post<{ message: string }>(
    `${API_BASE}/reset-password`,
    data
  )
  return res.data.message
}
