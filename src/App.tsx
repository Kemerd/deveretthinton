import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout/Layout';
import { SkillGrid, professionalSkills } from './components/SkillGrid/SkillGrid';
import { PersonalGrid, personalExperience } from './components/PersonalGrid/PersonalGrid';
import { WorkGrid, workExperience } from './components/WorkGrid/WorkGrid';
import { AppsGrid, apps } from './components/AppsGrid/AppsGrid';
import { ViewSelector } from './components/ViewSelector/ViewSelector';
import GlobalStyles from './styles/GlobalStyles';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';
import { useImagePreloader } from './hooks/useImagePreloader';
import { extractFirstImagesFromGridItems } from './utils/imageCache';

const AnimatedContainer = styled(animated.div)`
    /* Remove absolute positioning to allow natural document flow */
    width: 100%;
    will-change: transform, opacity;
`;

const GridContainer = styled.div`
    /* Remove relative positioning and fixed heights */
    width: 100%;
`;

const ContentWrapper = styled.div`
    /* Remove all overflow and positioning constraints */
    width: 100%;
`;

type View = 'skills' | 'personal' | 'work' | 'apps';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('skills');

  // Build intelligent preloading strategy based on view priority
  const imagesToPreload = useMemo(() => {
    // Extract first image from each item for faster initial load
    const skillsFirstImages = extractFirstImagesFromGridItems(professionalSkills);
    const personalFirstImages = extractFirstImagesFromGridItems(personalExperience);
    const workFirstImages = extractFirstImagesFromGridItems(workExperience);
    const appsFirstImages = extractFirstImagesFromGridItems(apps);

    return [
      // Priority 1: Current view (skills) - load immediately
      ...skillsFirstImages.map(url => ({ url, priority: 'high' as const })),

      // Priority 2: Other views - load in background
      ...personalFirstImages.map(url => ({ url, priority: 'medium' as const })),
      ...workFirstImages.map(url => ({ url, priority: 'medium' as const })),
      ...appsFirstImages.map(url => ({ url, priority: 'medium' as const })),
    ];
  }, []);

  // Start preloading images with intelligent priority
  const preloadedImages = useImagePreloader(imagesToPreload);

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
                {item === 'apps' && <AppsGrid />}
              </AnimatedContainer>
            ))}
          </GridContainer>
        </ContentWrapper>
      </Layout>
    </>
  );
};

export default App; 