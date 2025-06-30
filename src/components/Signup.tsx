import React, { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { registerUser } from '../api/auth'

// Props expected by the Signup component
interface SignupProps {
  onSignupSuccess: () => void  // Callback to trigger after successful signup
  onback: () => void           // Callback to return to login screen
}

// Signup form component
const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onback }) => {
  // Local state for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // States for feedback and control
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple regex-based email format validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate email format
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      // Attempt to register the user
      const message = await registerUser({ email, password })

      // Display a user-friendly success message
      if (
        message?.toLowerCase().includes('verify') ||
        message?.toLowerCase().includes('confirmation')
      ) {
        setSuccess('Signup successful! Please check your inbox to verify your email.')
      } else {
        setSuccess(message || 'Signup successful.')
      }

      // Delay redirect to allow user to read the message
      setTimeout(() => {
        onSignupSuccess()
      }, 3000)
    } catch (err: any) {
      // Handle server-side validation or other errors
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '))
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Signup failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // Centered signup form box
    <Box
      component="form"
      onSubmit={handleSignup}
      sx={{ maxWidth: 400, minWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}
    >
      {/* Form heading */}
      <Typography variant="h5" gutterBottom>Sign Up</Typography>

      {/* Email input field */}
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input field */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Error and success message displays */}
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}

      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        Sign Up
      </Button>

      {/* Back to login button */}
      <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={onback}>
        Back to Login
      </Button>
    </Box>
  )
}

export default Signup;
