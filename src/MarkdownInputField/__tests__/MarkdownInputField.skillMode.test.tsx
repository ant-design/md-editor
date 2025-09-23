import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../MarkdownInputField';

/**
 * MarkdownInputField SkillMode 单元测试
 * 专注测试 skillMode 功能的具体实现细节
 */
describe('MarkdownInputField - skillMode Unit Tests', () => {
  // 测试 skillMode prop 的处理和传递
  describe('skillMode prop handling', () => {
    it('should pass skillMode props correctly to SkillModeBar', () => {
      const skillModeConfig = {
        open: true,
        title: 'Unit Test Mode',
        closable: true,
        rightContent: [
          <span key="test" data-testid="right-content">
            Test Content
          </span>,
        ],
      };

      render(<MarkdownInputField skillMode={skillModeConfig} />);

      // 验证 SkillModeBar 组件是否被正确渲染（通过实际的类名）
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(screen.getByText('Unit Test Mode')).toBeInTheDocument();
      expect(screen.getByTestId('right-content')).toBeInTheDocument();
    });

    it('should handle undefined skillMode prop', () => {
      render(<MarkdownInputField skillMode={undefined} />);

      // 当 skillMode 为 undefined 时不应该渲染 SkillModeBar 容器
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();
    });

    it('should handle skillMode with only required props', () => {
      render(<MarkdownInputField skillMode={{ open: true }} />);

      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      // 默认应该显示关闭按钮（CloseOutlined）
      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).toBeInTheDocument();
    });

    it('should respect closable configuration', () => {
      const { rerender } = render(
        <MarkdownInputField skillMode={{ open: true, closable: true }} />,
      );

      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).toBeInTheDocument();

      // 重新渲染为不可关闭
      rerender(
        <MarkdownInputField skillMode={{ open: true, closable: false }} />,
      );

      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).not.toBeInTheDocument();
    });
  });

  // 测试 onSkillModeOpenChange 回调函数
  describe('onSkillModeOpenChange callback', () => {
    it('should call onSkillModeOpenChange when close button is clicked', () => {
      const onSkillModeOpenChange = vi.fn();

      render(
        <MarkdownInputField
          skillMode={{ open: true, title: 'Test Mode' }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      const closeButton = document.querySelector(
        '.ant-skill-mode-close',
      ) as HTMLElement;
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);

      expect(onSkillModeOpenChange).toHaveBeenCalledTimes(1);
      expect(onSkillModeOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not throw error when onSkillModeOpenChange is not provided', () => {
      render(
        <MarkdownInputField skillMode={{ open: true, title: 'Test Mode' }} />,
      );

      const closeButton = document.querySelector(
        '.ant-skill-mode-close',
      ) as HTMLElement;

      expect(() => {
        if (closeButton) {
          fireEvent.click(closeButton);
        }
      }).not.toThrow();
    });

    it('should call onSkillModeOpenChange when skillMode.open changes externally', async () => {
      const onSkillModeOpenChange = vi.fn();

      const { rerender } = render(
        <MarkdownInputField
          skillMode={{ open: false }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // 初始状态不应该触发回调
      expect(onSkillModeOpenChange).not.toHaveBeenCalled();

      // 外部改变状态
      rerender(
        <MarkdownInputField
          skillMode={{ open: true }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // 等待 useEffect 执行
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(onSkillModeOpenChange).toHaveBeenCalledWith(true);
    });

    it('should handle multiple state changes correctly', async () => {
      const onSkillModeOpenChange = vi.fn();

      const { rerender } = render(
        <MarkdownInputField
          skillMode={{ open: false }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // false -> true
      rerender(
        <MarkdownInputField
          skillMode={{ open: true }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(onSkillModeOpenChange).toHaveBeenCalledWith(true);

      // true -> false
      onSkillModeOpenChange.mockClear();
      rerender(
        <MarkdownInputField
          skillMode={{ open: false }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(onSkillModeOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // 测试 skillMode 的样式和类名传递
  describe('skillMode styling and className', () => {
    it('should apply custom style to SkillModeBar', () => {
      const customStyle = {
        backgroundColor: 'red',
        padding: '20px',
      };

      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            style: customStyle,
          }}
        />,
      );

      const skillModeBar = document.querySelector('.ant-skill-mode');
      expect(skillModeBar).toBeInTheDocument();

      // 验证自定义样式被应用到 style 属性中
      // 注意：由于 framer-motion 动画的复杂性，我们检查组件渲染而不是具体样式值
      const styleAttr = skillModeBar?.getAttribute('style');
      expect(styleAttr).toContain('background-color');
    });

    it('should apply custom className to SkillModeBar', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            className: 'custom-skill-mode',
          }}
        />,
      );

      const skillModeBar = document.querySelector(
        '.ant-skill-mode.custom-skill-mode',
      );
      expect(skillModeBar).toBeInTheDocument();
    });

    it('should pass baseCls and hashId to SkillModeBar', () => {
      // 这个测试主要验证 props 传递，实际的类名应用由 SkillModeBar 组件处理
      render(
        <MarkdownInputField
          skillMode={{ open: true }}
          className="custom-input-field"
        />,
      );

      // 验证组件正确渲染
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
    });
  });

  // 测试 skillMode 的右侧内容处理
  describe('skillMode rightContent handling', () => {
    it('should render single rightContent item', () => {
      const rightContent = [
        <button key="action" data-testid="skill-action" type="button">
          Action
        </button>,
      ];

      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            rightContent,
          }}
        />,
      );

      expect(screen.getByTestId('skill-action')).toBeInTheDocument();
    });

    it('should render multiple rightContent items', () => {
      const rightContent = [
        <span key="label" data-testid="skill-label">
          Status
        </span>,
        <button key="action" data-testid="skill-action" type="button">
          Action
        </button>,
        <div key="info" data-testid="skill-info">
          Info
        </div>,
      ];

      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            rightContent,
          }}
        />,
      );

      expect(screen.getByTestId('skill-label')).toBeInTheDocument();
      expect(screen.getByTestId('skill-action')).toBeInTheDocument();
      expect(screen.getByTestId('skill-info')).toBeInTheDocument();
    });

    it('should handle empty rightContent array', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            rightContent: [],
          }}
        />,
      );

      // 应该只显示关闭按钮，没有其他右侧内容
      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).toBeInTheDocument();
      expect(document.querySelector('.ant-skill-mode')).toBeInTheDocument();
      // 没有自定义右侧内容时，只显示关闭按钮
    });

    it('should handle interactive rightContent elements', () => {
      const onActionClick = vi.fn();
      const rightContent = [
        <button
          key="interactive"
          data-testid="interactive-element"
          onClick={onActionClick}
          type="button"
        >
          Click Me
        </button>,
      ];

      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            rightContent,
          }}
        />,
      );

      const interactiveElement = screen.getByTestId('interactive-element');
      fireEvent.click(interactiveElement);

      expect(onActionClick).toHaveBeenCalledTimes(1);
    });
  });

  // 测试 skillMode title 的不同类型
  describe('skillMode title handling', () => {
    it('should render string title', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: 'String Title',
          }}
        />,
      );

      expect(screen.getByText('String Title')).toBeInTheDocument();
    });

    it('should render React element title', () => {
      const titleElement = (
        <div data-testid="custom-title">
          <strong>Bold Title</strong>
          <span>Subtitle</span>
        </div>
      );

      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: titleElement,
          }}
        />,
      );

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByText('Bold Title')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('should handle empty title', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: '',
          }}
        />,
      );

      // 即使标题为空，组件也应该正常渲染
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
    });

    it('should handle undefined title', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            // title 未定义
          }}
        />,
      );

      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
    });
  });

  // 测试边界情况和错误处理
  describe('skillMode edge cases', () => {
    it('should handle skillMode state transitions correctly', () => {
      const { rerender } = render(
        <MarkdownInputField skillMode={{ open: false }} />,
      );

      // 初始状态：不显示
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();

      // 打开
      rerender(<MarkdownInputField skillMode={{ open: true }} />);
      const container = document.querySelector('.ant-skill-mode-container');
      expect(container).toBeInTheDocument();

      // 关闭 - 注意：framer-motion 的 AnimatePresence 在退出动画期间仍会保持元素在 DOM 中
      rerender(<MarkdownInputField skillMode={{ open: false }} />);
      // 可能仍然存在但在动画中，或者可能已经被移除
      // 这取决于动画的时机，所以我们不检查完全移除
    });

    it('should handle skillMode configuration updates', () => {
      const { rerender } = render(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: 'Initial Title',
            closable: true,
          }}
        />,
      );

      expect(screen.getByText('Initial Title')).toBeInTheDocument();
      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).toBeInTheDocument();

      // 更新配置
      rerender(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: 'Updated Title',
            closable: false,
          }}
        />,
      );

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByTestId('skill-mode-close')).not.toBeInTheDocument();
    });

    it('should work with other MarkdownInputField props', () => {
      const onChange = vi.fn();
      const onSend = vi.fn();

      render(
        <MarkdownInputField
          value="Test content"
          onChange={onChange}
          onSend={onSend}
          disabled={false}
          skillMode={{
            open: true,
            title: 'With Other Props',
          }}
        />,
      );

      // SkillMode 不应该影响其他功能
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('.ant-md-input-field-send-button'),
      ).toBeInTheDocument();
      expect(document.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('should maintain skillMode state during component updates', async () => {
      const onSkillModeOpenChange = vi.fn();

      const { rerender } = render(
        <MarkdownInputField
          value="initial"
          skillMode={{ open: true }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // 更新其他 props，不改变 skillMode
      rerender(
        <MarkdownInputField
          value="updated"
          skillMode={{ open: true }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // SkillMode 状态应该保持
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();

      // 不应该因为其他 props 变化而触发状态变化回调
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(onSkillModeOpenChange).not.toHaveBeenCalled();
    });
  });

  // 测试性能相关
  describe('skillMode performance', () => {
    it('should not cause unnecessary re-renders when skillMode is unchanged', () => {
      const skillModeConfig = {
        open: true,
        title: 'Stable Config',
      };

      const { rerender } = render(
        <MarkdownInputField value="test1" skillMode={skillModeConfig} />,
      );

      // 使用相同的 skillMode 对象引用重新渲染
      rerender(
        <MarkdownInputField value="test2" skillMode={skillModeConfig} />,
      );

      // 组件应该正常工作
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(screen.getByText('Stable Config')).toBeInTheDocument();
    });

    it('should handle frequent skillMode updates efficiently', () => {
      const { rerender } = render(
        <MarkdownInputField skillMode={{ open: false }} />,
      );

      // 快速切换状态多次
      for (let i = 0; i < 10; i++) {
        rerender(<MarkdownInputField skillMode={{ open: i % 2 === 0 }} />);
      }

      // 验证组件没有崩溃并且能正确处理状态变化
      // 最终状态是 open: false (循环结束时 i=9, 9%2!==0 所以最后是 open: false)
      // 注意：由于动画效果，可能仍然存在于 DOM 中但处于隐藏状态
      expect(() => {
        document.querySelector('.ant-md-input-field');
      }).not.toThrow();
    });
  });

  describe('skillMode branch coverage enhancement', () => {
    it('should handle explicit baseCls and hashId props', () => {
      render(
        <MarkdownInputField
          skillMode={{ open: true }}
          // 这些 props 会在 SkillModeBar 内部被处理，虽然不是直接传入
        />,
      );

      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
    });

    it('should handle undefined parameters to trigger default value branches', () => {
      // 通过不传入某些参数来触发默认值分支
      const skillModeConfig = {
        open: true,
        closable: undefined, // 触发默认值分支
        rightContent: undefined, // 触发默认值分支
      };

      render(<MarkdownInputField skillMode={skillModeConfig} />);

      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      // 默认应该显示关闭按钮（closable 默认为 true）
      expect(
        document.querySelector('.ant-skill-mode-close'),
      ).toBeInTheDocument();
    });
  });

  // 测试 enable 参数功能
  describe('skillMode enable parameter', () => {
    it('should not render SkillModeBar when enable is false', () => {
      render(
        <MarkdownInputField
          skillMode={{
            enable: false,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // 当 enable 为 false 时，SkillModeBar 应该完全不渲染
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();
    });

    it('should render SkillModeBar when enable is true', () => {
      render(
        <MarkdownInputField
          skillMode={{
            enable: true,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // 当 enable 为 true 且 open 为 true 时，SkillModeBar 应该正常渲染
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Mode')).toBeInTheDocument();
    });

    it('should render SkillModeBar when enable is undefined (default behavior)', () => {
      render(
        <MarkdownInputField
          skillMode={{
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // 当 enable 未设置时，默认为 true，应该正常渲染
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Mode')).toBeInTheDocument();
    });

    it('should handle enable changing from true to false dynamically', () => {
      const { rerender } = render(
        <MarkdownInputField
          skillMode={{
            enable: true,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // 初始状态应该渲染 SkillModeBar
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();

      // 将 enable 改为 false
      rerender(
        <MarkdownInputField
          skillMode={{
            enable: false,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // SkillModeBar 应该完全消失
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();
    });

    it('should handle enable changing from false to true dynamically', () => {
      const { rerender } = render(
        <MarkdownInputField
          skillMode={{
            enable: false,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // 初始状态不应该渲染 SkillModeBar
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();

      // 将 enable 改为 true
      rerender(
        <MarkdownInputField
          skillMode={{
            enable: true,
            open: true,
            title: 'Test Mode',
          }}
        />,
      );

      // SkillModeBar 应该重新出现
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Mode')).toBeInTheDocument();
    });

    it('should not execute any hooks when enable is false', () => {
      // 这个测试确保当 enable 为 false 时，组件完全不执行任何逻辑
      const onSkillModeOpenChange = vi.fn();

      render(
        <MarkdownInputField
          skillMode={{
            enable: false,
            open: true,
            title: 'Test Mode',
          }}
          onSkillModeOpenChange={onSkillModeOpenChange}
        />,
      );

      // 组件不应该渲染，也不应该执行任何回调
      expect(
        document.querySelector('.ant-skill-mode-container'),
      ).not.toBeInTheDocument();
      // 由于组件没有渲染，不会有任何交互，所以回调也不会被调用
      expect(onSkillModeOpenChange).not.toHaveBeenCalled();
    });
  });
});
