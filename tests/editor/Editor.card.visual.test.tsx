import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BaseEditor, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { describe, expect, it, beforeEach } from 'vitest';
import { BaseMarkdownEditor } from '../../src/MarkdownEditor/BaseMarkdownEditor';
import { ReactEditor, withReact } from '../../src/MarkdownEditor/editor/slate-react';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
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

  beforeEach(() => {
    editor = createTestEditor();
  });

  describe('Card Selection Visual Indicators', () => {
    it('should show outline when card is clicked', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 查找卡片元素
      const cardElement = container.querySelector('[data-be="card"]') as HTMLElement;
      expect(cardElement).toBeTruthy();

      // 验证初始状态（无 outline）
      expect(cardElement.style.outline).toBeFalsy();

      // 点击卡片
      fireEvent.click(cardElement!);

      await waitFor(() => {
        // 验证选中状态的 outline
        const selectedCard = container.querySelector('[data-be="card"]') as HTMLElement;
        expect(selectedCard.style.outline).toContain('2px solid #1890ff');
      });
    });

    it('should apply correct basic styling', () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]') as HTMLElement;
      expect(cardElement).toBeTruthy();

      // 验证基本样式
      expect(cardElement.style.position).toBe('relative');
      expect(cardElement.style.padding).toBe('12px');
      expect(cardElement.style.borderRadius).toBe('6px');
      expect(cardElement.style.width).toBe('max-content');
      expect(cardElement.style.cursor).toBe('pointer');
      expect(cardElement.style.transition).toContain('ease-in-out');
    });
  });

  describe('Card Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 检查可访问性属性
      expect(cardElement).toHaveAttribute('role', 'button');
      expect(cardElement).toHaveAttribute('tabIndex', '0');
      expect(cardElement).toHaveAttribute('aria-label', '可选择的卡片元素');
    });
  });

  describe('Card State Management', () => {
    it('should maintain smooth transitions', () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]') as HTMLElement;
      expect(cardElement).toBeTruthy();

      // 验证过渡效果始终存在
      expect(cardElement.style.transition).toContain('0.2s');
      expect(cardElement.style.transition).toContain('ease-in-out');
    });
  });
}); 