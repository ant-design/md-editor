import { styled } from 'styled-components';

export const SectionWrapper = styled.section`
  width: calc(100% - 32px);
  padding: 32px 0;
  background: #121319;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
  border-radius: 40px;

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    margin-inline: 12px;
    border-radius: 24px;
  }
`;

export const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 80px;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

export const DiamondIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  position: relative;

  svg {
    width: 25px;
    height: 24.28px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 56px;
    background: #3066fd;
    margin-top: 10px;
  }
`;

export const ShowroomSubtitle = styled.div`
  text-align: center;
  color: #fff;
  font-family: 'PingFang SC';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 100px;
  margin-bottom: 12px;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-top: 72px;
  }
`;

export const ShowroomTitle = styled.div`
  text-align: center;
  margin-bottom: 48px;
  color: #fff;
  font-family: 'PingFang SC';
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 32px;
  }
`;

export const ShowroomTitleHighlight = styled.span`
  background: linear-gradient(96deg, #fff 4%, #3066fd 66%, #5666ee 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-inline-start: 12px;
`;

export const CarouselContainer = styled.div`
  --showroom-card-width: 500px;
  --showroom-card-height: 300px;
  --showroom-card-gap: 64px;

  position: relative;
  width: 100%;
  height: calc(var(--showroom-card-height) + 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  contain: layout;

  @media (max-width: 768px) {
    --showroom-card-width: min(500px, calc(100vw - 104px));
    --showroom-card-height: calc(var(--showroom-card-width) * 0.6);
    --showroom-card-gap: 20px;
  }
`;

export const CarouselCard = styled.button`
  position: absolute;
  left: 50%;
  width: var(--showroom-card-width);
  height: var(--showroom-card-height);
  padding: 0;
  border: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transform-origin: center;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 240ms ease;

  &[aria-pressed='true'] {
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  }

  &:focus-visible {
    outline: 3px solid #7ba0ff;
    outline-offset: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CarouselNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
`;

export const CarouselNavigationButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transition:
      transform 180ms ease,
      background-color 180ms ease;
  }

  &[aria-current='true']::after {
    transform: scale(1.4);
    background: #fff;
  }

  &:hover::after {
    background: #fff;
  }

  &:focus-visible {
    outline: 2px solid #7ba0ff;
    outline-offset: -2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;

export const ShowroomCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
`;

export const CornerBracket = styled.div<{
  $position: 'top-left' | 'bottom-right' | 'bottom-left' | 'top-right';
}>`
  position: absolute;
  z-index: 11;
  pointer-events: none;
  width: 26px;
  height: 26px;
  ${(props) => {
    const isTop = props.$position.startsWith('top');
    const isLeft = props.$position.endsWith('left');
    return `
      top: calc(50% ${isTop ? '-' : '+'} var(--showroom-card-height) / 2 ${isTop ? '- 24px' : '- 2px'});
      left: calc(50% ${isLeft ? '-' : '+'} var(--showroom-card-width) / 2 ${isLeft ? '- 24px' : '- 2px'});
    `;
  }}

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const ComingSoonTitle = styled.div`
  color: #fff;
  font-family: 'PingFang SC';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-top: 16px;
`;

export const ComingSoonText = styled.div`
  color: #fff;

  font-family: 'PingFang SC';
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;
