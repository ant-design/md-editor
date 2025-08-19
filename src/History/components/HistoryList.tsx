import dayjs from 'dayjs';
import React from 'react';
import { HistoryDataType } from '../types';
import { formatTime, groupByCategory } from '../utils';
import { HistoryItem } from './HistoryItem';

/**
 * 历史记录列表配置接口
 */
interface HistoryListConfig {
  /** 过滤后的历史记录列表 */
  filteredList: HistoryDataType[];
  /** 选中的记录ID列表 */
  selectedIds: string[];
  /** 选择状态变化回调 */
  onSelectionChange: (sessionId: string, checked: boolean) => void;
  /** 选择记录回调 */
  onClick: (sessionId: string, item: HistoryDataType) => void;
  /** 删除记录回调 */
  onDeleteItem?: (sessionId: string) => Promise<void>;
  /** 收藏记录回调 */
  onFavorite?: (sessionId: string, isFavorite: boolean) => void;
  /** Agent配置 */
  agent?: {
    /** 是否启用agent模式 */
    enabled?: boolean;
    /** 搜索回调 */
    onSearch?: (keyword: string) => void;
    /** 收藏回调 */
    onFavorite?: (sessionId: string, isFavorite: boolean) => void;
    /** 多选回调 */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** 加载更多回调 */
    onLoadMore?: () => void;
    /** 是否正在加载更多 */
    loadingMore?: boolean;
  };
  /** 额外渲染函数 */
  extra?: (item: HistoryDataType) => React.ReactElement;
  /** 自定义日期格式化函数 */
  customDateFormatter?: (date: number | string | Date) => string;
  /** 自定义分组函数 */
  groupBy?: (item: HistoryDataType) => string;
  /** 自定义排序函数 */
  sessionSort?:
    | ((pre: HistoryDataType, current: HistoryDataType) => number | boolean)
    | false;
  /** 历史记录类型 */
  type?: 'chat' | 'task';
  /** 正在运行的记录ID列表，这些记录将显示运行图标 */
  runningId?: string[];
}

/**
 * 生成历史记录菜单项
 *
 * 该函数将历史记录数据转换为菜单项格式，支持分组、排序、自定义格式化等功能。
 *
 * @function
 * @description 生成历史记录菜单项，支持分组和排序
 * @param {HistoryListConfig} config - 配置参数
 * @param {HistoryDataType[]} config.filteredList - 过滤后的历史记录列表
 * @param {string[]} config.selectedIds - 选中的记录ID列表
 * @param {Function} config.onSelectionChange - 选择状态变化回调
 * @param {Function} config.onSelected - 选择记录回调
 * @param {Function} [config.onDeleteItem] - 删除记录回调
 * @param {Function} [config.onFavorite] - 收藏记录回调
 * @param {Object} [config.agent] - Agent配置
 * @param {Function} [config.extra] - 额外渲染函数
 * @param {Function} [config.customDateFormatter] - 自定义日期格式化函数
 * @param {Function} [config.groupBy] - 自定义分组函数
 * @param {Function|boolean} [config.sessionSort] - 自定义排序函数
 * @param {string[]} [config.runningId] - 正在运行的记录ID列表
 *
 * @example
 * ```tsx
 * const menuItems = generateHistoryItems({
 *   filteredList: historyData,
 *   selectedIds: selectedIds,
 *   onSelectionChange: handleSelectionChange,
 *   onSelected: handleSelected,
 *   onDeleteItem: handleDelete,
 *   onFavorite: handleFavorite,
 *   agent: { enabled: true },
 *   customDateFormatter: (date) => dayjs(date).format('YYYY-MM-DD'),
 *   runningId: ['task-1', 'task-2']
 * });
 * ```
 *
 * @returns {Array} 生成的菜单项数组
 *
 * @remarks
 * - 支持按日期自动分组
 * - 支持自定义分组逻辑
 * - 支持自定义排序规则
 * - 支持自定义日期格式化
 * - 集成HistoryItem组件渲染
 * - 支持多选和收藏功能
 * - 支持运行状态图标显示
 */
export const generateHistoryItems = ({
  filteredList,
  selectedIds,
  onSelectionChange,
  onClick,
  onDeleteItem,
  agent,
  onFavorite,
  extra,
  customDateFormatter,
  groupBy,
  sessionSort,
  type,
  runningId,
}: HistoryListConfig) => {
  const groupList = groupByCategory(
    filteredList || [],
    (item: HistoryDataType) => {
      if (groupBy) {
        return groupBy(item);
      }
      return formatTime(item.gmtCreate as number);
    },
  );

  const items = Object.keys(groupList).map((key) => {
    const list = groupList[key];
    const firstItem = list?.at(0);

    return {
      key: `group-${key}`,
      type: 'group' as const,
      label:
        customDateFormatter && firstItem?.gmtCreate
          ? customDateFormatter(firstItem.gmtCreate)
          : formatTime(firstItem?.gmtCreate as number),
      children: list
        ?.sort((a: HistoryDataType, b: HistoryDataType) => {
          if (sessionSort === false) {
            return 0;
          }
          if (sessionSort) {
            const result = sessionSort(a, b);
            return typeof result === 'boolean' ? 0 : result;
          }
          return dayjs(b.gmtCreate).valueOf() - dayjs(a.gmtCreate).valueOf();
        })
        ?.map((item: HistoryDataType) => {
          return {
            key: item.sessionId || `item-${item.id}`,
            type: 'item' as const,
            label: (
              <HistoryItem
                item={item}
                selectedIds={selectedIds}
                onSelectionChange={onSelectionChange}
                onClick={onClick}
                onDeleteItem={onDeleteItem}
                agent={agent}
                onFavorite={onFavorite}
                extra={extra}
                type={type}
                runningId={runningId}
              />
            ),
          };
        }),
    };
  });

  return items;
};
