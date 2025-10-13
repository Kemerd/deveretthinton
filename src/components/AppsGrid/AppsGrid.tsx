import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BaseBubble } from '../BaseBubble/BaseBubble';
import { AppTheme } from '../../theme/theme';
import { animated, useSprings } from 'react-spring';
import { QuipText } from '../../styles/SharedStyles';

const GridContainer = styled.div`
    display: grid;
    /* Responsive grid - 4 columns on large screens, scales down on smaller screens */
    grid-template-columns: repeat(4, 280px);
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[24]} ${AppTheme.spacing[32]};
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    justify-content: center;
    width: 100%;

    /* Tablet landscape - 3 columns */
    @media (max-width: 1268px) {
        grid-template-columns: repeat(3, 280px);
        max-width: calc(280px * 3 + ${AppTheme.spacing[24]} * 2 + ${AppTheme.spacing[32]} * 2);
    }

    /* Tablet portrait - 2 columns */
    @media (max-width: 980px) {
        grid-template-columns: repeat(2, 280px);
        max-width: calc(280px * 2 + ${AppTheme.spacing[24]} + ${AppTheme.spacing[32]} * 2);
    }

    /* Mobile - 1 column */
    @media (max-width: 680px) {
        grid-template-columns: 280px;
        max-width: calc(280px + ${AppTheme.spacing[32]} * 2);
        padding: ${AppTheme.spacing[24]} ${AppTheme.spacing[16]};
    }
`;

const GridItem = styled(animated.div) <{
    $isHidden: boolean;
    $isSameRow: boolean;
    $isHovered: boolean;
}>`
    transition: opacity 0.3s ease;
    opacity: ${props => props.$isHovered ? 1 :
        (props.$isHidden || props.$isSameRow) ? 0 : 1};
    pointer-events: ${props => props.$isHovered ? 'auto' :
        (props.$isHidden || props.$isSameRow) ? 'none' : 'auto'};
    z-index: ${props => props.$isHovered ? 3 :
        props.$isHidden ? 0 :
            props.$isSameRow ? 2 : 1};
`;

// Export for preloading in App.tsx
export const apps = [
    {
        description: 'Mobile app built with Flutter and Supabase. Typescript edge-function based AI integrations for sentence generation. Bleeding edge on-device Japanese TTS with Kokro and ONNX, plus custom FSRS algorithms.',
        title: 'NihonDojo.ai',
        years: 'Language Learning App',
        images: ['/img/apps/nihondojo1.png', '/img/apps/nihondojo2.png', '/img/apps/nihondojo3.png'],
        link: 'https://nihondojo.ai',
    },
    {
        title: 'MixMate.ai',
        description: 'AI production assistant for Ableton via MPC Python bridge with AI cloud analysis through TS edge-functions. Cutting edge, custom, high performance on-device C++ libTorch models for audio processing & classification in realtime.',
        years: 'Music Production Tool',
        images: ['/img/apps/mixmate1.png', '/img/apps/mixmate2.png', '/img/apps/mixmate3.png'],
        link: 'https://mixmate.ai',
    },
    {
        title: 'UFly',
        description: 'Comprehensive flight school management platform. Handle aircraft scheduling, student management, and flight sales all in one place. Built for aviation professionals.',
        years: 'Aviation Management (WIP)',
        images: ['/img/apps/ufly1.png', '/img/apps/ufly2.png', '/img/apps/ufly3.png'],
    },
    {
        title: 'BreathRep',
        description: 'AI-powered fitness app that counts reps by analyzing your breathing patterns. Hands-free tracking with real-time audio processing and voice feedback through earphones. Uses a completely custom model with my own dataset to classify breathing.',
        years: 'Fitness Tracking (WIP)',
        images: ['/img/apps/breathrep1.png', '/img/apps/breathrep2.png', '/img/apps/breathrep3.png'],
    },
];

