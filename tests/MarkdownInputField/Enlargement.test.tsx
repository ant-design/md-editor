import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Enlargement from '../../src/MarkdownInputField/Enlargement';

// Mock icons
vi.mock('@sofa-design/icons', () => ({
  ExpandAlt: ({ ...props }) => (
    <div data-testid="expand-alt-icon" {...props}>
      ExpandAlt
    </div>
  ),
  FoldAlt: ({ ...props }) => (
    <div data-testid="fold-alt-icon" {...props}>
      FoldAlt
    </div>
  ),
}));

// Mock style hook
vi.mock('../../src/MarkdownInputField/Enlargement/style', () => ({
  useStyle: vi.fn(() => ({
    wrapSSR: (component: React.ReactNode) => component,
    hashId: 'test-hash-id',
  })),
}));

describe('Enlargement', () => {
  const mockOnEnlargeClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderEnlargement = (props: any = {}) => {
    const defaultProps = {
      isEnlarged: false,
      onEnlargeClick: mockOnEnlargeClick,
      ...props,
    };

    return render(
      <ConfigProvider>
        <Enlargement {...defaultProps} />
      </ConfigProvider>,
    );
  };

  describe('基本渲染', () => {
    it('应该正确渲染Enlargement组件', () => {
      renderEnlargement();

      // 验证按钮元素存在
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('应该在未放大状态显示ExpandAlt图标', () => {
      renderEnlargement({ isEnlarged: false });

      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('fold-alt-icon')).not.toBeInTheDocument();
    });

    it('应该在放大状态显示FoldAlt图标', () => {
      renderEnlargement({ isEnlarged: true });

      expect(screen.getByTestId('fold-alt-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-alt-icon')).not.toBeInTheDocument();
    });

    it('应该应用正确的CSS类名', () => {
      renderEnlargement();

      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('ant-md-enlargement');
      expect(container).toHaveClass('test-hash-id');
    });

    it('应该在放大状态时应用enlarged类名', () => {
      renderEnlargement({ isEnlarged: true });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('enlarged');
    });

    it('应该在未放大状态时不应用enlarged类名', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('enlarged');
    });
  });

  describe('Props处理', () => {
    it('应该处理isEnlarged默认值false', () => {
      renderEnlargement({ onEnlargeClick: mockOnEnlargeClick });

      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();
    });

    it('应该处理undefined的onEnlargeClick', () => {
      renderEnlargement({ isEnlarged: false, onEnlargeClick: undefined });

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('应该根据isEnlarged prop切换图标', () => {
      const { rerender } = renderEnlargement({ isEnlarged: false });

      // 初始状态
      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();

      // 重新渲染为放大状态
      rerender(
        <ConfigProvider>
          <Enlargement isEnlarged={true} onEnlargeClick={mockOnEnlargeClick} />
        </ConfigProvider>,
      );

      expect(screen.getByTestId('fold-alt-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-alt-icon')).not.toBeInTheDocument();
    });
  });

  describe('交互功能', () => {
    it('应该在点击时调用onEnlargeClick', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持多次点击', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(3);
    });

    it('应该在按下Enter键时调用onEnlargeClick', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该在按下空格键时调用onEnlargeClick', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ' });

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该在按下Enter键时阻止默认行为', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      fireEvent(button, enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该在按下空格键时阻止默认行为', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });

      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
      fireEvent(button, spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该忽略其他键盘按键', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Escape' });
      fireEvent.keyDown(button, { key: 'Tab' });
      fireEvent.keyDown(button, { key: 'a' });

      expect(mockOnEnlargeClick).not.toHaveBeenCalled();
    });

    it('应该处理onEnlargeClick为undefined的键盘事件', () => {
      renderEnlargement({ onEnlargeClick: undefined });

      const button = screen.getByRole('button');
      expect(() => {
        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.keyDown(button, { key: ' ' });
      }).not.toThrow();
    });
  });

  describe('无障碍功能', () => {
    it('应该设置正确的role属性', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('应该设置正确的tabIndex', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('应该在未放大状态设置正确的aria-label', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '放大');
    });

    it('应该在放大状态设置正确的aria-label', () => {
      renderEnlargement({ isEnlarged: true });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '缩小');
    });

    it('应该在未放大状态设置正确的aria-pressed', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('应该在放大状态设置正确的aria-pressed', () => {
      renderEnlargement({ isEnlarged: true });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('应该在未放大状态设置正确的title', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', '放大');
    });

    it('应该在放大状态设置正确的title', () => {
      renderEnlargement({ isEnlarged: true });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', '缩小');
    });

    it('应该支持屏幕阅读器访问', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('放大');
    });
  });

  describe('边界情况', () => {
    it('应该处理快速连续点击', async () => {
      const user = userEvent.setup();
      renderEnlargement();

      const button = screen.getByRole('button');

      // 快速连续点击
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(3);
    });

    it('应该处理同时的键盘和鼠标事件', () => {
      renderEnlargement();

      const button = screen.getByRole('button');

      // 触发键盘和鼠标事件
      fireEvent.click(button);
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(2);
    });

    it('应该处理状态快速切换', () => {
      const { rerender } = renderEnlargement({ isEnlarged: false });

      // 快速切换状态
      for (let i = 0; i < 5; i++) {
        rerender(
          <ConfigProvider>
            <Enlargement
              isEnlarged={i % 2 !== 0}
              onEnlargeClick={mockOnEnlargeClick}
            />
          </ConfigProvider>,
        );
      }

      // 验证最终状态 (i=4, 4%2!==0 为 false，所以是未放大状态)
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '放大');
      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();
    });

    it('应该处理ConfigProvider的缺失', () => {
      // 不使用ConfigProvider包装
      const { container } = render(
        <Enlargement isEnlarged={false} onEnlargeClick={mockOnEnlargeClick} />,
      );

      // 组件应该仍然能正常渲染
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('ant-md-enlargement');
    });
  });

  describe('组件卸载', () => {
    it('应该能正确卸载组件', () => {
      const { unmount } = renderEnlargement();

      expect(() => unmount()).not.toThrow();
    });

    it('应该在卸载后清理事件监听器', () => {
      const { unmount } = renderEnlargement();

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);

      unmount();

      // 卸载后应该不会有内存泄漏或错误
      expect(() => {
        // 尝试触发已卸载组件的事件
        const unmountedEvent = new Event('click');
        document.dispatchEvent(unmountedEvent);
      }).not.toThrow();
    });
  });
});
