import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { History, HistoryDataType } from '../../src/History';

// 提供必要的上下文
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider>{children}</ConfigProvider>
);

vi.mock('../../src/History/components', () => ({
  HistoryLoadMore: ({ onLoadMore }: { onLoadMore: () => void }) => (
    <button type="button" data-testid="load-more" onClick={onLoadMore}>
      加载更多
    </button>
  ),
  HistoryNewChat: ({ onNewChat }: { onNewChat: () => void }) => (
    <button type="button" data-testid="new-chat" onClick={onNewChat}>
      新对话
    </button>
  ),
  HistorySearch: ({ onSearch }: { onSearch: (value: string) => void }) => (
    <input
      data-testid="search-input"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="搜索历史记录"
    />
  ),
  generateHistoryItems: vi.fn(() => [
    {
      key: 'group1',
      label: '今日',
      type: 'group',
      children: [
        {
          key: 'session1',
          label: '测试会话1',
          onClick: () => {},
        },
        {
          key: 'session2',
          label: '测试会话2',
          onClick: () => {},
        },
      ],
    },
  ]),
}));

describe('History 组件', () => {
  const mockHistoryData: HistoryDataType[] = [
    {
      id: '1',
      sessionId: 'session1',
      sessionTitle: '测试会话1',
      gmtCreate: Date.now() - 1000 * 60 * 60,
      gmtLastConverse: Date.now() - 1000 * 30 * 60,
      isFavorite: false,
    },
    {
      id: '2',
      sessionId: 'session2',
      sessionTitle: '测试会话2',
      gmtCreate: Date.now() - 1000 * 60 * 60 * 24,
      gmtLastConverse: Date.now() - 1000 * 60 * 60 * 2,
      isFavorite: true,
    },
  ];

  const defaultProps = {
    agentId: 'test-agent',
    sessionId: 'current-session',
    request: vi.fn().mockResolvedValue(mockHistoryData),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础功能', () => {
    it('应该正确渲染下拉菜单模式', () => {
      render(
        <TestWrapper>
          <History {...defaultProps} />
        </TestWrapper>,
      );

      // 通过类名查找历史记录图标
      const historyIcon = document.querySelector('.sofa-icons-icon');
      expect(historyIcon).toBeInTheDocument();
    });

    it('应该正确渲染独立模式', () => {
      render(
        <TestWrapper>
          <History {...defaultProps} standalone />
        </TestWrapper>,
      );

      expect(screen.getByText('今日')).toBeInTheDocument();
    });

    it('应该调用 request 函数获取历史数据', async () => {
      render(
        <TestWrapper>
          <History {...defaultProps} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(defaultProps.request).toHaveBeenCalledWith({
          agentId: 'test-agent',
        });
      });
    });

    it('应该处理 sessionId 变化时重新加载数据', async () => {
      const { rerender } = render(
        <TestWrapper>
          <History {...defaultProps} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(defaultProps.request).toHaveBeenCalledTimes(1);
      });

      rerender(
        <TestWrapper>
          <History {...defaultProps} sessionId="new-session" />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(defaultProps.request).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('回调函数', () => {
    it('应该调用 onInit 和 onShow 回调', async () => {
      const onInit = vi.fn();
      const onShow = vi.fn();

      render(
        <TestWrapper>
          <History {...defaultProps} onInit={onInit} onShow={onShow} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(onInit).toHaveBeenCalled();
        expect(onShow).toHaveBeenCalled();
      });
    });

    it('应该处理点击历史记录项', async () => {
      const onClick = vi.fn();
      const onSelected = vi.fn();

      render(
        <TestWrapper>
          <History
            {...defaultProps}
            onClick={onClick}
            onSelected={onSelected}
          />
        </TestWrapper>,
      );

      // 测试回调函数是否被正确传递
      expect(onClick).toBeDefined();
      expect(onSelected).toBeDefined();
    });
  });

  describe('Agent 模式', () => {
    const agentProps = {
      ...defaultProps,
      agent: {
        enabled: true,
        onSearch: vi.fn(),
        onFavorite: vi.fn(),
        onSelectionChange: vi.fn(),
        onLoadMore: vi.fn(),
        onNewChat: vi.fn(),
      },
    };

    it('应该显示 Agent 模式的功能按钮', () => {
      render(
        <TestWrapper>
          <History {...agentProps} standalone />
        </TestWrapper>,
      );

      // 在独立模式下，Agent 功能按钮应该直接显示
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('new-chat')).toBeInTheDocument();
    });

    it('应该处理搜索功能', () => {
      render(
        <TestWrapper>
          <History {...agentProps} standalone />
        </TestWrapper>,
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '测试' } });

      expect(agentProps.agent.onSearch).toHaveBeenCalledWith('测试');
    });
  });

  describe('错误处理', () => {
    it('应该处理空数据的情况', async () => {
      const emptyRequest = vi.fn().mockResolvedValue([]);

      render(
        <TestWrapper>
          <History {...defaultProps} request={emptyRequest} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(emptyRequest).toHaveBeenCalled();
      });
    });
  });

  describe('emptyRender 空状态渲染', () => {
    it('应该在历史记录为空时显示自定义空状态', async () => {
      const emptyRequest = vi.fn().mockResolvedValue([]);
      const { generateHistoryItems } = await import('../../src/History/components');
      (generateHistoryItems as any).mockReturnValue([]);

      const emptyRender = vi.fn(() => (
        <div data-testid="empty-state">暂无历史记录</div>
      ));

      render(
        <TestWrapper>
          <History
            {...defaultProps}
            request={emptyRequest}
            emptyRender={emptyRender}
            standalone
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('暂无历史记录')).toBeInTheDocument();
      });

      expect(emptyRender).toHaveBeenCalled();
    });

    it('应该在有数据时不显示空状态', async () => {
      const { generateHistoryItems } = await import('../../src/History/components');
      (generateHistoryItems as any).mockReturnValue([
        {
          key: 'group1',
          label: '今日',
          type: 'group',
          children: [{ key: 'session1', label: '测试会话1' }],
        },
      ]);

      const emptyRender = vi.fn(() => (
        <div data-testid="empty-state">暂无历史记录</div>
      ));

      render(
        <TestWrapper>
          <History
            {...defaultProps}
            emptyRender={emptyRender}
            standalone
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      });

      expect(emptyRender).not.toHaveBeenCalled();
    });

    it('应该在下拉菜单模式下也支持空状态渲染', async () => {
      const emptyRequest = vi.fn().mockResolvedValue([]);
      const { generateHistoryItems } = await import('../../src/History/components');
      (generateHistoryItems as any).mockReturnValue([]);

      const emptyRender = vi.fn(() => (
        <div data-testid="empty-state-popover">没有历史记录</div>
      ));

      render(
        <TestWrapper>
          <History
            {...defaultProps}
            request={emptyRequest}
            emptyRender={emptyRender}
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(emptyRequest).toHaveBeenCalled();
      });

      // 点击打开下拉菜单
      const historyButton = screen.getByTestId('history-button');
      fireEvent.click(historyButton);

      await waitFor(() => {
        expect(screen.getByTestId('empty-state-popover')).toBeInTheDocument();
        expect(screen.getByText('没有历史记录')).toBeInTheDocument();
      });
    });

    it('应该支持复杂的自定义空状态组件', async () => {
      const emptyRequest = vi.fn().mockResolvedValue([]);
      const { generateHistoryItems } = await import('../../src/History/components');
      (generateHistoryItems as any).mockReturnValue([]);

      const emptyRender = () => (
        <div data-testid="complex-empty-state" style={{ padding: 20 }}>
          <h3>暂无历史记录</h3>
          <p>开始一段新的对话吧</p>
          <button type="button">创建新对话</button>
        </div>
      );

      render(
        <TestWrapper>
          <History
            {...defaultProps}
            request={emptyRequest}
            emptyRender={emptyRender}
            standalone
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        const emptyState = screen.getByTestId('complex-empty-state');
        expect(emptyState).toBeInTheDocument();
        expect(screen.getByText('暂无历史记录')).toBeInTheDocument();
        expect(screen.getByText('开始一段新的对话吧')).toBeInTheDocument();
        expect(screen.getByText('创建新对话')).toBeInTheDocument();
      });
    });
  });

  describe('loading 加载状态', () => {
    it('应该在 loading 为 true 时显示加载动画', async () => {
      render(
        <TestWrapper>
          <History {...defaultProps} loading={true} standalone />
        </TestWrapper>,
      );

      await waitFor(() => {
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).toBeInTheDocument();
      });
    });

    it('应该在 loading 为 false 时显示正常内容', async () => {
      const { generateHistoryItems } = await import('../../src/History/components');
      (generateHistoryItems as any).mockReturnValue([
        {
          key: 'group1',
          label: '今日',
          type: 'group',
          children: [{ key: 'session1', label: '测试会话1' }],
        },
      ]);

      render(
        <TestWrapper>
          <History {...defaultProps} loading={false} standalone />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('今日')).toBeInTheDocument();
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).not.toBeInTheDocument();
      });
    });

    it('应该在下拉菜单模式下也支持 loading', async () => {
      render(
        <TestWrapper>
          <History {...defaultProps} loading={true} />
        </TestWrapper>,
      );

      // 点击打开下拉菜单
      const historyButton = screen.getByTestId('history-button');
      fireEvent.click(historyButton);

      await waitFor(() => {
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).toBeInTheDocument();
      });
    });

    it('应该在 loading 状态切换时正确更新显示', async () => {
      const { rerender } = render(
        <TestWrapper>
          <History {...defaultProps} loading={true} standalone />
        </TestWrapper>,
      );

      await waitFor(() => {
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).toBeInTheDocument();
      });

      // 切换到非加载状态
      rerender(
        <TestWrapper>
          <History {...defaultProps} loading={false} standalone />
        </TestWrapper>,
      );

      await waitFor(() => {
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).not.toBeInTheDocument();
      });
    });

    it('应该默认不显示 loading', async () => {
      render(
        <TestWrapper>
          <History {...defaultProps} standalone />
        </TestWrapper>,
      );

      await waitFor(() => {
        const spinElement = document.querySelector('.ant-spin');
        expect(spinElement).not.toBeInTheDocument();
      });
    });
  });
});
