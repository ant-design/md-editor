import { Checkbox, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { HistoryDataType } from '../types';
import { HistoryActionsBox } from './HistoryActionsBox';

interface HistoryItemProps {
  item: HistoryDataType;
  selectedIds: string[];
  onSelectionChange: (sessionId: string, checked: boolean) => void;
  onClick: (sessionId: string, item: HistoryDataType) => void;
  onDeleteItem?: (sessionId: string) => Promise<void>;
  onFavorite?: (sessionId: string, isFavorite: boolean) => void;
  agent?: {
    enabled?: boolean;
    onSearch?: (keyword: string) => void;
    onFavorite?: (sessionId: string, isFavorite: boolean) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    onLoadMore?: () => void;
    loadingMore?: boolean;
  };
  extra?: (item: HistoryDataType) => React.ReactElement;
}

/**
 * 历史记录项组件 - 显示单个历史记录
 */
export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  selectedIds,
  onSelectionChange,
  onClick,
  onFavorite,
  onDeleteItem,
  agent,
  extra,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8,
        minWidth: 140,
        alignItems: 'center',
        width: '100%',
      }}
    >
      {agent?.onSelectionChange && (
        <Checkbox
          checked={selectedIds.includes(item.sessionId!)}
          onChange={(e) => {
            e.stopPropagation();
            onSelectionChange(item.sessionId!, e.target.checked);
          }}
        />
      )}
      <div
        style={{
          color: '#666F8D',
          overflow: 'hidden',
          textWrap: 'nowrap',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        <Tooltip
          open={
            typeof item.sessionTitle === 'string' &&
            item.sessionTitle.length > 10
              ? undefined
              : false
          }
          title={item.sessionTitle}
        >
          <div
            style={{
              width: 'max-content',
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClick(item.sessionId!, item);
            }}
          >
            {item.sessionTitle}
          </div>
        </Tooltip>
      </div>
      <HistoryActionsBox
        onDeleteItem={
          onDeleteItem
            ? async () => {
                await onDeleteItem(item.sessionId!);
              }
            : undefined
        }
        agent={agent}
        item={item}
        onFavorite={onFavorite}
      >
        {dayjs(item.gmtCreate).format('HH:mm')}
      </HistoryActionsBox>
      {extra?.(item)}
    </div>
  );
};
