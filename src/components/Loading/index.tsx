import React from 'react';
import { useStyle } from './style';

export const Loading = () => {
  const prefixCls = 'loading-container';
  const { wrapSSR, hashId } = useStyle(prefixCls);
  return wrapSSR(
    <div className={`${prefixCls} ${hashId}`}>
      <div className={`${prefixCls}-item ${hashId}`}></div>
      <div className={`${prefixCls}-item ${hashId}`}></div>
      <div className={`${prefixCls}-item ${hashId}`}></div>
    </div>,
  );
};
