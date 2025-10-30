import { ConfigProvider } from 'antd';
import classnames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './style';

export interface WelcomeMessageProps {
  /** 标题 */
  title?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 自定义样式类名，用于各个提示项的不同部分 */
  classNames?: {
    title?: string;
    description?: string;
  };
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义根节点样式类名 */
  rootClassName?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  title,
  description,
  classNames,
  style,
  rootClassName,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('welcome');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  return wrapSSR(
    <div className={classnames(prefixCls, hashId, rootClassName)} style={style}>
      {/* Title */}
      {title && (
        <div className={classnames(`${prefixCls}-title`, classNames?.title)}>
          {title}
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          className={classnames(
            `${prefixCls}-description`,
            classNames?.description,
          )}
        >
          {description}
        </div>
      )}
    </div>,
  );
};
