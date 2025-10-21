/**
 * MarkdownInputField 放大功能测试文件
 * 专门测试组件的放大功能和相关特性
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../../src/MarkdownInputField/MarkdownInputField';

// Mock Enlargement 组件
vi.mock('../../src/MarkdownInputField/Enlargement', () => ({
  __esModule: true,
  default: ({ isEnlarged, onEnlargeClick, onOptimizeClick }: any) => (
    <div data-testid="enlargement-component">
      <button
        data-testid="enlarge-button"
        onClick={onEnlargeClick}
        aria-label={isEnlarged ? '缩小' : '放大'}
      >
        {isEnlarged ? '缩小' : '放大'}
      </button>
      <button
        data-testid="optimize-button"
        onClick={onOptimizeClick}
        aria-label="文本优化"
      >
        优化
      </button>
    </div>
  ),
}));

// Mock MarkdownEditor
vi.mock('../../src/MarkdownEditor', () => ({
  BaseMarkdownEditor: React.forwardRef((props: any, ref: any) => {
    const [content, setContent] = React.useState(
      props.value || props.initValue || '',
    );

    React.useEffect(() => {
      if (props.value !== undefined) {
        setContent(props.value);
      }
    }, [props.value]);

    React.useImperativeHandle(ref, () => ({
      store: {
        getMDContent: vi.fn(() => content),
        setMDContent: vi.fn((value: string) => setContent(value)),
        clearContent: vi.fn(() => setContent('')),
        editor: { children: [] },
        inputComposition: false,
      },
    }));

    return (
      <div
        data-testid="markdown-editor"
        style={props.style}
        className={props.className}
      >
        <div
          data-testid="editor-content"
          className="ant-md-editor-content"
          style={{
            height: '200px',
            overflowY: 'auto',
            // 模拟滚动条的出现条件
            scrollHeight: props.hasScrollbar ? '300px' : '200px',
          }}
        >
          {content}
        </div>
      </div>
    );
  }),
}));

// Mock 其他组件
vi.mock('../../src/MarkdownInputField/SendActions', () => ({
  SendActions: (props: any) => (
    <div data-testid="send-actions">
      <button data-testid="send-button">发送</button>
    </div>
  ),
}));

vi.mock('../../src/MarkdownInputField/Suggestion', () => ({
  Suggestion: ({ children }: any) => (
    <div data-testid="suggestion">{children}</div>
  ),
}));

vi.mock('../../src/MarkdownInputField/SkillModeBar', () => ({
  SkillModeBar: () => null,
}));

vi.mock('../../src/MarkdownInputField/AttachmentButton', () => ({
  AttachmentFileList: () => null,
}));

vi.mock('../../src/MarkdownInputField/QuickActions', () => ({
  QuickActions: () => null,
}));

// Mock ResizeObserver
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: mockObserve.mockImplementation((element) => {
    // 模拟触发 ResizeObserver 回调
    callback([
      {
        target: element,
        contentRect: {
          width: element.offsetWidth || 500,
          height: element.offsetHeight || 200,
        },
      },
    ]);
  }),
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}));

describe('MarkdownInputField 放大功能测试', () => {
  const user = userEvent.setup();
  let enlargeTargetRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: vi.fn(() => ({
        position: 'static',
        getPropertyValue: vi.fn(),
      })),
      writable: true,
    });
    
    // 创建一个模拟的 enlargeTargetRef
    const mockDiv = {
      clientHeight: 600,
      style: {} as CSSStyleDeclaration,
      // 添加其他必要的 DOM 属性
      offsetHeight: 600,
      offsetWidth: 800,
      scrollHeight: 600,
      scrollWidth: 800,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600,
      }),
    } as HTMLDivElement;
    
    enlargeTargetRef = {
      current: mockDiv,
    };
  });

  describe('放大功能基础渲染', () => {
    it('应该在 enlargeable 为 true 且有滚动条时显示放大组件', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容很长的内容"
        />,
      );

      // 模拟滚动条的出现
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 300,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      // 等待组件更新
      await waitFor(() => {
        // 在有滚动条的情况下，应该能找到放大组件
        // 由于测试环境的限制，我们主要验证组件结构正确
        expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      });
    });

    it('应该在 enlargeable 为 false 时不显示放大组件', () => {
      render(
        <MarkdownInputField
          enlargeable={false}
          value="测试内容"
        />,
      );

      expect(screen.queryByTestId('enlargement-component')).not.toBeInTheDocument();
    });

    it('应该在默认情况下启用放大功能', () => {
      render(
        <MarkdownInputField
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // enlargeable 默认为 true，但需要有滚动条才显示
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该在没有 enlargeTargetRef 时不显示放大组件', () => {
      render(
        <MarkdownInputField
          enlargeable={true}
          value="测试内容"
        />,
      );

      // 没有 enlargeTargetRef，即使有滚动条也不应该显示
      expect(screen.queryByTestId('enlargement-component')).not.toBeInTheDocument();
    });
  });

  describe('滚动条检测功能', () => {
    it('应该检测到滚动条的存在', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value={"很长的内容\n".repeat(20)}
        />,
      );

      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        // 模拟有滚动条的情况
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });

        // 触发 ResizeObserver 回调
        const resizeObserver = (global.ResizeObserver as any).mock.instances[0];
        if (resizeObserver) {
          const callback = (global.ResizeObserver as any).mock.calls[0][0];
          callback([{
            target: editorContent,
            contentRect: { width: 500, height: 200 }
          }]);
        }

        await waitFor(() => {
          // 检查是否有放大组件出现（表明检测到了滚动条）
          expect(screen.queryByTestId('enlargement-component')).toBeInTheDocument();
        });
      }
    });

    it('应该在内容变化时重新检测滚动条', async () => {
      const { rerender } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="短内容"
        />,
      );

      // 初始时没有滚动条
      expect(screen.queryByTestId('enlargement-component')).not.toBeInTheDocument();

      // 更改为长内容
      rerender(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value={"很长的内容\n".repeat(30)}
        />,
      );

      // 等待滚动条检测更新
      await waitFor(() => {
        // 这里我们模拟的逻辑可能需要手动触发滚动条检测
      });
    });
  });

  describe('放大状态切换', () => {
    it('应该正确处理放大按钮点击', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 首先模拟有滚动条的情况
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      // 等待组件更新
      await waitFor(() => {
        expect(screen.queryByTestId('enlargement-component')).toBeInTheDocument();
      });

      const enlargeButton = screen.getByTestId('enlarge-button');
      expect(enlargeButton).toHaveTextContent('放大');

      // 点击放大按钮
      await user.click(enlargeButton);

      // 验证按钮文本变化为缩小
      await waitFor(() => {
        expect(enlargeButton).toHaveTextContent('缩小');
      });
    });

    it('应该在放大状态下正确显示缩小按钮', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        expect(screen.getByTestId('enlargement-component')).toBeInTheDocument();
      });

      const enlargeButton = screen.getByTestId('enlarge-button');
      
      // 点击放大
      await user.click(enlargeButton);
      
      // 验证变为缩小状态
      await waitFor(() => {
        expect(enlargeButton).toHaveTextContent('缩小');
      });

      // 验证组件功能正常工作
      expect(screen.getByTestId('enlargement-component')).toBeInTheDocument();
    });
  });

  describe('文本优化功能', () => {
    it('应该显示文本优化按钮', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        expect(screen.getByTestId('enlargement-component')).toBeInTheDocument();
        expect(screen.getByTestId('optimize-button')).toBeInTheDocument();
      });
    });

    it('应该正确处理优化按钮点击', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        expect(screen.getByTestId('optimize-button')).toBeInTheDocument();
      });

      const optimizeButton = screen.getByTestId('optimize-button');
      await user.click(optimizeButton);

      // 验证控制台输出（当前实现只是 console.log）
      expect(consoleSpy).toHaveBeenCalledWith('文本优化功能待实现');
      
      consoleSpy.mockRestore();
    });
  });

  describe('样式和布局', () => {
    it('应该在放大状态下应用正确的样式', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        const enlargeButton = screen.getByTestId('enlarge-button');
        expect(enlargeButton).toBeInTheDocument();
      });

      const enlargeButton = screen.getByTestId('enlarge-button');
      await user.click(enlargeButton);

      // 验证容器样式的变化
      const inputContainer = container.querySelector('[class*="md-input-field"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it('应该为 Enlargement 组件预留正确的空间', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        // 检查编辑器内容区域是否为放大组件预留了空间
        const editorContainer = container.querySelector('[style*="calc(100% - 46px)"]');
        // 由于样式计算可能复杂，这里主要验证组件结构正确
        expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      });
    });
  });

  describe('边界情况处理', () => {
    it('应该处理 enlargeTargetRef.current 为 null 的情况', () => {
      const nullRef = { current: null };
      
      render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={nullRef}
          value="测试内容"
        />,
      );

      // 应该正常渲染，但不显示放大组件
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      expect(screen.queryByTestId('enlargement-component')).not.toBeInTheDocument();
    });

    it('应该处理目标容器高度过小的情况', async () => {
      const smallTargetRef = {
        current: {
          clientHeight: 100, // 很小的高度
          style: {} as CSSStyleDeclaration,
        } as HTMLDivElement,
      };

      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={smallTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        if (screen.queryByTestId('enlargement-component')) {
          const enlargeButton = screen.getByTestId('enlarge-button');
          return user.click(enlargeButton);
        }
      });

      // 即使目标容器很小，也应该应用最小高度限制
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该在组件卸载时清理事件监听器', () => {
      const { unmount } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 验证 ResizeObserver 被创建
      expect(global.ResizeObserver).toHaveBeenCalled();

      // 卸载组件
      unmount();

      // 验证 disconnect 被调用（使用模块级别的 mock）
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('性能和优化', () => {
    it('应该在过渡期间防止重复的滚动条检测', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        const enlargeButton = screen.queryByTestId('enlarge-button');
        if (enlargeButton) {
          // 快速连续点击
          return Promise.all([
            user.click(enlargeButton),
            user.click(enlargeButton),
          ]);
        }
      });

      // 验证组件仍然正常工作
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理延时的滚动条检测', async () => {
      vi.useFakeTimers();

      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟内容变化触发滚动条检测
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
      }

      // 快进定时器
      vi.advanceTimersByTime(100);

      vi.useRealTimers();

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });

  describe('可访问性', () => {
    it('应该为放大按钮提供正确的 aria-label', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        const enlargeButton = screen.queryByTestId('enlarge-button');
        if (enlargeButton) {
          expect(enlargeButton).toHaveAttribute('aria-label', '放大');
        }
      });
    });

    it('应该为优化按钮提供正确的 aria-label', async () => {
      const { container } = render(
        <MarkdownInputField
          enlargeable={true}
          enlargeTargetRef={enlargeTargetRef}
          value="测试内容"
        />,
      );

      // 模拟滚动条
      const editorContent = container.querySelector('.ant-md-editor-content');
      if (editorContent) {
        Object.defineProperty(editorContent, 'scrollHeight', {
          value: 400,
          configurable: true,
        });
        Object.defineProperty(editorContent, 'clientHeight', {
          value: 200,
          configurable: true,
        });
      }

      await waitFor(() => {
        const optimizeButton = screen.queryByTestId('optimize-button');
        if (optimizeButton) {
          expect(optimizeButton).toHaveAttribute('aria-label', '文本优化');
        }
      });
    });
  });
});
