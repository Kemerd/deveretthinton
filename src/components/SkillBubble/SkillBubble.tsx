import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, config } from 'react-spring';

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
`;

const ImageGallery = styled(animated.div)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${AppTheme.spacing[16]};
    padding: ${AppTheme.spacing[16]};
    opacity: 0;
`;

const ImageWrapper = styled.div<{ isExpanded: boolean }>`
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    background: rgba(0, 0, 0, 0.1);
`;

const ImageContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: calc(80% * 9/16);
    transform: translate(-50%, -50%);
    overflow: hidden;
`;

const ColorFallback = styled.div<{ color: string }>`
    width: 100%;
    height: 100%;
    background-color: ${props => props.color};
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.6s ease;
`;

const FeatureImage = styled.img<{ isActive: boolean }>`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: ${AppTheme.radius.medium};
    transition: opacity 0.3s ease;
    opacity: ${props => props.isActive ? 1 : 0.8};
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

const GalleryImage = styled(animated.div) <{ src: string }>`
    width: 100%;
    padding-bottom: 100%;
    background: url(${props => props.src}) no-repeat center center;
    background-size: cover;
    border-radius: ${AppTheme.radius.medium};
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
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoadError, setImageLoadError] = useState<boolean[]>([]);

    // Fallback colors if images fail to load
    const fallbackColors = ['#FF0000', '#FFFFFF', '#0000FF'];

    // Calculate image transition timing based on position
    useEffect(() => {
        const baseDelay = 1000; // 1 second
        const transitionDelay = (position.row * totalBubbles.cols + position.col) * baseDelay;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, baseDelay * (totalBubbles.rows * totalBubbles.cols));

        // Use the delay for initial stagger if needed
        setTimeout(() => {
            setCurrentImageIndex(1 % images.length);
        }, transitionDelay);

        return () => {
            clearInterval(interval);
        };
    }, [position, totalBubbles, images.length]);

    // Calculate expand direction based on position
    const expandDirection = position.col >= totalBubbles.cols / 2 ? 'left' : 'right';

    // Main container animation
    const containerSpring = useSpring({
        width: isHovered ? 1200 : 280,
        height: isHovered ? 340 : 340,
        // Calculate x-offset based on position to expand into available space
        x: isHovered ? (() => {
            const col = position.col;
            if (col === 0) return 0; // Leftmost - expand right
            else if (col === totalBubbles.cols - 1) return -920; // Rightmost - expand left
            else if (col === 1) return -280; // Second from left - expand mostly right
            else return -640; // Second from right - expand mostly left
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
                {/* Main feature image */}
                <animated.div style={mainImageSpring}>
                    <FeatureImage
                        src={images[currentImageIndex]}
                        isActive={!isHovered}
                        onError={() => {
                            const newErrors = [...imageLoadError];
                            newErrors[currentImageIndex] = true;
                            setImageLoadError(newErrors);
                        }}
                        alt={`${title} preview`}
                    />
                </animated.div>

                <TitleContainer style={titleSpring}>
                    <h3>{title}</h3>
                    {years && <YearText>{years}+ years</YearText>}
                </TitleContainer>

                <DescriptionContainer style={descriptionSpring}>
                    <p>{description}</p>
                </DescriptionContainer>

                <ImageGallery style={gallerySpring}>
                    {images.map((image, index) => (
                        <GalleryImage
                            key={index}
                            src={image}
                            style={{
                                opacity: gallerySpring.opacity,
                                transform: gallerySpring.scale.to(s => `scale(${s})`),
                            } as any} // Type assertion to handle spring animation props
                        />
                    ))}
                </ImageGallery>
            </AnimatedContent>
        </BubbleContainer>
    );
}; 