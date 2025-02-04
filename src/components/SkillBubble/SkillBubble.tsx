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
    position: relative;
    padding: ${AppTheme.spacing[16]};
    text-align: center;
`;

const DescriptionContainer = styled(animated.div)`
    padding: ${AppTheme.spacing[16]};
    opacity: 0;
    transform: translateY(20px);
    position: absolute;
    bottom: ${AppTheme.spacing[16]};
    left: 0;
    right: 0;
`;

const ImageGallery = styled(animated.div)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${AppTheme.spacing[16]};
    padding: ${AppTheme.spacing[16]};
    opacity: 0;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 100%; // Makes it 1:1 aspect ratio
    margin-bottom: ${AppTheme.spacing[16]};
`;

const GlassImageWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    font-size: 13px;
    font-weight: 400;
    letter-spacing: -0.08px;
    line-height: 1.38;
    color: ${AppTheme.colors.light.textSecondary};
    display: block;
    text-align: center;
    margin-top: ${AppTheme.spacing[4]};
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

const Description = styled.div`
    flex: 1;
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textPrimary};
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
const ExpandedLayout = styled(animated.div) <ExpandedLayoutProps>`
    display: grid;
    grid-template-columns: ${props =>
        props.expandDirection === 'right' ? '280px 1fr' :
            props.expandDirection === 'left' ? '1fr 280px' :
                '1fr 280px 1fr'};
    gap: ${AppTheme.spacing[24]};
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateY(20px);
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoadError, setImageLoadError] = useState<boolean[]>(new Array(images.length).fill(false));
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Image cycling effect
    useEffect(() => {
        if (isHovered) return; // Don't cycle images while expanded

        const baseDelay = 200; // Base delay between animations
        const rowDelay = position.row * (baseDelay * totalBubbles.cols); // Delay for current row
        const colDelay = position.col * baseDelay; // Delay within row
        const totalDelay = rowDelay + colDelay;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000); // Total cycle time

        // Initial stagger delay
        const timeout = setTimeout(() => {
            setCurrentImageIndex(1 % images.length);
        }, totalDelay);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [position, totalBubbles, images.length, isHovered]);

    // Main container animation
    const containerSpring = useSpring({
        width: isHovered ? 1200 : 280,
        height: isHovered ? 340 : 340,
        x: isHovered ? (() => {
            const col = position.col;
            // Determine expand direction based on position
            if (col === 0) return 0; // Leftmost - expand right
            else if (col === totalBubbles.cols - 1) return -(1200 - 280); // Rightmost - expand left
            else return -(1200 - 280) / 2; // Center columns - expand both directions
        })() : 0,
        scale: 1,
        blur: isHovered ? 20 : 10,
        borderOpacity: isHovered ? 1 : 0.3,
        config: {
            mass: 1,
            tension: 400,
            friction: 26,
        }
    });

    // Title animation
    const titleSpring = useSpring({
        y: isHovered ? -20 : 0,
        config: {
            mass: 1,
            tension: 380,
            friction: 26,
        }
    });

    // Description animation
    const descriptionSpring = useSpring({
        opacity: isHovered ? 1 : 0,
        y: isHovered ? 0 : 20,
        delay: isHovered ? 150 : 0,
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
        y: isHovered ? -60 : 0,
        scale: isHovered ? 0.8 : 1,
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

    return (
        <BubbleContainer
            ref={containerRef}
            isExpanded={isHovered}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatedContent
                $isExpanded={isHovered}
                style={{
                    ...containerSpring,
                    backdropFilter: containerSpring.blur.to(b => `blur(${b}px)`),
                }}
            >
                {isHovered ? (
                    <ExpandedLayout expandDirection={getExpandDirection()}>
                        <animated.div style={mainImageSpring}>
                            <ImageContainer>
                                <GlassImageWrapper>
                                    <FeatureImage
                                        src={images[currentImageIndex]}
                                        isActive={!isHovered}
                                        fallbackColor={FALLBACK_COLORS[Math.floor(position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                        onError={() => {
                                            const newErrors = [...imageLoadError];
                                            newErrors[currentImageIndex] = true;
                                            setImageLoadError(newErrors);
                                        }}
                                        alt={`${title} preview`}
                                    />
                                </GlassImageWrapper>
                            </ImageContainer>
                        </animated.div>

                        <DescriptionContainer style={descriptionSpring}>
                            <p>{description}</p>
                        </DescriptionContainer>

                        <ImageGallery style={gallerySpring}>
                            {images.map((image, index) => (
                                <GalleryImage
                                    key={index}
                                    src={image}
                                    fallbackColor={FALLBACK_COLORS[(index + position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                    style={{
                                        opacity: gallerySpring.opacity,
                                        transform: gallerySpring.scale.to(s => `scale(${s})`),
                                    }}
                                />
                            ))}
                        </ImageGallery>
                    </ExpandedLayout>
                ) : (
                    // Non-expanded content
                    <>
                        <animated.div style={mainImageSpring}>
                            <ImageContainer>
                                <GlassImageWrapper>
                                    <FeatureImage
                                        src={images[currentImageIndex]}
                                        isActive={!isHovered}
                                        fallbackColor={FALLBACK_COLORS[Math.floor(position.row * totalBubbles.cols + position.col) % FALLBACK_COLORS.length]}
                                        onError={() => {
                                            const newErrors = [...imageLoadError];
                                            newErrors[currentImageIndex] = true;
                                            setImageLoadError(newErrors);
                                        }}
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