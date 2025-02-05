import React, { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { SkillGrid } from './components/SkillGrid/SkillGrid';
import { PersonalGrid } from './components/PersonalGrid/PersonalGrid';
import { WorkGrid } from './components/WorkGrid/WorkGrid';
import { ViewSelector } from './components/ViewSelector/ViewSelector';
import GlobalStyles from './styles/GlobalStyles';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

const AnimatedContainer = styled(animated.div)`
    position: absolute;
    width: 100%;
    will-change: transform, opacity;
    left: 0;
`;

const GridContainer = styled.div`
    position: relative;
    width: 100%;
    min-height: 800px;
    overflow: hidden;
`;

const ContentWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    position: relative;
`;

type View = 'skills' | 'personal' | 'work';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('skills');

  const transitions = useTransition(currentView, {
    from: {
      opacity: 0,
      transform: 'translate3d(50px,0,0)',
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px,0,0)',
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(-50px,0,0)',
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 26,
    },
    exitBeforeEnter: true,
  });

  return (
    <>
      <GlobalStyles />
      <Layout>
        <ContentWrapper>
          <ViewSelector
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <GridContainer>
            {transitions((style, item) => (
              <AnimatedContainer style={style}>
                {item === 'skills' && <SkillGrid />}
                {item === 'personal' && <PersonalGrid />}
                {item === 'work' && <WorkGrid />}
              </AnimatedContainer>
            ))}
          </GridContainer>
        </ContentWrapper>
      </Layout>
    </>
  );
};

export default App; 