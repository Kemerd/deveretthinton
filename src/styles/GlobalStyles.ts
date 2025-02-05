import { createGlobalStyle } from 'styled-components';
import { AppTheme } from '../theme/theme';

const GlobalStyles = createGlobalStyle`
    /* Artico Font Family - Display Typography */
    @font-face {
        font-family: 'Artico';
        src: local('Artico'),
             url('../fonts/woff2/Artico.woff2') format('woff2'),
             url('../fonts/woff/Artico.woff') format('woff'),
             url('../fonts/otf/Artico.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
        font-synthesis: none;
    }

    @font-face {
        font-family: 'Artico';
        src: local('Artico Bold'),
             url('../fonts/woff2/Artico-Bold.woff2') format('woff2'),
             url('../fonts/woff/Artico-Bold.woff') format('woff'),
             url('../fonts/otf/Artico-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: block;
        font-synthesis: none;
    }

    @font-face {
        font-family: 'Artico Expanded';
        src: local('Artico Expanded'),
             url('../fonts/woff2/Artico-Expanded.woff2') format('woff2'),
             url('../fonts/woff/Artico-Expanded.woff') format('woff'),
             url('../fonts/otf/Artico-Expanded.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
        font-synthesis: none;
    }

    /* SF Pro Display - For large titles and headlines */
    @font-face {
        font-family: 'SF Pro Display';
        src: local('SF Pro Display'),
             local('.SFNSDisplay-Regular'),
             url('../fonts/woff2/SF-Pro-Display-Regular.woff2') format('woff2'),
             url('../fonts/woff/SF-Pro-Display-Regular.woff') format('woff'),
             url('../fonts/otf/SF-Pro-Display-Regular.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: local('SF Pro Display Bold'),
             local('.SFNSDisplay-Bold'),
             url('../fonts/woff2/SF-Pro-Display-Bold.woff2') format('woff2'),
             url('../fonts/woff/SF-Pro-Display-Bold.woff') format('woff'),
             url('../fonts/otf/SF-Pro-Display-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    /* SF Pro Text - For body text and UI elements */
    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text'),
             local('.SFNSText-Regular'),
             url('../fonts/woff2/SF-Pro-Text-Regular.woff2') format('woff2'),
             url('../fonts/woff/SF-Pro-Text-Regular.woff') format('woff'),
             url('../fonts/otf/SF-Pro-Text-Regular.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text Medium'),
             local('.SFNSText-Medium'),
             url('../fonts/woff2/SF-Pro-Text-Medium.woff2') format('woff2'),
             url('../fonts/woff/SF-Pro-Text-Medium.woff') format('woff'),
             url('../fonts/otf/SF-Pro-Text-Medium.otf') format('opentype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text Bold'),
             local('.SFNSText-Bold'),
             url('../fonts/woff2/SF-Pro-Text-Bold.woff2') format('woff2'),
             url('../fonts/woff/SF-Pro-Text-Bold.woff') format('woff'),
             url('../fonts/otf/SF-Pro-Text-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    /* System font stack as fallback */
    :root {
        --system-ui: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                     Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
                     'Helvetica Neue', sans-serif;
    }

    /* Enhanced body styles with better font fallbacks */
    body {
        margin: 0;
        padding: 0;
        background: ${AppTheme.colors.dark.background};
        color: ${AppTheme.colors.dark.textPrimary};
        font-family: 'SF Pro Text', var(--system-ui);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-synthesis: none;
    }

    * {
        box-sizing: border-box;
    }

    /* Add font smoothing for better rendering */
    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }
`;

export default GlobalStyles; 