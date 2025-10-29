import { ExpandAlt, FoldAlt } from '@sofa-design/icons';

import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './style';
interface EnlargementProps {
  /** 是否处于放大状态 */
  isEnlarged?: boolean;
  /** 点击放大图标的回调 */
  onEnlargeClick?: () => void;
}

const Enlargement: React.FC<EnlargementProps> = ({
  isEnlarged = false,
  onEnlargeClick,
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
        {isEnlarged ? <FoldAlt />  : <ExpandAlt />}
      </div>
    </div>,
  );
};

export default Enlargement;