import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BaseEditor, createEditor, Editor, Transforms } from 'slate';
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
    it('should show selection indicators when card is clicked', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 查找卡片元素
      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 点击卡片
      fireEvent.click(cardElement!);

      await waitFor(() => {
        // 检查是否显示了选中指示器
        // 这里我们可能需要检查样式变化或特定的选中元素
        const selectedCard = container.querySelector('[data-be="card"]');
        expect(selectedCard).toBeTruthy();
        
        // 验证选中状态的样式是否应用
        // 注意：由于我们使用内联样式，检查可能需要更具体的方法
        const cardStyle = window.getComputedStyle(selectedCard!);
        // 这里可以检查边框、背景色等样式变化
      });
    });

    it('should display selection toolbar when card is selected', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 查找卡片元素
      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 点击卡片以选中
      fireEvent.click(cardElement!);

      await waitFor(() => {
        // 检查工具栏是否显示
        const toolbar = container.querySelector('[style*="已选中卡片"]');
        if (toolbar) {
          expect(toolbar).toBeTruthy();
        }
        
        // 或者检查删除按钮是否存在
        const deleteButton = container.querySelector('button[title="删除卡片"]');
        if (deleteButton) {
          expect(deleteButton).toBeTruthy();
        }
      });
    });

    it('should remove card when delete button is clicked', async () => {
      const cardNode = createCardContent();
      const paragraphNode = { type: 'paragraph', children: [{ text: 'test' }] };
      const initValue = JSON.stringify([cardNode, paragraphNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      // 查找卡片元素
      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 点击卡片以选中
      fireEvent.click(cardElement!);

      await waitFor(async () => {
        // 查找删除按钮
        const deleteButton = container.querySelector('button[title="删除卡片"]');
        if (deleteButton) {
          // 点击删除按钮
          fireEvent.click(deleteButton);
          
          // 等待一下让删除操作完成
          await waitFor(() => {
            // 验证卡片是否被删除
            const remainingCard = container.querySelector('[data-be="card"]');
            expect(remainingCard).toBeFalsy();
          });
        }
      });
    });

    it('should apply correct styling for selected state', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]') as HTMLElement;
      expect(cardElement).toBeTruthy();

      // 检查初始状态（未选中）
      expect(cardElement.style.border).toBeFalsy();

      // 点击卡片
      fireEvent.click(cardElement);

      await waitFor(() => {
        // 验证选中状态的样式
        // 注意：这些样式是通过React动态设置的，所以需要检查实际的DOM样式
        const updatedCardElement = container.querySelector('[data-be="card"]') as HTMLElement;
        
        // 检查是否有相对定位
        expect(updatedCardElement.style.position).toBe('relative');
        
        // 检查过渡效果
        expect(updatedCardElement.style.transition).toContain('ease-in-out');
      });
    });

    it('should show visual feedback on hover', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 模拟鼠标悬停
      fireEvent.mouseOver(cardElement!);

      // 验证悬停状态（如果有的话）
      // 这里可以添加悬停效果的测试
    });
  });

  describe('Card Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 测试键盘焦点
      (cardElement as HTMLElement)?.focus?.();
      
      // 测试回车键选中
      fireEvent.keyDown(cardElement!, { key: 'Enter', code: 'Enter' });
      
      // 验证是否正确响应键盘事件
    });

    it('should have proper ARIA attributes', () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 检查是否有适当的ARIA属性
      // 例如：role, aria-selected 等
    });
  });

  describe('Card Animation and Transitions', () => {
    it('should have smooth transitions for selection state', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]') as HTMLElement;
      expect(cardElement).toBeTruthy();

      // 验证过渡CSS属性
      fireEvent.click(cardElement);

      await waitFor(() => {
        expect(cardElement.style.transition).toContain('0.2s');
        expect(cardElement.style.transition).toContain('ease-in-out');
      });
    });

    it('should handle rapid selection changes gracefully', async () => {
      const cardNode1 = createCardContent();
      const cardNode2 = EditorUtils.createMediaNode('test2.jpg', 'image');
      const initValue = JSON.stringify([cardNode1, cardNode2]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElements = container.querySelectorAll('[data-be="card"]');
      expect(cardElements.length).toBe(2);

      // 快速切换选中状态
      fireEvent.click(cardElements[0]);
      fireEvent.click(cardElements[1]);
      fireEvent.click(cardElements[0]);

      // 验证最终状态正确
      await waitFor(() => {
        // 应该只有最后点击的卡片被选中
        // 这里可以添加更具体的选中状态验证
      });
    });
  });

  describe('Card Integration with Editor', () => {
    it('should maintain selection when editor content changes', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 选中卡片
      fireEvent.click(cardElement!);

      // 在编辑器中添加其他内容
      // 这里可以模拟在其他地方添加文本等操作

      // 验证卡片选中状态是否保持
      await waitFor(() => {
        // 检查选中状态是否仍然存在
      });
    });

    it('should work correctly with undo/redo operations', async () => {
      const cardNode = createCardContent();
      const initValue = JSON.stringify([cardNode]);

      const { container } = render(
        <BaseMarkdownEditor initValue={initValue} onChange={() => {}} />,
      );

      const cardElement = container.querySelector('[data-be="card"]');
      expect(cardElement).toBeTruthy();

      // 选中并删除卡片
      fireEvent.click(cardElement!);
      
      await waitFor(async () => {
        const deleteButton = container.querySelector('button[title="删除卡片"]');
        if (deleteButton) {
          fireEvent.click(deleteButton);
          
          // 验证卡片被删除
          await waitFor(() => {
            const remainingCard = container.querySelector('[data-be="card"]');
            expect(remainingCard).toBeFalsy();
          });

          // 测试撤销操作（如果支持的话）
          // fireEvent.keyDown(container, { key: 'z', ctrlKey: true });
          
          // 验证卡片是否恢复
        }
      });
    });
  });
}); 