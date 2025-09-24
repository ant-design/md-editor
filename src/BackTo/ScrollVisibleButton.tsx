import { ConfigProvider, Tooltip, TooltipProps } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { isObject } from 'lodash';
import React, {
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useImperativeHandle,
} from 'react';
import {
  useScrollVisible,
  UseScrollVisibleProps,
} from './hooks/useScrollVisible';
import { prefixCls, useStyle } from './style';

export interface ScrollVisibleButtonProps
  extends Omit<React.DOMAttributes<HTMLButtonElement>, 'onClick'> {
  className?: string;
  style?: React.CSSProperties;
  tooltip?: React.ReactNode | TooltipProps;
  /**
   * 滚动到底部的目标元素
   */
  target?: () => HTMLElement | Window;
  /**
   * 按钮是否显示，默认为滚动到底部的可见高度，也可以传入一个函数，根据滚动位置判断是否显示
   * @default 400
   */
  shouldVisible?: number | UseScrollVisibleProps['shouldVisible'];
  /**
   * 点击按钮的回调
   */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    container: HTMLElement | Window,
  ) => void;
}

export type ScrollVisibleButtonRef = {
  nativeElement: HTMLButtonElement | null;
};

export const ScrollVisibleButton = forwardRef<
  ScrollVisibleButtonRef,
  ScrollVisibleButtonProps
>(
  (
    {
      className,
      style,
      shouldVisible: propsShouldVisible = 400,
      target,
      onClick,
      tooltip,
      children,
      ...rest
    },
    ref,
  ) => {
    const context = useContext(ConfigProvider.ConfigContext);
    const baseCls = context?.getPrefixCls(prefixCls);
    const { wrapSSR, hashId } = useStyle(baseCls);

    const internalRef =
      React.useRef<ScrollVisibleButtonRef['nativeElement']>(null);

    useImperativeHandle(ref, () => ({
      nativeElement: internalRef.current,
    }));

    const getTarget = target || (() => window);

    const shouldVisible = useCallback<UseScrollVisibleProps['shouldVisible']>(
      (scrollTop, container) => {
        if (typeof propsShouldVisible === 'function') {
          return propsShouldVisible(scrollTop, container);
        }
        return scrollTop >= propsShouldVisible;
      },
      [propsShouldVisible],
    );

    const { visible, currentContainer } = useScrollVisible({
      target: getTarget,
      shouldVisible,
    });

    let buttonNode = (
      <button
        ref={internalRef}
        className={classNames(baseCls, className, hashId)}
        style={style}
        type="button"
        onClick={(e) => {
          onClick?.(e, currentContainer.current);
        }}
        {...rest}
      >
        <div className={`${baseCls}-content ${hashId}`}>{children}</div>
      </button>
    );

    if (tooltip) {
      const tooltipProps =
        isObject(tooltip) && !isValidElement(tooltip)
          ? tooltip
          : { title: tooltip };
      buttonNode = <Tooltip {...tooltipProps}>{buttonNode}</Tooltip>;
    }

    return wrapSSR(
      <AnimatePresence>
        {visible ? (
          <motion.div exit={{ opacity: 0 }}>{buttonNode}</motion.div>
        ) : null}
      </AnimatePresence>,
    );
  },
);
