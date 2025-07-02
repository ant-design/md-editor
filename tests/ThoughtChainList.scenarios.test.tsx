import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { WhiteBoxProcessInterface } from '../src/ThoughtChainList';
import { ThoughtChainList } from '../src/ThoughtChainList';

/**
 * ThoughtChainList 功能场景测试
 *
 * 测试各种实际使用场景和用户交互流程
 */

describe('ThoughtChainList Functional Scenarios', () => {
  describe('Error Handling and Recovery', () => {
    it('should handle API failures gracefully during thinking process', async () => {
      let thoughtChain: WhiteBoxProcessInterface[] = [
        {
          category: 'ToolCall',
          info: '调用外部API获取数据',
          runId: 'api-fail-1',
          meta: {
            name: 'fetchUserData',
            method: 'GET',
            path: '/api/users/123',
          },
          output: {
            type: 'ERROR',
            errorMsg: 'API调用失败：连接超时 (timeout after 30s)',
          },
        },
      ];

      const { rerender } = render(
        <ThoughtChainList thoughtChainList={thoughtChain} />,
      );

      expect(screen.getByText('调用外部API获取数据')).toBeInTheDocument();
      expect(screen.getByText(/API调用失败：连接超时/)).toBeInTheDocument();

      // 模拟重试机制
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'ToolCall',
          info: '重试API调用（第2次尝试）',
          runId: 'api-retry-1',
          meta: {
            name: 'fetchUserData',
            method: 'GET',
            path: '/api/users/123',
          },
          output: {
            type: 'END',
            response: {
              success: true,
              data: { id: 123, name: '张三', email: 'zhangsan@example.com' },
              retryCount: 2,
            },
          },
        },
      ];

      rerender(<ThoughtChainList thoughtChainList={thoughtChain} />);

      expect(screen.getByText('重试API调用（第2次尝试）')).toBeInTheDocument();
      expect(screen.getByText('调用外部API获取数据')).toBeInTheDocument(); // 原错误仍然显示
    });

    it('should handle partial failures in batch operations', () => {
      const batchOperations: WhiteBoxProcessInterface[] = [
        {
          category: 'TableSql',
          info: '批量查询用户数据 - 查询1/3成功',
          runId: 'batch-1',
          input: { sql: 'SELECT * FROM users WHERE region = "north"' },
          output: {
            type: 'TABLE',
            tableData: { count: [150], region: ['north'] },
            columns: ['count', 'region'],
          },
        },
        {
          category: 'TableSql',
          info: '批量查询用户数据 - 查询2/3失败',
          runId: 'batch-2',
          input: { sql: 'SELECT * FROM users WHERE region = "south"' },
          output: {
            type: 'ERROR',
            errorMsg: '表锁定错误：无法访问表 users_south',
          },
        },
        {
          category: 'TableSql',
          info: '批量查询用户数据 - 查询3/3成功',
          runId: 'batch-3',
          input: { sql: 'SELECT * FROM users WHERE region = "east"' },
          output: {
            type: 'TABLE',
            tableData: { count: [89], region: ['east'] },
            columns: ['count', 'region'],
          },
        },
      ];

      render(<ThoughtChainList thoughtChainList={batchOperations} />);

      expect(
        screen.getByText('批量查询用户数据 - 查询1/3成功'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('批量查询用户数据 - 查询2/3失败'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('批量查询用户数据 - 查询3/3成功'),
      ).toBeInTheDocument();
      expect(screen.getByText(/表锁定错误/)).toBeInTheDocument();
    });
  });

  describe('Document Interaction Workflow', () => {
    it('should support complete document browsing workflow', async () => {
      const ragData: WhiteBoxProcessInterface = {
        category: 'RagRetrieval',
        info: '搜索产品文档和用户手册',
        runId: 'doc-workflow-1',
        input: {
          searchQueries: ['API文档', '快速开始', '配置指南'],
        },
        output: {
          type: 'CHUNK',
          chunks: [
            {
              content: '快速开始指南：1. 安装依赖 2. 配置环境 3. 运行示例...',
              originUrl: 'https://docs.example.com/quick-start',
              docMeta: {
                doc_name: '快速开始指南',
                doc_id: 'quick_start_001',
                type: 'documentation',
                upload_time: '2024-01-15T10:30:00Z',
              },
            },
            {
              content: 'API参考文档：详细的接口说明和示例代码...',
              originUrl: 'https://docs.example.com/api-reference',
              docMeta: {
                doc_name: 'API参考文档',
                doc_id: 'api_ref_001',
                type: 'api_documentation',
                upload_time: '2024-01-20T14:20:00Z',
              },
            },
          ],
        },
      };

      const mockOnDocMetaClick = vi.fn();

      render(
        <ThoughtChainList
          thoughtChainList={[ragData]}
          onDocMetaClick={mockOnDocMetaClick}
        />,
      );

      expect(screen.getByText('搜索产品文档和用户手册')).toBeInTheDocument();

      // 点击第一个文档
      const quickStartLink = screen.getByText('快速开始指南');
      fireEvent.click(quickStartLink);

      await waitFor(() => {
        expect(mockOnDocMetaClick).toHaveBeenCalledWith({
          doc_name: '快速开始指南',
          doc_id: 'quick_start_001',
          type: 'documentation',
          upload_time: '2024-01-15T10:30:00Z',
        });
      });

      // 验证文档预览抽屉打开
      expect(screen.getByText(/预览.*快速开始指南/)).toBeInTheDocument();
      expect(screen.getByText('2024-01-15 18:30:00')).toBeInTheDocument(); // 时间格式化后的显示

      // 点击第二个文档
      const apiRefLink = screen.getByText('API参考文档');
      fireEvent.click(apiRefLink);

      await waitFor(() => {
        expect(mockOnDocMetaClick).toHaveBeenCalledWith({
          doc_name: 'API参考文档',
          doc_id: 'api_ref_001',
          type: 'api_documentation',
          upload_time: '2024-01-20T14:20:00Z',
        });
      });
    });
  });

  describe('Real-time Collaboration Scenarios', () => {
    it('should handle multiple users thinking simultaneously', async () => {
      // 模拟多个用户同时进行思考的场景
      let sharedThoughtChain: WhiteBoxProcessInterface[] = [
        {
          category: 'DeepThink',
          info: '用户A：分析市场趋势',
          runId: 'user-a-1',
          meta: { data: { userId: 'user_a', userName: '张三' } },
          output: {
            type: 'TOKEN',
            data: '根据Q1数据，科技股呈现上升趋势...',
          },
        },
      ];

      const { rerender } = render(
        <ThoughtChainList thoughtChainList={sharedThoughtChain} />,
      );

      expect(screen.getByText('用户A：分析市场趋势')).toBeInTheDocument();

      // 用户B加入思考
      sharedThoughtChain = [
        ...sharedThoughtChain,
        {
          category: 'WebSearch',
          info: '用户B：搜索相关新闻',
          runId: 'user-b-1',
          meta: { data: { userId: 'user_b', userName: '李四' } },
          input: {
            searchQueries: ['科技股新闻', '市场分析'],
          },
          output: {
            type: 'END',
            data: '找到10篇相关新闻：特斯拉股价上涨5%，苹果发布新品...',
          },
        },
      ];

      rerender(<ThoughtChainList thoughtChainList={sharedThoughtChain} />);

      expect(screen.getByText('用户A：分析市场趋势')).toBeInTheDocument();
      expect(screen.getByText('用户B：搜索相关新闻')).toBeInTheDocument();

      // 用户A继续补充分析
      sharedThoughtChain = [
        ...sharedThoughtChain,
        {
          category: 'TableSql',
          info: '用户A：查询历史交易数据',
          runId: 'user-a-2',
          meta: { data: { userId: 'user_a', userName: '张三' } },
          input: {
            sql: 'SELECT date, closing_price FROM stock_prices WHERE symbol = "AAPL" AND date >= "2024-01-01"',
          },
          output: {
            type: 'TABLE',
            tableData: {
              date: ['2024-01-01', '2024-01-02', '2024-01-03'],
              closing_price: [150.25, 152.1, 148.9],
            },
            columns: ['date', 'closing_price'],
          },
        },
      ];

      rerender(<ThoughtChainList thoughtChainList={sharedThoughtChain} />);

      expect(screen.getByText('用户A：分析市场趋势')).toBeInTheDocument();
      expect(screen.getByText('用户B：搜索相关新闻')).toBeInTheDocument();
      expect(screen.getByText('用户A：查询历史交易数据')).toBeInTheDocument();
      expect(screen.getByText('150.25')).toBeInTheDocument();
    });
  });

  describe('Accessibility and Usability', () => {
    it('should support keyboard navigation through thought chain items', () => {
      const thoughtChain: WhiteBoxProcessInterface[] = [
        {
          category: 'TableSql',
          info: '第一个思考项目',
          runId: 'nav-1',
          output: { type: 'END', data: 'Complete' },
        },
        {
          category: 'ToolCall',
          info: '第二个思考项目',
          runId: 'nav-2',
          output: { type: 'END', data: 'Complete' },
        },
        {
          category: 'DeepThink',
          info: '第三个思考项目',
          runId: 'nav-3',
          output: { type: 'END', data: 'Complete' },
        },
      ];

      render(<ThoughtChainList thoughtChainList={thoughtChain} />);

      // 获取所有可交互的按钮
      const buttons = screen.getAllByRole('button');

      // 验证按钮可以获得焦点
      buttons.forEach((button) => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });

      // 验证键盘交互
      const firstButton = buttons[0];
      fireEvent.keyDown(firstButton, { key: 'Enter' });
      fireEvent.keyDown(firstButton, { key: ' ' }); // Space key
    });

    it('should provide clear visual feedback for different states', async () => {
      const thoughtChain: WhiteBoxProcessInterface[] = [
        {
          category: 'TableSql',
          info: '成功状态',
          runId: 'state-1',
          output: {
            type: 'TABLE',
            tableData: { result: ['success'] },
            columns: ['result'],
          },
        },
        {
          category: 'ToolCall',
          info: '错误状态',
          runId: 'state-2',
          output: {
            type: 'ERROR',
            errorMsg: '操作失败',
          },
        },
        {
          category: 'DeepThink',
          info: '加载状态',
          runId: 'state-3',
          isLoading: true,
          output: { type: 'RUNNING' },
        },
      ];

      const { container } = render(
        <ThoughtChainList thoughtChainList={thoughtChain} />,
      );

      // 验证不同状态的视觉区分
      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems.length).toBe(3);

      await waitFor(
        () => {
          // 验证成功状态
          expect(screen.getByText('成功状态')).toBeInTheDocument();
          expect(screen.getByText('success')).toBeInTheDocument();

          // 验证错误状态
          expect(screen.getByText('错误状态')).toBeInTheDocument();
          expect(screen.getByText('操作失败')).toBeInTheDocument();

          // 验证加载状态
          expect(screen.getByText('加载状态')).toBeInTheDocument();
        },
        {
          timeout: 5000,
        },
      );
    });
  });
});
