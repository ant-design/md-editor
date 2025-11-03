import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useGradientTextStyle } from './style';

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export function GradientText({
  children,
  className = '',
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('gradient-text');
  const { wrapSSR, hashId } = useGradientTextStyle(prefixCls);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return wrapSSR(
    <div className={classNames(prefixCls, hashId, className)}>
      {showBorder && (
        <div
          className={classNames(`${prefixCls}-gradient-overlay`, hashId)}
          style={gradientStyle}
        ></div>
      )}
      <div
        className={classNames(`${prefixCls}-text-content`, hashId)}
        style={gradientStyle}
      >
        {children}
      </div>
    </div>,
  );
}
