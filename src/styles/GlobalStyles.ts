import { createGlobalStyle } from 'styled-components';
import { AppTheme } from '../theme/theme';

const GlobalStyles = createGlobalStyle`
    /* Artico Font Family - Display Typography */
    @font-face {
        font-family: 'Artico';
        src: local('Artico'),
             url('/fonts/woff2/Artico.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: block;
        font-synthesis: none;
    }

    @font-face {
        font-family: 'Artico';
        src: local('Artico Bold'),
             url('/fonts/woff2/Artico-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: block;
        font-synthesis: none;
    }

    @font-face {
        font-family: 'Artico Expanded';
        src: local('Artico Expanded'),
             url('/fonts/woff2/Artico-Expanded.woff2') format('woff2');
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
             url('/fonts/woff2/SF-Pro-Display-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: block;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: local('SF Pro Display Bold'),
             local('.SFNSDisplay-Bold'),
             url('/fonts/woff2/SF-Pro-Display-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-RegularItalic.woff2') format('woff2');
        font-weight: 400;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-MediumItalic.woff2') format('woff2');
        font-weight: 500;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-Thin.woff2') format('woff2');
        font-weight: 200;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/woff2/SF-Pro-Display-ThinItalic.woff2') format('woff2');
        font-weight: 200;
        font-style: italic;
        font-display: swap;
    }

    /* SF Pro Text - For body text and UI elements */
    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text'),
             local('.SFNSText-Regular'),
             url('/fonts/woff2/SF-Pro-Text-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text Medium'),
             local('.SFNSText-Medium'),
             url('/fonts/woff2/SF-Pro-Text-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: local('SF Pro Text Bold'),
             local('.SFNSText-Bold'),
             url('/fonts/woff2/SF-Pro-Text-Bold.woff2') format('woff2');
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

    /* Ensure html and body allow natural page scrolling */
    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        /* Remove any height constraints */
        height: auto;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* Enhanced body styles with better font fallbacks */
    body {
        /* Don't override margin/padding/background - set in index.html for loading state */
        color: ${AppTheme.colors.dark.textPrimary};
        font-family: 'SF Pro Text', var(--system-ui);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-synthesis: none;
        /* Allow body to grow with content */
        height: auto;
        min-height: 100vh;
        /* Overflow controlled by loading state in index.html */
    }

    /* Ensure root div takes full height but grows with content */
    /* Don't override filter/opacity - controlled by loading state in index.html */
    #root {
        height: auto;
        min-height: 100vh;
        overflow: visible;
    }

    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyles; 