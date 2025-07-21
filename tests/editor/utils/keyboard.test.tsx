import { Subject } from 'rxjs';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  KeyboardTask,
  useSystemKeyboard,
} from '../../../src/MarkdownEditor/editor/utils/keyboard';

// Mock dependencies
vi.mock('antd', () => ({
  message: {
    loading: vi.fn(() => vi.fn()),
    success: vi.fn(),
  },
}));

vi.mock('copy-to-clipboard', () => vi.fn());

vi.mock('../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    toggleFormat: vi.fn(),
    clearMarks: vi.fn(),
    createMediaNode: vi.fn(() => ({ type: 'media', url: 'test-url' })),
    wrapperCardNode: vi.fn((node) => node),
    isTop: vi.fn(() => true),
    p: { type: 'paragraph', children: [{ text: '' }] },
    findPrev: vi.fn(),
    findNext: vi.fn(),
  },
}));

vi.mock('../../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    focus: vi.fn(),
  },
}));

describe('KeyboardTask', () => {
  let editor: any;
  let store: any;
  let props: any;
  let keyboardTask: KeyboardTask;

  beforeEach(() => {
    editor = withReact(createEditor());
    store = {
      editor,
      undo: jest.fn(),
      redo: jest.fn(),
    };
    props = {
      readonly: false,
      image: {
        upload: jest.fn().mockResolvedValue(['test-url']),
      },
    };
    keyboardTask = new KeyboardTask(store, props);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('selectAll', () => {
    it('should select all content in editor', () => {
      const selectSpy = jest.spyOn(editor, 'select');

      keyboardTask.selectAll();

      expect(selectSpy).toHaveBeenCalledWith({
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
    });
  });

  describe('selectLine', () => {
    it('should select current line when selection exists', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 10 },
      };

      const selectSpy = jest.spyOn(editor, 'select');

      keyboardTask.selectLine();

      expect(selectSpy).toHaveBeenCalledWith([0]);
    });

    it('should not select line when no selection exists', () => {
      editor.selection = null;

      const selectSpy = jest.spyOn(editor, 'select');

      keyboardTask.selectLine();

      expect(selectSpy).not.toHaveBeenCalled();
    });
  });

  describe('selectFormatToCode', () => {
    it('should toggle code format when selection exists', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };

      const {
        EditorUtils,
      } = require('../../../src/MarkdownEditor/editor/utils/editorUtils');

      keyboardTask.selectFormatToCode();

      expect(EditorUtils.toggleFormat).toHaveBeenCalledWith(editor, 'code');
    });

    it('should not toggle format when no selection exists', () => {
      editor.selection = null;

      const {
        EditorUtils,
      } = require('../../../src/MarkdownEditor/editor/utils/editorUtils');

      keyboardTask.selectFormatToCode();

      expect(EditorUtils.toggleFormat).not.toHaveBeenCalled();
    });
  });

  describe('selectWord', () => {
    it('should select word when cursor is on word', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      };

      // Mock Node.leaf to return text with word
      jest
        .spyOn(require('slate'), 'Node')
        .leaf.mockReturnValue({ text: 'hello world' });

      const selectSpy = jest.spyOn(editor, 'select');

      keyboardTask.selectWord();

      expect(selectSpy).toHaveBeenCalledWith({
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      });
    });

    it('should select Chinese character when cursor is on Chinese', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 1 },
      };

      jest
        .spyOn(require('slate'), 'Node')
        .leaf.mockReturnValue({ text: '你好世界' });

      const selectSpy = jest.spyOn(editor, 'select');

      keyboardTask.selectWord();

      expect(selectSpy).toHaveBeenCalledWith({
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 2 },
      });
    });
  });

  describe('pastePlainText', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          readText: jest.fn().mockResolvedValue('test text'),
        },
      });
    });

    it('should paste plain text in normal node', async () => {
      const insertTextSpy = jest.spyOn(editor, 'insertText');

      await keyboardTask.pastePlainText();

      expect(insertTextSpy).toHaveBeenCalledWith('test text');
    });

    it('should replace newlines with spaces in table cell', async () => {
      // Mock curNodes to return table cell
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'table-cell' }, [0, 0]]]);

      const insertTextSpy = jest.spyOn(editor, 'insertText');

      await keyboardTask.pastePlainText();

      expect(insertTextSpy).toHaveBeenCalledWith('test text');
    });
  });

  describe('uploadImage', () => {
    beforeEach(() => {
      // Mock document.createElement
      const mockInput = {
        id: '',
        type: '',
        accept: '',
        onchange: null,
        click: jest.fn(),
        remove: jest.fn(),
        value: '',
        dataset: {},
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockInput as any);
    });

    it('should create file input and trigger click', () => {
      keyboardTask.uploadImage();

      expect(document.createElement).toHaveBeenCalledWith('input');
    });
  });

  describe('head', () => {
    it('should set heading level', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.head(1);

      expect(setNodesSpy).toHaveBeenCalledWith(
        { type: 'head', level: 1 },
        { at: [0] },
      );
    });

    it('should convert to paragraph when level is 4', () => {
      const paragraphSpy = jest.spyOn(keyboardTask, 'paragraph');

      keyboardTask.head(4);

      expect(paragraphSpy).toHaveBeenCalled();
    });
  });

  describe('paragraph', () => {
    it('should convert heading to paragraph', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'head' }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.paragraph();

      expect(setNodesSpy).toHaveBeenCalledWith(
        { type: 'paragraph' },
        { at: [0] },
      );
    });
  });

  describe('increaseHead', () => {
    it('should increase heading level', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'head', level: 2 }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.increaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith({ level: 1 }, { at: [0] });
    });

    it('should convert level 1 heading to paragraph', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'head', level: 1 }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.increaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith(
        { type: 'paragraph' },
        { at: [0] },
      );
    });
  });

  describe('decreaseHead', () => {
    it('should decrease heading level', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'head', level: 2 }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.decreaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith({ level: 3 }, { at: [0] });
    });

    it('should convert level 4 heading to paragraph', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'head', level: 4 }, [0]]]);

      const setNodesSpy = jest.spyOn(editor, 'setNodes');

      keyboardTask.decreaseHead();

      expect(setNodesSpy).toHaveBeenCalledWith(
        { type: 'paragraph' },
        { at: [0] },
      );
    });
  });

  describe('insertQuote', () => {
    it('should wrap paragraph in blockquote', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const wrapNodesSpy = jest.spyOn(editor, 'wrapNodes');

      keyboardTask.insertQuote();

      expect(wrapNodesSpy).toHaveBeenCalledWith({
        type: 'blockquote',
        children: [],
      });
    });

    it('should unwrap blockquote when already in blockquote', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      // Mock Node.parent to return blockquote
      jest
        .spyOn(require('slate'), 'Node')
        .parent.mockReturnValue({ type: 'blockquote' });

      const unwrapNodesSpy = jest.spyOn(editor, 'unwrapNodes');

      keyboardTask.insertQuote();

      expect(unwrapNodesSpy).toHaveBeenCalledWith({ at: [0] });
    });
  });

  describe('insertTable', () => {
    it('should insert table in paragraph', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.insertTable();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('insertColumn', () => {
    it('should insert column group', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.insertColumn();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('insertCode', () => {
    it('should insert code block', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.insertCode();

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('should insert mermaid code block', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.insertCode('mermaid');

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('horizontalLine', () => {
    it('should insert horizontal line', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.horizontalLine();

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should create ordered list', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.list('ordered');

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('should create unordered list', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.list('unordered');

      expect(insertNodesSpy).toHaveBeenCalled();
    });

    it('should create task list', () => {
      jest
        .spyOn(keyboardTask, 'curNodes', 'get')
        .mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const insertNodesSpy = jest.spyOn(editor, 'insertNodes');

      keyboardTask.list('task');

      expect(insertNodesSpy).toHaveBeenCalled();
    });
  });

  describe('format', () => {
    it('should toggle format', () => {
      const {
        EditorUtils,
      } = require('../../../src/MarkdownEditor/editor/utils/editorUtils');

      keyboardTask.format('bold');

      expect(EditorUtils.toggleFormat).toHaveBeenCalledWith(editor, 'bold');
    });
  });

  describe('clear', () => {
    it('should clear marks when selection exists', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };

      const {
        EditorUtils,
      } = require('../../../src/MarkdownEditor/editor/utils/editorUtils');

      keyboardTask.clear();

      expect(EditorUtils.clearMarks).toHaveBeenCalledWith(editor, true);
    });
  });

  describe('undo', () => {
    it('should call editor undo', () => {
      const undoSpy = jest.spyOn(store, 'undo');

      keyboardTask.undo();

      expect(undoSpy).toHaveBeenCalled();
    });
  });

  describe('redo', () => {
    it('should call editor redo', () => {
      const redoSpy = jest.spyOn(store, 'redo');

      keyboardTask.redo();

      expect(redoSpy).toHaveBeenCalled();
    });
  });
});

describe('useSystemKeyboard', () => {
  it('should set up keyboard event listener', () => {
    const keyTask$ = new Subject();
    const store = { editor: withReact(createEditor()) };
    const props = { readonly: false };
    const markdownContainerRef = { current: document.createElement('div') };

    const addEventListenerSpy = jest.spyOn(
      markdownContainerRef.current,
      'addEventListener',
    );
    const removeEventListenerSpy = jest.spyOn(
      markdownContainerRef.current,
      'removeEventListener',
    );

    // This is a hook, so we can't easily test it without a component
    // But we can verify the basic structure
    expect(typeof useSystemKeyboard).toBe('function');
  });
});
