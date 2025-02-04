import React, { useState } from 'react';
import styled from 'styled-components';
import { SkillBubble } from '../SkillBubble/SkillBubble';
import { AppTheme } from '../../theme/theme';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 280px);
    gap: ${AppTheme.spacing[24]};
    padding: ${AppTheme.spacing[32]};
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
`;

const GridItem = styled.div<{ isBelow: boolean; isSameRow: boolean }>`
    transition: opacity 0.3s ease;
    opacity: ${props => (props.isBelow || props.isSameRow) ? 1 : 0};
    pointer-events: ${props => (props.isBelow || props.isSameRow) ? 'auto' : 'none'};
    z-index: ${props => props.isBelow ? 1 : props.isSameRow ? 2 : 0};
`;

const skills = [
    {
        title: 'Unreal Engine',
        description: 'Over a decade of experience in Unreal Engine development, from game development to film & VFX. Expertise in blueprints, C++, and real-time rendering.',
        years: 10,
        images: ['/unreal1.jpg', '/unreal2.jpg', '/unreal3.jpg'],
    },
    {
        title: 'Unity',
        description: 'Extensive experience in Unity development, focusing on performance optimization and cross-platform development.',
        years: 10,
        images: ['/unity1.jpg', '/unity2.jpg', '/unity3.jpg'],
    },
    {
        title: 'C++',
        description: 'Deep expertise in C++ development, from low-level systems programming to high-performance game engines.',
        years: 10,
        images: ['/cpp1.jpg', '/cpp2.jpg', '/cpp3.jpg'],
    },
    {
        title: 'Python',
        description: 'Proficient in Python development, with focus on automation, data processing, and machine learning applications.',
        years: 5,
        images: ['/python1.jpg', '/python2.jpg', '/python3.jpg'],
    },
    {
        title: 'Machine Learning',
        description: 'Experience in implementing ML solutions, from computer vision to natural language processing.',
        years: 3,
        images: ['/ml1.jpg', '/ml2.jpg', '/ml3.jpg'],
    },
    {
        title: 'Flutter & Dart',
        description: 'Expert in cross-platform mobile development using Flutter, creating beautiful and performant applications.',
        years: 4,
        images: ['/flutter1.jpg', '/flutter2.jpg', '/flutter3.jpg'],
    },
    {
        title: 'JavaScript',
        description: 'Extensive experience in modern JavaScript development, including React and Node.js.',
        years: 8,
        images: ['/js1.jpg', '/js2.jpg', '/js3.jpg'],
    },
    {
        title: 'TypeScript',
        description: 'Strong advocate for type-safe development, using TypeScript to build robust applications.',
        years: 5,
        images: ['/ts1.jpg', '/ts2.jpg', '/ts3.jpg'],
    },
];

export const SkillGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const gridSize = { rows: Math.ceil(skills.length / 4), cols: 4 };

    return (
        <GridContainer>
            {skills.map((skill, index) => {
                const currentRow = Math.floor(index / 4);
                const hoveredRow = hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : -1;
                const isSameRow = currentRow === hoveredRow;

                return (
                    <GridItem
                        key={skill.title}
                        isBelow={hoveredIndex === null || currentRow > hoveredRow}
                        isSameRow={isSameRow}
                    >
                        <SkillBubble
                            {...skill}
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
    );
}; 