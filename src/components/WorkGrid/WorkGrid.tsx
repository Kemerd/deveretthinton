import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { BaseBubble } from '../BaseBubble/BaseBubble';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, useSprings } from 'react-spring';
import { QuipText } from '../../styles/SharedStyles';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 280px);
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[24]} ${AppTheme.spacing[32]};
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    justify-content: center;
    width: 100%;

    @media (max-width: 1268px) {
        /* Force minimum width to fit all columns plus gaps */
        min-width: calc(280px * 4 + ${AppTheme.spacing[24]} * 3);
        margin: 0;
        justify-content: flex-start;
        padding-left: ${AppTheme.spacing[32]};
        padding-right: ${AppTheme.spacing[32]};
    }
`;

const ScrollContainer = styled.div`
    /* Default state - no scrolling */
    width: 100%;
    
    /* Enable horizontal scrolling under 1268px */
    @media (max-width: 1268px) {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        /* Show scrollbar above content */
        position: relative;
        z-index: 2;
        
        /* Customize scrollbar appearance */
        &::-webkit-scrollbar {
            height: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            
            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }
        
        /* Firefox scrollbar styling */
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
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

const workExperience = [
    {
        title: 'Skydance Interactive',
        description: 'Driving force in UE5 & C++ VR development for Oculus Quest, contributing to Behemoth beta launch and an unannounced title. Implemented multiplayer VR systems, replication, and AWS backend services.',
        years: 'Senior Software Engineer',
        images: ['/img/work/skydance1.jpg', '/img/work/skydance2.jpg', '/img/work/skydance3.jpg'],
    },
    {
        title: 'Black Box VR',
        description: 'Developed Unity VR systems for location-based fitness centers, integrating hardware resistance machines. Migrated backend to AWS Lambda using JS/TS and implemented XR gameplay features.',
        years: 'Senior Backend Engineer',
        images: ['/img/work/blackbox1.jpg', '/img/work/blackbox2.jpg', '/img/work/blackbox3.jpg'],
    },
    {
        title: 'Netflix',
        description: 'Developed Unreal Engine tools for virtual production VFX pipeline at Scanline VFX. Created synthetic data generation systems for ML models and integrated complex cross-disciplinary systems.',
        years: 'Senior VFX Pipeline Engineer',
        images: ['/img/work/netflix1.jpg', '/img/work/netflix2.jpg', '/img/work/netflix3.jpg'],
    },
    {
        title: 'Nextech3D.AI',
        description: 'Built web-based virtual events using Unreal Engine with AWS pixel streaming. Developed UI/UX, Node.js servers, and created custom materials and levels for client specifications.',
        years: 'Lead Unreal Architect',
        images: ['/img/work/nextech1.jpg', '/img/work/nextech2.jpg', '/img/work/nextech3.jpg'],
    },
    {
        title: 'FCA Fiat Chrysler',
        description: 'Architected interactive features for CES car showcase using Unreal Engine. Created web-based immersive experience and AR companion apps for iOS/Android.',
        years: 'Senior Game Developer',
        images: ['/img/work/fca1.jpg', '/img/work/fca2.jpg', '/img/work/fca3.jpg'],
    },
    {
        title: 'DMG Entertainment',
        description: 'Spearheaded development of two Transformers VR attractions, managing global teams and hardware/software integration. Implemented multiplayer systems and mobile operator tools.',
        years: 'Lead VR Engineer',
        images: ['/img/work/dmg1.jpg', '/img/work/dmg2.jpg', '/img/work/dmg3.jpg'],
    },
    {
        title: 'Armstrong State University',
        description: 'With the power of "elliptical curves over finite fields," we created cutting-edge primality-test algorithms using Python and SAGE.',
        years: 'Mathematics Researcher',
        images: ['/img/work/armstrong1.jpg', '/img/work/armstrong2.jpg', '/img/work/armstrong3.jpg'],
    },
    {
        title: 'Code Mercenary',
        description: 'Led multiple software projects across various companies including Novabox, UserCS, and more. Developed game servers, AI systems, and created custom features using C++, C#, LUA, and various web technologies.',
        years: 'Freelance Contractor',
        images: ['/img/work/freelance1.jpg', '/img/work/freelance2.jpg', '/img/work/freelance3.jpg'],
    },
];

export const WorkGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
    const [activeImageIndices, setActiveImageIndices] = useState<number[]>(
        new Array(workExperience.length).fill(0)
    );
    const gridSize = { rows: Math.ceil(workExperience.length / 4), cols: 4 };
    const totalItems = workExperience.length;

    // Function to get the current image index for a specific grid position
    const getCurrentImageIndex = (itemIndex: number) => {
        // Only show cycling images for the current active item
        return activeImageIndices[itemIndex];
    };

    // Create a subtle rotation spring for the cycling effect
    const cycleSpring = useSpring({
        from: { rotation: 0 },
        to: { rotation: 360 },
        config: {
            // Use a spring configuration that feels like a gentle clock dial
            tension: 120, // Slightly lower tension for softness
            friction: 14, // Lower friction for a more natural bounce
            mass: 1.2, // Slightly higher mass for weight
        },
        reset: true,
        loop: { reverse: false },
    });

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
        }, 1000); // Keep it at 1 second as requested

        return () => clearInterval(cycleInterval);
    }, [hoveredIndex, totalItems, currentCycleIndex]);

    // Create springs for all items at once
    const springs = useSprings(
        workExperience.length,
        workExperience.map((_, index) => {
            const currentRow = Math.floor(index / 4);
            const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : -1;
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
                    // Only apply rotation to the current cycling item
                    rotation: isCurrentCycle ? 2 : 0,
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
                Just a few highlights from my journey. For the full saga (and my caffeine consumption stats), check my CV or LinkedIn.
            </QuipText>
            <ScrollContainer>
                <GridContainer>
                    {springs.map((springProps, index) => {
                        const currentRow = Math.floor(index / 4);
                        const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : -1;
                        const isSameRow = currentRow === hoveredRow;
                        const isHovered = index === hoveredIndex;

                        const isHidden = hoveredIndex !== null && (
                            (hoveredRow < gridSize.rows / 2 && currentRow < hoveredRow) ||
                            (hoveredRow >= gridSize.rows / 2 && currentRow > hoveredRow)
                        );

                        return (
                            <GridItem
                                key={workExperience[index].title}
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
                                    {...workExperience[index]}
                                    position={{
                                        row: currentRow,
                                        col: index % 4,
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
            </ScrollContainer>
        </>
    );
}; 