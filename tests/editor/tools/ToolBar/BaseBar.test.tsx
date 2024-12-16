import { withMarkdown } from '@ant-design/md-editor/MarkdownEditor/editor/plugins';
import { fireEvent, render } from '@testing-library/react';
import * as Slate from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '../../../../src/MarkdownEditor/editor/store';
import { BaseToolBar } from '../../../../src/MarkdownEditor/editor/tools/ToolBar/BaseBar';

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(),
}));

vi.spyOn(Slate.Editor, 'nodes').mockImplementation(
  () => [[{ type: 'mock-node' }]] as any,
);
const editor = withMarkdown(withReact(withHistory(Slate.createEditor())));
describe('BaseToolBar Component', () => {
  beforeEach(() => {
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: {
        editor,
        refreshFloatBar: false,
        editorProps: {},
        highlightCache: new Map(),
        openInsertLink$: { next: vi.fn() },
        refreshHighlight: false,
        openLinkPanel: false,
      },
      keyTask$: { next: vi.fn() },
    });
  });
  it('renders BaseToolBar with default props', () => {
    const { container } = render(<BaseToolBar />);
    expect(container.firstChild).toBeDefined();
    expect(
      container.querySelectorAll('.toolbar-action-item').length,
    ).toBeGreaterThan(0);
  });

  it('handles click events on the undo button and updates keyTask$', () => {
    const mockKeyTaskNext = vi.fn();
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: { editor: {} },
      keyTask$: { next: mockKeyTaskNext },
    });

    const { getByRole } = render(<BaseToolBar showEditor={true} />);
    const undoButton = getByRole('button', { name: /undo/i });

    fireEvent.click(undoButton);

    expect(mockKeyTaskNext).toHaveBeenCalledWith({ key: 'undo', args: [] });
    expect(mockKeyTaskNext).toHaveBeenCalledTimes(1);
  });

  it('handles click events on the redo button and updates keyTask$', () => {
    const mockKeyTaskNext = vi.fn();
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: { editor: {} },
      keyTask$: { next: mockKeyTaskNext },
    });

    const { getByRole } = render(<BaseToolBar showEditor={true} />);
    const redoButton = getByRole('button', { name: /redo/i });

    fireEvent.click(redoButton);

    expect(mockKeyTaskNext).toHaveBeenCalledWith({ key: 'redo', args: [] });
    expect(mockKeyTaskNext).toHaveBeenCalledTimes(1);
  });

  it('handles color picker interactions', () => {
    const mockKeyTaskNext = vi.fn();
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: {
        editor: {},
      },
      keyTask$: { next: mockKeyTaskNext },
    });

    const { getByText } = render(<BaseToolBar showEditor={true} />);

    const colorButton = getByText('A');

    expect(colorButton).toBeDefined();

    fireEvent.click(colorButton);
  });

  it('renders with min prop enabled', () => {
    const { container } = render(<BaseToolBar min={true} />);
    expect(container.firstChild).toBeDefined();
    expect(
      container.querySelector('.toolbar-action-item-min-plus-icon'),
    ).toBeDefined();
  });

  it('filters out tools based on hideTools prop', () => {
    const { container } = render(<BaseToolBar hideTools={['clear', 'redo']} />);
    expect(
      container.querySelector('.toolbar-action-item[key="clear"]'),
    ).toBeNull();
    expect(
      container.querySelector('.toolbar-action-item[key="redo"]'),
    ).toBeNull();
  });
});
