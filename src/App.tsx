import React, { useEffect, useState } from 'react'
import { Container, Button, Box } from '@mui/material'
import GameSearch from './components/GameSearch'

/**
 * Main App component that serves as the primary game search page
 * Provides navigation controls and houses the game search functionality
 */
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')))
  }, [])

  /**
   * Handles user logout by removing authentication token and redirecting to home
   */
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    window.location.href = '/'
  }

  /**
   * Handles navigation to user's saved games list
   * Checks authentication before allowing access
   */
  const handleViewGamesClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to view your saved games.')
    } else {
      window.location.href = '/my-games'
    }
  }

  return (
    <>
      {/* Top navigation bar with user actions */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end', // Align buttons to the right
          gap: 1, // Space between buttons
          pt: 2, // Top padding
          pr: 3, // Right padding
          boxSizing: 'border-box',
        }}
      >
        {/* Navigate to user's game list */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleViewGamesClick}
          sx={{ borderColor: 'white' }}
        >
          View My Games
        </Button>

        {/* Login/Logout button based on auth state */}
        <Button
          variant="outlined"
          size="small"
          onClick={isLoggedIn ? handleLogout : handleLogin}
          sx={{ borderColor: 'white' }}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Box>

      {/* Main content area - centered container for game search */}
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <GameSearch />
      </Container>
    </>
  )
}

export default App
