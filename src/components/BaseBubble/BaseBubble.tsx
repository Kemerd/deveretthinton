import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, config } from 'react-spring';

const FALLBACK_COLORS = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream Yellow
    '#D4A5A5', // Dusty Rose
    '#9370DB', // Medium Purple
    '#20B2AA', // Light Sea Green
];

interface BaseBubbleProps {
    title: string;
    description: string;
    images: string[];
    years?: number;
    position: { row: number; col: number };
    totalBubbles: { rows: number; cols: number };
    expandDirection?: 'left' | 'right';
    onHoverChange?: (isHovered: boolean) => void;
}

// Expansion animation
const expandAnimation = keyframes`
    0% {
        width: 200px;
        height: 200px;
    }
    100% {
        width: 100%;
        height: 300px;
    }
`;

const BubbleContainer = styled.div<{ $isExpanded: boolean }>`
    position: relative;
    width: 280px;
    height: 340px;
    transition: z-index 0.01s;
    z-index: ${props => props.$isExpanded ? 10 : 1};
`;

const AnimatedContent = styled(animated.div) <{ $isExpanded: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform-origin: ${props => props.$isExpanded ? 'center center' : 'left center'};
    will-change: transform, width, height, filter, opacity;
    /* Update backdrop-filter intensity to match header */
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    /* Smooth transition for backdrop-filter */
    transition: backdrop-filter 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                -webkit-backdrop-filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Animated border style */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.1)
        );
        border-radius: inherit;
        z-index: -1;
        opacity: ${props => props.$isExpanded ? 1 : 0.3};
        /* Match the transition timing */
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
`;

const TitleWrapper = styled(animated.div)`
    position: relative;
    width: 100%;
`;

const TitleContainer = styled(animated.div)`
    position: relative;
    padding: ${AppTheme.spacing[12]};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${AppTheme.spacing[4]};
    /* Update background opacity to match header card */
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    border-radius: ${AppTheme.radius.medium};
    width: 100%;
    
    h3 {
        margin: 0;
        ${AppTheme.typography.title2};
        color: ${AppTheme.colors.light.textPrimary};
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.3px;
    }
`;

const Description = styled(animated.div)`
    flex: 1;
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textPrimary};
    padding: ${AppTheme.spacing[32]};
    
    h3 {
        ${AppTheme.typography.title2};
        margin: 0 0 ${AppTheme.spacing[8]};
        color: ${AppTheme.colors.light.textPrimary};
    }
    
    p {
        margin: ${AppTheme.spacing[16]} 0 0;
        opacity: 0.8;
        line-height: 1.6;
    }
`;

const ImageGallery = styled(animated.div)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${AppTheme.spacing[24]};
    width: 100%;
    height: 100%;
    padding: ${AppTheme.spacing[32]};
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 260px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    margin-bottom: ${AppTheme.spacing[12]};
`;

const GlassImageWrapper = styled(FrostedGlass)`
    position: absolute;
    top: ${AppTheme.spacing[16]};
    left: ${AppTheme.spacing[16]};
    right: ${AppTheme.spacing[16]};
    bottom: ${AppTheme.spacing[16]};
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
 
    $blurIntensity={10}
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FeatureImage = styled.img<{ $isActive: boolean; $fallbackColor: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${AppTheme.radius.large};
    transition: opacity 0.3s ease;
    opacity: ${props => props.$isActive ? 1 : 0.8};
    background-color: ${props => props.$fallbackColor};
`;

const YearText = styled.span`
    ${AppTheme.typography.body};
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.08px;
    line-height: 1;
    color: ${AppTheme.colors.light.textSecondary};
    opacity: 0.7;
    margin: 0;
`;

const ExpandedContent = styled.div<{ $isVisible: boolean }>`
    position: absolute;
    left: ${AppTheme.spacing[32]};
    right: ${AppTheme.spacing[32]};
    opacity: ${props => props.$isVisible ? 1 : 0};
    transform: translateY(${props => props.$isVisible ? 0 : '20px'});
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    gap: ${AppTheme.spacing[32]};
`;

const GalleryImage = styled(animated.div) <{ $src: string; $fallbackColor: string }>`
    width: 100%;
    height: 100%;
    background-image: url(${props => props.$src});
    background-size: cover;
    background-position: center;
    border-radius: ${AppTheme.radius.medium};
    background-color: ${props => props.$fallbackColor};
`;

// Add interface for ExpandedLayout props
interface ExpandedLayoutProps {
    expandDirection: 'left' | 'right' | 'center';
}

// Update the ExpandedLayout component with proper typing
const ExpandedLayout = styled.div<{ $expandDirection: 'left' | 'right' | 'center' }>`
    position: absolute;
    width: 1200px;
    height: 340px;
    top: 0;
    display: flex;
    gap: ${AppTheme.spacing[32]};
    padding: ${AppTheme.spacing[32]};
    
    ${props => {
        switch (props.$expandDirection) {
            case 'left':
                return 'right: 0;';
            case 'right':
                return 'left: 0;';
            case 'center':
                return `
                    left: 50%;
                    transform: translateX(-50%);
                `;
        }
    }}
`;

