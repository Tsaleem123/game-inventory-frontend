import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  onLoginSuccess?: (token: string) => void;
  onLoginAttempt?: () => void;
}

const LoginForm: React.FC<Props> = ({ onLoginSuccess, onLoginAttempt }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAttempt?.();
    setError('');

    try {
      const res = await fetch('https://localhost:7098/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError('Login failed. Please check your credentials.');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.removeItem('isGuest');
      onLoginSuccess?.(data.token);
      navigate({ to: '/app' });
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleGuest = () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    navigate({ to: '/app' });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, minWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        value={form.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        type="password"
        label="Password"
        name="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>

      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={() => navigate({ to: '/signup' })}
      >
        Don’t have an account? Sign up
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => navigate({ to: '/forgot-password' })}
        sx={{ mt: 1 }}
      >
        Forgot Password?
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={handleGuest}
        sx={{ mt: 3 }}
      >
        Continue as Guest
      </Button>
    </Box>
  );
};

export default LoginForm;
