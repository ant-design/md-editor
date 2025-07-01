import { Editor, Node, Path, Point, Range, Transforms } from 'slate';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { EditorUtils } from '../../../utils/editorUtils';
import { BackspaceKey } from '../backspace';

// Mock Slate's Editor, Transforms, and other dependencies
vi.mock('slate', () => {
  const mockFn = () => vi.fn() as Mock;
  return {
    Editor: {
      start: mockFn(),
      end: mockFn(),
      nodes: mockFn(),
      parent: mockFn(),
      previous: mockFn(),
      hasPath: mockFn(),
      node: mockFn(),
      isEditor: mockFn(),
    },
    Element: {
      isElement: mockFn(),
    },
    Node: {
      leaf: mockFn(),
      string: mockFn(),
      get: mockFn(),
    },
    Path: {
      hasPrevious: mockFn(),
      previous: mockFn(),
      parent: mockFn(),
      next: mockFn(),
    },
    Point: {
      equals: mockFn(),
    },
    Range: {
      edges: mockFn(),
      start: mockFn(),
    },
    Transforms: {
      delete: mockFn(),
      insertNodes: mockFn(),
      removeNodes: mockFn(),
      select: mockFn(),
      setNodes: mockFn(),
      moveNodes: mockFn(),
    },
  };
});

// Mock EditorUtils
vi.mock('../../../utils/editorUtils', () => ({
  EditorUtils: {
    deleteAll: vi.fn(),
    isDirtLeaf: vi.fn(),
    clearMarks: vi.fn(),
    isTop: vi.fn(),
    p: { type: 'paragraph', children: [{ text: '' }] },
    copy: vi.fn(),
    moveNodes: vi.fn(),
  },
}));

