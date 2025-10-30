import React, { forwardRef } from 'react';
import scrollTo from '../Utils/scrollTo';
import {
  ScrollVisibleButton,
  ScrollVisibleButtonProps,
  ScrollVisibleButtonRef,
} from './ScrollVisibleButton';
import { TopIcon } from './icons/TopIcon';

const DEFAULT_DURATION = 450;
const DEFAULT_VISIBLE_THRESHOLD = 400;

const getShouldVisible = (
  propsShouldVisible: BackTopProps['shouldVisible'],
) => {
  return (scrollTop: number, container: HTMLElement | Window): boolean => {
    if (typeof propsShouldVisible === 'function') {
      return propsShouldVisible(scrollTop, container);
    }
    return scrollTop >= (propsShouldVisible ?? DEFAULT_VISIBLE_THRESHOLD);
  };
};

/**
 * BackTop 组件属性
 */
export interface BackTopProps extends ScrollVisibleButtonProps {
  /** 滚动到顶部的持续时间 @default 450 */
  duration?: number;
}

/**
 * BackTop 组件
 *
 * 返回顶部按钮，点击后平滑滚动到页面顶部
 *
 * @example
 * ```tsx
 * <BackTop duration={300} />
 * ```
 */
export const BackTop = forwardRef<ScrollVisibleButtonRef, BackTopProps>(
  (props, ref) => {
    const {
      duration = DEFAULT_DURATION,
      onClick,
      shouldVisible: propsShouldVisible,
      ...rest
    } = props;

    const shouldVisible = getShouldVisible(propsShouldVisible);

    const handleClick: ScrollVisibleButtonProps['onClick'] = (e, container) => {
      scrollTo(0, { container, duration });
      onClick?.(e, container);
    };

    return (
      <ScrollVisibleButton
        {...rest}
        ref={ref}
        shouldVisible={shouldVisible}
        onClick={handleClick}
      >
        <TopIcon />
      </ScrollVisibleButton>
    );
  },
);
