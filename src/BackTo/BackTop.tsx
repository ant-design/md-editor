import React, { forwardRef, useCallback } from 'react';
import scrollTo from '../utils/scrollTo';
import {
  ScrollVisibleButton,
  ScrollVisibleButtonProps,
  ScrollVisibleButtonRef,
} from './ScrollVisibleButton';
import { TopIcon } from './icons/TopIcon';

export interface BackTopProps extends ScrollVisibleButtonProps {
  /**
   * 滚动到顶部的持续时间
   * @default 450
   */
  duration?: number;
}

export const BackTop = forwardRef<ScrollVisibleButtonRef, BackTopProps>(
  (props, ref) => {
    const {
      duration = 450,
      onClick,
      shouldVisible: propsShouldVisible,
      ...rest
    } = props;

    const shouldVisible = useCallback<
      (scrollTop: number, container: HTMLElement | Window) => boolean
    >(
      (scrollTop, container) => {
        if (typeof propsShouldVisible === 'function') {
          return propsShouldVisible(scrollTop, container);
        }
        return scrollTop >= (propsShouldVisible ?? 400);
      },
      [propsShouldVisible],
    );

    const scrollToTop: ScrollVisibleButtonProps['onClick'] = (e, container) => {
      scrollTo(0, { container, duration });
      onClick?.(e, container);
    };

    return (
      <ScrollVisibleButton
        {...rest}
        ref={ref}
        shouldVisible={shouldVisible}
        onClick={scrollToTop}
      >
        <TopIcon />
      </ScrollVisibleButton>
    );
  },
);
