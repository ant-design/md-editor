import React, { useContext } from 'react';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { ExpandAlt, TextOptimize } from '@sofa-design/icons';
import { useStyle } from './style';

const Enlargement = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-enlargement');
  const { wrapSSR, hashId } = useStyle(baseCls);

  return wrapSSR(
    <div className={classNames(baseCls, hashId)}>
      <div className={classNames(`${baseCls}-icon`, hashId)}>
        <ExpandAlt />
      </div>
      <div className={classNames(`${baseCls}-icon`, hashId)}>
        <TextOptimize />
      </div>
    </div>
  );
};

export default Enlargement;
