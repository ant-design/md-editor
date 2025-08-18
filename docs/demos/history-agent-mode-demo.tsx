import { message } from 'antd';
import React, { useState } from 'react';
import { History, HistoryDataType } from '../../src/History';

const HistoryAgentModeDemo: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(['session-2']),
  );
  const [searchKeyword, setSearchKeyword] = useState('');

  // 模拟历史数据
  const mockHistoryData: HistoryDataType[] = [
    {
      id: '1',
      sessionId: 'session-1',
      sessionTitle: '如何实现 React 组件的懒加载？',
      gmtCreate: Date.now() - 3600000,
      isFavorite: favorites.has('session-1'),
    },
    {
      id: '2',
      sessionId: 'session-2',
      sessionTitle: 'TypeScript 高级类型的使用技巧',
      gmtCreate: Date.now() - 7200000,
      isFavorite: favorites.has('session-2'),
    },
    {
      id: '3',
      sessionId: 'session-3',
      sessionTitle: '前端性能优化的最佳实践',
      gmtCreate: Date.now() - 86400000,
      isFavorite: favorites.has('session-3'),
    },
    {
      id: '4',
      sessionId: 'session-4',
      sessionTitle: 'CSS Grid 布局详解',
      gmtCreate: Date.now() - 172800000,
      isFavorite: favorites.has('session-4'),
    },
    {
      id: '5',
      sessionId: 'session-5',
      sessionTitle: 'JavaScript 异步编程模式',
      gmtCreate: Date.now() - 259200000,
      isFavorite: favorites.has('session-5'),
    },
  ];

  // 模拟请求函数
  const mockRequest = async ({ agentId }: { agentId: string }) => {
    console.log('请求历史数据，agentId:', agentId);
    // 模拟网络延迟
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    return mockHistoryData;
  };

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    message.info(`搜索关键词: ${keyword}`);
  };

  // 处理收藏
  const handleFavorite = async (sessionId: string, isFavorite: boolean) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(sessionId);
      message.success('已添加到收藏');
    } else {
      newFavorites.delete(sessionId);
      message.info('已取消收藏');
    }
    setFavorites(newFavorites);
  };

  // 处理多选
  const handleSelectionChange = (selectedSessionIds: string[]) => {
    setSelectedIds(selectedSessionIds);
    message.info(`已选择 ${selectedSessionIds.length} 个会话`);
  };

  // 处理加载更多
  const handleLoadMore = async () => {
    message.loading('正在加载更多数据...');

    // 模拟加载更多
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    message.success('加载完成');
  };

  // 处理新对话
  const handleNewChat = async () => {
    message.success('创建新对话');
    // 这里可以添加创建新对话的逻辑
  };

  // 处理选择会话
  const handleSelected = (sessionId: string) => {
    message.success(`选择了会话: ${sessionId}`);
  };

  // 处理删除会话
  const handleDeleteItem = async (sessionId: string) => {
    message.success(`删除了会话: ${sessionId}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>History 组件 Agent 模式演示</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>功能说明：</h3>
        <ul>
          <li>
            <strong>搜索功能：</strong>在搜索框中输入关键词可以过滤历史记录
          </li>
          <li>
            <strong>收藏功能：</strong>
            悬停在历史记录上会显示收藏按钮，点击可以收藏/取消收藏
          </li>
          <li>
            <strong>多选功能：</strong>每个历史记录前面都有复选框，支持多选操作
          </li>
          <li>
            <strong>加载更多：</strong>
            点击底部的加载更多按钮可以加载更多历史记录
          </li>
          <li>
            <strong>新对话：</strong>
            点击新对话按钮可以创建新的对话会话
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>当前状态：</h3>
        <p>
          已选择的会话: {selectedIds.length > 0 ? selectedIds.join(', ') : '无'}
        </p>
        <p>收藏的会话: {Array.from(favorites).join(', ') || '无'}</p>
        <p>搜索关键词: {searchKeyword || '无'}</p>
      </div>

      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <h3>History 组件（Agent 模式）：</h3>
        <History
          agentId="demo-agent"
          sessionId="session-1"
          request={mockRequest}
          onSelected={handleSelected}
          onDeleteItem={handleDeleteItem}
          standalone
          agent={{
            enabled: true,
            onSearch: handleSearch,
            onFavorite: handleFavorite,
            onSelectionChange: handleSelectionChange,
            onLoadMore: handleLoadMore,
            onNewChat: handleNewChat,
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>使用说明：</h3>
        <ol>
          <li>点击历史记录图标打开菜单</li>
          <li>在搜索框中输入关键词进行搜索</li>
          <li>点击新对话按钮创建新的对话</li>
          <li>悬停在历史记录上可以看到收藏和删除按钮</li>
          <li>勾选复选框可以选择多个会话</li>
          <li>点击加载更多按钮可以加载更多数据</li>
        </ol>
      </div>
    </div>
  );
};

export default HistoryAgentModeDemo;
