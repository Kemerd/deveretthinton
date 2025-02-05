import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { AppTheme } from '../../theme/theme';

// Props interface for the actual React component
interface FrostedGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  $blurIntensity?: number;
  $borderRadius?: string;
  $padding?: string;
  $upperLeftGlow?: boolean;
  $bottomRightGlow?: boolean;
  $glowIntensity?: number;
  $enableGlow?: boolean;
  $enableAnimatedGradient?: boolean;
  children?: React.ReactNode;
  className?: string; // Important for styled-components
}

// Create a base component that will filter the props
const FrostedGlassBase = React.forwardRef<HTMLDivElement, FrostedGlassProps>(({
  children,
  className,
  // Destructure all styled props to prevent them from reaching the DOM
  $blurIntensity,
  $borderRadius,
  $padding,
  $upperLeftGlow,
  $bottomRightGlow,
  $glowIntensity,
  $enableGlow,
  $enableAnimatedGradient,
  ...rest // Keep other valid HTML props
}, ref) => (
  <div ref={ref} className={className} {...rest}>
    {children}
  </div>
));

// Add display name for better debugging
FrostedGlassBase.displayName = 'FrostedGlassBase';

// Gradient animation
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Style the base component
const FrostedGlassContainer = styled(FrostedGlassBase)`
  position: relative;
  border-radius: ${props => props.$borderRadius || AppTheme.radius.medium};
  padding: ${props => props.$padding};
  backdrop-filter: blur(${props => props.$blurIntensity || 10}px) saturate(180%);
  -webkit-backdrop-filter: blur(${props => props.$blurIntensity || 10}px) saturate(180%);
  
  /* Base glass effect */
  background: rgba(255, 255, 255, 0.08);
  
  /* Gradient stroke */
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    
    &::after {
      opacity: 0.15; // Reduce hover brightness
    }
  }

  /* Glow effect */
  ${props => props.$enableGlow && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${props.$upperLeftGlow ? 'radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 70%)' : ''}, 
                  ${props.$bottomRightGlow ? 'radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 70%)' : ''};
      opacity: ${props.$glowIntensity || 0.15};
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
  `}

  /* Gradient animation with reduced intensity */
  ${props =>
    props.$enableAnimatedGradient &&
    props.$enableGlow &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: linear-gradient(
          45deg,
          rgba(255, 255, 255, ${props.$upperLeftGlow ? Math.round((props.$glowIntensity || 0.1) * 128).toString(16) : '00'}) 0%,
          rgba(255, 255, 255, ${props.$bottomRightGlow ? Math.round((props.$glowIntensity || 0.1) * 128).toString(16) : '00'}) 100%
        );
        background-size: 200% 200%;
        animation: ${gradientShift} 15s ease infinite;
        z-index: 0;
        filter: blur(30px);
        opacity: 0.15; // Reduced base opacity
        border-radius: inherit;
        transition: opacity 0.3s ease;
      }
    `}

  /* Content container */
  & > * {
    position: relative;
    z-index: 2;
  }
`;

// Export the styled component
export const FrostedGlass = FrostedGlassContainer; 