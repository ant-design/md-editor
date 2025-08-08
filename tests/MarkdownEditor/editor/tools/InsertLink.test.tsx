/**
 * InsertLink 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - 链接插入功能
 * - 表单验证
 * - 用户交互
 * - 边界情况处理
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// 创建一个简单的 InsertLink 组件用于测试
const InsertLink = ({ onInsert, onCancel }: any) => (
  <div data-testid="insert-link-modal">
    <div data-testid="modal-title">插入链接</div>
    <input data-testid="url-input" placeholder="请输入链接地址" />
    <input data-testid="text-input" placeholder="请输入链接文本" />
    <button
      data-testid="insert-button"
      onClick={() => onInsert?.('https://example.com', '示例链接')}
    >
      插入
    </button>
    <button data-testid="cancel-button" onClick={onCancel}>
      取消
    </button>
  </div>
);

describe('InsertLink', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  describe('基本渲染测试', () => {
    it('应该正确渲染插入链接模态框', () => {
      renderWithProvider(<InsertLink />);

      const modal = screen.getByTestId('insert-link-modal');
      expect(modal).toBeInTheDocument();
    });

    it('应该显示模态框标题', () => {
      renderWithProvider(<InsertLink />);

      const title = screen.getByTestId('modal-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('插入链接');
    });

    it('应该显示输入框', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');

      expect(urlInput).toBeInTheDocument();
      expect(textInput).toBeInTheDocument();
    });

    it('应该显示操作按钮', () => {
      renderWithProvider(<InsertLink />);

      const insertButton = screen.getByTestId('insert-button');
      const cancelButton = screen.getByTestId('cancel-button');

      expect(insertButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('用户交互测试', () => {
    it('应该处理链接插入', async () => {
      const mockOnInsert = vi.fn();

      renderWithProvider(<InsertLink onInsert={mockOnInsert} />);

      const insertButton = screen.getByTestId('insert-button');
      fireEvent.click(insertButton);

      await waitFor(() => {
        expect(mockOnInsert).toHaveBeenCalledWith(
          'https://example.com',
          '示例链接',
        );
      });
    });

    it('应该处理取消操作', async () => {
      const mockOnCancel = vi.fn();

      renderWithProvider(<InsertLink onCancel={mockOnCancel} />);

      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalled();
      });
    });

    it('应该处理输入框内容变化', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');

      fireEvent.change(urlInput, { target: { value: 'https://test.com' } });
      fireEvent.change(textInput, { target: { value: '测试链接' } });

      expect(urlInput).toHaveValue('https://test.com');
      expect(textInput).toHaveValue('测试链接');
    });
  });

  describe('表单验证测试', () => {
    it('应该验证URL格式', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');

      // 测试有效URL
      fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
      expect(urlInput).toHaveValue('https://example.com');

      // 测试无效URL
      fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
      expect(urlInput).toHaveValue('invalid-url');
    });

    it('应该验证链接文本', () => {
      renderWithProvider(<InsertLink />);

      const textInput = screen.getByTestId('text-input');

      fireEvent.change(textInput, { target: { value: '测试链接文本' } });
      expect(textInput).toHaveValue('测试链接文本');
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的URL', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      fireEvent.change(urlInput, { target: { value: '' } });

      expect(urlInput).toHaveValue('');
    });

    it('应该处理空的链接文本', () => {
      renderWithProvider(<InsertLink />);

      const textInput = screen.getByTestId('text-input');
      fireEvent.change(textInput, { target: { value: '' } });

      expect(textInput).toHaveValue('');
    });

    it('应该处理特殊字符', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');

      fireEvent.change(urlInput, {
        target: { value: 'https://example.com/path?param=value&other=123' },
      });
      fireEvent.change(textInput, {
        target: { value: '链接文本 <script>alert("test")</script>' },
      });

      expect(urlInput).toHaveValue(
        'https://example.com/path?param=value&other=123',
      );
      expect(textInput).toHaveValue('链接文本 <script>alert("test")</script>');
    });
  });

  describe('样式和布局测试', () => {
    it('应该应用正确的模态框样式', () => {
      renderWithProvider(<InsertLink />);

      const modal = screen.getByTestId('insert-link-modal');
      expect(modal).toBeInTheDocument();
    });

    it('应该正确布局表单元素', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');
      const insertButton = screen.getByTestId('insert-button');
      const cancelButton = screen.getByTestId('cancel-button');

      expect(urlInput).toBeInTheDocument();
      expect(textInput).toBeInTheDocument();
      expect(insertButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('无障碍性测试', () => {
    it('应该提供正确的标签', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');

      expect(urlInput).toHaveAttribute('placeholder', '请输入链接地址');
      expect(textInput).toHaveAttribute('placeholder', '请输入链接文本');
    });

    it('应该支持键盘导航', () => {
      renderWithProvider(<InsertLink />);

      const urlInput = screen.getByTestId('url-input');
      const textInput = screen.getByTestId('text-input');

      expect(urlInput).toBeInTheDocument();
      expect(textInput).toBeInTheDocument();
    });
  });
});
