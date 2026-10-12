import React from 'react';
import { SiteLanguageProvider } from '../../i18n';
import CircularCarousel from '../CircularCarousel';
import Hero from '../Hero';
import DeferredSection from './DeferredSection';
import { PageWrapper, SectionWithBorders, SectionWithDividers } from './style';

const loadSupportDesign = () => import('../SupportDesign');
const loadEnhanceDesign = () => import('../EnhanceDesign');
const loadShowroom = () => import('../Showroom');

const HomePage: React.FC = () => {
  return (
    <SiteLanguageProvider>
      <PageWrapper>
        <SectionWithDividers>
          <Hero />
        </SectionWithDividers>
        <SectionWithDividers>
          <CircularCarousel />
        </SectionWithDividers>
        <SectionWithBorders
          $backgroundColor="#f7f8f9"
          data-section-with-borders
        >
          <DeferredSection
            load={loadSupportDesign}
            minHeight={1878}
            name="support"
          />
        </SectionWithBorders>
        <SectionWithBorders data-section-with-borders>
          <DeferredSection
            load={loadEnhanceDesign}
            minHeight={1237}
            name="enhance"
          />
        </SectionWithBorders>
        <SectionWithDividers>
          <DeferredSection
            load={loadShowroom}
            minHeight={788}
            name="showroom"
          />
        </SectionWithDividers>
      </PageWrapper>
    </SiteLanguageProvider>
  );
};

export default HomePage;
