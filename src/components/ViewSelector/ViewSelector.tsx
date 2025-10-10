import React from 'react';
import styled from 'styled-components';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated } from 'react-spring';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${AppTheme.spacing[16]} 0;
    position: relative;
    margin-bottom: ${AppTheme.spacing[8]};
`;

const SelectorContainer = styled(FrostedGlass)`
    padding: ${AppTheme.spacing[4]};
    display: flex;
    gap: ${AppTheme.spacing[4]};
    position: relative;
    border-radius: ${AppTheme.radius.pill};
    min-width: 520px;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.05);

    /* Properly resize on mobile without scaling - prevents clipping */
    @media (max-width: 580px) {
        min-width: auto;
        width: calc(100vw - ${AppTheme.spacing[32]});
        max-width: 100%;
    }

    @media (max-width: 480px) {
        width: calc(100vw - ${AppTheme.spacing[24]});
        gap: ${AppTheme.spacing[2]};
        padding: ${AppTheme.spacing[2]};
    }
`;

const Option = styled.button<{ $isActive: boolean }>`
    ${AppTheme.typography.button};
    flex: 1;
    color: ${props => props.$isActive ? AppTheme.colors.light.textPrimary : AppTheme.colors.light.textSecondary};
    background: none;
    border: none;
    padding: ${AppTheme.spacing[12]} ${AppTheme.spacing[24]};
    cursor: pointer;
    position: relative;
    z-index: 2;
    transition: color 0.3s ease;
    font-size: 16px;
    min-width: 120px;
    white-space: nowrap;

    &:hover {
        color: ${AppTheme.colors.light.textPrimary};
    }

    /* Adjust padding and font size for smaller screens to prevent overflow */
    @media (max-width: 580px) {
        padding: ${AppTheme.spacing[12]} ${AppTheme.spacing[16]};
        min-width: auto;
        font-size: 15px;
    }

    @media (max-width: 480px) {
        padding: ${AppTheme.spacing[8]} ${AppTheme.spacing[12]};
        font-size: 14px;
    }

    @media (max-width: 380px) {
        padding: ${AppTheme.spacing[8]} ${AppTheme.spacing[8]};
        font-size: 13px;
    }
`;

const Pill = styled(animated.div)`
    position: absolute;
    top: ${AppTheme.spacing[4]};
    height: calc(100% - ${AppTheme.spacing[8]});
    background: rgba(255, 255, 255, 0.12);
    border-radius: ${AppTheme.radius.pill};
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.05);
`;

type View = 'skills' | 'personal' | 'work' | 'apps';

interface ViewSelectorProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
    currentView,
    onViewChange,
}) => {
    // Create refs for each button to track their actual positions
    const skillsRef = React.useRef<HTMLButtonElement>(null);
    const personalRef = React.useRef<HTMLButtonElement>(null);
    const workRef = React.useRef<HTMLButtonElement>(null);
    const appsRef = React.useRef<HTMLButtonElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // State to track pill position and width
    const [pillPosition, setPillPosition] = React.useState({ left: 0, width: 0 });

    // Update pill position when current view changes or window resizes
    React.useEffect(() => {
        const updatePillPosition = () => {
            const refs = {
                skills: skillsRef,
                personal: personalRef,
                work: workRef,
                apps: appsRef,
            };

            const activeRef = refs[currentView];
            const containerElement = containerRef.current;

            if (activeRef.current && containerElement) {
                const buttonRect = activeRef.current.getBoundingClientRect();
                const containerRect = containerElement.getBoundingClientRect();

                // Calculate relative position within the container
                const left = buttonRect.left - containerRect.left;
                const width = buttonRect.width;

                setPillPosition({ left, width });
            }
        };

        // Update position on mount and when view changes
        updatePillPosition();

        // Update position on window resize for responsive behavior
        window.addEventListener('resize', updatePillPosition);

        // Small delay to ensure layout is complete
        const timeoutId = setTimeout(updatePillPosition, 50);

        return () => {
            window.removeEventListener('resize', updatePillPosition);
            clearTimeout(timeoutId);
        };
    }, [currentView]);

    // Animate the pill position with spring physics
    const pillSpring = useSpring({
        left: pillPosition.left,
        width: pillPosition.width,
        config: {
            mass: 1,
            tension: 400,
            friction: 26,
        },
    });

    // Transform the spring value into CSS properties
    const pillStyle = {
        left: pillSpring.left.to(x => `${x}px`),
        width: pillSpring.width.to(w => `${w}px`),
    };

    return (
        <Container>
            <SelectorContainer ref={containerRef}>
                <Pill style={pillStyle} />
                <Option
                    ref={skillsRef}
                    $isActive={currentView === 'skills'}
                    onClick={() => onViewChange('skills')}
                >
                    Skills
                </Option>
                <Option
                    ref={personalRef}
                    $isActive={currentView === 'personal'}
                    onClick={() => onViewChange('personal')}
                >
                    Personal
                </Option>
                <Option
                    ref={workRef}
                    $isActive={currentView === 'work'}
                    onClick={() => onViewChange('work')}
                >
                    Work
                </Option>
                <Option
                    ref={appsRef}
                    $isActive={currentView === 'apps'}
                    onClick={() => onViewChange('apps')}
                >
                    Apps
                </Option>
            </SelectorContainer>
        </Container>
    );
}; 