/**
 * Core theme definitions following Apple HIG with custom typography system
 * Contains both light and dark themes, plus reusable design tokens
 */
export const AppTheme = {
    // Typography Scale - Display (Artico Font)
    typography: {
        // Hero Display - For main landing pages and key marketing messages
        heroDisplay: {
            fontFamily: '"Artico Expanded", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
        },

        // Primary Display - For section headers
        primaryDisplay: {
            fontFamily: '"Artico", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '40px',
            fontWeight: 700,
            letterSpacing: '-0.4px',
            lineHeight: 1.15,
        },

        // Secondary Display - For featured content
        secondaryDisplay: {
            fontFamily: '"Artico", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
        },

        // Core UI Typography - SF Pro
        largeTitle: {
            fontFamily: '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '34px',
            fontWeight: 700,
            letterSpacing: '0.37px',
            lineHeight: 1.2,
        },

        title1: {
            fontFamily: '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '0.36px',
            lineHeight: 1.3,
        },

        title2: {
            fontFamily: '"SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '0.35px',
            lineHeight: 1.3,
        },

        body: {
            fontFamily: '"SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            letterSpacing: '-0.41px',
            lineHeight: 1.5,
        },

        bodyStrong: {
            fontFamily: '"SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.41px',
            lineHeight: 1.5,
        },

        // Adding caption style for smaller text elements
        caption: {
            fontFamily: '"SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            letterSpacing: '-0.08px',
            lineHeight: 1.38, // Apple's typical caption line height
        },

        // Button style for interactive elements
        button: {
            fontFamily: '"SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: '0.4px',
            lineHeight: 1.2,
        },
    },

    // Spacing - 8pt Grid System
    spacing: {
        2: '2px',
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
        64: '64px',
    },

    // Colors - Light Theme
    colors: {
        light: {
            primary: '#FFFFFF',
            background: '#121212',
            surface: 'rgba(255, 255, 255, 0.05)',
            textPrimary: '#FFFFFF',
            textSecondary: 'rgba(255, 255, 255, 0.7)',
            divider: 'rgba(255, 255, 255, 0.1)',
        },
        // Dark Theme - Luxury Palette
        dark: {
            primary: '#FFFFFF',
            background: '#121212',
            surface: 'rgba(255, 255, 255, 0.05)',
            textPrimary: '#FFFFFF',
            textSecondary: 'rgba(255, 255, 255, 0.7)',
            divider: 'rgba(255, 255, 255, 0.1)',
        },
        // Glassmorphism Glow Colors
        glass: {
            light: {
                primary: '#9D5FFF',
                secondary: '#FF71CE',
                gunmetal: '#7F8487',
                gold: '#BFA065',
            },
            dark: {
                primary: '#7B4FCC',
                secondary: '#CC5AA5',
                gunmetal: '#4A4E51',
                gold: '#8B7355',
            },
        },
    },

    // Border Radius
    radius: {
        small: '4px',
        medium: '8px',
        large: '12px',
        pill: '9999px',
    },

    // Add styled components section
    styledComponents: {
        QuipText: `
            /* Using typography.body as base style */
            ${(props: any) => props.theme.typography.body};
            color: ${(props: any) => props.theme.colors.light.textSecondary};
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 300;
            font-style: italic;
            text-align: center;
            white-space: nowrap;
            max-width: none;
            margin: ${(props: any) => props.theme.spacing[8]} auto ${(props: any) => props.theme.spacing[4]};
            opacity: 0.8;
            letter-spacing: +0.05em;
            font-size: 1em;
            
            /* Add fallback handling */
            @supports not (font-variation-settings: normal) {
                font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif !important;
            }
        `,
    },
};

export type Theme = typeof AppTheme; 