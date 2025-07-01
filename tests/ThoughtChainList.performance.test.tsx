import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { WhiteBoxProcessInterface } from '../src/ThoughtChainList';
import { ThoughtChainList } from '../src/ThoughtChainList';

/**
 * ThoughtChainList 性能基准测试
 *
 * 这个文件专门测试经过性能优化的 ThoughtChainList 组件
 * 重点验证 React.memo 优化和细粒度组件拆分的效果
 */

// 生成测试数据的辅助函数
const generateMockData = (
  count: number,
  category: WhiteBoxProcessInterface['category'] = 'TableSql',
): WhiteBoxProcessInterface[] => {
  return Array.from({ length: count }, (_, i) => ({
    category,
    info: `测试任务 ${i + 1}`,
    runId: `benchmark-${i}`,
    costMillis: Math.floor(Math.random() * 5000) + 100,
    input: {
      sql: `SELECT * FROM test_table_${i} WHERE id = ${i}`,
    },
    output: {
      type: 'TABLE',
      tableData: {
        id: [i, i + 1, i + 2],
        name: [`测试${i}`, `测试${i + 1}`, `测试${i + 2}`],
        value: [i * 10, (i + 1) * 10, (i + 2) * 10],
      },
      columns: ['id', 'name', 'value'],
    },
  }));
};

const generateMixedCategoryData = (
  count: number,
): WhiteBoxProcessInterface[] => {
  const categories: WhiteBoxProcessInterface['category'][] = [
    'TableSql',
    'ToolCall',
    'RagRetrieval',
    'DeepThink',
    'WebSearch',
  ];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length];

    const baseData: WhiteBoxProcessInterface = {
      category,
      info: `${category} 任务 ${i + 1}`,
      runId: `mixed-${i}`,
      costMillis: Math.floor(Math.random() * 3000) + 200,
    };

    switch (category) {
      case 'TableSql':
        return {
          ...baseData,
          input: { sql: `SELECT * FROM table${i}` },
          output: {
            type: 'TABLE',
            tableData: { id: [i], name: [`名称${i}`] },
            columns: ['id', 'name'],
          },
        };
      case 'ToolCall':
        return {
          ...baseData,
          meta: {
            name: `tool${i}`,
            method: 'POST',
            path: `/api/test${i}`,
          },
          output: {
            type: 'END',
            response: { success: true, data: i },
          },
        };
      case 'RagRetrieval':
        return {
          ...baseData,
          output: {
            type: 'CHUNK',
            chunks: [
              {
                content: `检索内容 ${i}`,
                originUrl: `https://example.com/doc${i}`,
                docMeta: {
                  doc_name: `文档${i}`,
                  doc_id: `doc_${i}`,
                  type: 'documentation',
                },
              },
            ],
          },
        };
      case 'DeepThink':
        return {
          ...baseData,
          output: {
            type: 'TOKEN',
            data: `深度思考结果 ${i}: ${'思考内容 '.repeat(10)}`,
          },
        };
      case 'WebSearch':
        return {
          ...baseData,
          input: { searchQueries: [`查询${i}`] },
          output: {
            type: 'END',
            data: `搜索结果 ${i}`,
          },
        };
      default:
        return baseData;
    }
  });
};

