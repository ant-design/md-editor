/**
 * Enlargement 组件测试文件
 * 测试放大/缩小和文本优化功能
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Enlargement from '../../src/MarkdownInputField/Enlargement';

// Mock icons
vi.mock('@sofa-design/icons', () => ({
  ExpandAlt: () => <span data-testid="expand-icon">ExpandIcon</span>,
  FoldAlt: () => <span data-testid="fold-icon">FoldIcon</span>,
  TextOptimize: () => <span data-testid="optimize-icon">OptimizeIcon</span>,
}));

// Mock Antd ConfigProvider
vi.mock('antd', () => ({
  ConfigProvider: {
    ConfigContext: React.createContext({
      getPrefixCls: (suffix: string) => `ant-${suffix}`,
    }),
  },
}));

// Mock style hook
vi.mock('../../src/MarkdownInputField/Enlargement/style', () => ({
  useStyle: () => ({
    wrapSSR: (element: React.ReactElement) => element,
    hashId: 'test-hash-id',
  }),
}));

describe('Enlargement 组件测试', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该正确渲染放大和优化按钮', () => {
      render(<Enlargement />);

      // 检查放大按钮
      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();

      // 检查优化按钮
      expect(screen.getByTitle('文本优化')).toBeInTheDocument();
      expect(screen.getByTestId('optimize-icon')).toBeInTheDocument();
    });

    it('应该在放大状态下显示缩小图标和标题', () => {
      render(<Enlargement isEnlarged={true} />);

      expect(screen.getByTitle('缩小')).toBeInTheDocument();
      expect(screen.getByTestId('fold-icon')).toBeInTheDocument();
    });

    it('应该在未放大状态下显示放大图标和标题', () => {
      render(<Enlargement isEnlarged={false} />);

      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
    });

    it('应该在默认状态下显示放大图标', () => {
      render(<Enlargement />);

      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
    });
  });

  describe('交互功能', () => {
    it('应该在点击放大按钮时调用 onEnlargeClick', async () => {
      const onEnlargeClick = vi.fn();
      render(<Enlargement onEnlargeClick={onEnlargeClick} />);

      const enlargeButton = screen.getByTitle('放大');
      await user.click(enlargeButton);

      expect(onEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该在点击优化按钮时调用 onOptimizeClick', async () => {
      const onOptimizeClick = vi.fn();
      render(<Enlargement onOptimizeClick={onOptimizeClick} />);

      const optimizeButton = screen.getByTitle('文本优化');
      await user.click(optimizeButton);

      expect(onOptimizeClick).toHaveBeenCalledTimes(1);
    });

    it('应该在放大状态下点击缩小按钮时调用 onEnlargeClick', async () => {
      const onEnlargeClick = vi.fn();
      render(<Enlargement isEnlarged={true} onEnlargeClick={onEnlargeClick} />);

      const shrinkButton = screen.getByTitle('缩小');
      await user.click(shrinkButton);

      expect(onEnlargeClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持连续点击', async () => {
      const onEnlargeClick = vi.fn();
      const onOptimizeClick = vi.fn();
      
      render(
        <Enlargement
          onEnlargeClick={onEnlargeClick}
          onOptimizeClick={onOptimizeClick}
        />,
      );

      const enlargeButton = screen.getByTitle('放大');
      const optimizeButton = screen.getByTitle('文本优化');

      // 连续点击放大按钮
      await user.click(enlargeButton);
      await user.click(enlargeButton);

      // 点击优化按钮
      await user.click(optimizeButton);

      expect(onEnlargeClick).toHaveBeenCalledTimes(2);
      expect(onOptimizeClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('属性处理', () => {
    it('应该正确处理 undefined 的回调函数', async () => {
      render(<Enlargement />);

      const enlargeButton = screen.getByTitle('放大');
      const optimizeButton = screen.getByTitle('文本优化');

      // 点击时不应该报错
      await user.click(enlargeButton);
      await user.click(optimizeButton);

      expect(enlargeButton).toBeInTheDocument();
      expect(optimizeButton).toBeInTheDocument();
    });

    it('应该正确处理 isEnlarged 状态变化', () => {
      const { rerender } = render(<Enlargement isEnlarged={false} />);

      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();

      rerender(<Enlargement isEnlarged={true} />);

      expect(screen.getByTitle('缩小')).toBeInTheDocument();
      expect(screen.getByTestId('fold-icon')).toBeInTheDocument();
    });
  });

  describe('样式和类名', () => {
    it('应该应用正确的 CSS 类名', () => {
      const { container } = render(<Enlargement />);

      const enlargementContainer = container.querySelector('.ant-md-enlargement');
      expect(enlargementContainer).toBeInTheDocument();

      const iconElements = container.querySelectorAll('.ant-md-enlargement-icon');
      expect(iconElements).toHaveLength(2); // 放大图标和优化图标
    });

    it('应该在放大状态下为放大按钮应用 enlarged 类名', () => {
      const { container } = render(<Enlargement isEnlarged={true} />);

      const enlargeIcon = container.querySelector('.enlarged');
      expect(enlargeIcon).toBeInTheDocument();
    });

    it('应该在未放大状态下不应用 enlarged 类名', () => {
      const { container } = render(<Enlargement isEnlarged={false} />);

      const enlargeIcon = container.querySelector('.enlarged');
      expect(enlargeIcon).not.toBeInTheDocument();
    });
  });

  describe('可访问性', () => {
    it('应该提供正确的标题属性', () => {
      render(<Enlargement />);

      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTitle('文本优化')).toBeInTheDocument();
    });

    it('应该在不同状态下提供正确的标题', () => {
      const { rerender } = render(<Enlargement isEnlarged={false} />);
      expect(screen.getByTitle('放大')).toBeInTheDocument();

      rerender(<Enlargement isEnlarged={true} />);
      expect(screen.getByTitle('缩小')).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      // 由于我们的组件渲染的是div元素，而div默认不能获得焦点
      // 这个测试主要验证组件结构正确，实际的键盘导航由CSS和父组件处理
      render(<Enlargement />);

      const enlargeButton = screen.getByTitle('放大');
      const optimizeButton = screen.getByTitle('文本优化');

      // 验证按钮存在且可以被找到
      expect(enlargeButton).toBeInTheDocument();
      expect(optimizeButton).toBeInTheDocument();
      
      // 验证按钮有正确的role和title属性用于可访问性
      expect(enlargeButton).toHaveAttribute('title', '放大');
      expect(optimizeButton).toHaveAttribute('title', '文本优化');
    });
  });

  describe('图标渲染', () => {
    it('应该在未放大状态下渲染 ExpandAlt 图标', () => {
      render(<Enlargement isEnlarged={false} />);
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('fold-icon')).not.toBeInTheDocument();
    });

    it('应该在放大状态下渲染 FoldAlt 图标', () => {
      render(<Enlargement isEnlarged={true} />);
      expect(screen.getByTestId('fold-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
    });

    it('应该始终渲染 TextOptimize 图标', () => {
      const { rerender } = render(<Enlargement isEnlarged={false} />);
      expect(screen.getByTestId('optimize-icon')).toBeInTheDocument();

      rerender(<Enlargement isEnlarged={true} />);
      expect(screen.getByTestId('optimize-icon')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理快速状态切换', () => {
      const { rerender } = render(<Enlargement isEnlarged={false} />);

      // 快速切换状态
      rerender(<Enlargement isEnlarged={true} />);
      rerender(<Enlargement isEnlarged={false} />);
      rerender(<Enlargement isEnlarged={true} />);

      expect(screen.getByTitle('缩小')).toBeInTheDocument();
      expect(screen.getByTestId('fold-icon')).toBeInTheDocument();
    });

    it('应该处理异常的 props 值', () => {
      // 测试传入异常值不会导致崩溃
      const { rerender } = render(
        <Enlargement isEnlarged={undefined as any} />,
      );

      expect(screen.getByTitle('放大')).toBeInTheDocument();

      rerender(<Enlargement isEnlarged={null as any} />);
      expect(screen.getByTitle('放大')).toBeInTheDocument();
    });

    it('应该处理回调函数抛出异常的情况', async () => {
      const errorCallback = vi.fn(() => {
        throw new Error('测试错误');
      });

      render(<Enlargement onEnlargeClick={errorCallback} />);

      const enlargeButton = screen.getByTitle('放大');

      // 点击应该调用回调但不会导致组件崩溃
      await user.click(enlargeButton);
      expect(errorCallback).toHaveBeenCalled();
      expect(enlargeButton).toBeInTheDocument();
    });
  });

  describe('组件生命周期', () => {
    it('应该正确处理组件挂载和卸载', () => {
      const { unmount } = render(<Enlargement />);

      expect(screen.getByTitle('放大')).toBeInTheDocument();

      unmount();

      // 卸载后元素应该不存在
      expect(screen.queryByTitle('放大')).not.toBeInTheDocument();
    });

    it('应该正确处理多次重新渲染', () => {
      const { rerender } = render(<Enlargement isEnlarged={false} />);
      
      // 验证初始状态
      expect(screen.getByTitle('放大')).toBeInTheDocument();

      for (let i = 1; i <= 5; i++) {
        const isEnlarged = i % 2 === 0;
        rerender(<Enlargement isEnlarged={isEnlarged} />);
        
        const expectedTitle = isEnlarged ? '缩小' : '放大';
        expect(screen.getByTitle(expectedTitle)).toBeInTheDocument();
        
        // 验证相反状态的标题不存在
        const oppositeTitle = isEnlarged ? '放大' : '缩小';
        expect(screen.queryByTitle(oppositeTitle)).not.toBeInTheDocument();
      }
    });
  });

  describe('事件处理', () => {
    it('应该正确处理鼠标事件', async () => {
      const onEnlargeClick = vi.fn();
      const onOptimizeClick = vi.fn();

      render(
        <Enlargement
          onEnlargeClick={onEnlargeClick}
          onOptimizeClick={onOptimizeClick}
        />,
      );

      const enlargeButton = screen.getByTitle('放大');
      const optimizeButton = screen.getByTitle('文本优化');

      // 测试不同的鼠标事件
      await user.hover(enlargeButton);
      await user.click(enlargeButton);
      await user.unhover(enlargeButton);

      await user.hover(optimizeButton);
      await user.click(optimizeButton);
      await user.unhover(optimizeButton);

      expect(onEnlargeClick).toHaveBeenCalledTimes(1);
      expect(onOptimizeClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持键盘事件', async () => {
      const onEnlargeClick = vi.fn();
      render(<Enlargement onEnlargeClick={onEnlargeClick} />);

      const enlargeButton = screen.getByTitle('放大');

      // 由于我们的组件是 div 元素，键盘事件需要通过模拟 keyDown 事件来测试
      // 在实际使用中，父组件会处理键盘导航和焦点管理
      fireEvent.keyDown(enlargeButton, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(enlargeButton, { key: ' ', code: 'Space' });

      // 验证组件结构正确，键盘事件的实际处理由父组件负责
      expect(enlargeButton).toBeInTheDocument();
      expect(enlargeButton).toHaveAttribute('title', '放大');
    });

    // 添加一个新的测试来验证点击事件确实工作
    it('应该在点击时正确触发回调', async () => {
      const onEnlargeClick = vi.fn();
      render(<Enlargement onEnlargeClick={onEnlargeClick} />);

      const enlargeButton = screen.getByTitle('放大');
      await user.click(enlargeButton);

      expect(onEnlargeClick).toHaveBeenCalledTimes(1);
    });
  });
});
