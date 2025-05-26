import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { WhiteBoxProcessInterface } from '../src/ThoughtChainList';
import { ThoughtChainList } from '../src/ThoughtChainList';

// Mock data for different categories
const mockTableSqlData: WhiteBoxProcessInterface = {
  category: 'TableSql',
  info: '查询用户表数据',
  costMillis: 1200,
  runId: 'sql-001',
  input: {
    sql: "SELECT * FROM users WHERE status = 'active'",
  },
  output: {
    type: 'TABLE',
    tableData: {
      id: [1, 2, 3],
      name: ['张三', '李四', '王五'],
      status: ['active', 'active', 'active'],
    },
    columns: ['id', 'name', 'status'],
  },
};

const mockToolCallData: WhiteBoxProcessInterface = {
  category: 'ToolCall',
  info: '调用用户信息接口',
  runId: 'tool-001',
  input: {
    inputArgs: {
      requestBody: { userId: 123 },
      parameters: { id: '123' },
      params: { include: 'profile' },
    },
  },
  meta: {
    name: 'getUserInfo',
    method: 'GET',
    path: '/api/users/123',
    description: '获取用户详细信息',
  },
  output: {
    type: 'END',
    response: {
      error: false,
      data: { id: 123, name: '张三', email: 'zhangsan@example.com' },
    },
  },
};

const mockRagRetrievalData: WhiteBoxProcessInterface = {
  category: 'RagRetrieval',
  info: '检索产品文档',
  runId: 'rag-001',
  input: {
    searchQueries: ['产品功能', '使用指南'],
  },
  output: {
    type: 'CHUNK',
    chunks: [
      {
        content: '产品主要功能包括用户管理、数据分析和报表生成...',
        originUrl: 'https://docs.example.com/features',
        docMeta: {
          doc_name: '产品功能说明',
          doc_id: 'doc_001',
          type: 'documentation',
        },
      },
    ],
  },
};

const mockDeepThinkData: WhiteBoxProcessInterface = {
  category: 'DeepThink',
  info: '分析市场趋势',
  runId: 'think-001',
  output: {
    type: 'TOKEN',
    data: '根据最新的市场数据分析，科技股在本季度表现强劲，主要驱动因素包括...',
  },
};

const mockWebSearchData: WhiteBoxProcessInterface = {
  category: 'WebSearch',
  info: '搜索最新技术资讯',
  runId: 'search-001',
  input: {
    searchQueries: ['AI 发展趋势', '机器学习应用'],
  },
  output: {
    type: 'END',
    data: `搜索结果：

1. **AI 技术发展报告 2024** - tech.example.com
   人工智能技术在 2024 年呈现出快速发展的趋势...

2. **机器学习在金融领域的应用** - finance.example.com
   机器学习技术正在革命性地改变金融行业...`,
  },
};

const mockErrorData: WhiteBoxProcessInterface = {
  category: 'ToolCall',
  info: '调用支付接口失败',
  runId: 'error-001',
  output: {
    type: 'ERROR',
    errorMsg: 'API 请求失败：网络连接超时',
  },
};

const mockLoadingData: WhiteBoxProcessInterface = {
  category: 'DeepThink',
  info: '正在分析数据...',
  runId: 'loading-001',
  isLoading: true,
  output: {
    type: 'RUNNING',
  },
};

