import { motion } from 'framer-motion';
import { styled } from 'styled-components';

export const CarouselContainer = styled.div`
  position: relative;
  --carousel-card-height: 660px;
  background: white;
  padding-block: 32px 48px;
  overflow: hidden;

  @media (max-width: 767px) {
    padding-block: 24px 32px;
  }
`;

export const StickyContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: rgba(249, 250, 251, 0.3);
  /* 确保整个容器在分隔线之上 */
  z-index: 10;
  isolation: isolate;
`;

export const NavigationMenu = styled.div`
  position: relative;
  z-index: 110;
  width: 100%;
  max-width: 1280px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

export const NavButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 44px;

  @media (min-width: 768px) {
    font-size: 17px;
  }

  color: ${(props) =>
    props.$isActive ? '#14161C' : 'rgba(84, 93, 109, 0.65)'};

  &:hover {
    color: ${(props) => (props.$isActive ? '#14161C' : '#343a45')};
  }

  &:focus-visible {
    outline: 2px solid #2876ff;
    outline-offset: 4px;
  }

  @media (max-width: 767px) {
    padding-inline: 12px;
    font-size: 14px;
  }
`;

export const ActiveIndicatorWrapper = styled.div`
  position: absolute;
  inset: 0;
  margin: -4px;
  border-radius: 8px;
`;

export const CarouselWheelContainer = styled.div`
  position: relative;
  width: 100%;
  /* 固定高度，基于卡片高度 + 一些额外空间 */
  height: calc(var(--carousel-card-height) + 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止被压缩 */
  /* 创建新的堆叠上下文，确保卡片在分隔线之上 */
  z-index: 10;
  isolation: isolate;
`;

export const CardMotionContainer = styled(motion.div)`
  position: absolute;
  width: min(406px, calc(100vw - 48px));
  height: var(--carousel-card-height);
  /* 确保卡片有基础 z-index，动态 z-index 会覆盖这个值 */
  z-index: 10;
`;

export const CardWrapper = styled.div<{ $isActive?: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: ${(props) => (props.$isActive ? 'default' : 'pointer')};
  perspective: 1000px;

  /* 确保按钮等交互元素可以接收点击事件 */
  button,
  a,
  [role='button'] {
    position: relative;
    z-index: 100;
    pointer-events: auto;
  }
`;

export const CardFlipContainer = styled.div<{ $flipped?: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.36s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;
  transform: rotateY(${(props) => (props.$flipped ? 180 : 0)}deg);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const FlipButton = styled.button<{ $flipped: boolean }>`
  position: absolute !important;
  inset-block-start: 22px;
  inset-inline-end: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  color: ${(props) => (props.$flipped ? '#343a45' : 'white')};
  background: ${(props) =>
    props.$flipped ? 'rgba(80, 92, 113, 0.08)' : 'rgba(255, 255, 255, 0.12)'};
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color 0.16s;

  &:hover {
    background: ${(props) =>
      props.$flipped ? 'rgba(80, 92, 113, 0.14)' : 'rgba(255, 255, 255, 0.22)'};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
`;

export const BackgroundGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, #f3f4f6, transparent);
  z-index: -10;
  pointer-events: none;
`;

export const WheelContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
`;

export const CanvasWrapper = styled.canvas``;
