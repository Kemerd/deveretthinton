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
    width: ${props => props.isExpanded ? '100%' : '280px'};
    height: ${props => props.isExpanded ? '600px' : '340px'};
    display: flex;
    flex-direction: column;
    gap: ${AppTheme.spacing[16]};
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

const SkillImage = styled.img<{ isActive: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: ${props => props.isActive ? 1 : 0};
    transform: scale(${props => props.isActive ? 1 : 1.05});
`;

const Title = styled.h3`
    ${AppTheme.typography.title2};
    color: ${AppTheme.colors.light.textPrimary};
    margin: 0;
    text-align: center;
    padding: ${AppTheme.spacing[8]} ${AppTheme.spacing[16]};
    font-weight: 500;
    letter-spacing: -0.5px;
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
                    <ImageContainer>
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
                    </ImageContainer>
                </ImageWrapper>
                <div>
                    <Title>{title}</Title>
                    {years && <YearText>{years}+ years</YearText>}
                </div>
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