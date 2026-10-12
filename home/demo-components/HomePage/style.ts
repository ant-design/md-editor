import styled from 'styled-components';

export const PageWrapper = styled.div`
  --home-section-space: clamp(64px, 7vw, 112px);
  --home-section-title-size: clamp(30px, 4vw, 48px);
  width: 100%;
  min-height: 100vh;
  background: #fff;
  position: relative;

  [data-prefers-color='dark'] & {
    background: #0a0c10;
  }
`;

export const SectionLoading = styled.div`
  padding: var(--home-section-space, 96px) 24px;
  color: #666;
  text-align: center;

  button {
    padding: 10px 20px;
    min-height: 44px;
    border: 1px solid #d8dce2;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid #3066fd;
      outline-offset: 2px;
    }
  }
`;

/**
 * 带左右分隔线的容器组件
 * 每个模块单独添加分隔线
 */
export const SectionWithDividers = styled.div`
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: max(24px, calc((100% - 1248px) / 2));
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(44, 62, 93, 0.07);
    z-index: 2;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: max(24px, calc((100% - 1248px) / 2));
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(44, 62, 93, 0.07);
    z-index: 1;
    pointer-events: none;
  }

  [data-prefers-color='dark'] & {
    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

/**
 * 带左右边框的容器组件
 * 用于 SupportDesign 组件，通过覆盖层的左右 border 形成边界线效果
 */
export const SectionWithBorders = styled.div<{ $backgroundColor?: string }>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 100%;
  background: ${(props) => props.$backgroundColor ?? 'transparent'};

  /* 覆盖层外层容器：动态匹配 ScrollableContent 的宽度（包含 16px padding） */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    bottom: 0;
    min-width: 0;
    width: calc(var(--scrollable-content-width, 100%) - 32px);
    max-width: min(1440px, calc(100% - 32px));
    border-left: 1px solid rgba(44, 62, 93, 0.07);
    border-right: 1px solid rgba(44, 62, 93, 0.07);
    pointer-events: none;
    z-index: 2;
  }

  [data-prefers-color='dark'] & {
    background: ${(props) =>
      props.$backgroundColor ? '#101319' : 'transparent'};

    &::before {
      border-left-color: rgba(255, 255, 255, 0.08);
      border-right-color: rgba(255, 255, 255, 0.08);
    }
  }
`;
