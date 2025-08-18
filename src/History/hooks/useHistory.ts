import { useEffect, useState } from 'react';
import { useRefFunction } from '../../index';
import { HistoryDataType, HistoryProps } from '../types';

/**
 * 历史记录状态管理 Hook
 */
export const useHistory = (props: HistoryProps) => {
  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState<HistoryDataType[]>(() => []);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filteredList, setFilteredList] = useState<HistoryDataType[]>([]);

  const loadHistory = useRefFunction(async () => {
    const msg = (await props
      .request({
        agentId: props.agentId,
      })
      .then((msg) => {
        return msg;
      })) as HistoryDataType[];
    setChatList(msg);
  });

  useEffect(() => {
    props.onInit?.();
    props.onShow?.();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [props.sessionId]);

  // 搜索过滤逻辑
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredList(chatList);
    } else {
      const filtered = chatList.filter((item) => {
        const title =
          typeof item.sessionTitle === 'string'
            ? item.sessionTitle
            : String(item.sessionTitle || '');
        return title.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setFilteredList(filtered);
    }
  }, [chatList, searchKeyword]);

  // 处理收藏
  const handleFavorite = useRefFunction(
    async (sessionId: string, isFavorite: boolean) => {
      await props.agent?.onFavorite?.(sessionId, isFavorite);
      // 更新本地状态
      setChatList((prev) =>
        prev.map((item) =>
          item.sessionId === sessionId ? { ...item, isFavorite } : item,
        ),
      );
    },
  );

  // 处理多选
  const handleSelectionChange = useRefFunction(
    (sessionId: string, checked: boolean) => {
      const newSelectedIds = checked
        ? [...selectedIds, sessionId]
        : selectedIds.filter((id) => id !== sessionId);

      setSelectedIds(newSelectedIds);
      props.agent?.onSelectionChange?.(newSelectedIds);
    },
  );

  // 处理搜索
  const handleSearch = useRefFunction((value: string) => {
    setSearchKeyword(value);
    props.agent?.onSearch?.(value);
  });

  // 处理加载更多
  const handleLoadMore = useRefFunction(async () => {
    await props.agent?.onLoadMore?.();
  });

  // 处理新对话
  const handleNewChat = useRefFunction(async () => {
    await props.agent?.onNewChat?.();
    setOpen(false);
  });

  return {
    open,
    setOpen,
    chatList,
    searchKeyword,
    selectedIds,
    filteredList,
    loadHistory,
    handleFavorite,
    handleSelectionChange,
    handleSearch,
    handleLoadMore,
    handleNewChat,
  };
};
