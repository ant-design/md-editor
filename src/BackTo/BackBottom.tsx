import React, { forwardRef, useCallback } from 'react';
import { getScrollRailHeight } from '../Utils/getScroll';
import scrollTo from '../Utils/scrollTo';
import {
  ScrollVisibleButton,
  ScrollVisibleButtonProps,
  ScrollVisibleButtonRef,
} from './ScrollVisibleButton';
import { BottomIcon } from './icons/BottomIcon';

export interface BackBottomProps extends ScrollVisibleButtonProps {
  /**
   * 滚动到底部的持续时间
   * @default 450
   */
  duration?: number;
}

export const BackBottom = forwardRef<ScrollVisibleButtonRef, BackBottomProps>(
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
        const scrollRailHeight = getScrollRailHeight(container);
        return scrollRailHeight - scrollTop >= (propsShouldVisible ?? 400);
      },
      [propsShouldVisible],
    );

    const scrollToBottom: ScrollVisibleButtonProps['onClick'] = (
      e,
      container,
    ) => {
      const scrollRailHeight = getScrollRailHeight(container);
      scrollTo(scrollRailHeight, { container, duration });
      onClick?.(e, container);
    };

    return (
      <ScrollVisibleButton
        {...rest}
        ref={ref}
        shouldVisible={shouldVisible}
        onClick={scrollToBottom}
      >
        <BottomIcon />
      </ScrollVisibleButton>
    );
  },
);
