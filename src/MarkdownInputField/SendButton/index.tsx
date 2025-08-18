import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SendIcon } from './SendIcon';
import { useStyle } from './style';

/**
 * Props for the SendButton component.
 */
type SendButtonProps = {
  /**
   * 指示按钮是否处于悬停状态
   * Indicates whether the button is in a hover state.
   */
  isHover: boolean;

  /**
   * 指示用户是否正在输入
   * Indicates whether the user is currently typing.
   */
  typing: boolean;

  /**
   * 点击按钮时触发的回调函数
   * Callback function triggered when the button is clicked.
   */
  onClick: () => void;

  /**
   * 应用于按钮的CSS样式
   * CSS styles to be applied to the button.
   */
  style?: React.CSSProperties;

  /**
   * 按钮初始化时触发的回调函数
   * Callback function triggered when the button is initialized.
   */
  onInit?: () => void;

  /**
   * 是否使用紧凑模式显示按钮
   * Whether to display the button in compact mode.
   */
  compact?: boolean;

  /**
   * 按钮是否禁用
   * Whether the button is disabled.
   */
  disabled?: boolean;
};

/**
 * SendButton 组件 - 发送按钮组件
 *
 * 该组件提供一个可点击的发送按钮，根据不同状态（悬停、禁用、输入中）
 * 呈现不同的视觉效果和动画。支持紧凑模式和自定义样式。
 *
 * @component
 * @description 发送按钮组件，支持多种状态和动画效果
 * @param {SendButtonProps} props - 组件属性
 * @param {boolean} props.isHover - 指示鼠标是否悬停在按钮上
 * @param {boolean} props.disabled - 指示按钮是否禁用
 * @param {boolean} props.typing - 指示是否处于输入状态
 * @param {() => void} props.onClick - 点击按钮时的回调函数
 * @param {React.CSSProperties} [props.style] - 应用于按钮容器的自定义样式
 * @param {() => void} [props.onInit] - 组件初始化时调用的可选回调函数
 * @param {boolean} [props.compact] - 是否使用紧凑模式样式
 *
 * @example
 * ```tsx
 * <SendButton
 *   isHover={false}
 *   disabled={false}
 *   typing={false}
 *   onClick={() => console.log('发送消息')}
 *   compact={false}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的发送按钮组件，SSR环境下返回null
 *
 * @remarks
 * - 支持悬停、禁用、输入中等多种状态
 * - 提供流畅的动画效果
 * - 支持紧凑模式显示
 * - 在SSR环境下不渲染
 */
export const SendButton: React.FC<SendButtonProps> = (props) => {
  const { isHover, disabled, typing, onClick, style } = props;
  useEffect(() => {
    props.onInit?.();
  }, []);
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field-send-button');
  const { wrapSSR, hashId } = useStyle(baseCls);

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !window.document
  ) {
    // SSR 环境下不渲染
    return null;
  }

  return wrapSSR(
    <div
      data-testid="send-button"
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      style={style}
      className={classNames(baseCls, hashId, {
        [`${baseCls}-compact`]: props.compact,
        [`${baseCls}-disabled`]: disabled,
        [`${baseCls}-typing`]: typing,
      })}
    >
      <ErrorBoundary fallback={<div />}>
        <SendIcon
          hover={isHover && !disabled}
          disabled={disabled}
          typing={typing}
        />
      </ErrorBoundary>
    </div>,
  );
};
