import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseBubble } from '../BaseBubble/BaseBubble';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated, useSprings } from 'react-spring';

// Reuse the same GridContainer styling
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

// Placeholder personal projects data
const personalProjects = [
    {
        title: 'Aviation',
        description: 'Private pilot and aircraft builder. Currently building an RV-14.',
        years: 5,
        images: ['/personal/aviation1.jpg', '/personal/aviation2.jpg', '/personal/aviation3.jpg'],
    },
    {
        title: 'Photography',
        description: 'Landscape and aviation photography enthusiast.',
        years: 8,
        images: ['/personal/photo1.jpg', '/personal/photo2.jpg', '/personal/photo3.jpg'],
    },
    {
        title: '3D Printing',
        description: 'Custom 3D printer builds and design work.',
        years: 3,
        images: ['/personal/3d1.jpg', '/personal/3d2.jpg', '/personal/3d3.jpg'],
    },
    {
        title: 'Electronics',
        description: 'Custom PCB design and embedded systems projects.',
        years: 4,
        images: ['/personal/electronics1.jpg', '/personal/electronics2.jpg', '/personal/electronics3.jpg'],
    },
];

export const PersonalGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const gridSize = { rows: Math.ceil(personalProjects.length / 4), cols: 4 };

    // Reuse the same spring logic as SkillGrid
    const springs = useSprings(
        personalProjects.length,
        personalProjects.map((_, index) => {
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
                    key={personalProjects[index].title}
                    {...personalProjects[index]}
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