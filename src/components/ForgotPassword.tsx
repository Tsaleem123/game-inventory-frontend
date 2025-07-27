import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { forgotPassword } from '../api/auth';

/**
 * Props interface for the ForgotPassword component
 */
interface ForgotPasswordProps {
  /** Callback function to navigate back to the login screen */
  onback: () => void;
}

/**
 * ForgotPassword component that allows users to request a password reset
 * by providing their email address. Displays success/error messages and
 * provides navigation back to the login screen.
 */
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onback }) => {
  // State for storing the user's email input
  const [email, setEmail] = useState('');

  // State for storing and displaying error messages
  const [error, setError] = useState('');

  // State for storing and displaying success messages
  const [success, setSuccess] = useState('');

  /**
   * Handles the form submission for password reset request
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing error or success messages
    setError('');
    setSuccess('');

    try {
      // Call the API to send password reset email
      const message = await forgotPassword({ email });
      setSuccess(message);
    } catch (err: any) {
      // Handle API errors and display appropriate error message
      setError(err.response?.data?.message || 'Request failed. Try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, minWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}
    >
      {/* Page heading */}
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>

      {/* Email input field */}
      <TextField
        fullWidth
        type="email"
        label="Email"
        name="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Error message display - only shown when error exists */}
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* Success message display - only shown when success message exists */}
      {success && (
        <Typography color="primary" sx={{ mt: 1 }}>
          {success}
        </Typography>
      )}

      {/* Submit button to send reset link */}
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Send Reset Link
      </Button>

      {/* Navigation button to return to login screen */}
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={onback}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;