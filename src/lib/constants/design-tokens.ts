export const COLORS = {
    // Primary Brand Blue Scale (from Image)
    primary: {
        50: '#E6F5FD',
        100: '#D0EDFB',
        200: '#BAD1F4',
        300: '#54BDF0',
        400: '#33AFED',
        500: '#009BE8',    // Main Brand Color
        main: '#009BE8',
        light: '#33AFED',  // Alias for 400
        dark: '#006EA5',   // Alias for 700
        600: '#008DD3',
        700: '#006EA5',
        800: '#005580',
        900: '#004161',
        subtle: '#E6F5FD', // blue-50
        contrast: '#FFFFFF',
    },
    // Greyscale / Neutrals (from Image)
    neutral: {
        50: '#F0F1F3',
        100: '#D0D3D9',
        200: '#B9BDC7',
        300: '#989FAD',
        400: '#858D9D',
        500: '#667085',
        600: '#5D6679',
        700: '#48505E',
        800: '#383E49',
        900: '#2B2F38',
    },
    // Functional Backgrounds
    background: {
        default: '#F6F8FF', // Background Color from Image
        paper: '#FFFFFF',
        subtle: '#F0F1F3',  // greyscale-50
    },
    // Semantic Text Mapping
    text: {
        primary: '#48505E',   // greyscale-700 (consistent with image)
        secondary: '#667085', // greyscale-500
        muted: '#989FAD',     // greyscale-300
    },
    // Semantic Border Mapping
    border: {
        light: '#F0F1F3',
        medium: '#D0D3D9',
        strong: '#B9BDC7',
    },
    // Status States
    error: {
        main: '#EF4444',
        subtle: 'rgba(239, 68, 68, 0.08)',
    },
    warning: {
        main: '#F59E0B',
        subtle: 'rgba(245, 158, 11, 0.08)',
    },
    success: {
        main: '#10B981',
        subtle: 'rgba(16, 185, 129, 0.08)',
    },
    info: {
        main: '#009BE8',
        subtle: '#E6F5FD',
    },
    secondary: {
        main: '#6366F1',
        light: '#818CF8',
        dark: '#4F46E5',
        subtle: 'rgba(99, 102, 241, 0.08)',
        contrast: '#FFFFFF',
    },
};

export const GRADIENTS = {
    primary: 'linear-gradient(135deg, #009BE8 0%, #00C9AB 100%)',
    secondary: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    accent: 'linear-gradient(135deg, #006EA5 0%, #009BE8 100%)',
    surface: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    dark: 'linear-gradient(135deg, #2B2F38 0%, #1A1F26 100%)',
    hover: 'linear-gradient(135deg, #008DD3 0%, #00C9AB 100%)',
};

export const SHADOWS = {
    small: '0 2px 8px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 16px rgba(0, 155, 232, 0.1)',
    large: '0 8px 32px rgba(0, 155, 232, 0.15)',
    premium: '0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.02)',
    hover: '0 25px 50px rgba(0, 155, 232, 0.2), 0 1px 12px rgba(0, 155, 232, 0.05)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
};

export const BORDER_RADIUS = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    full: '9999px',
};

export const TYPOGRAPHY = {
    fontFamily: '"Inter", "Outfit", system-ui, -apple-system, sans-serif',
    weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        semiBold: 600, // Alias
        bold: 700,
        extraBold: 800, // Alias
        black: 900,
    },
    sizes: {
        display: '2.5rem',    // 40px
        h1: '2.0625rem',      // 33px
        h2: '1.75rem',        // 28px
        h3: '1.4375rem',      // 23px
        title: '1.1875rem',    // 19px
        bodyLarge: '1rem',     // 16px
        bodyMedium: '0.8125rem',// 13px
        bodySmall: '0.6875rem', // 11px
        caption: '0.5625rem',   // 9px
        overline: '0.5rem',     // 8px
        // Aliases for compatibility
        '5xl': '2.5rem',
        '4xl': '2.0625rem',
        '3xl': '1.75rem',
        '2xl': '1.4375rem',
        xl: '1.1875rem',
        lg: '1.125rem', // Keeping legacy lg for specific cases if needed
        base: '1rem',
        sm: '0.8125rem',
        xs: '0.6875rem',
    }
};

export const BUTTON_STYLE = {
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: '2px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    structure: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: SHADOWS.medium,
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: SHADOWS.hover,
        },
        '&:active': {
            transform: 'translateY(0)',
        }
    }
};

export const ANIMATIONS = {
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};
