import { createEditor, Editor, Path, Transforms } from 'slate';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ReactEditor,
  withReact,
} from '../../../src/MarkdownEditor/editor/slate-react';
import { EditorStore } from '../../../src/MarkdownEditor/editor/store';
import { EditorUtils } from '../../../src/MarkdownEditor/editor/utils/editorUtils';
import { KeyboardTask } from '../../../src/MarkdownEditor/editor/utils/keyboard';

// Mock dependencies
vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('copy-to-clipboard', () => ({
  default: vi.fn(() => true),
}));

// Mock EditorUtils only for methods that are actually used
vi.mock('../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    toggleFormat: vi.fn(),
    clearMarks: vi.fn(),
    wrapperCardNode: vi.fn((node) => node),
    isTop: vi.fn(() => true),
  },
}));

vi.mock('../../../src/MarkdownEditor/editor/store', () => ({
  EditorStore: vi.fn(),
}));

describe('KeyboardTask', () => {
  let editor: ReactEditor;
  let store: EditorStore;
  let keyboardTask: KeyboardTask;
  let mockProps: any;

  beforeEach(() => {
    // Create editor with initial content
    editor = withReact(createEditor());
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Test content' }],
      },
    ];

    store = {
      editor,
      markdownEditorRef: { current: null },
      setShowComment: vi.fn(),
    } as any;

    mockProps = {
      value: [{ type: 'paragraph', children: [{ text: 'Test content' }] }],
      onChange: vi.fn(),
    };

    keyboardTask = new KeyboardTask(store, mockProps);
  });

  describe('selectAll', () => {
    it('应该选择编辑器中的所有内容', () => {
      const selectSpy = vi.spyOn(Transforms, 'select');
      const startSpy = vi.spyOn(Editor, 'start');
      const endSpy = vi.spyOn(Editor, 'end');

      keyboardTask.selectAll();

      expect(startSpy).toHaveBeenCalledWith(editor, []);
      expect(endSpy).toHaveBeenCalledWith(editor, []);
      expect(selectSpy).toHaveBeenCalledWith(editor, {
        anchor: expect.any(Object),
        focus: expect.any(Object),
      });
    });
  });

  describe('selectLine', () => {
    it('应该选择当前行的文本', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };
      editor.selection = mockSelection;

      const selectSpy = vi.spyOn(Transforms, 'select');
      const parentSpy = vi.spyOn(Path, 'parent');

      keyboardTask.selectLine();

      expect(parentSpy).toHaveBeenCalledWith(mockSelection.anchor.path);
      expect(selectSpy).toHaveBeenCalledWith(editor, expect.any(Array));
    });
  });

  describe('selectFormatToCode', () => {
    it('应该将选中文本转换为行内代码', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };
      editor.selection = mockSelection;

      const toggleFormatSpy = vi.spyOn(EditorUtils, 'toggleFormat');

      keyboardTask.selectFormatToCode();

      expect(toggleFormatSpy).toHaveBeenCalledWith(editor, 'code');
    });
  });

  describe('head', () => {
    it('应该设置标题级别', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = mockSelection;

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const setNodesSpy = vi.spyOn(Transforms, 'setNodes');

      keyboardTask.head(3);

      expect(setNodesSpy).toHaveBeenCalledWith(
        editor,
        { type: 'head', level: 3 },
        { at: [0] },
      );
    });
  });

  describe('paragraph', () => {
    it('应该转换为普通段落', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = mockSelection;

      // Mock curNodes to return a head node
      const mockNode = [
        { type: 'head', level: 2, children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const setNodesSpy = vi.spyOn(Transforms, 'setNodes');

      keyboardTask.paragraph();

      expect(setNodesSpy).toHaveBeenCalledWith(
        editor,
        { type: 'paragraph' },
        { at: [0] },
      );
    });
  });

  describe('increaseHead', () => {
    it('应该增加标题级别', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = mockSelection;

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const setNodesSpy = vi.spyOn(Transforms, 'setNodes');

      keyboardTask.increaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith(
        editor,
        { type: 'head', level: 4 },
        { at: [0] },
      );
    });
  });

  describe('decreaseHead', () => {
    it('应该减少标题级别', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = mockSelection;

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const setNodesSpy = vi.spyOn(Transforms, 'setNodes');

      keyboardTask.decreaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith(
        editor,
        { type: 'head', level: 1 },
        { at: [0] },
      );
    });
  });

  describe('insertQuote', () => {
    it('应该插入引用块', () => {
      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const wrapNodesSpy = vi.spyOn(Transforms, 'wrapNodes');

      keyboardTask.insertQuote();

      expect(wrapNodesSpy).toHaveBeenCalledWith(editor, {
        type: 'blockquote',
        children: [],
      });
    });
  });

  describe('insertTable', () => {
    it('应该插入表格', () => {
      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertTable();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('insertColumn', () => {
    it('应该插入列', () => {
      // Create a fresh editor with column structure
      const freshEditor = withReact(createEditor());
      freshEditor.children = [
        {
          type: 'column-group',
          children: [
            {
              type: 'column-cell',
              children: [{ text: 'Test' }],
            },
          ],
        },
      ];
      const freshStore = { ...store, editor: freshEditor };
      const freshKeyboardTask = new KeyboardTask(freshStore as any, mockProps);

      // Mock curNodes to return a column-cell node
      const mockNode = [
        { type: 'column-cell', children: [{ text: 'Test' }] },
        [0, 0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      freshKeyboardTask.insertColumn();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('insertCode', () => {
    it('应该插入代码块', () => {
      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertCode();

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该插入指定类型的代码块', () => {
      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertCode('mermaid');

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('horizontalLine', () => {
    it('应该插入水平线', () => {
      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.horizontalLine();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('应该插入有序列表', () => {
      // Create a fresh editor for this test
      const freshEditor = withReact(createEditor());
      freshEditor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Test' }],
        },
      ];
      const freshStore = { ...store, editor: freshEditor };
      const freshKeyboardTask = new KeyboardTask(freshStore as any, mockProps);

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      freshKeyboardTask.list('ordered');

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该插入无序列表', () => {
      // Create a fresh editor for this test
      const freshEditor = withReact(createEditor());
      freshEditor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Test' }],
        },
      ];
      const freshStore = { ...store, editor: freshEditor };
      const freshKeyboardTask = new KeyboardTask(freshStore as any, mockProps);

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      freshKeyboardTask.list('unordered');

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该插入任务列表', () => {
      // Create a fresh editor for this test
      const freshEditor = withReact(createEditor());
      freshEditor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Test' }],
        },
      ];
      const freshStore = { ...store, editor: freshEditor };
      const freshKeyboardTask = new KeyboardTask(freshStore as any, mockProps);

      // Mock curNodes to return a paragraph node
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      freshKeyboardTask.list('task');

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('format', () => {
    it('应该应用指定格式', () => {
      const toggleFormatSpy = vi.spyOn(EditorUtils, 'toggleFormat');

      keyboardTask.format('bold');

      expect(toggleFormatSpy).toHaveBeenCalledWith(editor, 'bold');
    });
  });

  describe('clear', () => {
    it('应该清除格式', () => {
      const mockSelection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };
      editor.selection = mockSelection;

      const clearMarksSpy = vi.spyOn(EditorUtils, 'clearMarks');

      keyboardTask.clear();

      expect(clearMarksSpy).toHaveBeenCalledWith(editor, true);
    });
  });

  describe('undo', () => {
    it('应该执行撤销操作', () => {
      // Mock the editor's undo method
      //@ts-ignore
      editor.undo = vi.fn() as any;

      const undoSpy = vi.spyOn(editor, 'undo' as any);

      keyboardTask.undo();

      expect(undoSpy).toHaveBeenCalled();
    });
  });

  describe('redo', () => {
    it('应该执行重做操作', () => {
      // Mock the editor's redo method
      //@ts-ignore
      editor.redo = vi.fn();

      const redoSpy = vi.spyOn(editor, 'redo' as any);

      keyboardTask.redo();

      expect(redoSpy).toHaveBeenCalled();
    });
  });
});
