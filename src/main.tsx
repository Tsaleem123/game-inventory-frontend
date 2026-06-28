import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import { AppRouter } from './router'

// App-wide MUI theme so every Material UI component renders in Pliant
// (the same variable Google font used by the rest of the site).
const theme = createTheme({
  typography: {
    fontFamily: "'Pliant', sans-serif",
  },
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>,
)