describe('ThoughtChainList', () => {
  // 基础渲染测试
  describe('Basic Rendering', () => {
    it('should render empty list correctly', () => {
      render(<ThoughtChainList thoughtChainList={[]} />);
      expect(screen.queryByRole('list')).toBeInTheDocument();
    });

    it('should render with single item', () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);
      expect(screen.getByText('查询用户表数据')).toBeInTheDocument();
    });

    it('should render multiple items', () => {
      const multipleItems = [
        mockTableSqlData,
        mockToolCallData,
        mockRagRetrievalData,
      ];
      render(<ThoughtChainList thoughtChainList={multipleItems} />);

      expect(screen.getByText('查询用户表数据')).toBeInTheDocument();
      expect(screen.getByText('调用用户信息接口')).toBeInTheDocument();
      expect(screen.getByText('检索产品文档')).toBeInTheDocument();
    });
  });

  // Category 类型测试
  describe('Category Types', () => {
    it('should render TableSql category correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);

      expect(screen.getByText('查询用户表数据')).toBeInTheDocument();
      expect(
        screen.getByText("SELECT * FROM users WHERE status = 'active'"),
      ).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('王五')).toBeInTheDocument();
    });

    it('should render ToolCall category correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockToolCallData]} />);

      expect(screen.getByText('调用用户信息接口')).toBeInTheDocument();
      expect(screen.getByText('getUserInfo')).toBeInTheDocument();
      expect(screen.getByText('GET')).toBeInTheDocument();
      expect(screen.getByText('/api/users/123')).toBeInTheDocument();
    });

    it('should render RagRetrieval category correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockRagRetrievalData]} />);

      expect(screen.getByText('检索产品文档')).toBeInTheDocument();
      expect(screen.getByText('产品功能')).toBeInTheDocument();
      expect(screen.getByText('使用指南')).toBeInTheDocument();
      expect(
        screen.getByText('产品主要功能包括用户管理、数据分析和报表生成...'),
      ).toBeInTheDocument();
    });

    it('should render DeepThink category correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockDeepThinkData]} />);

      expect(screen.getByText('分析市场趋势')).toBeInTheDocument();
      expect(
        screen.getByText(
          '根据最新的市场数据分析，科技股在本季度表现强劲，主要驱动因素包括...',
        ),
      ).toBeInTheDocument();
    });

    it('should render WebSearch category correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockWebSearchData]} />);

      expect(screen.getByText('搜索最新技术资讯')).toBeInTheDocument();
      expect(screen.getByText('AI 发展趋势')).toBeInTheDocument();
      expect(screen.getByText('机器学习应用')).toBeInTheDocument();
    });
  });

  // 状态测试
  describe('States', () => {
    it('should render error state correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockErrorData]} />);

      expect(screen.getByText('调用支付接口失败')).toBeInTheDocument();
      expect(
        screen.getByText('API 请求失败：网络连接超时'),
      ).toBeInTheDocument();
    });

    it('should render loading state correctly', () => {
      render(<ThoughtChainList thoughtChainList={[mockLoadingData]} />);

      expect(screen.getByText('正在分析数据...')).toBeInTheDocument();
      // 检查是否有加载指示器
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show cost time when provided', () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);

      expect(screen.getByText('1.2s')).toBeInTheDocument();
    });
  });

  // 交互测试
  describe('Interactions', () => {
    it('should toggle collapse/expand on click', async () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);

      const collapseButtons = screen.getAllByRole('button', {
        name: /收起|展开|collapse|expand/i,
      });
      const collapseButton = collapseButtons[0]; // 使用第一个按钮

      // 初始状态应该是展开的
      expect(
        screen.getAllByText("SELECT * FROM users WHERE status = 'active'")[0],
      ).toBeVisible();

      // 点击折叠
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(
          screen.queryByText("SELECT * FROM users WHERE status = 'active'"),
        ).not.toBeVisible();
      });

      // 再次点击展开
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(
          screen.getAllByText("SELECT * FROM users WHERE status = 'active'")[0],
        ).toBeVisible();
      });
    });

    it('should handle document meta click for RagRetrieval', () => {
      const mockOnMetaClick = vi.fn();
      render(
        <ThoughtChainList
          thoughtChainList={[mockRagRetrievalData]}
          onDocMetaClick={mockOnMetaClick}
        />,
      );

      const docLink = screen.getByText('产品功能说明');
      fireEvent.click(docLink);

      expect(mockOnMetaClick).toHaveBeenCalledWith({
        doc_name: '产品功能说明',
        doc_id: 'doc_001',
        type: 'documentation',
      });
    });
  });

  // Props 测试
  describe('Props', () => {
    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red', padding: '20px' };
      const { container } = render(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          style={customStyle}
        />,
      );

      const thoughtChainElement = container.firstChild as HTMLElement;
      expect(thoughtChainElement).toHaveStyle(
        'background-color: rgb(255, 0, 0)',
      );
      expect(thoughtChainElement).toHaveStyle('padding: 20px');
    });

    it('should render in compact mode', () => {
      const { container } = render(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          compact={true}
        />,
      );

      expect(
        container.querySelector('.ant-thought-chain-list-content-compact'),
      ).toBeInTheDocument();
    });

    it('should show loading state when loading prop is true', () => {
      const loadingData: WhiteBoxProcessInterface = {
        category: 'DeepThink',
        info: '正在思考中...',
        runId: 'loading-001',
        isLoading: true,
      };

      render(
        <ThoughtChainList thoughtChainList={[loadingData]} loading={true} />,
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should use custom locale', () => {
      const customLocale = {
        thinking: '思考中...',
        taskFinished: '任务已完成',
        taskCost: '用时',
      };

      render(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          locale={customLocale}
          chatItem={{ isFinished: true }}
        />,
      );

      expect(screen.getByText('任务已完成')).toBeInTheDocument();
    });

    it('should handle chatItem states', () => {
      const chatItem = {
        isFinished: true,
        endTime: Date.now(),
        createAt: Date.now() - 5000,
        isAborted: false,
      };

      render(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          chatItem={chatItem}
        />,
      );

      // 应该显示完成状态
      expect(screen.getByText(/任务完成|task finished/i)).toBeInTheDocument();
    });

    it('should auto-collapse when finished if finishAutoCollapse is true', async () => {
      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          finishAutoCollapse={true}
          chatItem={{ isFinished: false }}
        />,
      );

      // 初始状态应该是展开的
      expect(
        screen.getByText("SELECT * FROM users WHERE status = 'active'"),
      ).toBeInTheDocument();

      // 更新为完成状态
      rerender(
        <ThoughtChainList
          thoughtChainList={[mockTableSqlData]}
          finishAutoCollapse={true}
          chatItem={{ isFinished: true }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.queryByText("SELECT * FROM users WHERE status = 'active'"),
        ).not.toBeVisible();
      });
    });
  });

  // 边界情况测试
  describe('Edge Cases', () => {
    it('should handle empty output gracefully', () => {
      const emptyOutputData: WhiteBoxProcessInterface = {
        category: 'DeepThink',
        info: '空输出测试',
        runId: 'empty-001',
      };

      render(<ThoughtChainList thoughtChainList={[emptyOutputData]} />);
      expect(screen.getByText('空输出测试')).toBeInTheDocument();
    });

    it('should handle invalid category gracefully', () => {
      const invalidCategoryData: WhiteBoxProcessInterface = {
        category: 'InvalidCategory' as any,
        info: '无效分类测试',
        runId: 'invalid-001',
      };

      render(<ThoughtChainList thoughtChainList={[invalidCategoryData]} />);
      expect(screen.getByText('无效分类测试')).toBeInTheDocument();
    });

    it('should handle missing meta data', () => {
      const noMetaData: WhiteBoxProcessInterface = {
        category: 'ToolCall',
        info: '无元数据测试',
        runId: 'no-meta-001',
        output: {
          type: 'END',
          response: { data: 'success' },
        },
      };

      render(<ThoughtChainList thoughtChainList={[noMetaData]} />);
      expect(screen.getByText('无元数据测试')).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContentData: WhiteBoxProcessInterface = {
        category: 'DeepThink',
        info: '长内容测试',
        runId: 'long-001',
        output: {
          type: 'TOKEN',
          data: 'A'.repeat(10000), // 10000 个字符的长内容
        },
      };

      render(<ThoughtChainList thoughtChainList={[longContentData]} />);
      expect(screen.getByText('长内容测试')).toBeInTheDocument();
    });
  });

  // 性能测试
  describe('Performance', () => {
    it('should handle large number of items', () => {
      const largeList = Array.from({ length: 100 }, (_, index) => ({
        ...mockTableSqlData,
        runId: `item-${index}`,
        info: `查询数据 ${index}`,
      }));

      const startTime = performance.now();
      render(<ThoughtChainList thoughtChainList={largeList} />);
      const endTime = performance.now();

      // 渲染时间应该在合理范围内（小于 5000ms）
      expect(endTime - startTime).toBeLessThan(5000);

      // 检查第一个和最后一个项目是否正确渲染
      expect(screen.getByText('查询数据 0')).toBeInTheDocument();
      expect(screen.getByText('查询数据 99')).toBeInTheDocument();
    });
  });

  // 可访问性测试
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<ThoughtChainList thoughtChainList={[mockTableSqlData]} />);

      const collapseButtons = screen.getAllByRole('button', {
        name: /收起|展开|collapse|expand/i,
      });
      const collapseButton = collapseButtons[0]; // 使用第一个按钮

      // 测试键盘焦点
      collapseButton.focus();
      expect(document.activeElement).toBe(collapseButton);

      // 测试 Enter 键
      fireEvent.keyDown(collapseButton, { key: 'Enter' });
      // 应该触发折叠/展开
    });
  });
});
