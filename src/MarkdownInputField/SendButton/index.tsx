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
 * 发送按钮组件
 *
 * 一个可点击的发送按钮，根据不同状态（悬停、禁用、输入中）呈现不同的视觉效果
 *
 * @param props - 按钮组件的属性
 * @param props.isHover - 指示鼠标是否悬停在按钮上
 * @param props.disabled - 指示按钮是否禁用
 * @param props.typing - 指示是否处于输入状态
 * @param props.onClick - 点击按钮时的回调函数
 * @param props.style - 应用于按钮容器的自定义样式
 * @param props.onInit - 组件初始化时调用的可选回调函数
 * @param props.compact - 是否使用紧凑模式样式
 * @returns 发送按钮组件
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

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    // 测试环境下不渲染
    return null;
  }

  return wrapSSR(
    <div
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
      {/* 使用 ErrorBoundary 包裹 SendIcon 组件 */}
      {/* 这样可以捕获 SendIcon 组件中的错误并防止整个应用崩溃 */}
      {/* 你可以在这里自定义错误边界的 fallback UI */}
      {/* 例如：<div>Something went wrong</div> */}
      {/* 你可以根据需要传递其他 props 给 ErrorBoundary */}
      {/* 例如：<ErrorBoundary FallbackComponent={MyFallbackComponent} /> */}
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
