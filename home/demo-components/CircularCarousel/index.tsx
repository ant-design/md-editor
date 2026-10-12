import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useAnimationVisibility } from '../../hooks/useAnimationVisibility';
import { useSiteI18n } from '../../i18n';
import { CarouselCard } from './components/CarouselCard';
import { CarouselWheel } from './components/CarouselWheel';
import { useFeatures } from './data';
import {
  ActiveIndicatorWrapper,
  BackgroundGradient,
  CarouselContainer,
  CarouselWheelContainer,
  NavButton,
  NavigationMenu,
  StickyContainer,
} from './style';

// Helper to get color for the active state
const getFeatureColor = (id: string) => {
  switch (id) {
    case 'intro':
      return '40, 118, 255'; // 偏蓝色
    case '01':
      return '91, 59, 159';
    case '02':
      return '0, 130, 133';
    case '03':
      return '0, 179, 0';
    case '04':
      return '0, 92, 157';
    case '05':
      return '204, 153, 0';
    default:
      return '255, 255, 255';
  }
};

const CircularCarousel: React.FC<{
  onTabChange?: (id: string) => void;
}> = ({ onTabChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [settledIndex, setSettledIndex] = useState<number | undefined>(0);
  const { reducedMotion } = useAnimationVisibility(containerRef);
  const { locale } = useSiteI18n();
  const FEATURES = useFeatures();

  // Motion value for the current index - used for smooth transitions
  const smoothIndex = useMotionValue(0);

  // Animate the smoothIndex whenever activeIndex changes
  useEffect(() => {
    if (reducedMotion) {
      smoothIndex.set(activeIndex);
      setSettledIndex(activeIndex);
      return;
    }
    const controls = animate(smoothIndex, activeIndex, {
      duration: 0.36,
      ease: [0.2, 0.8, 0.2, 1],
      onComplete: () => setSettledIndex(activeIndex),
    });
    return controls.stop;
  }, [activeIndex, smoothIndex, reducedMotion]);

  const handleMenuClick = (index: number) => {
    if (index === activeIndex) return;
    setSettledIndex(undefined);
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(FEATURES[index].id);
    }
  };

  return (
    <CarouselContainer ref={containerRef} data-home-carousel>
      <StickyContainer>
        {/* Navigation Menu */}
        <NavigationMenu
          role="tablist"
          aria-label={locale === 'en-US' ? 'Design principles' : '设计原则'}
        >
          {FEATURES.map((feature, idx) => {
            const isActive = idx === activeIndex;
            return (
              <NavButton
                key={feature.id}
                id={`feature-tab-${feature.id}`}
                ref={(element) => {
                  tabRefs.current[idx] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`feature-panel-${feature.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleMenuClick(idx)}
                onKeyDown={(event) => {
                  let nextIndex: number;
                  if (event.key === 'ArrowRight')
                    nextIndex = (idx + 1) % FEATURES.length;
                  else if (event.key === 'ArrowLeft')
                    nextIndex = (idx - 1 + FEATURES.length) % FEATURES.length;
                  else if (event.key === 'Home') nextIndex = 0;
                  else if (event.key === 'End') nextIndex = FEATURES.length - 1;
                  else return;
                  event.preventDefault();
                  handleMenuClick(nextIndex);
                  tabRefs.current[nextIndex]?.focus();
                }}
                $isActive={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId={reducedMotion ? undefined : 'active-cursor'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      margin: '-4px',
                      borderRadius: '8px',
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.2,
                    }}
                  >
                    <ActiveIndicatorWrapper>
                      {/* Top Left */}
                      <svg
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '8px',
                          height: '8px',
                          color: '#14161C',
                        }}
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 9V1H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      </svg>
                      {/* Top Right */}
                      <svg
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '8px',
                          height: '8px',
                          color: '#14161C',
                        }}
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M9 9V1H1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      </svg>
                      {/* Bottom Left */}
                      <svg
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '8px',
                          height: '8px',
                          color: '#14161C',
                        }}
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 1V9H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      </svg>
                      {/* Bottom Right */}
                      <svg
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '8px',
                          height: '8px',
                          color: '#14161C',
                        }}
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M9 1V9H1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      </svg>
                    </ActiveIndicatorWrapper>
                  </motion.div>
                )}
                <span style={{ position: 'relative', zIndex: 10 }}>
                  {feature.label}
                </span>
              </NavButton>
            );
          })}
        </NavigationMenu>

        {/* Carousel Wheel */}
        <CarouselWheelContainer>
          <CarouselWheel smoothIndex={smoothIndex} />
          {FEATURES.map((feature, index) => (
            <CarouselCard
              key={feature.id}
              feature={feature}
              index={index}
              smoothIndex={smoothIndex}
              isActive={index === activeIndex}
              onCardClick={handleMenuClick}
              themeColor={getFeatureColor(feature.id)}
              reducedMotion={!!reducedMotion}
              isSettled={settledIndex === activeIndex}
            />
          ))}
        </CarouselWheelContainer>

        {/* Background Radial Gradient */}
        <BackgroundGradient />
      </StickyContainer>
    </CarouselContainer>
  );
};

export default CircularCarousel;
