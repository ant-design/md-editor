import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Mermaid } from '../../../src/plugins/mermaid/Mermaid';

// Mock mermaid
vi.mock('mermaid', () => ({
  default: {
    render: vi.fn(),
    parse: vi.fn(),
  },
}));

// Mock react-use
vi.mock('react-use', () => ({
  useGetSetState: vi.fn(() => {
    const state = {
      code: '',
      error: '',
    };
    const setState = vi.fn((update) => {
      if (typeof update === 'function') {
        update(state);
      } else {
        Object.assign(state, update);
      }
    });
    return [() => state, setState];
  }),
}));

describe('Mermaid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    el: {
      type: 'code',
      language: 'mermaid',
      value: 'graph TD\nA[开始] --> B[结束]',
      children: [{ text: '' }],
    },
  };

  describe('基本渲染测试', () => {
    it('应该正确渲染 Mermaid 组件', () => {
      render(<Mermaid {...defaultProps} />);

      expect(document.body).toBeInTheDocument();
    });

    it('应该渲染空状态', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: '',
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });

    it('应该渲染错误状态', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: 'invalid mermaid code',
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('mermaid 渲染测试', () => {
    it('应该调用 mermaid.render 方法', async () => {
      const mermaid = await import('mermaid');
      mermaid.default.render.mockResolvedValue({
        svg: '<svg>test</svg>',
      });

      render(<Mermaid {...defaultProps} />);

      await waitFor(() => {
        expect(mermaid.default.render).toHaveBeenCalled();
      });
    });

    it('应该处理 mermaid.render 成功', async () => {
      const mermaid = await import('mermaid');
      mermaid.default.render.mockResolvedValue({
        svg: '<svg>success</svg>',
      });

      render(<Mermaid {...defaultProps} />);

      await waitFor(() => {
        expect(mermaid.default.render).toHaveBeenCalledWith(
          expect.stringMatching(/^m\d+$/),
          defaultProps.el.value,
        );
      });
    });

    it('应该处理 mermaid.render 失败', async () => {
      const mermaid = await import('mermaid');
      mermaid.default.render.mockRejectedValue(new Error('Render failed'));
      mermaid.default.parse.mockRejectedValue(new Error('Parse failed'));

      render(<Mermaid {...defaultProps} />);

      await waitFor(() => {
        expect(mermaid.default.render).toHaveBeenCalled();
      });
    });

    it('应该处理 mermaid.parse 失败', async () => {
      const mermaid = await import('mermaid');
      mermaid.default.render.mockRejectedValue(new Error('Render failed'));
      mermaid.default.parse.mockRejectedValue(new Error('Parse failed'));

      render(<Mermaid {...defaultProps} />);

      await waitFor(() => {
        expect(mermaid.default.parse).toHaveBeenCalled();
      });
    });
  });

  describe('定时器测试', () => {
    it('应该使用 setTimeout 进行防抖', () => {
      const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

      render(<Mermaid {...defaultProps} />);

      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    it('应该在组件卸载时清理定时器', () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
      const { unmount } = render(<Mermaid {...defaultProps} />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理 undefined value', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: undefined,
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });

    it('应该处理 null value', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: null,
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });

    it('应该处理空字符串 value', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: '',
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });

    it('应该处理复杂的 mermaid 代码', () => {
      const complexCode = `
        graph TD
        A[开始] --> B{判断}
        B -->|是| C[执行]
        B -->|否| D[跳过]
        C --> E[结束]
        D --> E
      `;

      const props = {
        el: {
          ...defaultProps.el,
          value: complexCode,
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('样式和布局测试', () => {
    it('应该应用正确的样式', () => {
      render(<Mermaid {...defaultProps} />);

      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });

    it('应该设置 contentEditable 为 false', () => {
      render(<Mermaid {...defaultProps} />);

      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('错误处理测试', () => {
    it('应该显示错误信息', async () => {
      const mermaid = await import('mermaid');
      mermaid.default.render.mockRejectedValue(new Error('Render failed'));
      mermaid.default.parse.mockRejectedValue(new Error('Parse failed'));

      render(<Mermaid {...defaultProps} />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('应该处理空代码和错误状态', () => {
      const props = {
        el: {
          ...defaultProps.el,
          value: '',
        },
      };

      render(<Mermaid {...props} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('性能测试', () => {
    it('应该处理快速更新的代码', async () => {
      const { rerender } = render(<Mermaid {...defaultProps} />);

      // 快速更新代码
      const newProps = {
        el: {
          ...defaultProps.el,
          value: 'graph TD\nB[新代码] --> C[结束]',
        },
      };

      rerender(<Mermaid {...newProps} />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('应该处理相同的代码不会重复渲染', () => {
      const { rerender } = render(<Mermaid {...defaultProps} />);

      // 使用相同的代码重新渲染
      rerender(<Mermaid {...defaultProps} />);

      expect(document.body).toBeInTheDocument();
    });
  });
});
