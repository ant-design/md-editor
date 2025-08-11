import { createEditor, Editor, Node, Transforms } from 'slate';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ReactEditor,
  withReact,
} from '../../../../../src/MarkdownEditor/editor/slate-react';
import { EditorStore } from '../../../../../src/MarkdownEditor/editor/store';
import { EditorUtils } from '../../../../../src/MarkdownEditor/editor/utils/editorUtils';
import { KeyboardTask } from '../../../../../src/MarkdownEditor/editor/utils/keyboard';

// Mock dependencies
vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => vi.fn()),
  },
}));

vi.mock('copy-to-clipboard', () => ({
  default: vi.fn(() => true),
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: vi.fn(),
  },
  writable: true,
});

// Mock EditorUtils
vi.mock('../../../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    toggleFormat: vi.fn(),
    clearMarks: vi.fn(),
    wrapperCardNode: vi.fn((node) => node),
    isTop: vi.fn(() => true),
    createMediaNode: vi.fn(() => ({ type: 'media', url: 'test.jpg' })),
    p: { type: 'paragraph', children: [{ text: '' }] },
    findPrev: vi.fn(() => [0]),
    findNext: vi.fn(() => [1]),
  },
}));

vi.mock('../../../../../src/MarkdownEditor/editor/store', () => ({
  EditorStore: vi.fn(),
}));

describe('KeyboardTask - Insert Methods', () => {
  let editor: ReactEditor;
  let store: EditorStore;
  let keyboardTask: KeyboardTask;
  let mockProps: any;

  beforeEach(() => {
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
      image: {
        upload: vi.fn(),
      },
    };

    keyboardTask = new KeyboardTask(store, mockProps);

    vi.clearAllMocks();
  });

  describe('insertQuote', () => {
    it('应该插入引用块', () => {
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

    it('应该移除现有的引用块', () => {
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0, 0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);
      vi.spyOn(Node, 'parent').mockReturnValue({
        type: 'blockquote',
        children: [],
      } as any);

      const unwrapNodesSpy = vi.spyOn(Transforms, 'unwrapNodes');

      keyboardTask.insertQuote();

      expect(unwrapNodesSpy).toHaveBeenCalledWith(editor, { at: [0] });
    });

    it('当节点类型不支持时不应该执行任何操作', () => {
      const mockNode = [{ type: 'code', children: [{ text: 'Test' }] }, [0]];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const wrapNodesSpy = vi.spyOn(Transforms, 'wrapNodes');

      keyboardTask.insertQuote();

      expect(wrapNodesSpy).not.toHaveBeenCalled();
    });
  });

  describe('insertTable', () => {
    it('应该插入表格', () => {
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertTable();

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该在列单元格中插入表格', () => {
      const mockNode = [
        { type: 'column-cell', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertTable();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('insertCode', () => {
    it('应该插入代码块', () => {
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
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertCode('mermaid');

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该插入HTML代码块', () => {
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.insertCode('html');

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('horizontalLine', () => {
    it('应该插入水平线', () => {
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.horizontalLine();

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('应该在水平线后插入段落', () => {
      const mockNode = [
        { type: 'paragraph', children: [{ text: 'Test' }] },
        [0],
      ];
      vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);
      vi.spyOn(Editor, 'hasPath').mockReturnValue(false);

      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      keyboardTask.horizontalLine();

      expect(insertNodesSpy).toHaveBeenCalledTimes(2); // 一次插入水平线，一次插入段落
    });
  });
});