describe('BackspaceKey', () => {
  let editor: Editor;
  let backspaceKey: BackspaceKey;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Create a mock editor
    editor = {
      selection: null,
      children: [],
    } as any;

    backspaceKey = new BackspaceKey(editor);
  });

  describe('range()', () => {
    it('should handle full document selection', () => {
      // Mock selection that covers the entire document
      const mockStart = { offset: 0, path: [0] };
      const mockEnd = { offset: 10, path: [1] };
      editor.selection = { anchor: mockStart, focus: mockEnd } as any;

      // Mock Range.edges to return the start and end points
      (Range.edges as Mock).mockReturnValue([mockStart, mockEnd]);

      // Mock Editor.start and Editor.end
      (Editor.start as Mock).mockReturnValue(mockStart);
      (Editor.end as Mock).mockReturnValue(mockEnd);

      (Point.equals as Mock)
        .mockReturnValueOnce(true) // start point equals
        .mockReturnValueOnce(true); // end point equals

      const result = backspaceKey.range();

      expect(result).toBe(true);
      expect(EditorUtils.deleteAll).toHaveBeenCalledWith(editor);
      expect(Transforms.select).toHaveBeenCalled();
    });

    it('should return false when no selection exists', () => {
      editor.selection = null;
      const result = backspaceKey.range();
      expect(result).toBe(undefined);
    });
  });

  describe('run()', () => {
    it('should handle heading conversion to paragraph when empty', () => {
      const mockStart = { offset: 0, path: [0, 0] };
      editor.selection = { anchor: mockStart, focus: mockStart } as any;
      const headNode = { type: 'head', children: [] };
      const path = [0];

      (Editor.nodes as Mock).mockReturnValue([[headNode, path]]);
      (Node.string as Mock).mockReturnValue('');
      (Range.start as Mock).mockReturnValue(mockStart);
      (Node.leaf as Mock).mockReturnValue({ text: '' });
      (EditorUtils.isDirtLeaf as Mock).mockReturnValue(false);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.setNodes).toHaveBeenCalledWith(
        editor,
        { type: 'paragraph' },
        { at: path },
      );
    });

    it('should handle media node deletion', () => {
      const mockStart = { offset: 0, path: [0, 0] };
      editor.selection = { anchor: mockStart, focus: mockStart } as any;
      const mediaNode = { type: 'media', children: [] };
      const path = [0];

      (Editor.nodes as Mock).mockReturnValue([[mediaNode, path]]);
      (Range.start as Mock).mockReturnValue(mockStart);
      (Node.leaf as Mock).mockReturnValue({ text: '' });
      (EditorUtils.isDirtLeaf as Mock).mockReturnValue(false);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.removeNodes).toHaveBeenCalledWith(editor, { at: path });
      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        editor,
        EditorUtils.p,
        { at: path, select: true },
      );
    });

    it('should handle table cell at start position', () => {
      editor.selection = {
        anchor: { offset: 0, path: [0, 0, 0] },
        focus: { offset: 0, path: [0, 0, 0] },
      } as any;
      const tableCellNode = { type: 'table-cell', children: [] };
      const path = [0, 0, 0];
      const mockStart = { offset: 0, path: [0, 0, 0] };

      (Editor.nodes as Mock).mockReturnValue([[tableCellNode, path]]);
      (Path.hasPrevious as Mock)
        .mockReturnValueOnce(false) // for start.path
        .mockReturnValueOnce(true); // for path
      (Range.start as Mock).mockReturnValue(mockStart);
      (Node.leaf as Mock).mockReturnValue({ text: '' });
      (EditorUtils.isDirtLeaf as Mock).mockReturnValue(false);

      const result = backspaceKey.run();

      expect(result).toBe(true);
    });

    it('should handle empty list item deletion', () => {
      editor.selection = { anchor: {}, focus: {} } as any;
      const paragraphNode = { type: 'paragraph', children: [] };
      const path = [0];
      const parentNode = { type: 'list-item', children: [] };

      (Editor.nodes as Mock).mockReturnValue([[paragraphNode, path]]);
      (Editor.parent as Mock).mockReturnValue([parentNode, [0]]);
      (Node.string as Mock).mockReturnValue('');

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.delete).toHaveBeenCalled();
      expect(Transforms.insertNodes).toHaveBeenCalled();
    });

    it('should handle blockquote deletion', () => {
      editor.selection = {
        anchor: { offset: 0, path: [0, 0] },
        focus: { offset: 0, path: [0, 0] },
      } as any;
      const paragraphNode = { type: 'paragraph', children: [] };
      const path = [0, 0];
      const parentNode = { type: 'blockquote', children: [] };

      (Editor.nodes as Mock).mockReturnValue([[paragraphNode, path]]);
      (Editor.parent as Mock).mockReturnValue([parentNode, [0]]);
      (Editor.previous as Mock).mockReturnValue(null);
      (Editor.hasPath as Mock).mockReturnValue(false);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.delete).toHaveBeenCalled();
      expect(Transforms.insertNodes).toHaveBeenCalled();
    });

    it('should handle break node deletion', () => {
      editor.selection = {
        anchor: { offset: 0, path: [0] },
        focus: { offset: 0, path: [0] },
      } as any;
      const paragraphNode = { type: 'paragraph', children: [] };
      const path = [0];
      const breakNode = { type: 'break' };

      (Editor.nodes as Mock).mockReturnValue([[paragraphNode, path]]);
      (Editor.previous as Mock).mockReturnValue([breakNode, [0]]);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.delete).toHaveBeenCalled();
    });

    it('should handle first paragraph in editor deletion', () => {
      editor.selection = {
        anchor: { offset: 0, path: [0] },
        focus: { offset: 0, path: [0] },
      } as any;
      const paragraphNode = { type: 'paragraph', children: [] };
      const path = [0];

      (Editor.nodes as Mock).mockReturnValue([[paragraphNode, path]]);
      (Editor.previous as Mock).mockReturnValue(null);
      (Editor.parent as Mock).mockReturnValue([editor, []]);
      (Editor.hasPath as Mock).mockReturnValue(true);
      (Editor.node as Mock).mockReturnValue([{ type: 'paragraph' }, [1]]);
      (Editor.isEditor as any).mockReturnValue(true);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.delete).toHaveBeenCalled();
    });

    it('should handle list item merging with previous item', () => {
      editor.selection = {
        anchor: { offset: 0, path: [0, 0] },
        focus: { offset: 0, path: [0, 0] },
      } as any;
      const paragraphNode = { type: 'paragraph', children: [] };
      const path = [0, 0];
      const parentNode = { type: 'list-item', children: [] };
      const prevListItem = { type: 'list-item', children: [] };

      (Editor.nodes as Mock).mockReturnValue([[paragraphNode, path]]);
      (Editor.parent as Mock)
        .mockReturnValueOnce([parentNode, [0]]) // first call for list-item check
        .mockReturnValueOnce([parentNode, [0]]); // second call for list-item logic
      
      // Mock the previous calls in sequence
      (Editor.previous as Mock)
        .mockReturnValueOnce(null) // preInline check at focus path
        .mockReturnValueOnce(null) // pre check at path
        .mockReturnValueOnce([prevListItem, [0]]); // preListItem check
      
      (Node.string as Mock).mockReturnValue('');
      (Editor.hasPath as Mock).mockReturnValue(true); // for cur path check
      (Path.next as Mock).mockReturnValue([0, 1]);

      const result = backspaceKey.run();

      expect(result).toBe(true);
      expect(Transforms.moveNodes).toHaveBeenCalled();
      expect(Transforms.delete).toHaveBeenCalled();
    });
  });
});
