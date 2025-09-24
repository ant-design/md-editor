import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useCallback } from 'react';
import { DownArrowIcon } from '../../icons/DownArrowIcon';
import { UpArrowIcon } from '../../icons/UpArrowIcon';
import { useStyle } from './style';

export interface TopOperationProps {
  /**
   * 第一个按钮的文本
   */
  firstButtonText?: string;

  /**
   * 第二个按钮的文本
   */
  secondButtonText?: string;

  /**
   * 第一个按钮点击回调
   */
  onFirstButtonClick?: () => void;

  /**
   * 第二个按钮点击回调
   */
  onSecondButtonClick?: () => void;

  /**
   * 滚动容器选择器或元素引用，用于监听滚动事件
   */
  scrollContainer?: string | HTMLElement | (() => HTMLElement | null);

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * TopOperation 组件 - 顶部操作栏组件
 *
 * 该组件提供一个水平布局的操作栏，包含中间的两个操作按钮和右侧的上下箭头控制按钮。
 * 适用于需要在输入区域顶部提供快捷操作的场景。
 *
 * @component
 * @description 顶部操作栏组件，包含中间按钮和右侧箭头控制
 * @param {TopOperationProps} props - 组件属性
 * @param {string} [props.firstButtonText="次按钮"] - 第一个按钮的文本
 * @param {string} [props.secondButtonText="主按钮"] - 第二个按钮的文本
 * @param {() => void} [props.onFirstButtonClick] - 第一个按钮点击回调
 * @param {() => void} [props.onSecondButtonClick] - 第二个按钮点击回调
 * @param {string | HTMLElement | (() => HTMLElement | null)} [props.scrollContainer] - 滚动容器选择器或元素引用
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义类名
 *
 * @example
 * ```tsx
 * <TopOperation
 *   firstButtonText="保存草稿"
 *   secondButtonText="发送消息"
 *   onFirstButtonClick={() => console.log('保存草稿')}
 *   onSecondButtonClick={() => console.log('发送消息')}
 *   scrollContainer=".chat-messages-container"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的顶部操作栏组件
 *
 * @remarks
 * - 使用 flexbox 布局，按钮居中显示
 * - 支持自定义按钮文本和点击事件
 * - 内部自动检测滚动位置，根据滚动状态智能显示箭头：
 *   • 在顶部时：只显示向下箭头
 *   • 在底部时：只显示向上箭头
 *   • 在中间时：同时显示向上和向下箭头
 * - 箭头功能完全内部实现：点击向上箭头自动滚动到顶部，点击向下箭头自动滚动到底部
 * - 响应式设计，适配不同屏幕尺寸
 * - 提供悬停和点击交互效果
 */
const TopOperation: React.FC<TopOperationProps> = ({
  firstButtonText = '次按钮',
  secondButtonText = '主按钮',
  onFirstButtonClick,
  onSecondButtonClick,
  scrollContainer,
  style,
  className,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field-top-operation');
  const { wrapSSR, hashId } = useStyle(baseCls);


  // 获取滚动容器元素
  const getScrollContainer = useCallback((): HTMLElement | null => {
    if (!scrollContainer) {
      // 默认使用window
      return document.documentElement;
    }
    
    if (typeof scrollContainer === 'string') {
      return document.querySelector(scrollContainer);
    }
    
    if (typeof scrollContainer === 'function') {
      return scrollContainer();
    }
    
    return scrollContainer;
  }, [scrollContainer]);



  const handleFirstButtonClick = () => {
    onFirstButtonClick?.();
  };

  const handleSecondButtonClick = () => {
    onSecondButtonClick?.();
  };

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    const container = getScrollContainer();
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [getScrollContainer]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    const container = getScrollContainer();
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, [getScrollContainer]);

  const handleDownArrowClick = () => {
    scrollToBottom();
  };

  const handleUpArrowClick = () => {
    scrollToTop();
  };

  return wrapSSR(
    <div
      className={classNames(baseCls, hashId, className)}
      style={style}
      data-testid="top-operation"
    >
      {/* 左侧弹性空间 */}
      <div className={classNames(`${baseCls}-left-spacer`, hashId)} />

      {/* 中间按钮区域 - 居中显示 */}
      <div className={classNames(`${baseCls}-center`, hashId)}>
        <button
          type="button"
          key="first-button"
          className={classNames(
            `${baseCls}-button`,
            `${baseCls}-button-first`,
            hashId,
          )}
          onClick={handleFirstButtonClick}
          data-testid="first-button"
        >
          {firstButtonText}
        </button>
        <button
          type="button"
          key="second-button"
          className={classNames(
            `${baseCls}-button`,
            `${baseCls}-button-second`,
            hashId,
          )}
          onClick={handleSecondButtonClick}
          data-testid="second-button"
        >
          {secondButtonText}
        </button>
      </div>

      {/* 右侧操作空间 */}
      <div className={classNames(`${baseCls}-right-spacer`, hashId)}>
        {/* 向上箭头 */}
        <UpArrowIcon
          className={classNames(
            `${baseCls}-arrow-icon`,
            `${baseCls}-up-arrow-icon`,
            `${baseCls}-up-arrow-icon-with-both`,
            hashId,
          )}
          onClick={handleUpArrowClick}
          data-testid="up-arrow-icon"
        />
        {/* 向下箭头 */}
        <DownArrowIcon
          className={classNames(`${baseCls}-arrow-icon`, hashId)}
          onClick={handleDownArrowClick}
          data-testid="down-arrow-icon"
        />
      </div>
    </div>,
  );
};

export default TopOperation;
