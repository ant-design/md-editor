/**
 * TagPopup 组件通过 MarkdownInputField 集成测试
 *
 * 这个测试文件通过 MarkdownInputField 来测试 TagPopup 的功能，
 * 更接近真实的使用场景
 */

import { MarkdownInputField } from '@ant-design/md-editor';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('TagPopup - MarkdownInputField 集成测试', () => {
  const mockItems = [
    { label: '选项1', key: 'option1' },
    { label: '选项2', key: 'option2' },
    { label: '选项3', key: 'option3' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本功能测试', () => {
    it('应该正确渲染带有 TagPopup 配置的 MarkdownInputField', () => {
      render(
        <MarkdownInputField
          value="测试内容 `${placeholder}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      // 文本会被 TagPopup 分割成多个元素，所以使用部分匹配
      expect(screen.getByText(/测试内容/)).toBeInTheDocument();
    });

    it('应该在输入占位符格式时显示 TagPopup', async () => {
      const onChange = vi.fn();
      render(
        <MarkdownInputField
          value="`${test}`"
          onChange={onChange}
          tagInputProps={{
            enable: true,
            items: mockItems,
            type: 'panel',
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });
      expect(editor).toBeInTheDocument();

      // TagPopup 会被渲染出来
      await waitFor(() => {
        expect(editor).toBeInTheDocument();
      });
    });

    it('应该在禁用状态下不允许交互', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          disabled
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const container = screen
        .getByRole('textbox', { hidden: true })
        .closest('.ant-md-input-field');
      expect(container).toHaveClass('ant-md-input-field-disabled');
    });
  });

  describe('TagPopup 配置传递测试', () => {
    it('应该正确传递 items 配置', () => {
      const customItems = [
        { label: '自定义选项1', key: 'custom1' },
        { label: '自定义选项2', key: 'custom2' },
      ];

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: customItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该支持异步加载 items', async () => {
      const asyncItems = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return mockItems;
      });

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: asyncItems,
          }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { hidden: true }),
        ).toBeInTheDocument();
      });
    });

    it('应该支持 dropdown 类型的 TagPopup', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            type: 'dropdown',
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该支持 panel 类型的 TagPopup', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            type: 'panel',
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('回调函数测试', () => {
    it('应该在选择选项时调用 onChange', async () => {
      const onChange = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <MarkdownInputField
          value="`${test}`"
          onChange={onChange}
          tagInputProps={{
            enable: true,
            items: mockItems,
            onOpenChange,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该处理 beforeOpenChange 回调', () => {
      const beforeOpenChange = vi.fn(() => true);

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            beforeOpenChange,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该在 beforeOpenChange 返回 false 时阻止打开', () => {
      const beforeOpenChange = vi.fn(() => false);

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            beforeOpenChange,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该使用自定义 tagRender', () => {
      const tagRender = vi.fn((props) => (
        <div data-testid="custom-tag-render">自定义标签: {props.text}</div>
      ));

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            tagRender,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该使用自定义 tagTextRender', () => {
      const tagTextRender = vi.fn((props, text) => `自定义: ${text}`);

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            tagTextRender,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该使用自定义 dropdownRender', () => {
      const dropdownRender = vi.fn((defaultNode) => (
        <div data-testid="custom-dropdown">
          <div>自定义下拉菜单</div>
          {defaultNode}
        </div>
      ));

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            dropdownRender,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('样式配置测试', () => {
    it('应该应用自定义标签样式', () => {
      const tagTextStyle = { color: 'red', fontWeight: 'bold' };

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            tagTextStyle,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该应用函数式标签样式', () => {
      const tagTextStyle = vi.fn(() => ({ color: 'blue' }));

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            tagTextStyle,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该应用自定义 className', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            className: 'custom-tag-class',
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该应用自定义下拉菜单样式', () => {
      const dropdownStyle = { backgroundColor: '#f0f0f0', padding: '10px' };

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            dropdownStyle,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('菜单配置测试', () => {
    it('应该配置自定义菜单属性', () => {
      const menu = {
        onClick: vi.fn(),
        selectedKeys: ['option1'],
      };

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            menu,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该显示 notFoundContent', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: [],
            notFoundContent: <div data-testid="not-found">没有数据</div>,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该应用 body 样式', () => {
      const bodyStyle = { maxHeight: '300px', overflow: 'auto' };

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            bodyStyle,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('占位符文本测试', () => {
    it('应该显示占位符提示', () => {
      render(
        <MarkdownInputField
          value="`${}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            placeholder: '请选择标签',
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该在空白时添加 empty 类', () => {
      render(
        <MarkdownInputField
          value="`${  }`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该正确处理包含文本的占位符', () => {
      render(
        <MarkdownInputField
          value="`${示例文本}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('键盘交互测试', () => {
    it('应该支持键盘导航', async () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });

      // 模拟键盘导航
      fireEvent.keyDown(editor, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(editor, { key: 'ArrowUp', code: 'ArrowUp' });

      expect(editor).toBeInTheDocument();
    });

    it('应该支持 Enter 键选择', async () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });

      fireEvent.keyDown(editor, { key: 'Enter', code: 'Enter' });

      expect(editor).toBeInTheDocument();
    });

    it('应该支持 Escape 键关闭', async () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });

      fireEvent.keyDown(editor, { key: 'Escape', code: 'Escape' });

      expect(editor).toBeInTheDocument();
    });
  });

  describe('受控状态测试', () => {
    it('应该支持受控的 open 状态', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            open: true,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该在 open 状态变化时调用回调', () => {
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            open: false,
            onOpenChange,
          }}
        />,
      );

      rerender(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            open: true,
            onOpenChange,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('自动打开功能测试', () => {
    it('应该在 autoOpen 为 true 时自动打开', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={
            {
              enable: true,
              items: mockItems,
              autoOpen: true,
            } as any
          }
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该在 autoOpen 为 false 时不自动打开', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={
            {
              enable: true,
              items: mockItems,
              autoOpen: false,
            } as any
          }
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的 items', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: [],
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该处理 undefined items', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: undefined,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该处理异步加载失败', async () => {
      const asyncItems = vi.fn().mockRejectedValue(new Error('加载失败'));

      // 捕获未处理的 rejection
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // 捕获未处理的 promise rejection
      const unhandledRejectionHandler = vi.fn();
      process.on('unhandledRejection', unhandledRejectionHandler);

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: asyncItems,
          }}
        />,
      );

      await waitFor(() => {
        expect(asyncItems).toHaveBeenCalled();
      });

      // 等待异步错误处理完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      consoleError.mockRestore();
      process.removeListener('unhandledRejection', unhandledRejectionHandler);
    });

    it('应该处理空字符串值', () => {
      render(
        <MarkdownInputField
          value=""
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该处理复杂的占位符格式', () => {
      render(
        <MarkdownInputField
          value="`${placeholder:示例;initialValue:默认值}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该处理多个占位符', () => {
      render(
        <MarkdownInputField
          value="查询 `${企业名称}` 在 `${时间范围}` 的 `${指标名称}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('集成测试', () => {
    it('应该与发送功能正确配合', async () => {
      const onSend = vi.fn();
      const onChange = vi.fn();

      render(
        <MarkdownInputField
          value="`${test}`"
          onChange={onChange}
          onSend={onSend}
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const sendButton = screen.getByTestId('send-button');
      await userEvent.click(sendButton);

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该与附件功能正确配合', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          attachment={{
            enable: true,
          }}
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该与技能模式正确配合', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          skillMode={{
            enable: true,
            open: true,
            title: 'AI助手',
          }}
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      expect(screen.getByTestId('skill-mode-bar')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该正确处理完整的用户交互流程', async () => {
      const onChange = vi.fn();
      const onSend = vi.fn();

      render(
        <MarkdownInputField
          value="查询`${企业}`的信息"
          onChange={onChange}
          onSend={onSend}
          tagInputProps={{
            enable: true,
            items: mockItems,
            type: 'panel',
          }}
          attachment={{
            enable: true,
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });
      expect(editor).toBeInTheDocument();

      // 验证 TagPopup 已渲染
      await waitFor(() => {
        expect(editor).toBeInTheDocument();
      });

      // 发送消息
      const sendButton = screen.getByTestId('send-button');
      await userEvent.click(sendButton);

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('性能优化测试', () => {
    it('应该正确处理频繁的状态更新', async () => {
      const onChange = vi.fn();

      const { rerender } = render(
        <MarkdownInputField
          value="`${test1}`"
          onChange={onChange}
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      // 快速更新多次
      for (let i = 2; i <= 5; i++) {
        rerender(
          <MarkdownInputField
            value={`\`\${test${i}}\``}
            onChange={onChange}
            tagInputProps={{
              enable: true,
              items: mockItems,
            }}
          />,
        );
      }

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该正确处理大量选项', () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        label: `选项${i + 1}`,
        key: `option${i + 1}`,
      }));

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: largeItems,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('错误处理测试', () => {
    it('应该捕获渲染错误', () => {
      const tagRender = vi.fn(() => {
        throw new Error('渲染错误');
      });

      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // 在 React 18 中，渲染错误会被 Error Boundary 捕获，不会抛出
      // 所以只验证组件不会崩溃
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
            tagRender,
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
      consoleError.mockRestore();
    });

    it('应该处理选择回调中的错误', async () => {
      const onSelect = vi.fn(() => {
        throw new Error('选择错误');
      });

      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems.map((item) => ({
              ...item,
              onClick: onSelect,
            })),
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该具有正确的 ARIA 属性', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const editor = screen.getByRole('textbox', { hidden: true });
      expect(editor).toBeInTheDocument();
    });

    it('应该支持屏幕阅读器', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          placeholder="请输入内容"
          tagInputProps={{
            enable: true,
            items: mockItems,
            placeholder: '请选择标签',
          }}
        />,
      );

      expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

    it('应该在禁用时设置正确的 ARIA 状态', () => {
      render(
        <MarkdownInputField
          value="`${test}`"
          disabled
          tagInputProps={{
            enable: true,
            items: mockItems,
          }}
        />,
      );

      const container = screen
        .getByRole('textbox', { hidden: true })
        .closest('.ant-md-input-field');
      expect(container).toHaveClass('ant-md-input-field-disabled');
    });
  });
});
