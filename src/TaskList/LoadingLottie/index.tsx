import Lottie from 'lottie-react';
import React from 'react';
import loadingLottie from './loading.json';

export interface LottieVoiceProps {
  /**
   * 是否自动播放动画
   */
  autoplay?: boolean;
  /**
   * 是否循环播放动画
   */
  loop?: boolean;
  /**
   * 动画容器类名
   */
  className?: string;
  /**
   * 动画容器样式
   */
  style?: React.CSSProperties;
  /**
   * 动画尺寸
   */
  size?: number;
}

export const LoadingLottie: React.FC<LottieVoiceProps> = ({
  autoplay = true,
  loop = true,
  className,
  style,
  size = 32,
}) => {
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      <Lottie animationData={loadingLottie} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LoadingLottie;
