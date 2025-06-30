import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { resetPassword } from '../api/auth';

interface Props {
  email: string;
  token: string;
  onDone: () => void;
}

const ResetPassword: React.FC<Props> = ({ email, token, onDone }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const message = await resetPassword({ email, token, newPassword: newPass });
      setSuccess(message);
      setTimeout(onDone, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. Try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, minWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}
    >
      {/* Heading */}
      <Typography variant="h5" gutterBottom>
        Choose a New Password
      </Typography>

      {/* Show email being reset */}
      <Typography variant="body2" gutterBottom>
        {email}
      </Typography>

      {/* New password input */}
      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      {/* Confirm password input */}
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />

      {/* Error message */}
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* Success message */}
      {success && (
        <Typography color="primary" sx={{ mt: 1 }}>
          {success}
        </Typography>
      )}

      {/* Reset button */}
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Reset Password
      </Button>

      {/* Back to login button */}
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
