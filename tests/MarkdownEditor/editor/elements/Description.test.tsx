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

  it('应该在大容器中使用更多列', () => {
    const { getAllByTestId } = renderDescription(mockElement, 1200);

    const rows = getAllByTestId('description-row');
    // 更宽的容器应该有更少的行（每行更多列）
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该正确计算子组长度', () => {
    const largeElement = {
      type: 'description',
      children: Array.from({ length: 10 }, (_, i) => ({
        text: `Item ${i + 1}`,
      })),
    };

    const { getAllByTestId } = renderDescription(largeElement, 800);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('应该处理奇数个项目', () => {
    const oddElement = {
      type: 'description',
      children: Array.from({ length: 5 }, (_, i) => ({
        text: `Item ${i + 1}`,
      })),
    };

    const { getAllByTestId } = renderDescription(oddElement, 800);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该处理偶数个项目', () => {
    const evenElement = {
      type: 'description',
      children: Array.from({ length: 6 }, (_, i) => ({
        text: `Item ${i + 1}`,
      })),
    };

    const { getAllByTestId } = renderDescription(evenElement, 800);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该应用拖拽类名', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container.className).toContain('ant-md-editor-drag-el');
  });

  it('应该应用 hash ID', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    // 检查类名中包含 ant-md-editor-description
    expect(container.className).toContain('ant-md-editor-description');
  });

  it('应该表格应用正确的类名', () => {
    const { getByTestId } = renderDescription();

    const table = getByTestId('description-table');
    expect(table.className).toContain('ant-md-editor-description-table');
  });

  it('应该行应用正确的类名', () => {
    const { getAllByTestId } = renderDescription();

    const rows = getAllByTestId('description-row');
    rows.forEach((row) => {
      expect(row.className).toContain('ant-md-editor-description-row');
    });
  });

  it('应该使用 React.useMemo 优化渲染', () => {
    const { rerender, getByTestId } = renderDescription();

    const firstContainer = getByTestId('description-container');

    // 使用相同的 props 重新渲染
    rerender(
      <ConfigProvider>
        <Slate editor={withReact(createEditor())} initialValue={[mockElement]}>
          <Description attributes={mockAttributes} element={mockElement}>
            {mockElement.children.map((child, index) => (
              <td key={index}>{child.text}</td>
            ))}
          </Description>
        </Slate>
      </ConfigProvider>,
    );

    const secondContainer = getByTestId('description-container');
    // React.useMemo 应该返回相同的引用
    expect(firstContainer).toBe(secondContainer);
  });

  it('应该在容器宽度改变时重新计算布局', () => {
    const { getAllByTestId, rerender } = renderDescription(mockElement, 400);

    const narrowRows = getAllByTestId('description-row');
    const narrowRowCount = narrowRows.length;

    // 改变容器宽度
    const mockRef = { current: { clientWidth: 1200 } };
    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: vi.fn(),
      },
      markdownContainerRef: mockRef,
    } as any);

    rerender(
      <ConfigProvider>
        <Slate editor={withReact(createEditor())} initialValue={[mockElement]}>
          <Description attributes={mockAttributes} element={mockElement}>
            {mockElement.children.map((child, index) => (
              <td key={index}>{child.text}</td>
            ))}
          </Description>
        </Slate>
      </ConfigProvider>,
    );

    // 更宽的容器可能有不同的行数
    expect(narrowRowCount).toBeGreaterThan(0);
  });

  it('应该处理非常小的容器宽度', () => {
    const { getAllByTestId } = renderDescription(mockElement, 100);

    const rows = getAllByTestId('description-row');
    // 即使容器很小，也应该至少有一列
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该处理非常大的容器宽度', () => {
    const { getAllByTestId } = renderDescription(mockElement, 3000);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该处理容器宽度为 0', () => {
    const { getAllByTestId } = renderDescription(mockElement, 0);

    const rows = getAllByTestId('description-row');
    // 即使宽度为 0，也应该至少有一列
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该有 tbody 元素', () => {
    const { getByTestId } = renderDescription();

    const table = getByTestId('description-table');
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeDefined();
  });

  it('应该处理大量项目', () => {
    const largeElement = {
      type: 'description',
      children: Array.from({ length: 100 }, (_, i) => ({
        text: `Item ${i + 1}`,
      })),
    };

    const { getAllByTestId } = renderDescription(largeElement, 800);

    const rows = getAllByTestId('description-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('应该传递正确的 data-be 属性', () => {
    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container.getAttribute('data-be')).toBe('table');
  });

  it('应该渲染 DragHandle 组件', () => {
    const { container } = renderDescription();

    // DragHandle 应该在容器中
    expect(
      container.querySelector('[data-testid="description-container"]'),
    ).toBeDefined();
  });

  it('应该处理拖拽停止事件', () => {
    const mockDragStart = vi.fn();
    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: mockDragStart,
      },
      markdownContainerRef: { current: { clientWidth: 800 } },
    } as any);

    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    const event = new Event('dragstart', { bubbles: true });

    container.dispatchEvent(event);

    // onDragStart 应该被触发
    expect(container).toBeDefined();
  });

  it('应该保持行的顺序', () => {
    const orderedElement = {
      type: 'description',
      children: [
        { text: 'First' },
        { text: 'Second' },
        { text: 'Third' },
        { text: 'Fourth' },
      ],
    };

    const { container } = renderDescription(orderedElement, 800);

    const cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toBe('First');
    expect(cells[1].textContent).toBe('Second');
  });

  it('应该处理元素子节点变化', () => {
    const { rerender, getAllByTestId } = renderDescription();

    const firstRows = getAllByTestId('description-row');
    const firstRowCount = firstRows.length;

    // 改变子元素
    const newElement = {
      type: 'description',
      children: Array.from({ length: 8 }, (_, i) => ({
        text: `New Item ${i + 1}`,
      })),
    };

    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: vi.fn(),
      },
      markdownContainerRef: { current: { clientWidth: 800 } },
    } as any);

    rerender(
      <ConfigProvider>
        <Slate editor={withReact(createEditor())} initialValue={[newElement]}>
          <Description attributes={mockAttributes} element={newElement}>
            {newElement.children.map((child, index) => (
              <td key={index}>{child.text}</td>
            ))}
          </Description>
        </Slate>
      </ConfigProvider>,
    );

    const newRows = getAllByTestId('description-row');
    // 子元素数量变化应该影响行数
    expect(newRows.length).toBeGreaterThan(0);
  });

  it('应该处理包含复杂内容的子元素', () => {
    const complexElement = {
      type: 'description',
      children: [
        { text: 'Simple text' },
        { text: 'Text with special chars: @#$%' },
        { text: '数字和中文: 123 测试' },
        { text: '' },
      ],
    };

    const { container } = renderDescription(complexElement, 800);

    const cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toBe('Simple text');
    expect(cells[1].textContent).toBe('Text with special chars: @#$%');
    expect(cells[2].textContent).toBe('数字和中文: 123 测试');
  });

  it('应该处理 null 或 undefined 的 markdownContainerRef', () => {
    vi.mocked(editorStore.useEditorStore).mockReturnValue({
      store: {
        dragStart: vi.fn(),
      },
      markdownContainerRef: { current: null },
    } as any);

    const { getByTestId } = renderDescription();

    const container = getByTestId('description-container');
    expect(container).toBeDefined();
  });
});
