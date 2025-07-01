import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { BaseEditor, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { beforeEach, describe, expect, it } from 'vitest';
import { BaseMarkdownEditor } from '../../src/MarkdownEditor/BaseMarkdownEditor';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import {
  ReactEditor,
  withReact,
} from '../../src/MarkdownEditor/editor/slate-react';
import { EditorUtils } from '../../src/MarkdownEditor/editor/utils/editorUtils';

describe('Card Visual Effects Tests', () => {
  let editor: BaseEditor & ReactEditor & HistoryEditor;

  const createTestEditor = () => {
    const baseEditor = withMarkdown(withHistory(withReact(createEditor())));
    baseEditor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
    return baseEditor;
  };

  const createCardContent = () => {
    return EditorUtils.createMediaNode('test.jpg', 'image');
  };

  // 创建包含图片卡片的 Markdown 字符串
  const createCardMarkdown = () => {
    return '![](test.jpg)';
  };

  beforeEach(() => {
    editor = createTestEditor();
  });

  describe('Card Selection Visual Indicators', () => {
    it('should be clickable and interactive', async () => {
      const initValue = createCardMarkdown();

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 等待组件渲染完成
      await waitFor(() => {
        const cardElement = container.querySelector('[data-be="card"]');
        expect(cardElement).toBeTruthy();
      });

      const cardElement = container.querySelector(
        '[data-be="card"]',
      ) as HTMLElement;

      // 验证初始状态
      expect(cardElement.style.outline).toMatch(/^(|none)$/);
      expect(cardElement.getAttribute('aria-selected')).toBe('false');

      // 验证卡片是可点击的
      expect(cardElement.getAttribute('role')).toBe('button');
      expect(cardElement.getAttribute('tabIndex')).toBe('0');
      expect(cardElement.style.cursor).toBe('pointer');

      // 验证点击事件不会导致错误
      expect(() => {
        fireEvent.click(cardElement);
      }).not.toThrow();

      // 验证卡片仍然存在（没有被错误删除）
      const cardAfterClick = container.querySelector('[data-be="card"]');
      expect(cardAfterClick).toBeTruthy();
    });

    it('should apply correct basic styling', async () => {
      const initValue = createCardMarkdown();

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 等待组件渲染完成
      await waitFor(() => {
        const cardElement = container.querySelector('[data-be="card"]');
        expect(cardElement).toBeTruthy();
      });

      const cardElement = container.querySelector(
        '[data-be="card"]',
      ) as HTMLElement;

      // 验证基本样式（注意 React 会将数字转换为字符串并添加 px）
      expect(cardElement.style.position).toBe('relative');
      expect(cardElement.style.padding).toBe('8px');
      expect(cardElement.style.borderRadius).toBe('6px');
      // width 可能被其他样式覆盖，只验证基本的样式存在
      expect(cardElement.style.cursor).toBe('pointer');
      expect(cardElement.style.transition).toContain('ease-in-out');

      // 验证卡片具有正确的结构和属性
      expect(cardElement.getAttribute('data-be')).toBe('card');
      expect(cardElement.getAttribute('role')).toBe('button');
    });
  });

  describe('Card Accessibility', () => {
    it('should have proper accessibility attributes', async () => {
      const initValue = createCardMarkdown();

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 等待组件渲染完成
      await waitFor(() => {
        const cardElement = container.querySelector('[data-be="card"]');
        expect(cardElement).toBeTruthy();
      });

      const cardElement = container.querySelector('[data-be="card"]');

      // 检查可访问性属性
      expect(cardElement).toHaveAttribute('role', 'button');
      expect(cardElement).toHaveAttribute('tabIndex', '0');
      expect(cardElement).toHaveAttribute('aria-label', '可选择的卡片元素');
    });
  });

  describe('Card State Management', () => {
    it('should maintain smooth transitions', async () => {
      const initValue = createCardMarkdown();

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 等待组件渲染完成
      await waitFor(() => {
        const cardElement = container.querySelector('[data-be="card"]');
        expect(cardElement).toBeTruthy();
      });

      const cardElement = container.querySelector(
        '[data-be="card"]',
      ) as HTMLElement;

      // 验证过渡效果始终存在
      expect(cardElement.style.transition).toContain('0.2s');
      expect(cardElement.style.transition).toContain('ease-in-out');
    });
  });
});
