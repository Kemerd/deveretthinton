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

const professionalSkills = [
    {
        title: 'Full-Stack Development',
        description: 'From pixel-perfect, beautifully animated frontends— to scalable backends, I\'ve built everything from mobile applications, to web panels, to AWS Lambda functions. Because sometimes you need to be a jack of all trades and a master of... well, most of them.',
        years: '10+ years',
        images: ['/img/skills/fullstack1.jpg', '/img/skills/fullstack2.jpg', '/img/skills/fullstack3.jpg'],
    },
    {
        title: 'Machine Learning & Python',
        description: 'Turning caffeine into weights & biases since before it was cool. I\'ve used linear algebra + statistics to train models since 2016— when it was just a niche class in college, we didn\'t have PyTorch or TensorFlow!',
        years: '7+ years',
        images: ['/img/skills/ml1.jpg', '/img/skills/ml2.jpg', '/img/skills/ml3.jpg'],

    },
    {
        title: 'Unreal & Unity',
        description: 'As a passionate gamer, I\'ve been using Unreal since UE3, and Unity just as long. From multiplayer VR experiences to Netflix VP pipeline tooling, I\'ve probably broken & fixed every subsystem in both engines at least twice. Yes, even that one.',
        years: '10+ years',
        images: ['/img/skills/unreal1.jpg', '/img/skills/unreal2.jpg', '/img/skills/unreal3.jpg'],

    },
    {
        title: 'C++ & C#',
        description: 'I am one of those weird people who adores C++. Because sometimes you need to make the computer do exactly what you want, down to the last bit.. even if it takes 200 extra lines, the performance can be very worth it! C# is easy by comparison!',
        years: '10+ years',
        images: ['/img/skills/cpp1.jpg', '/img/skills/cpp2.jpg', '/img/skills/cpp3.jpg'],
    },
    {
        title: 'TypeScript & JavaScript',
        description: 'After years of using PHP, using modern libraries is easy by comparison. From using TypeScript to build scalable backends, to using JavaScript to build pixel-perfect frontends, I\'ve got you covered. I mean, this website is proof, isn\'t it pretty?!',
        years: '6+ years',
        images: ['/img/skills/ts1.jpg', '/img/skills/ts2.jpg', '/img/skills/ts3.jpg'],
    },
    {
        title: 'CI/CD Pipeline',
        description: 'I build end-to-end multi-platform deployment pipelines that would make a DevOps engineer shed tears of joy. Because the best deployments are the ones that happen smoothly, predictably, and without surprises or headaches.',
        years: 'DevOps Evangelist',
        images: ['/img/skills/cicd1.jpg', '/img/skills/cicd2.jpg', '/img/skills/cicd3.jpg'],
    },
    {
        title: 'XR/VR Development',
        description: 'I\'ve had the privilege of developing with VR since its public inception with the Oculus DK1. From award-winning research projects to Skydance\'s Behemoth and LBE Transformers VR experiences, I\'ve been making people motion sick (professionally) for years!',
        years: 'Since the beginning!',
        images: ['/img/skills/vr1.jpg', '/img/skills/vr2.jpg', '/img/skills/vr3.jpg'],
    },
    {
        title: 'Design & UI',
        description: 'My goal is to create interfaces that ensure Steve Jobs doesn\'t turn over in his grave. Because good UI is like a joke - if you have to explain it, it\'s probably not that good. I\'ve been designing & implementing interfaces since 2009, and still learning!',
        years: 'UI Architect',
        images: ['/img/skills/ui1.jpg', '/img/skills/ui2.jpg', '/img/skills/ui3.jpg'],
    },
];

export const SkillGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
    const [activeImageIndices, setActiveImageIndices] = useState<number[]>(
        new Array(professionalSkills.length).fill(0)
    );
    const gridSize = { rows: Math.ceil(professionalSkills.length / 4), cols: 4 };
    const totalItems = professionalSkills.length;

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
        professionalSkills.length,
        professionalSkills.map((_, index) => {
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
                They say a jack of all trades is a master of none... but better than a master of one. Good thing I mastered quite a few!
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
                            key={professionalSkills[index].title}
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
                                {...professionalSkills[index]}
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