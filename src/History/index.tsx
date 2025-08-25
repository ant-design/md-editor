import { ConfigProvider, Popover } from 'antd';
import React, { useContext, useRef } from 'react';
import useClickAway from '../hooks/useClickAway';
import { HistoryIcon } from '../icons/HistoryIcon';
import { ActionIconBox, BubbleConfigContext } from '../index';
import {
  HistoryLoadMore,
  HistoryNewChat,
  HistorySearch,
  generateHistoryItems,
} from './components';
import { useHistory } from './hooks/useHistory';
import GroupMenu from './menu';
import { HistoryProps } from './types';

/**
 * History 组件 - 用于显示和管理聊天历史记录
 *
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.agentId - 代理ID，用于获取历史记录
 * @param {string} props.sessionId - 会话ID，变更时会触发数据重新获取
 * @param {Function} props.request - 请求函数，用于获取历史数据
 * @param {Function} [props.onInit] - 组件初始化时的回调函数
 * @param {Function} [props.onShow] - 组件显示时的回调函数
 * @param {Function} [props.onSelected] - 选择历史记录项时的回调函数 (已弃用，请使用 onClick)
 * @param {Function} [props.onDeleteItem] - 删除历史记录项时的回调函数
 * @param {Function} [props.customDateFormatter] - 日期格式化函数
 * @param {boolean} [props.standalone] - 是否以独立模式显示，为true时直接显示菜单，否则显示为下拉菜单
 *
 * @returns {React.ReactElement|null} 返回历史记录组件或null（当没有历史记录时）
 *
 * @description
 * 该组件提供两种显示模式：
 * 1. 独立模式 (standalone=true)：直接显示为菜单列表
 * 2. 下拉菜单模式 (standalone=false)：显示为一个可点击的图标，点击后显示下拉菜单
 *
 * 历史记录按日期分组显示，每组内按时间倒序排列。
 * 支持查看历史会话和删除历史记录。
 */
export const History: React.FC<HistoryProps> = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const menuPrefixCls = getPrefixCls('agent-chat-history-menu');
  const { locale } = useContext(BubbleConfigContext) || {};
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    open,
    setOpen,
    searchKeyword,
    selectedIds,
    filteredList,
    loadHistory,
    handleSelectionChange,
    handleSearch,
    handleLoadMore,
    handleFavorite,
    handleNewChat,
  } = useHistory(props);

  useClickAway(() => {
    setOpen(false);
  }, containerRef);

  const items = generateHistoryItems({
    filteredList,
    selectedIds,
    onSelectionChange: handleSelectionChange,
    onClick: (sessionId, item) => {
      props.onClick?.(sessionId, item);
      props.onSelected?.(sessionId);
      setOpen(false);
    },
    groupLabelRender: props.groupLabelRender,
    onDeleteItem: props.onDeleteItem
      ? async (sessionId) => {
          await props.onDeleteItem?.(sessionId);
          loadHistory();
        }
      : undefined,
    onFavorite: handleFavorite,
    agent: props.agent,
    extra: props.extra,
    customDateFormatter: props.customDateFormatter,
    groupBy: props.groupBy,
    sessionSort: props.sessionSort,
    type: props.type,
    runningId: props.agent?.runningId,
  });

  if (props.standalone) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {props.agent?.enabled && !!props.agent?.onNewChat && (
          <HistoryNewChat onNewChat={handleNewChat} />
        )}

        {props.agent?.enabled && !!props.agent?.onSearch && (
          <HistorySearch
            searchKeyword={searchKeyword}
            onSearch={handleSearch}
          />
        )}

        {props.slots?.beforeHistoryList?.(filteredList)}

        <GroupMenu
          selectedKeys={[props.sessionId]}
          inlineIndent={20}
          items={items}
          className={menuPrefixCls}
        />
        {props.agent?.enabled && !!props.agent?.onLoadMore && (
          <HistoryLoadMore onLoadMore={handleLoadMore} />
        )}
      </div>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      className={menuPrefixCls}
      style={{
        maxHeight: 'min(480px,100%)',
        overflow: 'auto',
        maxWidth: 'min(480px,100%)',
        borderRadius: 'inherit',
        border: '1px solid #f0f2f5',
      }}
      getPopupContainer={(p) => p.parentElement || document.body}
      content={
        <>
          <GroupMenu
            selectedKeys={[props.sessionId]}
            inlineIndent={20}
            items={items}
            className={menuPrefixCls}
          />
          {props.agent?.enabled && !!props.agent?.onLoadMore && (
            <HistoryLoadMore onLoadMore={handleLoadMore} />
          )}
        </>
      }
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          padding: 4,
          alignItems: 'center',
          fontSize: '0.85em',
          width: 'max-content',
          maxWidth: 'min(860px,100%)',
        }}
        data-testid="history-button"
      >
        <ActionIconBox
          key="history"
          style={{
            color: '#666F8D',
            width: 24,
            height: 24,
          }}
          noPadding
          title={locale?.['chat.history'] || '历史记录'}
        >
          <HistoryIcon />
        </ActionIconBox>
      </div>
    </Popover>
  );
};

export * from './components';
export * from './hooks/useHistory';
export * from './types';
export * from './utils';
