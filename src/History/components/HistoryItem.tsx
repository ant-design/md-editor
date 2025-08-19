import { Checkbox, Divider, Tooltip } from 'antd';
import React from 'react';
import { HistoryDataType } from '../types';
import { formatTime } from '../utils';
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
  /** 历史记录类型 */
  type?: 'chat' | 'task';
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
  type,
}) => {
  // 自动显示配置
  const isTask = type === 'task';
  const shouldShowIcon = isTask && !!item.icon;
  const shouldShowDescription = isTask && !!item.description;
  // 如果是任务类型或包含 description 和 icon 就自动打开多行模式
  const isMultiMode = isTask || (shouldShowIcon && shouldShowDescription);

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
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(item.sessionId!, item);
      }}
    >
      {agent?.onSelectionChange && (
        <Checkbox
          checked={selectedIds.includes(item.sessionId!)}
          onChange={(e) => {
            e.stopPropagation();
            onSelectionChange(item.sessionId!, e.target.checked);
          }}
          style={{ marginTop: isMultiMode ? 4 : 0 }}
        />
      )}

      {/* 图标区域 */}
      {shouldShowIcon && (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.isValidElement(item.icon) ? (
            item.icon
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px',
                gap: '10px',
                fontSize: 15,
                borderRadius: '200px',
                background: '#F1F2F4',
              }}
            >
              {item.icon || (isTask ? '📋' : '📄')}
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div
        style={{
          color: '#666F8D',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: isMultiMode ? 4 : 0,
        }}
      >
        {/* 标题 */}
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
              fontWeight: 500,
              fontSize: 14,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              lineHeight: isMultiMode ? '20px' : 'inherit',
            }}
          >
            {item.sessionTitle}
          </div>
        </Tooltip>

        {/* 描述 */}
        {isMultiMode &&
          shouldShowDescription &&
          (item.description || isTask) && (
            <Tooltip
              open={
                typeof item.description === 'string' &&
                item.description.length > 20
                  ? undefined
                  : false
              }
              title={item.description || (isTask ? '任务' : '')}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 'normal',
                  lineHeight: '18px',
                  letterSpacing: 'normal',
                  color: '#767E8B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.description || (isTask ? '任务' : '')}
                <Divider type="vertical" />
                {formatTime(item.gmtCreate)}
              </div>
            </Tooltip>
          )}
      </div>

      {/* 右侧操作区域 */}
      <div style={{ marginTop: isMultiMode ? 4 : 0 }}>
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
          {formatTime(item.gmtCreate)}
        </HistoryActionsBox>
      </div>
      {extra?.(item)}
    </div>
  );
};
