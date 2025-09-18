import React from 'react';
import { ChartStaticProps } from '../components/ChartStatic';

/**
 * 通用的 ChartStatic 组件配置处理 hook
 * @param staticConfig ChartStatic 组件配置
 * @returns 处理后的配置对象
 */
export const useChartStatic = (
  staticConfig: boolean | Omit<ChartStaticProps, 'theme'> | undefined,
) => {
  // 处理 ChartStatic 组件配置
  const staticComponentConfig = React.useMemo(() => {
    if (!staticConfig) return null;

    // 如果是 boolean 类型，使用默认配置
    if (typeof staticConfig === 'boolean') {
      return staticConfig ? {} : null;
    }

    // 如果是对象类型，直接返回配置
    return staticConfig;
  }, [staticConfig]);

  return staticComponentConfig;
};
