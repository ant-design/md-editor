import React from 'react';
import { useStyle } from './ButtonTabStyle';

export interface ButtonTabProps {
  /** 按钮文本 */
  children?: React.ReactNode;
  /** 是否选中 */
  selected?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 图标点击回调 */
  onIconClick?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 前缀类名 */
  prefixCls?: string;
}

const ButtonTab: React.FC<ButtonTabProps> = ({
  children,
  selected = false,
  onClick,
  onIconClick,
  className,
  icon,
  prefixCls = 'md-editor-button-tab',
}) => {
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const handleClick = () => {
    onClick?.();
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIconClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return wrapSSR(
    <button
      type="button"
      className={`${prefixCls} ${selected ? `${prefixCls}-selected` : ''} ${className || ''} ${hashId}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {children && (
        <span className={`${prefixCls}-text ${hashId}`}>{children}</span>
      )}
      {icon && (
        <span
          className={`${prefixCls}-icon ${onIconClick ? `${prefixCls}-icon-clickable` : ''} ${hashId}`}
          onClick={onIconClick ? handleIconClick : undefined}
        >
          {icon}
        </span>
      )}
    </button>,
  );
};

export default ButtonTab;
