import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { forgotPassword } from '../api/auth';

interface ForgotPasswordProps {
  onback: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onback }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const message = await forgotPassword({ email });
      setSuccess(message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed. Try again.');
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
        Reset Password
      </Typography>

      {/* Email input */}
      <TextField
        fullWidth
        type="email"
        label="Email"
        name="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      {/* Submit button */}
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Send Reset Link
      </Button>

      {/* Back to login button */}
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
