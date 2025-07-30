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
          justifyContent: { xs: 'center', sm: 'flex-end' },
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          pt: { xs: 1.5, sm: 2 },
          pr: { xs: 2, sm: 3 },
          pl: { xs: 2, sm: 0 },
          boxSizing: 'border-box',
          flexWrap: 'wrap', // Allow wrapping on very small screens
        }}
      >
        {/* Navigate to user's game list */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleViewGamesClick}
          sx={{ 
            borderColor: 'white',
            color: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.5, sm: 0.75 },
            minWidth: 'fit-content',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          View My Games
        </Button>

        {/* Login/Logout button based on auth state */}
        <Button
          variant="outlined"
          size="small"
          onClick={isLoggedIn ? handleLogout : handleLogin}
          sx={{ 
            borderColor: 'white',
            color: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.5, sm: 0.75 },
            minWidth: 'fit-content',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
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