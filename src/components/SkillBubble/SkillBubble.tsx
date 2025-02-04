import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';
import { AppTheme } from '../../theme/theme';

interface SkillBubbleProps {
    title: string;
    description: string;
    images: string[];
    years?: number;
    position: { row: number; col: number };
    totalBubbles: { rows: number; cols: number };
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
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    animation: ${props => props.isExpanded ? expandAnimation : 'none'} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    width: ${props => props.isExpanded ? '100%' : '200px'};
    height: ${props => props.isExpanded ? '400px' : '240px'};
    display: flex;
    flex-direction: column;
    gap: ${AppTheme.spacing[8]};
`;

const ImageWrapper = styled.div<{ isExpanded: boolean }>`
    position: relative;
    width: 100%;
    height: ${props => props.isExpanded ? '400px' : '200px'};
    border-radius: ${AppTheme.radius.medium};
    overflow: hidden;
`;

const ImageContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: inherit;
`;

const ColorFallback = styled.div<{ color: string }>`
    width: 100%;
    height: 100%;
    background-color: ${props => props.color};
    position: absolute;
    top: 0;
    left: 0;
`;

const SkillImage = styled.img<{ isActive: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    transition: opacity 0.6s ease;
    opacity: ${props => props.isActive ? 1 : 0};
`;

const Title = styled.h3`
    ${AppTheme.typography.title2};
    color: ${AppTheme.colors.light.textPrimary};
    margin: 0;
    text-align: center;
    padding: ${AppTheme.spacing[8]} 0;
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

const ImageGallery = styled.div`
    flex: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${AppTheme.spacing[16]};
`;

const GalleryImage = styled.div<{ src: string }>`
    width: 100%;
    padding-bottom: 100%;
    background: url(${props => props.src}) no-repeat center center;
    background-size: cover;
    border-radius: ${AppTheme.radius.medium};
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
`;

export const SkillBubble: React.FC<SkillBubbleProps> = ({
    title,
    description,
    images,
    years,
    position,
    totalBubbles,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
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

    return (
        <BubbleContainer isExpanded={isExpanded}>
            <FrostedGlass
                onClick={() => setIsExpanded(!isExpanded)}
                glowIntensity={0.2}
                blurIntensity={15}
                height="100%"
            >
                <ImageWrapper isExpanded={isExpanded}>
                    {images.map((image, index) => (
                        imageLoadError[index] ? (
                            <ColorFallback
                                key={index}
                                color={fallbackColors[index]}
                                style={{ opacity: !isExpanded && currentImageIndex === index ? 1 : 0 }}
                            />
                        ) : (
                            <SkillImage
                                key={index}
                                src={image}
                                isActive={!isExpanded && currentImageIndex === index}
                                alt={`${title} example ${index + 1}`}
                                onError={() => {
                                    const newErrors = [...imageLoadError];
                                    newErrors[index] = true;
                                    setImageLoadError(newErrors);
                                }}
                            />
                        )
                    ))}
                </ImageWrapper>
                <Title>
                    {title}
                    {years && ` (${years}+ years)`}
                </Title>
                <ExpandedContent isVisible={isExpanded}>
                    <Description>{description}</Description>
                    <ImageGallery>
                        {images.map((image, index) => (
                            <GalleryImage key={index} src={image} />
                        ))}
                    </ImageGallery>
                </ExpandedContent>
            </FrostedGlass>
        </BubbleContainer>
    );
}; 