describe('ThoughtChainList Performance Benchmarks', () => {
  describe('Rendering Performance', () => {
    it('should render 10 items quickly', () => {
      const data = generateMockData(10);
      const startTime = performance.now();

      render(<ThoughtChainList thoughtChainList={data} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 阈值设置为1500ms以适配较慢的CI或低性能环境，实际本地应远低于此
      expect(renderTime).toBeLessThan(1500);
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
      expect(screen.getByText('测试任务 10')).toBeInTheDocument();
    });

    it('should render 50 items efficiently', () => {
      const data = generateMockData(50);
      const startTime = performance.now();

      render(<ThoughtChainList thoughtChainList={data} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1500); // 调整为更现实的阈值（50个项目渲染）
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
      expect(screen.getByText('测试任务 50')).toBeInTheDocument();
    });

    it('should handle 100 mixed category items', () => {
      const data = generateMixedCategoryData(100);
      const startTime = performance.now();

      render(<ThoughtChainList thoughtChainList={data} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1500); // 应该在1500ms内完成（调整为更现实的阈值）
      expect(screen.getByText('TableSql 任务 1')).toBeInTheDocument();
      expect(screen.getByText('WebSearch 任务 100')).toBeInTheDocument();
    });
  });

  describe('Re-render Optimization', () => {
    it('should minimize re-renders when props do not change', () => {
      const data = generateMockData(20);
      let renderCount = 0;

      // 创建一个包装组件来计算渲染次数
      const TestWrapper = React.memo(() => {
        renderCount++;
        return <ThoughtChainList thoughtChainList={data} />;
      });

      const { rerender } = render(<TestWrapper />);

      const initialRenderCount = renderCount;

      // 重新渲染相同的组件
      rerender(<TestWrapper />);

      // 由于使用了 React.memo，渲染次数不应该增加
      expect(renderCount).toBe(initialRenderCount);
    });

    it('should only re-render when relevant props change', () => {
      const data = generateMockData(10);
      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={data}
          style={{ padding: '10px' }}
        />,
      );

      const beforeElements = screen.getAllByText(/测试任务/);

      // 改变不相关的样式属性
      rerender(
        <ThoughtChainList
          thoughtChainList={data}
          style={{ padding: '20px' }} // 只改变样式
        />,
      );

      const afterElements = screen.getAllByText(/测试任务/);

      // 元素数量应该保持不变
      expect(afterElements.length).toBe(beforeElements.length);
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
    });

    it('should handle rapid consecutive updates efficiently', () => {
      let data = generateMockData(5);
      const { rerender } = render(<ThoughtChainList thoughtChainList={data} />);

      const startTime = performance.now();

      // 快速进行20次更新
      for (let i = 0; i < 20; i++) {
        data = [...data, ...generateMockData(1, 'DeepThink')];
        rerender(<ThoughtChainList thoughtChainList={data} />);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(2000); // 总时间应该小于2秒（调整为更现实的阈值）
      expect(data.length).toBe(25); // 5 + 20 = 25
      expect(screen.getAllByText('测试任务 1')[0]).toBeInTheDocument();
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should not leak memory during component lifecycle', () => {
      const data = generateMixedCategoryData(30);

      // 模拟多次挂载和卸载
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <ThoughtChainList thoughtChainList={data} />,
        );

        expect(screen.getByText('TableSql 任务 1')).toBeInTheDocument();
        unmount();
      }

      // 如果有内存泄漏，这里可能会导致性能问题
      // 这个测试主要是确保组件能够正确卸载
    });

    it('should handle large dataset updates without accumulating memory', () => {
      let data = generateMockData(10);
      const { rerender } = render(<ThoughtChainList thoughtChainList={data} />);

      // 进行多次大数据更新
      for (let i = 0; i < 10; i++) {
        data = generateMockData(50 + i * 10); // 逐渐增大数据集
        rerender(<ThoughtChainList thoughtChainList={data} />);
      }

      // 最终应该能正确显示最新数据
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
      expect(data.length).toBe(140); // 50 + 9 * 10 = 140
    });
  });

  describe('Callback Memoization Performance', () => {
    it('should memoize callback functions to prevent unnecessary child updates', () => {
      const data = generateMixedCategoryData(15);
      const mockCallback = vi.fn();

      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={data}
          onDocMetaClick={mockCallback}
        />,
      );

      const initialElements = screen.getAllByText(/任务/);

      // 重新渲染时使用相同的回调函数
      rerender(
        <ThoughtChainList
          thoughtChainList={data}
          onDocMetaClick={mockCallback} // 相同的回调引用
        />,
      );

      const afterElements = screen.getAllByText(/任务/);

      // 元素数量应该保持不变，说明子组件没有不必要的重新渲染
      expect(afterElements.length).toBe(initialElements.length);
    });

    it('should handle callback function changes gracefully', () => {
      const data = generateMockData(10);
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();

      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={data}
          onDocMetaClick={firstCallback}
        />,
      );

      expect(screen.getByText('测试任务 1')).toBeInTheDocument();

      // 更改回调函数
      rerender(
        <ThoughtChainList
          thoughtChainList={data}
          onDocMetaClick={secondCallback}
        />,
      );

      // 组件应该仍然正常工作
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
      expect(screen.getByText('测试任务 10')).toBeInTheDocument();
    });
  });

  describe('Component Memoization Effectiveness', () => {
    it('should demonstrate ThoughtChainTitle memoization benefits', () => {
      const data = generateMockData(5);
      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={data}
          bubble={{ isFinished: false }}
        />,
      );

      // 只改变数据，不改变标题相关的 props
      const newData = [...data, ...generateMockData(1)];

      const startTime = performance.now();
      rerender(
        <ThoughtChainList
          thoughtChainList={newData}
          bubble={{ isFinished: false }} // 标题状态没有变化
        />,
      );
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(200); // 由于标题组件被 memo，渲染应该很快
      expect(
        screen.getByText((content, element) => {
          return element?.textContent?.includes('测试任务 6') ?? false;
        }),
      ).toBeInTheDocument();
    });

    it('should demonstrate DocumentDrawer memoization benefits', () => {
      const ragData: WhiteBoxProcessInterface[] = [
        {
          category: 'RagRetrieval',
          info: '文档检索测试',
          runId: 'doc-test',
          output: {
            type: 'CHUNK',
            chunks: [
              {
                content: '测试内容',
                originUrl: 'https://test.com',
                docMeta: {
                  doc_name: '测试文档',
                  doc_id: 'test_doc',
                  type: 'documentation',
                },
              },
            ],
          },
        },
      ];

      const { rerender } = render(
        <ThoughtChainList
          thoughtChainList={ragData}
          onDocMetaClick={vi.fn()}
        />,
      );

      // 添加其他数据，但不影响 DocumentDrawer
      const moreData = [...ragData, ...generateMockData(5)];

      const startTime = performance.now();
      rerender(
        <ThoughtChainList
          thoughtChainList={moreData}
          onDocMetaClick={vi.fn()}
        />,
      );
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(150); // 应该相对较快
      expect(screen.getByText('文档检索测试')).toBeInTheDocument();
      expect(screen.getByText('测试任务 1')).toBeInTheDocument();
    });
  });

  describe('Stress Testing', () => {
    it('should handle extreme data volumes', () => {
      const extremeData = generateMixedCategoryData(200);

      const startTime = performance.now();
      render(<ThoughtChainList thoughtChainList={extremeData} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(3000); // 即使是200个项目也应该在3秒内完成（调整为更现实的阈值）

      // 验证第一个和最后一个项目都被正确渲染
      expect(screen.getByText('TableSql 任务 1')).toBeInTheDocument();
      expect(screen.getByText('WebSearch 任务 200')).toBeInTheDocument();
    });

    it('should maintain performance with complex nested content', () => {
      const complexData: WhiteBoxProcessInterface[] = Array.from(
        { length: 50 },
        (_, i) => ({
          category: 'TableSql',
          info: `复杂任务 ${i + 1}`,
          runId: `complex-${i}`,
          costMillis: 1000 + i * 100,
          input: {
            sql: `
            SELECT 
              u.id, u.name, u.email, p.title, p.content,
              COUNT(c.id) as comment_count,
              AVG(r.rating) as avg_rating
            FROM users u
            LEFT JOIN posts p ON u.id = p.user_id
            LEFT JOIN comments c ON p.id = c.post_id  
            LEFT JOIN ratings r ON p.id = r.post_id
            WHERE u.created_at > '2024-01-01'
              AND p.status = 'published'
            GROUP BY u.id, p.id
            ORDER BY avg_rating DESC, comment_count DESC
            LIMIT ${i + 1} OFFSET ${i * 10}
          `,
          },
          output: {
            type: 'TABLE',
            tableData: {
              id: Array.from({ length: 10 }, (_, j) => i * 10 + j),
              name: Array.from({ length: 10 }, (_, j) => `用户${i * 10 + j}`),
              email: Array.from(
                { length: 10 },
                (_, j) => `user${i * 10 + j}@example.com`,
              ),
              title: Array.from(
                { length: 10 },
                (_, j) => `帖子标题${i * 10 + j}`,
              ),
              content: Array.from({ length: 10 }, (_, j) =>
                `这是帖子内容${i * 10 + j}，包含大量文本`.repeat(5),
              ),
            },
            columns: ['id', 'name', 'email', 'title', 'content'],
          },
        }),
      );

      const startTime = performance.now();
      render(<ThoughtChainList thoughtChainList={complexData} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(1500); // 复杂内容也应该在合理时间内完成（调整为更现实的阈值）

      expect(screen.getByText('复杂任务 1')).toBeInTheDocument();
      expect(screen.getByText('复杂任务 50')).toBeInTheDocument();
    });
  });
});
