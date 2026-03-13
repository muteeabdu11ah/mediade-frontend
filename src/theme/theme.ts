'use client';

import { createTheme } from '@mui/material/styles';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, GRADIENTS } from '@/lib/constants/design-tokens';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.primary.main,
      light: COLORS.primary.light,
      dark: COLORS.primary.dark,
      contrastText: COLORS.primary.contrast,
    },
    secondary: {
      main: COLORS.secondary.main,
      light: COLORS.secondary.light,
      dark: COLORS.secondary.dark,
      contrastText: COLORS.secondary.contrast,
    },
    background: {
      default: COLORS.background.default,
      paper: COLORS.background.paper,
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
    },
    divider: COLORS.border.light,
    error: {
      main: COLORS.error.main,
    },
    warning: {
      main: COLORS.warning.main,
    },
    success: {
      main: COLORS.success.main,
    },
    info: {
      main: COLORS.info.main,
    },
  },
  typography: {
    fontFamily: TYPOGRAPHY.fontFamily,
    h1: {
      fontSize: TYPOGRAPHY.sizes.h1,
      fontWeight: TYPOGRAPHY.weights.black,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: TYPOGRAPHY.sizes.h2,
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: TYPOGRAPHY.sizes.h3,
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: TYPOGRAPHY.sizes.title,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: TYPOGRAPHY.sizes.bodyLarge,
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: TYPOGRAPHY.sizes.bodyMedium,
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: TYPOGRAPHY.sizes.bodyLarge,
      lineHeight: 1.6,
      color: COLORS.text.primary,
    },
    body2: {
      fontSize: TYPOGRAPHY.sizes.bodyMedium,
      lineHeight: 1.5,
      color: COLORS.text.secondary,
    },
    caption: {
      fontSize: TYPOGRAPHY.sizes.caption,
      lineHeight: 1.4,
      color: COLORS.text.muted,
    },
    subtitle1: {
      fontSize: TYPOGRAPHY.sizes.bodyLarge,
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: 1.5,
      color: COLORS.text.primary,
    },
    subtitle2: {
      fontSize: TYPOGRAPHY.sizes.bodyMedium,
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: COLORS.text.primary,
    },
    overline: {
      fontSize: TYPOGRAPHY.sizes.overline,
      fontWeight: TYPOGRAPHY.weights.semibold,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    button: {
      textTransform: 'none',
      fontWeight: TYPOGRAPHY.weights.bold,
    },
  },
  shape: {
    borderRadius: parseInt(BORDER_RADIUS.md),
  },
  shadows: [
    'none',
    SHADOWS.small,
    SHADOWS.medium,
    SHADOWS.large,
    '0 1px 3px rgba(0,0,0,0.05)',
    '0 1px 2px rgba(0,0,0,0.1)',
    '0 4px 6px rgba(0,0,0,0.05)',
    '0 10px 15px rgba(0,0,0,0.1)',
    '0 20px 25px rgba(0,0,0,0.1)',
    SHADOWS.premium,
    SHADOWS.hover,
    ...Array(14).fill('none'), // Fill remaining shadows with none
  ] as any,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.md,
          padding: '12px 28px',
          fontSize: '1rem',
          fontWeight: 700,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: GRADIENTS.primary,
          boxShadow: SHADOWS.medium,
          border: 'none',
          '&:hover': {
            background: GRADIENTS.hover,
            boxShadow: SHADOWS.hover,
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: COLORS.primary.main,
          color: COLORS.primary.main,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: COLORS.primary.subtle,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.medium,
          border: `1px solid ${COLORS.border.light}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: SHADOWS.large,
            borderColor: COLORS.border.medium,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.background.paper,
            '& fieldset': {
              borderColor: COLORS.border.medium,
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: COLORS.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${COLORS.border.light}`,
          color: COLORS.text.primary,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.sm,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        filledPrimary: {
          background: GRADIENTS.primary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.lg,
          backgroundImage: 'none', // Remove MUI dark mode gradient
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: COLORS.background.default,
          color: COLORS.text.primary,
          fontFamily: TYPOGRAPHY.fontFamily,
        },
        '::selection': {
          backgroundColor: 'rgba(0, 155, 232, 0.2)',
          color: COLORS.primary.dark,
        },
        /* Custom Scrollbar */
        '::-webkit-scrollbar': {
          width: '10px',
        },
        '::-webkit-scrollbar-track': {
          background: COLORS.background.subtle,
        },
        '::-webkit-scrollbar-thumb': {
          background: COLORS.border.strong,
          borderRadius: '5px',
          border: `2px solid ${COLORS.background.subtle}`,
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: COLORS.primary.main,
        }
      }
    }
  },
});

export default theme;
