import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { isValidElement, useContext, useState } from 'react';
import { CloseIcon } from './components/CloseIcon';
import { ErrorIcon } from './components/ErrorIcon';
import { InfoIcon } from './components/InfoIcon';
import { LoaderIcon } from './components/LoaderIcon';
import { SuccessIcon } from './components/SuccessIcon';
import { WarningIcon } from './components/WarningIcon';
import { useStyle } from './style';

export interface AnswerAlertProps {
  className?: string;
  style?: React.CSSProperties;
  /** 内容 */
  message?: React.ReactNode;
  /** 辅助性文字介绍 */
  description?: React.ReactNode;
  /** 自定义图标，`showIcon` 为 true 时有效 */
  icon?: React.ReactNode;
  /** 是否显示辅助图标 */
  showIcon?: boolean;
  /** 指定指示器的样式 */
  type?: 'success' | 'error' | 'warning' | 'info' | 'gray';
  /** 自定义操作项 */
  action?: React.ReactNode;
  /** 可关闭配置 */
  closable?: boolean;
  /** 关闭时触发的回调函数 */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const iconMapFilled = {
  success: SuccessIcon,
  info: InfoIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  gray: LoaderIcon,
};

interface IconNodeProps {
  type: AnswerAlertProps['type'];
  icon: AnswerAlertProps['icon'];
  prefixCls: string;
  hashId: string;
}

const IconNode: React.FC<IconNodeProps> = (props) => {
  const { icon, prefixCls, type, hashId } = props;
  const iconType = type ? iconMapFilled[type] : null;
  if (icon) {
    if (!isValidElement(icon)) {
      return (
        <span className={classNames(`${prefixCls}-icon`, hashId)}>{icon}</span>
      );
    }
    return React.cloneElement(icon as React.ReactElement<any>, {
      className: classNames(
        `${prefixCls}-icon ${hashId}`,
        icon.props.className,
      ),
    });
  }
  if (!iconType) return null;
  return React.createElement(iconType, {
    className: `${prefixCls}-icon ${hashId}`,
  });
};

export function AnswerAlert({
  className,
  style,
  message,
  description,
  icon,
  showIcon,
  type,
  action,
  closable,
  onClose,
}: AnswerAlertProps) {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('answer-alert');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const [closed, setClosed] = useState(false);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClosed(true);
    onClose?.(e);
  };

  const alertCls = classNames(
    prefixCls,
    className,
    {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-with-description`]: !!description,
    },
    hashId,
  );

  if (closed) {
    return null;
  }

  return wrapSSR(
    <div className={alertCls} style={style}>
      <div className={classNames(`${prefixCls}-content`, hashId)}>
        {showIcon ? (
          <IconNode
            icon={icon}
            prefixCls={prefixCls}
            type={type}
            hashId={hashId}
          />
        ) : null}
        <div className={classNames(`${prefixCls}-message`, hashId)}>
          {message}
        </div>
        {action ? (
          <div className={classNames(`${prefixCls}-action`, hashId)}>
            {action}
          </div>
        ) : null}
        {closable && (
          <button
            type="button"
            className={classNames(`${prefixCls}-close-icon`, hashId)}
            tabIndex={0}
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div className={classNames(`${prefixCls}-description`, hashId)}>
        {description}
      </div>
    </div>,
  );
}
