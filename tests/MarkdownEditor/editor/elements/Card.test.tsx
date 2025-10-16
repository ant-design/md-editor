import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { WarpCard } from '../../../../src/MarkdownEditor/editor/elements/Card';
import * as editorHooks from '../../../../src/MarkdownEditor/hooks/editor';
import * as editorStore from '../../../../src/MarkdownEditor/editor/store';

// Mock hooks
vi.mock('../../../../src/MarkdownEditor/hooks/editor.ts');
vi.mock('../../../../src/MarkdownEditor/editor/store.ts');

describe('WarpCard Element', () => {
  const createTestEditor = () => withReact(createEditor());

  const mockElement = {
    type: 'card',
    children: [{ text: 'Card content' }],
  };

  const mockAttributes = {
    'data-slate-node': 'element',
    ref: null,
  };

  const renderCard = (element = mockElement, readonly = false, selected = false) => {
    const editor = createTestEditor();
    
    vi.mocked(editorStore.useEditorStore).mockReturnValue({ readonly } as any);
    vi.mocked(editorHooks.useSelStatus).mockReturnValue([selected, [0]] as any);

    return render(
      <Slate editor={editor} initialValue={[element]}>
        <WarpCard attributes={mockAttributes} element={element}>
          <span>Card content</span>
        </WarpCard>
      </Slate>,
    );
  };

  it('应该渲染卡片组件', () => {
    const { container } = renderCard();
    
    const cardDiv = container.querySelector('[data-be="card"]');
    expect(cardDiv).toBeDefined();
  });

  it('应该在只读模式下渲染简化版本', () => {
    const { container } = renderCard(mockElement, true);
    
    const cardDiv = container.querySelector('[data-be="card"]');
    expect(cardDiv).toBeDefined();
    expect(cardDiv?.getAttribute('role')).toBe('button');
  });

  it('应该在编辑模式下包含可访问性属性', () => {
    const { container } = renderCard();
    
    const cardDiv = container.querySelector('[data-be="card"]');
    expect(cardDiv?.getAttribute('role')).toBe('button');
    expect(cardDiv?.getAttribute('tabIndex')).toBe('0');
    expect(cardDiv?.getAttribute('aria-label')).toBe('可选择的卡片元素');
  });

  it('应该在选中时设置 aria-selected', () => {
    const { container } = renderCard(mockElement, false, true);
    
    const cardDiv = container.querySelector('[data-be="card"]');
    expect(cardDiv?.getAttribute('aria-selected')).toBe('true');
  });

  it('应该应用 block 样式', () => {
    const blockElement = {
      ...mockElement,
      block: true,
    };

    const { container } = renderCard(blockElement);
    
    const cardDiv = container.querySelector('[data-be="card"]') as HTMLElement;
    expect(cardDiv.style.display).toBe('flex');
  });

  it('应该应用 inline-flex 样式当 block 为 false', () => {
    const inlineElement = {
      ...mockElement,
      block: false,
    };

    const { container } = renderCard(inlineElement);
    
    const cardDiv = container.querySelector('[data-be="card"]') as HTMLElement;
    expect(cardDiv.style.display).toBe('inline-flex');
  });

  it('应该应用自定义样式', () => {
    const styledElement = {
      ...mockElement,
      style: {
        backgroundColor: 'red',
        padding: '10px',
      },
    };

    const { container } = renderCard(styledElement);
    
    const cardDiv = container.querySelector('[data-be="card"]') as HTMLElement;
    expect(cardDiv.style.backgroundColor).toBe('red');
    expect(cardDiv.style.padding).toBe('10px');
  });

  it('应该渲染子元素', () => {
    const { getByText } = renderCard();
    
    expect(getByText('Card content')).toBeDefined();
  });

  it('应该传递 attributes', () => {
    const { container } = renderCard();
    
    const cardDiv = container.querySelector('[data-be="card"]');
    expect(cardDiv?.getAttribute('data-slate-node')).toBe('element');
  });
});
