import { ExpandAlt, TextOptimize } from '@sofa-design/icons';

import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './style';
interface EnlargementProps {
  /** 目标容器的 ref */
  targetContainerRef?: React.RefObject<HTMLElement>;
  /** 是否处于放大状态 */
  isEnlarged?: boolean;
  /** 点击放大图标的回调 */
  onEnlargeClick?: () => void;
  /** 点击优化按钮的回调 */
  onOptimizeClick?: () => void;
}

const Enlargement: React.FC<EnlargementProps> = ({
  isEnlarged = false,
  onEnlargeClick,
  onOptimizeClick,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-enlargement');
  const { wrapSSR, hashId } = useStyle(baseCls);

  return wrapSSR(
    <div className={classNames(baseCls, hashId)}>
      <div
        className={classNames(`${baseCls}-icon`, hashId, {
          enlarged: isEnlarged,
        })}
        onClick={onEnlargeClick}
        title={isEnlarged ? '缩小' : '放大'}
      >
        {isEnlarged ? <ExpandAlt /> : <ExpandAlt />}
      </div>
      <div
        className={classNames(`${baseCls}-icon`, hashId)}
        onClick={onOptimizeClick}
        title="文本优化"
      >
        <TextOptimize />
      </div>
    </div>,
  );
};

export default Enlargement;
