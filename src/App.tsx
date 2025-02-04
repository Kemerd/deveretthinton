import React from 'react';
import { Layout } from './components/Layout/Layout';
import { SkillGrid } from './components/SkillGrid/SkillGrid';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Layout>
        <SkillGrid />
      </Layout>
    </>
  );
};

export default App; 