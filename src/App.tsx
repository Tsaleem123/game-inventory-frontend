import React from 'react'
import { Container, Button } from '@mui/material'
import GameSearch from './components/GameSearch'

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <Container maxWidth="md" sx={{ pt: 2 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleLogout}
        sx={{ py: '0.25rem', px: '0.75rem', fontSize: '0.8rem', mt: '0.5rem' }}
      >
        Logout
      </Button>

      <GameSearch />
    </Container>
  )
}

export default App
