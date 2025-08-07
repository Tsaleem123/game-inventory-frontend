import React, { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { registerUser } from '../api/auth'

// Props expected by the Signup component
interface SignupProps {
  onSignupSuccess: () => void  // Callback to trigger after successful signup
  onback: () => void           // Callback to return to login screen
}

// Field validation configuration
const VALIDATION_RULES = {
  email: {
    required: true,
    validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validator: (value: string) => {
      const checks = {
        minLength: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      }
      return Object.values(checks).every(Boolean)
    },
    errorMessage: (value: string) => {
      const issues = []
      if (value.length < 6) issues.push('at least 6 characters')
      if (!/[A-Z]/.test(value)) issues.push('1 uppercase letter')
      if (!/[a-z]/.test(value)) issues.push('1 lowercase letter')
      if (!/\d/.test(value)) issues.push('1 number')
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) issues.push('1 special character')
      return `Password must contain: ${issues.join(', ')}`
    }
  }
}

// Signup form component
const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onback }) => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  // Touched fields tracking
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  
  // UI state
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generic field update handler
  const handleFieldChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  // Generic field blur handler
  const handleFieldBlur = (field: string) => () => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
  }

  // Generic validation function
  const validateField = (field: keyof typeof VALIDATION_RULES, value: string) => {
    const rule = VALIDATION_RULES[field]
    const isTouched = touchedFields[field]
    const isEmpty = value.length === 0
    const isInvalid = value.length > 0 && !rule.validator(value)

    return {
      hasError: isTouched && (isEmpty || isInvalid),
      helperText: (() => {
        if (!isTouched) return ''
        if (isEmpty && rule.required) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        if (isInvalid) {
          return typeof rule.errorMessage === 'function' 
            ? rule.errorMessage(value) 
            : rule.errorMessage
        }
        return ''
      })()
    }
  }

  // Check if entire form is valid
  const isFormValid = () => {
    return Object.entries(formData).every(([field, value]) => {
      const rule = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES]
      return value.length > 0 && rule.validator(value)
    })
  }

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    // Mark all fields as touched to show validation errors
    const allFieldsTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouchedFields(allFieldsTouched)

    // Don't submit if form is invalid
    if (!isFormValid()) return

    setIsSubmitting(true)

    try {
      const message = await registerUser(formData)

      // Display success message
      if (message?.toLowerCase().includes('verify') || message?.toLowerCase().includes('confirmation')) {
        setSuccess('Signup successful! Please check your inbox to verify your email.')
      } else {
        setSuccess(message || 'Signup successful.')
      }

      // Delay redirect
      setTimeout(() => onSignupSuccess(), 3000)
    } catch (err: any) {
      // Handle server errors
      if (err.response?.data?.errors) {
        setServerError(err.response.data.errors.join(', '))
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message)
      } else {
        setServerError('Signup failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get validation state for each field
  const emailValidation = validateField('email', formData.email)
  const passwordValidation = validateField('password', formData.password)

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
      sx={{ maxWidth: 400, minWidth: 400, mx: 'auto', mt: 6, textAlign: 'center' }}
    >
      <Typography variant="h5" gutterBottom>Sign Up</Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={formData.email}
        onChange={handleFieldChange('email')}
        onBlur={handleFieldBlur('email')}
        error={emailValidation.hasError}
        helperText={emailValidation.helperText}
        required
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={formData.password}
        onChange={handleFieldChange('password')}
        onBlur={handleFieldBlur('password')}
        error={passwordValidation.hasError}
        helperText={passwordValidation.helperText}
        required
      />

      {serverError && (
        <Typography color="error" sx={{ mt: 1, textAlign: 'left' }}>
          {serverError}
        </Typography>
      )}
      
      {success && (
        <Typography color="primary" sx={{ mt: 1, textAlign: 'left' }}>
          {success}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>

      <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={onback}>
        Back to Login
      </Button>
    </Box>
  )
}

export default Signup;