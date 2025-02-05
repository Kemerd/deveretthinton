import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { BaseBubble } from '../BaseBubble/BaseBubble';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, useSprings } from 'react-spring';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 280px);
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[32]};
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
    margin: ${AppTheme.spacing[16]} auto ${AppTheme.spacing[8]};
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
        description: 'Licensed instrument-rated pilot with 250+ hours in the logbook. Turns out the clouds look pretty much the same from both sides.',
        years: '250 hrs',
        images: ['/pilot1.jpg', '/pilot2.jpg', '/pilot3.jpg'],
    },
    {
        title: 'Building Planes',
        description: 'Currently constructing a Glasair III. Because buying a plane is too easy, and who doesn\'t enjoy spending weekends covered in epoxy and aluminum shavings?',
        years: 'Glasair III',
        images: ['/glasair1.jpg', '/glasair2.jpg', '/glasair3.jpg'],
    },
    {
        title: 'Mechanical Engineering',
        description: 'From CAD to fabrication, bringing ideas to life through design and implementation. Sometimes the best solution is the one that makes other engineers say "you did what?"',
        years: 'Design & Build',
        images: ['/mech1.jpg', '/mech2.jpg', '/mech3.jpg'],
    },
    {
        title: 'Electrical Engineering',
        description: 'Turning coffee into circuits since college. Specializing in embedded systems and trying not to let the magic smoke out of components.',
        years: 'Circuit Wizard',
        images: ['/ee1.jpg', '/ee2.jpg', '/ee3.jpg'],
    },
    {
        title: 'AutoCAD Master',
        description: 'Creating precision designs and technical drawings with the accuracy of a surgeon and the patience of a saint. Because sometimes, the 47th revision is the charm.',
        years: '3D Design',
        images: ['/cad1.jpg', '/cad2.jpg', '/cad3.jpg'],
    },
    {
        title: 'Mixed Martial Arts',
        description: 'Training in various martial arts disciplines. Because sometimes debugging code requires the patience of a martial artist (and the ability to take a hit).',
        years: 'Fighter',
        images: ['/mma1.jpg', '/mma2.jpg', '/mma3.jpg'],
    },
    {
        title: 'Live Music',
        description: 'Multi-instrumentalist proficient in piano, guitar, bass, and vocals. Making beautiful noise across four different instruments (and occasionally all at once).',
        years: 'Musician',
        images: ['/music1.jpg', '/music2.jpg', '/music3.jpg'],
    },
    {
        title: 'Audio Engineering',
        description: 'Studio production wizard with Ableton Live. Taking sounds from "what was that?" to "how did you do that?" one track at a time.',
        years: 'Producer',
        images: ['/audio1.jpg', '/audio2.jpg', '/audio3.jpg'],
    },
];

export const PersonalGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const gridSize = { rows: Math.ceil(personalExperience.length / 4), cols: 4 };

    // Create springs for all items at once
    const springs = useSprings(
        personalExperience.length,
        personalExperience.map((_, index) => {
            const currentRow = Math.floor(index / 4);
            const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : -1;
            const isSameRow = currentRow === hoveredRow;
            const isHovered = index === hoveredIndex;

            const isHidden = hoveredIndex !== null && (
                (hoveredRow < gridSize.rows / 2 && currentRow < hoveredRow) ||
                (hoveredRow >= gridSize.rows / 2 && currentRow > hoveredRow)
            );

            return {
                from: {
                    opacity: 1,
                    blur: 10,
                },
                to: {
                    opacity: isHovered ? 1 : (isHidden || isSameRow) ? 0 : 1,
                    blur: isHovered ? 20 : 10,
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
                People often ask me how I accomplish so much. The answer is, a lot of caffeine and very intense calendering.
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
                            style={springProps}
                        >
                            <BaseBubble
                                {...personalExperience[index]}
                                position={{
                                    row: currentRow,
                                    col: index % 4,
                                }}
                                totalBubbles={gridSize}
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