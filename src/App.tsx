import React, { useState, useMemo, useEffect } from 'react';
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

  // Build intelligent preloading strategy based on current view
  // This ensures images 2 and 3 are preloaded BEFORE they're needed
  const imagesToPreload = useMemo(() => {
    // Helper to get all images from grid items
    const getAllImages = (items: Array<{ images: string[] }>) =>
      items.flatMap(item => item.images);

    // Get all images for each section
    const skillsImages = getAllImages(professionalSkills);
    const personalImages = getAllImages(personalExperience);
    const workImages = getAllImages(workExperience);
    const appsImages = getAllImages(apps);

    // Map of which images to prioritize based on current view
    const viewPriorityMap: Record<View, string[]> = {
      skills: skillsImages,
      personal: personalImages,
      work: workImages,
      apps: appsImages,
    };

    // Get current view images - all 3 images for each item
    const currentViewImages = viewPriorityMap[currentView];

    // Get first images from other views for quick tab switching
    const otherViewsFirstImages = [
      ...extractFirstImagesFromGridItems(currentView !== 'skills' ? professionalSkills : []),
      ...extractFirstImagesFromGridItems(currentView !== 'personal' ? personalExperience : []),
      ...extractFirstImagesFromGridItems(currentView !== 'work' ? workExperience : []),
      ...extractFirstImagesFromGridItems(currentView !== 'apps' ? apps : []),
    ];

    return [
      // PRIORITY 1: All images (1, 2, 3) from current view - load immediately
      // This prevents flash when cycling through images
      ...currentViewImages.map(url => ({ url, priority: 'high' as const })),

      // PRIORITY 2: First images from other views - preload for quick tab switch
      ...otherViewsFirstImages.map(url => ({ url, priority: 'medium' as const })),
    ];
  }, [currentView]);

  // Start preloading images with intelligent priority
  // This hook will automatically handle caching and avoid duplicate loads
  useImagePreloader(imagesToPreload);

  // When view changes, immediately preload ALL images (2+3) for the new view
  // This happens in the background while the transition animation runs
  useEffect(() => {
    // Helper to get all images from grid items
    const getAllImages = (items: Array<{ images: string[] }>) =>
      items.flatMap(item => item.images);

    // Determine which images to aggressively preload based on new view
    const viewImages: string[] = (() => {
      switch (currentView) {
        case 'skills':
          return getAllImages(professionalSkills);
        case 'personal':
          return getAllImages(personalExperience);
        case 'work':
          return getAllImages(workExperience);
        case 'apps':
          return getAllImages(apps);
      }
    })();

    // Aggressively preload images 2 and 3 for this view
    // Using native Image() for immediate, synchronous preloading
    viewImages.forEach((url) => {
      // Preload all images, but prioritize images 2 and 3 (indices 1 and 2 within each item)
      const img = new Image();
      img.src = url;
    });
  }, [currentView]);

  // Background preloader: After page loads and animations settle,
  // slowly preload EVERY image from the entire site with low priority
  // This ensures everything is cached for buttery smooth navigation
  useEffect(() => {
    // Wait 500ms for initial animations to complete
    const timer = setTimeout(() => {
      // Helper to get all images from grid items
      const getAllImages = (items: Array<{ images: string[] }>) =>
        items.flatMap(item => item.images);

      // Gather ALL images from every section of the site
      const allSiteImages = [
        ...getAllImages(professionalSkills),
        ...getAllImages(personalExperience),
        ...getAllImages(workExperience),
        ...getAllImages(apps),
      ];

      // Remove duplicates (in case same image appears multiple times)
      const uniqueImages = Array.from(new Set(allSiteImages));

      // Slowly preload each image with low priority to avoid blocking
      // Using requestIdleCallback for truly background loading that won't affect performance
      uniqueImages.forEach((url, index) => {
        // Stagger the loading slightly to avoid network congestion
        const staggerDelay = index * 50; // 50ms between each image

        setTimeout(() => {
          if ('requestIdleCallback' in window) {
            // Use idle time to preload when browser is not busy
            requestIdleCallback(() => {
              const img = new Image();
              img.loading = 'lazy'; // Use native lazy loading for low priority
              img.src = url;
            });
          } else {
            // Fallback for browsers without requestIdleCallback
            const img = new Image();
            img.loading = 'lazy';
            img.src = url;
          }
        }, staggerDelay);
      });
    }, 500); // Initial delay to let page animations settle

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

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