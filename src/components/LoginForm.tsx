import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

// Props interface for the LoginForm component
interface Props {
  onLoginSuccess?: (token: string) => void; // Callback fired when login is successful
  onLoginAttempt?: () => void; // Callback fired when login attempt starts
}

const LoginForm: React.FC<Props> = ({ onLoginSuccess, onLoginAttempt }) => {
  // Form state to track email and password inputs
  const [form, setForm] = useState({ email: '', password: '' });
  
  // Error state to display authentication or network errors
  const [error, setError] = useState('');
  
  // TanStack Router hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles input field changes and updates form state
   * @param e - React change event from input field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission and login authentication
   * @param e - React form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Trigger login attempt callback if provided
    onLoginAttempt?.();
    
    // Clear any previous error messages
    setError('');

    try {
      // Make API call to login endpoint
      const res = await fetch(`${import.meta.env.VITE_ENDPOINT}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // Send email and password as JSON
      });

      // Check if the response indicates failure
      if (!res.ok) {
        setError('Login failed. Please check your credentials.');
        return;
      }

      // Parse the successful response
      const data = await res.json();
      
      // Store authentication token in localStorage
      localStorage.setItem('token', data.token);
      
      // Remove guest flag if it exists (user is now authenticated)
      localStorage.removeItem('isGuest');
      
      // Trigger success callback with the token
      onLoginSuccess?.(data.token);
      
      // Navigate to the main application
      navigate({ to: '/app' });
    } catch (err) {
      // Handle network errors or other exceptions
      console.error('Network error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  /**
   * Handles guest login - allows access without authentication
   */
  const handleGuest = () => {
    // Mark user as guest in localStorage
    localStorage.setItem('isGuest', 'true');
    
    // Remove any existing authentication token
    localStorage.removeItem('token');
    
    // Navigate to the main application as guest
    navigate({ to: '/app' });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        maxWidth: 400, 
        mx: 'auto',
        mt: 6, 
        textAlign: 'center' 
      }}
    >
      {/* Login form title */}
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      {/* Email input field */}
      <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        value={form.email}
        onChange={handleChange}
      />

      {/* Password input field */}
      <TextField
        fullWidth
        type="password"
        label="Password"
        name="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />

      {/* Error message display - only shown when error exists */}
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* Primary login button */}
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>

      {/* Navigation to signup page */}
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={() => navigate({ to: '/signup' })}
      >
        Don't have an account? Sign up
      </Button>

      {/* Navigation to forgot password page */}
      <Button
        fullWidth
        variant="text"
        onClick={() => navigate({ to: '/forgot-password' })}
        sx={{ mt: 1 }}
      >
        Forgot Password?
      </Button>

      {/* Guest access button - separated with more margin */}
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