import { type MotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useSiteI18n } from '../../../i18n';
import {
  CardFlipContainer,
  CardMotionContainer,
  CardWrapper,
  FlipButton,
} from '../style';
import { CardAnimationContext } from './CardAnimationContext';
import { Rotate3DIcon } from './Rotate3DIcon';
import { ActiveCard, BacksideCardState, InactiveCard } from './cardStates';
import { CornerMarks } from './cardStates/CornerMarks';
import { FeatureItem } from './cardStates/types';

const ANGLE_STEP = 15;

interface CarouselCardProps {
  feature: FeatureItem;
  index: number;
  smoothIndex: MotionValue<number>;
  isActive: boolean;
  onCardClick: (index: number) => void;
  themeColor: string;
  reducedMotion?: boolean;
  isSettled?: boolean;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  feature,
  index,
  smoothIndex,
  isActive,
  onCardClick,
  themeColor,
  reducedMotion = false,
  isSettled = true,
}) => {
  const { locale } = useSiteI18n();
  const [flipped, setFlipped] = useState(false);
  const [backsideMounted, setBacksideMounted] = useState(false);
  const backActive = isActive && flipped;
  const animationState = useMemo(
    () => ({
      frontActive: isActive && isSettled && !backActive,
      backActive,
      reducedMotion,
    }),
    [isActive, isSettled, backActive, reducedMotion],
  );

  useEffect(() => {
    if (backActive) setBacksideMounted(true);
  }, [backActive]);

  useEffect(() => {
    if (!isActive) setFlipped(false);
  }, [isActive]);

  // Calculate relative position based on the smooth index
  const relativeIndex = useTransform(smoothIndex, (v: number) => index - v);

  // Calculate rotation: index * step
  const rotate = useTransform(relativeIndex, (v) => v * ANGLE_STEP);

  // Calculate X offset: move cards apart horizontally
  const x = useTransform(relativeIndex, (v) => v * 350);

  // Calculate Y offset: drop down as they move away from center
  const y = useTransform(relativeIndex, (v) => Math.abs(v) * 60);

  const scale = useTransform(relativeIndex, (v) => {
    const dist = Math.abs(v);
    return Math.max(0.8, 1 - dist * 0.1);
  });

  const zIndex = useTransform(relativeIndex, (v) => {
    return 100 - Math.round(Math.abs(v) * 10);
  });

  return (
    <CardMotionContainer
      id={`feature-panel-${feature.id}`}
      role={isActive ? 'tabpanel' : undefined}
      aria-labelledby={`feature-tab-${feature.id}`}
      aria-hidden={!isActive}
      data-carousel-card={feature.id}
      data-active={isActive}
      data-flipped={backActive}
      style={{
        rotate,
        x,
        y,
        opacity: 1,
        scale,
        zIndex,
        transformOrigin: '50% 1500px',
      }}
      onClick={(e) => {
        // 如果点击的是按钮或其他交互元素，不阻止事件
        const target = e.target as HTMLElement;
        if (
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]')
        ) {
          return;
        }
        if (!isActive) {
          e.stopPropagation();
          onCardClick(index);
        }
      }}
    >
      {/* 3D Perspective Container */}
      <CardWrapper
        $isActive={isActive}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && backActive) {
            setFlipped(false);
            event.currentTarget
              .querySelector<HTMLButtonElement>('button[aria-pressed]')
              ?.focus();
          }
        }}
      >
        <CardAnimationContext.Provider value={animationState}>
          {/* Flipping Container */}
          <CardFlipContainer $flipped={backActive}>
            {/* Corner Plus Marks - Now inside flip container to flip with card */}
            <CornerMarks />

            {/* Front Face - Render different state based on isActive */}
            {isActive ? (
              <ActiveCard
                feature={feature}
                index={index}
                smoothIndex={smoothIndex}
                themeColor={themeColor}
              />
            ) : (
              <InactiveCard feature={feature} themeColor={themeColor} />
            )}

            {/* Back Face */}
            {(backsideMounted || backActive) && (
              <BacksideCardState feature={feature} themeColor={themeColor} />
            )}
          </CardFlipContainer>
          {isActive && (
            <FlipButton
              type="button"
              $flipped={backActive}
              aria-label={
                locale === 'en-US'
                  ? backActive
                    ? 'Show card summary'
                    : 'Show card details'
                  : backActive
                    ? '返回卡片概览'
                    : '查看卡片详情'
              }
              aria-pressed={backActive}
              onClick={() => setFlipped((previous) => !previous)}
            >
              <Rotate3DIcon size={24} color="currentColor" />
            </FlipButton>
          )}
        </CardAnimationContext.Provider>
      </CardWrapper>
    </CardMotionContainer>
  );
};
