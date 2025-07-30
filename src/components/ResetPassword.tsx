import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { resetPassword } from '../api/auth';

/**
 * Props interface for the ResetPassword component
 */
interface Props {
  /** Email address for the password reset */
  email: string;
  /** Reset token from the password reset email */
  token: string;
  /** Callback function triggered when password reset is complete or user wants to go back */
  onDone: () => void;
}

/**
 * ResetPassword component that allows users to set a new password
 * Validates password requirements, confirms password match,
 * and handles the password reset API call with proper error handling
 */
const ResetPassword: React.FC<Props> = ({ email, token, onDone }) => {
  // State for new password input
  const [newPass, setNewPass] = useState('');

  // State for password confirmation input
  const [confirmPass, setConfirmPass] = useState('');

  // State for storing and displaying error messages
  const [error, setError] = useState('');

  // State for storing and displaying success messages
  const [success, setSuccess] = useState('');

  /**
   * Handles form submission for password reset
   * Validates password requirements and confirmation before calling API
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing messages
    setError('');
    setSuccess('');

    // Validate minimum password length
    if (newPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Validate password confirmation matches
    if (newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Call API to reset password with email, token, and new password
      const message = await resetPassword({ email, token, newPassword: newPass });
      setSuccess(message);

      // Auto-redirect to login after 2 seconds on success
      setTimeout(onDone, 2000);
    } catch (err: any) {
      // Handle API errors and display appropriate error message
      setError(err.response?.data?.message || 'Reset failed. Try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: { xs: '90%', sm: 400, md:500 },
        mx: 'auto',
        mt: 6,
        textAlign: 'center',
        px: { xs: 2, sm: 0 }
      }}

    >
      {/* Page heading */}
      <Typography variant="h5" gutterBottom>
        Choose a New Password
      </Typography>

      {/* Display email being reset for user confirmation */}
      <Typography variant="body2" gutterBottom>
        {email}
      </Typography>

      {/* New password input field */}
      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      {/* Password confirmation input field */}
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
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

      {/* Submit button to reset password */}
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Reset Password
      </Button>

      {/* Navigation button to return to login screen */}
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={onDone}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default ResetPassword;