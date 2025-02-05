import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { BaseBubble } from '../BaseBubble/BaseBubble';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, useSprings } from 'react-spring';

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
`;

const QuipText = styled.p`
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textSecondary};
    font-style: italic;
    text-align: center;
    max-width: 800px;
    margin: ${AppTheme.spacing[8]} auto ${AppTheme.spacing[4]};
    opacity: 0.8;
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

const personalExperience = [
    {
        title: 'IFR Pilot',
        description: 'Licensed instrument-rated pilot with 250+ hours in the logbook, and a passion for flying 3000lb machines through the clouds blind!',
        years: '250 hrs',
        images: ['/img/personal/pilot1.jpg', '/img/personal/pilot2.jpg', '/img/personal/pilot3.jpg'],
    },
    {
        title: 'Building Planes',
        description: 'Currently constructing a Glasair III. Because buying a plane is too easy, and who doesn\'t enjoy spending weekends covered in epoxy and aluminum shavings?',
        years: 'Glasair III',
        images: ['/img/personal/glasair1.jpg', '/img/personal/glasair2.jpg', '/img/personal/glasair3.jpg'],
    },
    {
        title: 'Mechanical Engineering',
        description: 'From CAD to fabrication, bringing ideas to life through design and implementation. Sometimes the best solution is the one that makes other engineers say "you did what?"',
        years: 'Design & Build',
        images: ['/img/personal/mech1.jpg', '/img/personal/mech2.jpg', '/img/personal/mech3.jpg'],
    },
    {
        title: 'Electrical Engineering',
        description: 'Turning weird ideas into circuits since grade school. Specializing in embedded systems and trying not to let the magic smoke out of components.',
        years: 'Circuit Wizard',
        images: ['/img/personal/ee1.jpg', '/img/personal/ee2.jpg', '/img/personal/ee3.jpg'],
    },
    {
        title: 'AutoCAD',
        description: 'Creating precision designs and technical drawings with the accuracy of a surgeon and the patience of a saint. Because sometimes, the 47th revision is the charm.',
        years: '3D Design',
        images: ['/img/personal/cad1.jpg', '/img/personal/cad2.jpg', '/img/personal/cad3.jpg'],
    },
    {
        title: 'Mixed Martial Arts',
        description: 'When you get out all of your violence in the morning, even if work is hectic, it seems easy by comparison. Muay Thai, Kickboxing, BJJ, powerlifting, and a passion for the beautiful art that is combat sports!',
        years: 'MMA & Powerlifting',
        images: ['/img/personal/mma1.jpg', '/img/personal/mma2.jpg', '/img/personal/mma3.jpg'],
    },
    {
        title: 'Live Music',
        description: 'Multi-instrumentalist proficient in piano, guitar, bass, and vocals. Making beautiful noise across four different instruments (and occasionally all at once).',
        years: 'Musician',
        images: ['/img/personal/music1.jpg', '/img/personal/music2.jpg', '/img/personal/music3.jpg'],
    },
    {
        title: 'Audio Engineering',
        description: 'Taking sounds from "what was that?" to "how did you do that?" while making my CPU cry with effects chains that would make a supercomputer sweat.',
        years: 'Producer',
        images: ['/img/personal/audio1.jpg', '/img/personal/audio2.jpg', '/img/personal/audio3.jpg'],
    },
];

export const WorkGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
    const [activeImageIndices, setActiveImageIndices] = useState<number[]>(
        new Array(personalExperience.length).fill(0)
    );
    const gridSize = { rows: Math.ceil(personalExperience.length / 4), cols: 4 };
    const totalItems = personalExperience.length;

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
        personalExperience.length,
        personalExperience.map((_, index) => {
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
                These are but a few of the companies I've worked for. Please check out my LinkedIn for a full CV or download it above.
            </QuipText>
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
                            key={personalExperience[index].title}
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
                                {...personalExperience[index]}
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
        </>
    );
}; 