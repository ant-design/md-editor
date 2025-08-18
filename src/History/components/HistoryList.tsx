import dayjs from 'dayjs';
import React from 'react';
import { HistoryDataType } from '../types';
import { formatTime, groupByCategory } from '../utils';
import { HistoryItem } from './HistoryItem';

interface HistoryListProps {
  filteredList: HistoryDataType[];
  selectedIds: string[];
  onSelectionChange: (sessionId: string, checked: boolean) => void;
  onSelected: (sessionId: string) => void;
  onDeleteItem?: (sessionId: string) => Promise<void>;
  onFavorite?: (sessionId: string, isFavorite: boolean) => Promise<void>;
  agent?: {
    enabled?: boolean;
    onSearch?: (keyword: string) => void;
    onFavorite?: (sessionId: string, isFavorite: boolean) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    onLoadMore?: () => void;
    loadingMore?: boolean;
  };
  extra?: (item: HistoryDataType) => React.ReactElement;
  customDateFormatter?: (date: number | string | Date) => string;
  groupBy?: (item: HistoryDataType) => string;
  sessionSort?:
    | ((pre: HistoryDataType, current: HistoryDataType) => number | boolean)
    | false;
}

/**
 * 生成历史记录菜单项
 */
export const generateHistoryItems = ({
  filteredList,
  selectedIds,
  onSelectionChange,
  onSelected,
  onDeleteItem,
  onFavorite,
  agent,
  extra,
  customDateFormatter,
  groupBy,
  sessionSort,
}: HistoryListProps) => {
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
                onSelected={onSelected}
                onDeleteItem={onDeleteItem}
                onFavorite={onFavorite}
                agent={agent}
                extra={extra}
              />
            ),
          };
        }),
    };
  });

  return items;
};
