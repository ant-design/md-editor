import React from 'react';
import { ChartStaticProps } from '../components/ChartStatic';

export type ChartStaticConfig = Omit<ChartStaticProps, 'theme'>;
export type StaticConfigType = ChartStaticConfig | ChartStaticConfig[];

/**
 * 通用的 ChartStatic 组件配置处理 hook
 * @param staticConfig ChartStatic 组件配置，支持单个或数组
 * @returns 处理后的配置数组
 */
export const useChartStatic = (staticConfig: StaticConfigType | undefined) => {
  // 处理 ChartStatic 组件配置
  const staticComponentConfigs = React.useMemo(() => {
    if (!staticConfig) return null;

    // 如果是数组类型，直接返回
    if (Array.isArray(staticConfig)) {
      return staticConfig.length > 0 ? staticConfig : null;
    }

    // 如果是对象类型，包装成数组返回
    return [staticConfig];
  }, [staticConfig]);

  return staticComponentConfigs;
};