const GridItem = styled(animated.div) <{ $isHidden: boolean; $isSameRow: boolean; $isHovered: boolean }>`
    /* Change from transition to transitions to handle multiple properties */
    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: ${props => props.$isHovered ? 1 :
        (props.$isHidden || props.$isSameRow) ? 0 : 1};
    pointer-events: ${props => props.$isHovered ? 'auto' :
        (props.$isHidden || props.$isSameRow) ? 'none' : 'auto'};
    z-index: ${props => props.$isHovered ? 3 :
        props.$isHidden ? 0 :
            props.$isSameRow ? 2 : 1};
    /* Add a default blur that's always present but varies in intensity */
    filter: blur(${props =>
        props.$isHovered ? '0px' :
            props.$isHidden || props.$isSameRow ? '8px' : '0px'
    });
    /* Ensure GPU acceleration for smoother transitions */
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: opacity, filter;
`;

// Update FrostedGlass component props
const StyledFrostedGlass = styled(FrostedGlass)`
    /* Your existing styles... */
`;

// First, let's create a wrapper for the non-expanded content
const NonExpandedContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    padding: ${AppTheme.spacing[16]};
`;

export const BaseBubble: React.FC<BaseBubbleProps> = ({
    title,
    description,
    images,
    years,
    position,
    totalBubbles,
    onHoverChange,
}) => {
    const [currentImageIndices, setCurrentImageIndices] = useState<number[]>(
        Array(totalBubbles.rows * totalBubbles.cols).fill(0)
    );
    const [imageLoadError, setImageLoadError] = useState<boolean[]>(new Array(images.length).fill(false));
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Image cycling effect
    useEffect(() => {
        // Skip animation when hovered
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentImageIndices(prev => {
                const next = [...prev];
                // Update indices in a clockwork pattern
                for (let row = 0; row < totalBubbles.rows; row++) {
                    for (let col = 0; col < totalBubbles.cols; col++) {
                        const index = row * totalBubbles.cols + col;
                        next[index] = (next[index] + 1) % images.length;
                        // Only update one cell at a time, then break
                        return next;
                    }
                }
                return prev;
            });
        }, 2000); // Adjust timing as needed

        return () => clearInterval(interval);
    }, [isHovered, totalBubbles, images.length]);

    // Main container animation
    const containerSpring = useSpring({
        width: isHovered ? 1200 : 280,
        height: isHovered ? 340 : 340,
        x: isHovered ? (() => {
            const col = position.col;
            if (col === 0) return 0;
            if (col === totalBubbles.cols - 1) return -920; // 1200 - 280
            return -((280 + 24) * col);
        })() : 0,
        immediate: false,
        config: {
            mass: 1,
            tension: 400,
            friction: 26,
        }
    });

    // Calculate initial position based on grid layout
    const calculateInitialPosition = () => {
        const itemWidth = 280;
        const gap = 24;
        return {
            x: position.col * (itemWidth + gap),
            y: 0
        };
    };

    const titleSpring = useSpring({
        config: {
            mass: 0.8,
            tension: 380,
            friction: 26,
        }
    });

    // Description animation
    const descriptionSpring = useSpring({
        y: isHovered ? 0 : 20,
        opacity: isHovered ? 1 : 0,
        config: {
            mass: 0.8,
            tension: 280,
            friction: 24,
        }
    });

    // Image gallery animation
    const gallerySpring = useSpring({
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1 : 0.98,
        delay: isHovered ? 100 : 0,
        config: {
            mass: 0.8,
            tension: 280,
            friction: 24,
        }
    });

    // Add a new spring for the main image
    const mainImageSpring = useSpring({
        opacity: isHovered ? 0 : 1,
        scale: isHovered ? 0.95 : 1,
        config: {
            mass: 0.8,
            tension: 380,
            friction: 24,
        }
    });

    // Update hover handlers to call onHoverChange
    const handleMouseEnter = () => {
        setIsHovered(true);
        onHoverChange?.(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHoverChange?.(false);
    };

    // Calculate expand direction based on position
    const getExpandDirection = (): 'left' | 'right' | 'center' => {
        const col = position.col;
        if (col === 0) return 'right';
        if (col === totalBubbles.cols - 1) return 'left';
        return 'center';
    };

    const handleImageError = () => {
        const newErrors = [...imageLoadError];
        newErrors[currentImageIndices[position.row * totalBubbles.cols + position.col]] = true;
        setImageLoadError(newErrors);
    };

    useEffect(() => {
        console.log('BaseBubble State:', {
            title,
            isHovered,
            position,
            currentImageIndices,
            containerSpring: {
                width: containerSpring.width.get(),
                height: containerSpring.height.get(),
                x: containerSpring.x.get(),
            }
        });
    }, [isHovered, title, position, containerSpring]);

    return (
        <BubbleContainer
            $isExpanded={isHovered}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatedContent
                $isExpanded={isHovered}
                style={containerSpring}
            >
                <StyledFrostedGlass>
                    <NonExpandedContent>
                        <ImageContainer>
                            <GlassImageWrapper>
                                <FeatureImage
                                    src={images[currentImageIndices[position.row * totalBubbles.cols + position.col]]}
                                    $isActive={!isHovered}
                                    $fallbackColor={FALLBACK_COLORS[Math.floor(position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                    onError={handleImageError}
                                    alt={`${title} preview`}
                                />
                            </GlassImageWrapper>
                        </ImageContainer>
                        <TitleWrapper style={titleSpring}>
                            <TitleContainer>
                                <h3>{title}</h3>
                                {years && <YearText>{years}+ years</YearText>}
                            </TitleContainer>
                        </TitleWrapper>
                    </NonExpandedContent>
                </StyledFrostedGlass>
            </AnimatedContent>
        </BubbleContainer>
    );
}; 