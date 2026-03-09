'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1fb2ba',
      light: '#5adce3',
      dark: '#148991',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0f7e85',
      light: '#3eaeba',
      dark: '#0a595e',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F0FDFD',
    },
    text: {
      primary: '#1A2B3C',
      secondary: '#546E7A',
    },
    divider: '#B2EBF2',
    error: {
      main: '#EF5350',
    },
    warning: {
      main: '#FFA726',
    },
    success: {
      main: '#66BB6A',
    },
    info: {
      main: '#29B6F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,188,212,0.08)',
    '0 2px 6px rgba(0,188,212,0.10)',
    '0 4px 12px rgba(0,188,212,0.12)',
    '0 6px 16px rgba(0,188,212,0.14)',
    '0 8px 24px rgba(0,188,212,0.16)',
    '0 12px 32px rgba(0,188,212,0.18)',
    '0 16px 40px rgba(0,188,212,0.20)',
    '0 20px 48px rgba(0,188,212,0.22)',
    '0 24px 56px rgba(0,188,212,0.24)',
    '0 28px 64px rgba(0,188,212,0.26)',
    '0 32px 72px rgba(0,188,212,0.28)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.10)',
    '0 6px 24px rgba(0,0,0,0.12)',
    '0 8px 32px rgba(0,0,0,0.14)',
    '0 10px 40px rgba(0,0,0,0.16)',
    '0 12px 48px rgba(0,0,0,0.18)',
    '0 14px 56px rgba(0,0,0,0.20)',
    '0 16px 64px rgba(0,0,0,0.22)',
    '0 18px 72px rgba(0,0,0,0.24)',
    '0 20px 80px rgba(0,0,0,0.26)',
    '0 22px 88px rgba(0,0,0,0.28)',
    '0 24px 96px rgba(0,0,0,0.30)',
    '0 26px 104px rgba(0,0,0,0.32)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,188,212,0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,188,212,0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,188,212,0.08)',
          border: '1px solid rgba(0,188,212,0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,188,212,0.16)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4DD0E1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00BCD4',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 3px rgba(0,188,212,0.08)',
          color: '#1A2B3C',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
