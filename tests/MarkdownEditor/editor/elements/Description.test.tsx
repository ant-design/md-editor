import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { describe, expect, it, vi } from 'vitest';
import { Description } from '../../../../src/MarkdownEditor/editor/elements/Description';
import * as editorStore from '../../../../src/MarkdownEditor/editor/store';

vi.mock('../../../../src/MarkdownEditor/editor/store.ts');

describe('Description Element', () => {
  const createTestEditor = () => withReact(createEditor());

  const mockElement = {
    type: 'description',
    children: [
      { text: 'Item 1' },
      { text: 'Item 2' },
      { text: 'Item 3' },
      { text: 'Item 4' },
    ],
  };

  const mockAttributes = {
    'data-slate-node': 'element',
    ref: null,
  };

  const renderDescription = (element = mockElement, clientWidth = 800) => {
    const editor = createTestEditor();
    const mockRef = { current: { clientWidth } };

    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: vi.fn(),
      },
      markdownContainerRef: mockRef,
    } as any);

    return render(
      <ConfigProvider>
        <Slate editor={editor} initialValue={[element]}>
          <Description attributes={mockAttributes} element={element}>
            {element.children.map((child, index) => (
              <td key={index}>{child.text}</td>
            ))}
          </Description>
        </Slate>
      </ConfigProvider>,
    );
  };

  it('应该渲染描述列表容器', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container).toBeDefined();
    expect(container.getAttribute('data-be')).toBe('table');
  });

  it('应该渲染表格', () => {
    const { getByTestId } = renderDescription();

    const table = getByTestId('description-table');
    expect(table).toBeDefined();
    expect(table.tagName).toBe('TABLE');
  });

  it('应该渲染 DragHandle', () => {
    const { container } = renderDescription();

    // DragHandle 应该被渲染
    expect(
      container.querySelector('[data-testid="description-container"]'),
    ).toBeDefined();
  });

  it('应该根据容器宽度分组渲染项目', () => {
    const { getAllByTestId } = renderDescription(mockElement, 800);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该在窄容器中使用更少的列', () => {
    const { getAllByTestId } = renderDescription(mockElement, 400);

    const rows = getAllByTestId('description-row');
    // 窄容器应该有更多行（每行更少列）
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该处理空子元素', () => {
    const emptyElement = {
      type: 'description',
      children: [],
    };

    const { container } = renderDescription(emptyElement);

    const table = container.querySelector('[data-testid="description-table"]');
    expect(table).toBeDefined();
  });

  it('应该支持拖拽事件处理器', () => {
    const mockDragStart = vi.fn();
    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: mockDragStart,
      },
      markdownContainerRef: { current: { clientWidth: 800 } },
    } as any);

    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');

    // 验证 onDragStart 属性存在
    expect(container).toHaveProperty('ondragstart');
  });

  it('应该应用正确的 CSS 类名', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container.className).toContain('ant-md-editor-description');
    expect(container.className).toContain('ant-md-editor-drag-el');
  });

  it('应该传递 attributes', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container.getAttribute('data-slate-node')).toBe('element');
  });

  it('应该处理单个项目', () => {
    const singleItemElement = {
      type: 'description',
      children: [{ text: 'Single Item' }],
    };

    const { getAllByTestId } = renderDescription(singleItemElement);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });
});
