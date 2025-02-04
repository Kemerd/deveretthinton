import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { AppTheme } from '../../theme/theme';

interface FrostedGlassProps {
    children?: React.ReactNode;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    padding?: string;
    blurIntensity?: number;
    opacity?: number;
    upperLeftGlow?: string;
    bottomRightGlow?: string;
    glowIntensity?: number;
    enableGlow?: boolean;
    enableAnimatedGradient?: boolean;
    className?: string;
    onClick?: () => void;
}

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

const GlassContainer = styled.div<FrostedGlassProps>`
  position: relative;
  width: ${props => (typeof props.width === 'number' ? `${props.width}px` : props.width)};
  height: ${props => (typeof props.height === 'number' ? `${props.height}px` : props.height)};
  border-radius: ${props => props.borderRadius || '24px'};
  padding: ${props => props.padding};
  
  /* Base glass effect - following NN/g guidelines for complex backgrounds */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(${props => props.blurIntensity}px) saturate(180%);
  -webkit-backdrop-filter: blur(${props => props.blurIntensity}px) saturate(180%);
  
  /* Gradient stroke with curved corners */
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.1)
    );
    border-radius: inherit;
    z-index: -1;
  }
  
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    
    &::after {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5),
        rgba(255, 255, 255, 0.2)
      );
    }
  }

  /* Low-opacity stroke overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, ${props => props.opacity || 0.08}) 0%,
      rgba(255, 255, 255, ${props => (props.opacity || 0.08) * 0.5}) 100%
    );
    border-radius: inherit;
    z-index: 1;
  }

  /* Gradient background animation */
  ${props =>
        props.enableAnimatedGradient &&
        props.enableGlow &&
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
          ${props.upperLeftGlow}${Math.round((props.glowIntensity || 0.15) * 255).toString(16)} 0%,
          ${props.bottomRightGlow}${Math.round((props.glowIntensity || 0.15) * 255).toString(16)} 100%
        );
        background-size: 200% 200%;
        animation: ${gradientShift} 15s ease infinite;
        z-index: 0;
        filter: blur(30px);
        opacity: 0.25;
        border-radius: inherit;
      }
    `}

  /* Content container */
  & > * {
    position: relative;
    z-index: 2;
  }
`;

export const FrostedGlass: React.FC<FrostedGlassProps> = ({
    children,
    width = '100%',
    height = '100%',
    borderRadius = AppTheme.radius.medium,
    padding = AppTheme.spacing[16],
    blurIntensity = 10,
    opacity = 0.1,
    upperLeftGlow = AppTheme.colors.glass.light.gunmetal,
    bottomRightGlow = AppTheme.colors.glass.light.gold,
    glowIntensity = 0.1,
    enableGlow = true,
    enableAnimatedGradient = true,
    className,
    onClick,
}) => {
    return (
        <GlassContainer
            width={width}
            height={height}
            borderRadius={borderRadius}
            padding={padding}
            blurIntensity={blurIntensity}
            opacity={opacity}
            upperLeftGlow={upperLeftGlow}
            bottomRightGlow={bottomRightGlow}
            glowIntensity={glowIntensity}
            enableGlow={enableGlow}
            enableAnimatedGradient={enableAnimatedGradient}
            className={className}
            onClick={onClick}
        >
            {children}
        </GlassContainer>
    );
}; 