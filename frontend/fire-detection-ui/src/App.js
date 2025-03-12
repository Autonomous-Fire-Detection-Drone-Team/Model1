import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmberEyeFireDetection from './components/EmberEyeFireDetection';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF5722', // Ember orange
    },
    secondary: {
      main: '#FF0000', // Red for fire
    },
    background: {
      default: '#000000', // Space black
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 300,
      letterSpacing: '-0.00833em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #FF5722 30%, #FFC107 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 87, 34, .3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmberEyeFireDetection />
    </ThemeProvider>
  );
}

export default App;
