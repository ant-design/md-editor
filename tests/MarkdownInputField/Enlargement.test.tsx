import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Enlargement from '../../src/MarkdownInputField/Enlargement';
import { useStyle } from '../../src/MarkdownInputField/Enlargement/style';

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

const mockUseStyle = vi.mocked(useStyle);

describe('Enlargement', () => {
  const mockOnEnlargeClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default behavior
    mockUseStyle.mockReturnValue({
      wrapSSR: (component: any) => component,
      hashId: 'test-hash-id',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      expect(container).toHaveClass('ant-agentic-md-enlargement');
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
      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault');

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      fireEvent(button, enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);

      preventDefaultSpy.mockRestore();
    });

    it('应该在按下空格键时阻止默认行为', () => {
      renderEnlargement();

      const button = screen.getByRole('button');
      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault');

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });

      fireEvent(button, spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockOnEnlargeClick).toHaveBeenCalledTimes(1);

      preventDefaultSpy.mockRestore();
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
      expect(container.firstChild).toHaveClass('ant-agentic-md-enlargement');
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

  describe('样式和CSS类名', () => {
    it('应该正确调用useStyle hook', () => {
      renderEnlargement();

      expect(mockUseStyle).toHaveBeenCalledWith('ant-agentic-md-enlargement');
    });

    it('应该处理不同的hashId值', () => {
      mockUseStyle.mockReturnValue({
        wrapSSR: (component: any) => component,
        hashId: 'custom-hash-123',
      });

      renderEnlargement();

      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('ant-agentic-md-enlargement');
      expect(container).toHaveClass('custom-hash-123');
    });

    it('应该处理空的hashId', () => {
      mockUseStyle.mockReturnValue({
        wrapSSR: (component: any) => component,
        hashId: '',
      });

      renderEnlargement();

      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('ant-agentic-md-enlargement');
    });

    it('应该正确应用图标元素的类名', () => {
      renderEnlargement({ isEnlarged: false });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ant-agentic-md-enlargement-icon');
      expect(button).toHaveClass('test-hash-id');
      expect(button).not.toHaveClass('enlarged');
    });

    it('应该在放大状态时应用enlarged类名到图标', () => {
      renderEnlargement({ isEnlarged: true });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('ant-agentic-md-enlargement-icon');
      expect(button).toHaveClass('enlarged');
    });
  });

  describe('wrapSSR功能', () => {
    it('应该调用wrapSSR函数包装组件', () => {
      const mockWrapSSR = vi.fn((component) => component);
      mockUseStyle.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: 'test-hash-id',
      });

      renderEnlargement();

      expect(mockWrapSSR).toHaveBeenCalledTimes(1);
      expect(mockWrapSSR).toHaveBeenCalledWith(
        expect.any(Object), // React element
      );
    });

    it('应该处理wrapSSR返回修改后的组件', () => {
      const mockWrapSSR = vi.fn((component) => (
        <div data-testid="wrapped-component">{component}</div>
      ));
      mockUseStyle.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: 'test-hash-id',
      });

      renderEnlargement();

      expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
      expect(mockWrapSSR).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConfigProvider集成', () => {
    it('应该使用ConfigProvider提供的前缀', () => {
      const customGetPrefixCls = vi.fn(() => 'custom-prefix');

      render(
        <ConfigProvider.ConfigContext.Provider
          value={{
            getPrefixCls: customGetPrefixCls,
            iconPrefixCls: 'custom-icon',
          }}
        >
          <Enlargement isEnlarged={false} onEnlargeClick={mockOnEnlargeClick} />
        </ConfigProvider.ConfigContext.Provider>,
      );

      expect(customGetPrefixCls).toHaveBeenCalledWith('agentic-md-enlargement');
      expect(mockUseStyle).toHaveBeenCalledWith('custom-prefix');
    });

    it('应该在没有ConfigProvider时使用默认前缀', () => {
      // 渲染时不包装ConfigProvider
      render(
        <Enlargement isEnlarged={false} onEnlargeClick={mockOnEnlargeClick} />,
      );

      // 默认情况下应该使用 'ant-agentic-md-enlargement'
      expect(mockUseStyle).toHaveBeenCalledWith('ant-agentic-md-enlargement');
    });
  });

  describe('条件渲染和值处理', () => {
    it('应该处理isEnlarged为真值的不同情况', () => {
      const truthyValues = [true, 1, 'true', {}, []];

      truthyValues.forEach((value) => {
        const { unmount } = render(
          <ConfigProvider>
            <Enlargement
              isEnlarged={value as boolean}
              onEnlargeClick={mockOnEnlargeClick}
            />
          </ConfigProvider>,
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).toHaveAttribute('aria-label', '缩小');
        expect(screen.getByTestId('fold-alt-icon')).toBeInTheDocument();

        unmount();
      });
    });

    it('应该处理isEnlarged为假值的不同情况', () => {
      const falsyValues = [false, 0, '', null, undefined];

      falsyValues.forEach((value) => {
        const { unmount } = render(
          <ConfigProvider>
            <Enlargement
              isEnlarged={value as boolean}
              onEnlargeClick={mockOnEnlargeClick}
            />
          </ConfigProvider>,
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).toHaveAttribute('aria-label', '放大');
        expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('完整的用户交互流程', () => {
    it('应该支持完整的放大缩小切换流程', () => {
      let isEnlarged = false;
      const mockToggle = vi.fn(() => {
        isEnlarged = !isEnlarged;
      });

      const { rerender } = render(
        <ConfigProvider>
          <Enlargement isEnlarged={isEnlarged} onEnlargeClick={mockToggle} />
        </ConfigProvider>,
      );

      // 初始状态 - 未放大
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '放大');
      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();

      // 点击放大
      fireEvent.click(button);
      expect(mockToggle).toHaveBeenCalledTimes(1);

      // 重新渲染为放大状态
      rerender(
        <ConfigProvider>
          <Enlargement isEnlarged={true} onEnlargeClick={mockToggle} />
        </ConfigProvider>,
      );

      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '缩小');
      expect(screen.getByTestId('fold-alt-icon')).toBeInTheDocument();
    });

    it('应该支持使用键盘进行完整操作', () => {
      const mockToggle = vi.fn();

      renderEnlargement({ onEnlargeClick: mockToggle });

      const button = screen.getByRole('button');

      // 使用Tab键聚焦
      button.focus();
      expect(button).toHaveFocus();

      // 使用Enter键激活
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockToggle).toHaveBeenCalledTimes(1);

      // 使用空格键激活
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockToggle).toHaveBeenCalledTimes(2);
    });
  });

  describe('性能和优化', () => {
    it('应该在props不变时保持渲染稳定', () => {
      const { rerender } = renderEnlargement({
        isEnlarged: false,
        onEnlargeClick: mockOnEnlargeClick,
      });

      // 验证初始渲染
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();

      // 使用相同props重新渲染
      rerender(
        <ConfigProvider>
          <Enlargement isEnlarged={false} onEnlargeClick={mockOnEnlargeClick} />
        </ConfigProvider>,
      );

      const newButton = screen.getByRole('button');
      const newIcon = screen.getByTestId('expand-alt-icon');

      // 元素应该保持一致
      expect(newButton).toHaveAttribute('aria-label', '放大');
      expect(newIcon).toBeInTheDocument();
    });

    it('应该正确处理快速状态变化', () => {
      const { rerender } = renderEnlargement({ isEnlarged: false });

      // 快速切换多次
      for (let i = 0; i < 10; i++) {
        rerender(
          <ConfigProvider>
            <Enlargement
              isEnlarged={i % 2 === 0}
              onEnlargeClick={mockOnEnlargeClick}
            />
          </ConfigProvider>,
        );
      }

      // 最终状态应该正确 (i=9, 9%2===0 为false)
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '放大');
      expect(screen.getByTestId('expand-alt-icon')).toBeInTheDocument();
    });
  });
});
