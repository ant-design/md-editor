import React from 'react';
import { ChartStatisticProps } from '../ChartStatistic';

export type ChartStatisticConfig = Omit<ChartStatisticProps, 'theme'>;
export type StatisticConfigType = ChartStatisticConfig | ChartStatisticConfig[];

/**
 * 通用的 ChartStatistic 组件配置处理 hook
 * @param statisticConfig ChartStatistic 组件配置，支持单个或数组
 * @returns 处理后的配置数组
 */
export const useChartStatistic = (
  statisticConfig: StatisticConfigType | undefined,
) => {
  // 处理 ChartStatistic 组件配置
  const statisticComponentConfigs = React.useMemo(() => {
    if (!statisticConfig) return null;

    // 如果是数组类型，直接返回
    if (Array.isArray(statisticConfig)) {
      return statisticConfig.length > 0 ? statisticConfig : null;
    }

    // 如果是对象类型，包装成数组返回
    return [statisticConfig];
  }, [statisticConfig]);

  return statisticComponentConfigs;
};
