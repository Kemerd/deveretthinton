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

interface SkillBubbleProps {
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

const BubbleContainer = styled.div<{ isExpanded: boolean }>`
    position: relative;
    width: 280px;
    height: 340px;
    transition: z-index 0.01s;
    z-index: ${props => props.isExpanded ? 10 : 1};
`;

const AnimatedContent = styled(animated.div) <{ $isExpanded?: boolean }>`
    position: absolute;
    background: rgba(255, 255, 255, 0.08);
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    /* Animated border style */
    border: 3px solid transparent;
    background-clip: padding-box;
    
    &::after {
        content: '';
        position: absolute;
        top: -3px; left: -3px;
        right: -3px; bottom: -3px;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.1)
        );
        border-radius: inherit;
        z-index: -1;
        transition: opacity 0.3s ease;
        opacity: ${props => props.$isExpanded ? 1 : 0.3};
    }
`;

const TitleContainer = styled(animated.div)`
    position: absolute;
    top: ${AppTheme.spacing[24]};
    left: 0;
    right: 0;
    padding: 0 ${AppTheme.spacing[16]};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${AppTheme.spacing[4]};
    
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
    position: absolute;
    top: 0;
    left: 0;
    width: 1200px;
    height: 340px;
    display: grid;
    grid-template-columns: repeat(4, 280px);
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[32]};

    > div {
        width: 280px;
        height: 280px;
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 280px;
    height: 280px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: ${AppTheme.radius.large};
`;

const GlassImageWrapper = styled.div`
    position: absolute;
    top: ${AppTheme.spacing[16]};
    left: ${AppTheme.spacing[16]};
    right: ${AppTheme.spacing[16]};
    bottom: ${AppTheme.spacing[16]};
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeatureImage = styled.img<{ isActive: boolean; fallbackColor: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${AppTheme.radius.large};
    transition: opacity 0.3s ease;
    opacity: ${props => props.isActive ? 1 : 0.8};
    background-color: ${props => props.fallbackColor};
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

const ExpandedContent = styled.div<{ isVisible: boolean }>`
    position: absolute;
    left: ${AppTheme.spacing[32]};
    right: ${AppTheme.spacing[32]};
    opacity: ${props => props.isVisible ? 1 : 0};
    transform: translateY(${props => props.isVisible ? 0 : '20px'});
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    gap: ${AppTheme.spacing[32]};
`;

const GalleryImage = styled(animated.div) <{ src: string; fallbackColor: string }>`
    width: 100%;
    padding-bottom: 100%;
    background: url(${props => props.src}) no-repeat center center;
    background-size: cover;
    border-radius: ${AppTheme.radius.medium};
    background-color: ${props => props.fallbackColor};
`;

// Add interface for ExpandedLayout props
interface ExpandedLayoutProps {
    expandDirection: 'left' | 'right' | 'center';
}

// Update the ExpandedLayout component with proper typing
const ExpandedLayout = styled.div<{ expandDirection: 'left' | 'right' | 'center' }>`
    position: absolute;
    width: 1200px;
    height: 100%;
    top: 0;
    ${props => {
        if (props.expandDirection === 'left') return 'right: 0;';
        if (props.expandDirection === 'right') return 'left: 0;';
        return 'left: 50%; transform: translateX(-50%);';
    }}
`;

export const SkillBubble: React.FC<SkillBubbleProps> = ({
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
            const totalWidth = 1200;
            const itemWidth = 280;
            const gap = 24;

            // First and last items
            if (col === 0) return 0; // Leftmost - expand right
            if (col === totalBubbles.cols - 1) return -(totalWidth - itemWidth); // Rightmost - expand left

            // For middle items (col 1 and 2)
            if (col === 1) {
                // Second item should expand 1/3 left, 2/3 right
                return -(itemWidth + gap);
            }
            if (col === 2) {
                // Third item should expand 2/3 left, 1/3 right
                return -((itemWidth + gap) * 2);
            }

            return 0;
        })() : 0,
        scale: 1,
        config: {
            mass: 1,
            tension: 400,
            friction: 26,
        }
    });

    // Title animation
    const titleSpring = useSpring({
        y: 0,
        opacity: 1,
        scale: isHovered ? 1.1 : 1,
        config: {
            mass: 1,
            tension: 380,
            friction: 26,
        }
    });

    // Description animation
    const descriptionSpring = useSpring({
        y: isHovered ? 60 : 100,
        opacity: isHovered ? 1 : 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 26,
        }
    });

    // Image gallery animation
    const gallerySpring = useSpring({
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1 : 0.95,
        delay: isHovered ? 200 : 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 26,
        }
    });

    // Add a new spring for the main image
    const mainImageSpring = useSpring({
        opacity: isHovered ? 0 : 1,
        scale: isHovered ? 0.9 : 1,
        config: {
            mass: 1,
            tension: 380,
            friction: 26,
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

    return (
        <BubbleContainer
            ref={containerRef}
            isExpanded={isHovered}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatedContent
                $isExpanded={isHovered}
                style={containerSpring}
            >
                {isHovered ? (
                    <ExpandedLayout expandDirection={getExpandDirection()}>
                        <animated.div style={mainImageSpring}>
                            <ImageContainer>
                                <GlassImageWrapper>
                                    <FeatureImage
                                        src={images[currentImageIndices[position.row * totalBubbles.cols + position.col]]}
                                        isActive={!isHovered}
                                        fallbackColor={FALLBACK_COLORS[Math.floor(position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                        onError={handleImageError}
                                        alt={`${title} preview`}
                                    />
                                </GlassImageWrapper>
                            </ImageContainer>
                        </animated.div>

                        <TitleContainer style={titleSpring}>
                            <h3>{title}</h3>
                            {years && <YearText>{years}+ years</YearText>}
                        </TitleContainer>

                        <Description style={descriptionSpring}>
                            <p>{description}</p>
                        </Description>

                        <ImageGallery style={gallerySpring}>
                            {Array.from({ length: 4 }).map((_, index) => {
                                if (index === position.col) return <div key={index} />;
                                return (
                                    <GalleryImage
                                        key={index}
                                        src={images[(index % (images.length - 1)) + 1]}
                                        fallbackColor={FALLBACK_COLORS[(index + position.row * totalBubbles.cols) % FALLBACK_COLORS.length]}
                                    />
                                );
                            })}
                        </ImageGallery>
                    </ExpandedLayout>
                ) : (
                    <>
                        <animated.div style={mainImageSpring}>
                            <ImageContainer>
                                <GlassImageWrapper>
                                    <FeatureImage
                                        src={images[currentImageIndices[position.row * totalBubbles.cols + position.col]]}
                                        isActive={!isHovered}
                                        fallbackColor={FALLBACK_COLORS[Math.floor(position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                        onError={handleImageError}
                                        alt={`${title} preview`}
                                    />
                                </GlassImageWrapper>
                            </ImageContainer>
                        </animated.div>
                        <TitleContainer style={titleSpring}>
                            <h3>{title}</h3>
                            {years && <YearText>{years}+ years</YearText>}
                        </TitleContainer>
                    </>
                )}
            </AnimatedContent>
        </BubbleContainer>
    );
}; 