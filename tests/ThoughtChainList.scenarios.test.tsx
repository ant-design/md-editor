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
  describe('AI Assistant Conversation Flow', () => {
    it('should simulate complete AI assistant thinking process', async () => {
      // 模拟 AI 助手处理用户查询的完整流程
      let thoughtChain: WhiteBoxProcessInterface[] = [];

      const { rerender } = render(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      // 第一步：开始深度思考
      thoughtChain = [
        {
          category: 'DeepThink',
          info: '理解用户问题：如何优化数据库查询性能？',
          runId: 'think-1',
          isLoading: true,
          output: { type: 'RUNNING' },
        },
      ];

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(
        screen.getByText('理解用户问题：如何优化数据库查询性能？'),
      ).toBeInTheDocument();

      // 第二步：搜索相关资料
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'WebSearch',
          info: '搜索数据库优化最佳实践',
          runId: 'search-1',
          input: {
            searchQueries: ['数据库查询优化', 'SQL性能调优', '索引优化策略'],
          },
          isLoading: true,
          output: { type: 'RUNNING' },
        },
      ];

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(screen.getByText('搜索数据库优化最佳实践')).toBeInTheDocument();

      // 第三步：检索知识库
      thoughtChain[1] = {
        ...thoughtChain[1],
        isLoading: false,
        output: {
          type: 'END',
          data: '找到3篇相关文章：数据库索引优化指南、SQL查询性能调优、分析执行计划的方法',
        },
      };

      thoughtChain = [
        ...thoughtChain,
        {
          category: 'RagRetrieval',
          info: '检索数据库优化相关文档',
          runId: 'rag-1',
          input: {
            searchQueries: ['数据库优化', '查询性能'],
          },
          output: {
            type: 'CHUNK',
            chunks: [
              {
                content:
                  '数据库查询优化的关键策略包括：1. 合理使用索引 2. 优化查询语句 3. 分析执行计划...',
                originUrl: 'https://docs.example.com/db-optimization',
                docMeta: {
                  doc_name: '数据库优化指南',
                  doc_id: 'db_guide_001',
                  type: 'documentation',
                },
              },
            ],
          },
        },
      ];

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(screen.getByText('检索数据库优化相关文档')).toBeInTheDocument();
      expect(screen.getByText('数据库优化指南')).toBeInTheDocument();

      // 第四步：分析具体查询
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'TableSql',
          info: '分析用户提供的查询语句',
          runId: 'sql-1',
          input: {
            sql: `SELECT u.*, p.title, COUNT(c.id) as comment_count
                  FROM users u 
                  LEFT JOIN posts p ON u.id = p.user_id
                  LEFT JOIN comments c ON p.id = c.post_id
                  WHERE u.created_at > '2023-01-01'
                  GROUP BY u.id
                  ORDER BY comment_count DESC`,
          },
          output: {
            type: 'TABLE',
            tableData: {
              suggestion: ['添加索引', '优化JOIN', '限制结果集'],
              impact: ['高', '中', '低'],
              implementation: [
                'CREATE INDEX idx_user_created_at',
                'INNER JOIN if possible',
                'ADD LIMIT clause',
              ],
            },
            columns: ['suggestion', 'impact', 'implementation'],
          },
        },
      ];

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(screen.getByText('分析用户提供的查询语句')).toBeInTheDocument();
      expect(screen.getByText('添加索引')).toBeInTheDocument();

      // 第五步：调用优化工具
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'ToolCall',
          info: '使用数据库分析工具生成优化建议',
          runId: 'tool-1',
          meta: {
            name: 'analyzeQuery',
            method: 'POST',
            path: '/api/database/analyze',
            description: '分析SQL查询并提供优化建议',
          },
          output: {
            type: 'END',
            response: {
              optimizations: [
                'Add index on users.created_at',
                'Consider pagination for large result sets',
                'Use EXISTS instead of LEFT JOIN where appropriate',
              ],
              estimatedImprovement: '75% performance gain',
            },
          },
        },
      ];

      rerender(
        <ThoughtChainList
          thoughtChainList={thoughtChain}
          loading={false}
          bubble={{
            isFinished: true,
            endTime: Date.now(),
            createAt: Date.now() - 15000,
          }}
        />,
      );

      expect(
        screen.getByText((content, element) => {
          return (
            element?.textContent?.includes('使用数据库分析工具生成优化建议') ??
            false
          );
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/任务完成.*15(\.\d+)?s/)).toBeInTheDocument();

      // 验证所有步骤都在页面上
      expect(
        screen.getByText('理解用户问题：如何优化数据库查询性能？'),
      ).toBeInTheDocument();
      expect(screen.getByText('搜索数据库优化最佳实践')).toBeInTheDocument();
      expect(screen.getByText('检索数据库优化相关文档')).toBeInTheDocument();
      expect(screen.getByText('分析用户提供的查询语句')).toBeInTheDocument();
      expect(
        screen.getByText('使用数据库分析工具生成优化建议'),
      ).toBeInTheDocument();
    });
  });

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

  describe('Progressive Enhancement Scenarios', () => {
    it('should gracefully handle loading states during progressive data loading', async () => {
      // 模拟渐进式数据加载
      let thoughtChain: WhiteBoxProcessInterface[] = [
        {
          category: 'DeepThink',
          info: '正在分析复杂问题...',
          runId: 'progressive-1',
          isLoading: true,
          output: { type: 'RUNNING' },
        },
      ];

      const { rerender } = render(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(screen.getByText('正在分析复杂问题...')).toBeInTheDocument();

      // 第一阶段：部分结果
      thoughtChain[0] = {
        ...thoughtChain[0],
        output: {
          type: 'TOKEN',
          data: '初步分析结果：问题可以分解为三个子问题...',
        },
      };

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(
        screen.getByText((content, element) => {
          return (
            element?.textContent?.includes(
              '初步分析结果：问题可以分解为三个子问题',
            ) ?? false
          );
        }),
      ).toBeInTheDocument();

      // 第二阶段：添加更多分析
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'DeepThink',
          info: '深入分析子问题1',
          runId: 'progressive-2',
          output: {
            type: 'TOKEN',
            data: '子问题1的详细分析：需要考虑用户体验、技术可行性和商业价值...',
          },
        },
      ];

      rerender(
        <ThoughtChainList thoughtChainList={thoughtChain} loading={true} />,
      );

      expect(screen.getByText('深入分析子问题1')).toBeInTheDocument();

      // 第三阶段：完成所有分析
      thoughtChain = [
        ...thoughtChain,
        {
          category: 'DeepThink',
          info: '综合分析结论',
          runId: 'progressive-3',
          output: {
            type: 'END',
            data: '综合所有分析，推荐采用渐进式实施方案，优先级为：用户体验 > 技术架构 > 商业模式',
          },
        },
      ];

      rerender(
        <ThoughtChainList
          thoughtChainList={thoughtChain}
          loading={false}
          bubble={{ isFinished: true }}
        />,
      );

      expect(screen.getByText('综合分析结论')).toBeInTheDocument();
      expect(screen.getByText(/推荐采用渐进式实施方案/)).toBeInTheDocument();
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

    it('should provide clear visual feedback for different states', () => {
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

      // 验证成功状态
      expect(screen.getByText('成功状态')).toBeInTheDocument();
      expect(screen.getByText('success')).toBeInTheDocument();

      // 验证错误状态
      expect(screen.getByText('错误状态')).toBeInTheDocument();
      expect(screen.getByText('操作失败')).toBeInTheDocument();

      // 验证加载状态
      expect(screen.getByText('加载状态')).toBeInTheDocument();
    });
  });
});