export const AppsGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
    const [activeImageIndices, setActiveImageIndices] = useState<number[]>(
        new Array(apps.length).fill(0)
    );

    // Calculate responsive columns based on viewport width
    const [cols, setCols] = useState(() => {
        if (typeof window === 'undefined') return 4;
        const width = window.innerWidth;
        if (width <= 680) return 1;
        if (width <= 980) return 2;
        if (width <= 1268) return 3;
        return 4;
    });

    // Update columns on window resize
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width <= 680) setCols(1);
            else if (width <= 980) setCols(2);
            else if (width <= 1268) setCols(3);
            else setCols(4);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gridSize = { rows: Math.ceil(apps.length / cols), cols };
    const totalItems = apps.length;

    // Function to get the current image index for a specific grid position
    const getCurrentImageIndex = (itemIndex: number) => {
        return activeImageIndices[itemIndex];
    };

    // Effect to handle cycling through grid items
    useEffect(() => {
        // Exit early if an item is being hovered
        if (hoveredIndex !== null) return;

        const cycleInterval = setInterval(() => {
            // Update image for current item
            setActiveImageIndices(prevIndices => {
                const newIndices = [...prevIndices];
                // Increment only the current cycle index's image
                newIndices[currentCycleIndex] = (newIndices[currentCycleIndex] + 1) % 3;

                // Move to next item
                setCurrentCycleIndex(prev => (prev + 1) % totalItems);

                return newIndices;
            });
        }, 1000);

        return () => clearInterval(cycleInterval);
    }, [hoveredIndex, totalItems, currentCycleIndex]);

    // Create springs for all items at once
    const springs = useSprings(
        apps.length,
        apps.map((_, index) => {
            const currentRow = Math.floor(index / cols);
            const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / cols) : -1;
            const isSameRow = currentRow === hoveredRow;
            const isHovered = index === hoveredIndex;
            const isCurrentCycle = index === currentCycleIndex;

            const isHidden = hoveredIndex !== null && (
                (hoveredRow < gridSize.rows / 2 && currentRow < hoveredRow) ||
                (hoveredRow >= gridSize.rows / 2 && currentRow > hoveredRow)
            );

            return {
                from: {
                    opacity: 1,
                    blur: 10,
                    rotation: 0,
                },
                to: {
                    opacity: isHovered ? 1 : (isHidden || isSameRow) ? 0 : 1,
                    blur: isHovered ? 20 : 10,
                    // Only apply rotation to the current cycling item when nothing is hovered
                    rotation: (isCurrentCycle && hoveredIndex === null) ? 2 : 0,
                },
                config: {
                    mass: 1,
                    tension: 280,
                    friction: 26,
                }
            };
        })
    );

    return (
        <>
            <QuipText>
                Side projects that actually shipped. Some making money, others making progress. Built with Flutter and/or React.
            </QuipText>
            <GridContainer>
                {springs.map((springProps, index) => {
                    const currentRow = Math.floor(index / cols);
                    const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / cols) : -1;
                    const isSameRow = currentRow === hoveredRow;
                    const isHovered = index === hoveredIndex;

                    const isHidden = hoveredIndex !== null && (
                        (hoveredRow < gridSize.rows / 2 && currentRow < hoveredRow) ||
                        (hoveredRow >= gridSize.rows / 2 && currentRow > hoveredRow)
                    );

                    return (
                        <GridItem
                            key={apps[index].title}
                            $isHidden={isHidden}
                            $isSameRow={isSameRow}
                            $isHovered={isHovered}
                            style={{
                                ...springProps,
                                transform: springProps.rotation.to(
                                    r => `rotate(${r}deg)`
                                ),
                            }}
                        >
                            <BaseBubble
                                {...apps[index]}
                                position={{
                                    row: currentRow,
                                    col: index % cols,
                                }}
                                totalBubbles={gridSize}
                                currentImageIndex={getCurrentImageIndex(index)}
                                onHoverChange={(isHovered) => {
                                    setHoveredIndex(isHovered ? index : null);
                                }}
                            />
                        </GridItem>
                    );
                })}
            </GridContainer>
        </>
    );
};
