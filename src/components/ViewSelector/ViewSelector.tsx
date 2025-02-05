import React from 'react';
import styled from 'styled-components';
import { AppTheme } from '../../theme/theme';
import { useSpring, animated } from 'react-spring';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${AppTheme.spacing[32]} 0;
    position: relative;
    margin-bottom: ${AppTheme.spacing[16]};
`;

const SelectorContainer = styled(FrostedGlass)`
    padding: ${AppTheme.spacing[4]};
    display: flex;
    gap: ${AppTheme.spacing[4]};
    position: relative;
    border-radius: ${AppTheme.radius.pill};
    min-width: 400px;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.05);
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
    
    &:hover {
        color: ${AppTheme.colors.light.textPrimary};
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

type View = 'skills' | 'personal' | 'work';

interface ViewSelectorProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
    currentView,
    onViewChange,
}) => {
    // Calculate the position based on the current view
    const getPosition = (view: View) => {
        switch (view) {
            case 'skills':
                return { x: 4 };
            case 'personal':
                return { x: 133 };
            case 'work':
                return { x: 266 };
            default:
                return { x: 4 };
        }
    };

    const pillSpring = useSpring({
        from: getPosition(currentView),
        to: getPosition(currentView),
        config: {
            mass: 1,
            tension: 400,
            friction: 26,
        },
    });

    // Transform the spring value into CSS properties
    const pillStyle = {
        left: pillSpring.x.to(x => `${x}px`),
        width: '125px',
    };

    return (
        <Container>
            <SelectorContainer>
                <Pill style={pillStyle} />
                <Option
                    $isActive={currentView === 'skills'}
                    onClick={() => onViewChange('skills')}
                >
                    Skills
                </Option>
                <Option
                    $isActive={currentView === 'personal'}
                    onClick={() => onViewChange('personal')}
                >
                    Personal
                </Option>
                <Option
                    $isActive={currentView === 'work'}
                    onClick={() => onViewChange('work')}
                >
                    Work
                </Option>
            </SelectorContainer>
        </Container>
    );
}; 