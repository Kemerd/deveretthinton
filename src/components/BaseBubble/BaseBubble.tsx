import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, config, useSprings } from 'react-spring';

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
    years?: string | number;
    position: { row: number; col: number };
    totalBubbles: { rows: number; cols: number };
    expandDirection?: 'left' | 'right';
    onHoverChange?: (isHovered: boolean) => void;
    currentImageIndex?: number;
    onNextImage?: () => void;
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
    ${AppTheme.typography.caption};
    color: ${AppTheme.colors.light.textSecondary};
    opacity: 0.8;
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

// Keep the existing container styles, but update ExpandedContentLayout
const ExpandedContentLayout = styled.div`
    display: grid;
    grid-template-columns: 420px 1fr;
    height: 100%;
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[32]};
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[32]};
    background: rgba(0, 0, 0, 0.4);
    border-radius: ${AppTheme.radius.large};
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: fit-content;
`;

const ExpandedTitle = styled(animated.div)`
    ${AppTheme.typography.title1};
    color: ${AppTheme.colors.light.textPrimary};
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1.1;
`;

const ExpandedDescription = styled(animated.div)`
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textPrimary};
    opacity: 0.9;
    line-height: 1.6;
    font-size: 15px;
    margin-top: ${AppTheme.spacing[16]};
`;

const GallerySection = styled(animated.div)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${AppTheme.spacing[24]};
    align-items: start;
    padding: ${AppTheme.spacing[32]};
    background: rgba(255, 255, 255, 0.08);
    border-radius: ${AppTheme.radius.large};
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: fit-content;
`;

const GalleryItem = styled(animated.div)`
    position: relative;
    aspect-ratio: 1/1;
    border-radius: ${AppTheme.radius.medium};
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }

    /* Enhanced hover effect */
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    
    &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }
`;

export const BaseBubble: React.FC<BaseBubbleProps> = ({
    title,
    description,
    images,
    years,
    position,
    totalBubbles,
    onHoverChange,
    currentImageIndex,
    onNextImage,
}) => {
    const [imageLoadError, setImageLoadError] = useState<boolean[]>(new Array(images.length).fill(false));
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
        config: {
            mass: 1,
            tension: 380,
            friction: 28,
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

    // Move useSpring hooks outside of JSX
    const titleAnimation = useSpring({
        from: { x: -40, opacity: 0 },
        to: { x: isHovered ? 0 : -40, opacity: isHovered ? 1 : 0 },
        config: { mass: 1, tension: 280, friction: 24 }
    });

    // Description animation
    const descriptionAnimation = useSpring({
        from: { y: 20, opacity: 0 },
        to: { y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 },
        delay: isHovered ? 100 : 0,
        config: { mass: 0.8, tension: 280, friction: 26 }
    });

    // Replace the galleryAnimations code with this:
    const galleryAnimations = useSprings(
        3,
        Array(3).fill(0).map((_, index) => ({
            from: {
                x: 40,
                opacity: 0,
                scale: 0.9,
            },
            to: {
                x: isHovered ? 0 : 40,
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.9,
            },
            delay: isHovered ? 200 + index * 60 : 0,
            config: {
                mass: 0.8,
                tension: 300,
                friction: 24,
            }
        }))
    );

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
        newErrors[currentImageIndex || 0] = true;
        setImageLoadError(newErrors);
    };

    useEffect(() => {
        console.log('BaseBubble State:', {
            title,
            isHovered,
            position,
            currentImageIndex,
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
                    {!isHovered ? (
                        <NonExpandedContent>
                            <ImageContainer>
                                <GlassImageWrapper>
                                    <FeatureImage
                                        src={images[currentImageIndex || 0]}
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
                                    <YearText>
                                        {typeof years === 'number' ? `${years}+ years` : years}
                                    </YearText>
                                </TitleContainer>
                            </TitleWrapper>
                        </NonExpandedContent>
                    ) : (
                        <ExpandedContentLayout>
                            <InfoSection>
                                <animated.div style={titleAnimation}>
                                    <ExpandedTitle>{title}</ExpandedTitle>
                                    <YearText>
                                        {typeof years === 'number' ? `${years}+ years` : years}
                                    </YearText>
                                </animated.div>
                                <animated.div style={descriptionAnimation}>
                                    <ExpandedDescription>{description}</ExpandedDescription>
                                </animated.div>
                            </InfoSection>
                            <GallerySection>
                                {images.slice(0, 3).map((image, index) => (
                                    <animated.div
                                        key={image}
                                        style={galleryAnimations[index]}
                                    >
                                        <GalleryItem>
                                            <img
                                                src={image}
                                                alt={`${title} gallery ${index + 1}`}
                                                loading="lazy"
                                            />
                                        </GalleryItem>
                                    </animated.div>
                                ))}
                            </GallerySection>
                        </ExpandedContentLayout>
                    )}
                </StyledFrostedGlass>
            </AnimatedContent>
        </BubbleContainer>
    );
}; 