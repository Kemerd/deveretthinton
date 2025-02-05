import React, { useState } from 'react';
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

// Placeholder work experience data
const workExperience = [
    {
        title: 'Senior Software Engineer',
        description: 'Lead developer for enterprise applications.',
        years: 5,
        images: ['/work/enterprise1.jpg', '/work/enterprise2.jpg', '/work/enterprise3.jpg'],
    },
    {
        title: 'Technical Director',
        description: 'VFX pipeline development and optimization.',
        years: 3,
        images: ['/work/vfx1.jpg', '/work/vfx2.jpg', '/work/vfx3.jpg'],
    },
    {
        title: 'Game Developer',
        description: 'Unreal Engine game development and optimization.',
        years: 4,
        images: ['/work/game1.jpg', '/work/game2.jpg', '/work/game3.jpg'],
    },
    {
        title: 'Software Architect',
        description: 'System design and implementation for large-scale applications.',
        years: 6,
        images: ['/work/architect1.jpg', '/work/architect2.jpg', '/work/architect3.jpg'],
    },
];

export const WorkGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const gridSize = { rows: Math.ceil(workExperience.length / 4), cols: 4 };

    const springs = useSprings(
        workExperience.length,
        workExperience.map((_, index) => {
            const currentRow = Math.floor(index / 4);
            const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : -1;
            const isSameRow = currentRow === hoveredRow;
            const isHovered = index === hoveredIndex;

            const isHidden = hoveredIndex !== null && (
                (hoveredRow < gridSize.rows / 2 && currentRow < hoveredRow) ||
                (hoveredRow >= gridSize.rows / 2 && currentRow > hoveredRow)
            );

            return {
                opacity: isHovered ? 1 : (isHidden || isSameRow) ? 0 : 1,
                scale: isHovered ? 1.05 : 1,
                config: {
                    mass: 1,
                    tension: 280,
                    friction: 26,
                }
            };
        })
    );

    return (
        <GridContainer>
            {springs.map((springProps, index) => (
                <BaseBubble
                    key={workExperience[index].title}
                    {...workExperience[index]}
                    position={{
                        row: Math.floor(index / 4),
                        col: index % 4,
                    }}
                    totalBubbles={gridSize}
                    onHoverChange={(isHovered) => {
                        setHoveredIndex(isHovered ? index : null);
                    }}
                />
            ))}
        </GridContainer>
    );
}; 