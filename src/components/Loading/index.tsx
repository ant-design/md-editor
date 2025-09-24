import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './style';

/**
 * Loading 组件 - 加载动画组件
 *
 * 该组件提供一个简单的加载动画效果，包含三个跳动的圆点。
 * 主要用于在数据加载或处理过程中提供视觉反馈。
 *
 * @component
 * @description 加载动画组件，显示三个跳动的圆点
 * @example
 * ```tsx
 * import { Loading } from './components/Loading';
 *
 * function App() {
 *   return (
 *     <div>
 *       <Loading />
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} 渲染的加载动画组件
 */
export const Loading = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('loading-container');
  const { wrapSSR, hashId } = useStyle(prefixCls);
  return wrapSSR(
    <div
      className={classNames(prefixCls, hashId)}
      data-testid="loading-container"
    >
      <div
        className={classNames(`${prefixCls}-item`, hashId)}
        data-testid="loading-item"
      ></div>
      <div
        className={classNames(`${prefixCls}-item`, hashId)}
        data-testid="loading-item"
      ></div>
      <div
        className={classNames(`${prefixCls}-item`, hashId)}
        data-testid="loading-item"
      ></div>
    </div>,
  );
};
