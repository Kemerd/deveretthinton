import { createGlobalStyle } from 'styled-components';
import { AppTheme } from '../theme/theme';

const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Artico';
        src: url('/fonts/Artico.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Artico';
        src: url('/fonts/Artico Bold.otf') format('opentype');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Artico Expanded';
        src: url('/fonts/Artico Expanded.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/SF-Pro-Display-Regular.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Display';
        src: url('/fonts/SF-Pro-Display-Bold.otf') format('opentype');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: url('/fonts/SF-Pro-Text-Regular.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'SF Pro Text';
        src: url('/fonts/SF-Pro-Text-Bold.otf') format('opentype');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    body {
        margin: 0;
        padding: 0;
        background: ${AppTheme.colors.dark.background};
        color: ${AppTheme.colors.dark.textPrimary};
        font-family: ${AppTheme.typography.body.fontFamily};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyles; 