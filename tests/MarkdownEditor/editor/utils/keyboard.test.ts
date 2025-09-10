import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditorProps } from '../../../../src/MarkdownEditor/BaseMarkdownEditor';
import { EditorStore } from '../../../../src/MarkdownEditor/editor/store';
import {
  KeyboardTask,
  useSystemKeyboard,
} from '../../../../src/MarkdownEditor/editor/utils/keyboard';

// Mock dependencies
vi.mock('antd', () => ({
  message: {
    loading: vi.fn(() => vi.fn()),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('copy-to-clipboard', () => ({
  default: vi.fn(),
}));

vi.mock('is-hotkey', () => ({
  default: vi.fn(),
}));

vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
    start: vi.fn(),
    end: vi.fn(),
    hasPath: vi.fn(),
    range: vi.fn(),
    string: vi.fn(),
    insertText: vi.fn(),
    parent: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
  Node: {
    leaf: vi.fn(),
    parent: vi.fn(),
    string: vi.fn(),
  },
  Path: {
    parent: vi.fn(),
    next: vi.fn(),
    hasPrevious: vi.fn(),
  },
  Range: {
    isCollapsed: vi.fn(),
    equals: vi.fn(),
    includes: vi.fn(),
  },
  Text: {
    isText: vi.fn(),
  },
  Transforms: {
    select: vi.fn(),
    insertNodes: vi.fn(),
    setNodes: vi.fn(),
    delete: vi.fn(),
    unwrapNodes: vi.fn(),
    wrapNodes: vi.fn(),
    removeNodes: vi.fn(),
  },
  EditorUtils: {
    toggleFormat: vi.fn(),
    isTop: vi.fn(),
    createMediaNode: vi.fn(),
    wrapperCardNode: vi.fn(),
  },
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    toggleFormat: vi.fn(),
    isTop: vi.fn(),
    createMediaNode: vi.fn(),
    wrapperCardNode: vi.fn(),
    clearMarks: vi.fn(),
    findPrev: vi.fn(),
    findNext: vi.fn(),
    p: { type: 'paragraph', children: [{ text: '' }] },
  },
}));

vi.mock('../../../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    focus: vi.fn(),
  },
}));

vi.mock('../../../../src/MarkdownEditor/hooks/subscribe', () => ({
  useSubject: vi.fn(),
}));

describe('KeyboardTask', () => {
  let mockStore: EditorStore;
  let mockProps: MarkdownEditorProps;
  let keyboardTask: KeyboardTask;

  beforeEach(() => {
    vi.clearAllMocks();

    mockStore = {
      editor: {
        selection: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        },
        undo: vi.fn(),
        redo: vi.fn(),
      } as any,
    } as EditorStore;

    // 默认mock Editor.nodes返回一个有效的节点
    const { Editor } = require('slate');
    Editor.nodes.mockReturnValue([[{ type: 'paragraph', children: [] }, [0]]]);

    mockProps = {
      readonly: false,
      image: {
        upload: vi.fn(),
      },
    } as MarkdownEditorProps;

    keyboardTask = new KeyboardTask(mockStore, mockProps);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('构造函数', () => {
    it('应该正确初始化 KeyboardTask 实例', () => {
      expect(keyboardTask.store).toBe(mockStore);
      expect(keyboardTask.editor).toBe(mockStore.editor);
      expect(keyboardTask.props).toBe(mockProps);
    });
  });

  describe('curNodes getter', () => {
    it('应该返回当前编辑器中的最低层级元素节点', async () => {
      const mockNodes = [[{ type: 'paragraph', children: [] }, [0]]];
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue(mockNodes);

      const result = keyboardTask.curNodes;

      expect(vi.mocked(Editor.nodes)).toHaveBeenCalledWith(mockStore.editor, {
        mode: 'lowest',
        match: expect.any(Function),
      });
      expect(result).toBe(mockNodes);
    });
  });

  describe('selectAll', () => {
    it('应该全选编辑器内容', async () => {
      const { Editor, Transforms } = await import('slate');
      Editor.start.mockReturnValue({ path: [0], offset: 0 });
      Editor.end.mockReturnValue({ path: [0], offset: 10 });

      keyboardTask.selectAll();

      expect(Transforms.select).toHaveBeenCalledWith(mockStore.editor, {
        anchor: { path: [0], offset: 0 },
        focus: { path: [0], offset: 10 },
      });
    });
  });

  describe('selectLine', () => {
    it('应该选择当前行的文本', async () => {
      const { Transforms, Path } = await import('slate');
      Path.parent.mockReturnValue([0]);

      keyboardTask.selectLine();

      expect(Transforms.select).toHaveBeenCalledWith(mockStore.editor, [0]);
    });

    it('应该在没有选区时不执行任何操作', async () => {
      const { Transforms } = await import('slate');
      mockStore.editor.selection = null;

      keyboardTask.selectLine();

      expect(Transforms.select).not.toHaveBeenCalled();
    });
  });

  describe('selectFormatToCode', () => {
    it('应该将选中文本转换为行内代码', async () => {
      const { EditorUtils } = await import(
        '../../../../src/MarkdownEditor/editor/utils/editorUtils'
      );

      keyboardTask.selectFormatToCode();

      expect(EditorUtils.toggleFormat).toHaveBeenCalledWith(
        mockStore.editor,
        'code',
      );
    });

    it('应该在没有选区时不执行任何操作', async () => {
      const { EditorUtils } = await import(
        '../../../../src/MarkdownEditor/editor/utils/editorUtils'
      );
      mockStore.editor.selection = null;

      keyboardTask.selectFormatToCode();

      expect(EditorUtils.toggleFormat).not.toHaveBeenCalled();
    });
  });

  describe('selectWord', () => {
    it('应该选择当前光标所在的单词', async () => {
      const { Node, Range, Transforms } = await import('slate');
      const mockSelection = {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      };
      mockStore.editor.selection = mockSelection;
      Range.isCollapsed.mockReturnValue(true);
      Node.leaf.mockReturnValue({ text: 'hello world' });

      keyboardTask.selectWord();

      expect(Transforms.select).toHaveBeenCalledWith(mockStore.editor, {
        anchor: { path: [0, 0], offset: 6 },
        focus: { path: [0, 0], offset: 11 },
      });
    });

    it('应该选择当前光标所在的汉字', async () => {
      const { Node, Range, Transforms } = await import('slate');
      const mockSelection = {
        anchor: { path: [0, 0], offset: 2 },
        focus: { path: [0, 0], offset: 2 },
      };
      mockStore.editor.selection = mockSelection;
      Range.isCollapsed.mockReturnValue(true);
      Node.leaf.mockReturnValue({ text: '你好世界' });

      keyboardTask.selectWord();

      expect(Transforms.select).toHaveBeenCalled();
    });

    it('应该在没有选区时不执行任何操作', async () => {
      const { Transforms } = await import('slate');
      mockStore.editor.selection = null;

      keyboardTask.selectWord();

      expect(Transforms.select).not.toHaveBeenCalled();
    });
  });

  describe('pastePlainText', () => {
    it('应该粘贴纯文本内容', async () => {
      const mockText = 'Hello World';
      const mockClipboard = {
        readText: vi.fn().mockResolvedValue(mockText),
      };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
      });

      const { Editor } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);

      await keyboardTask.pastePlainText();

      expect(mockClipboard.readText).toHaveBeenCalled();
      expect(Editor.insertText).toHaveBeenCalledWith(
        mockStore.editor,
        mockText,
      );
    });

    it('应该在表格单元格中替换换行符', async () => {
      const mockText = 'Line1\nLine2';
      const mockClipboard = {
        readText: vi.fn().mockResolvedValue(mockText),
      };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
      });

      const { Editor } = await import('slate');
      const mockNodes = [[{ type: 'table-cell' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);

      await keyboardTask.pastePlainText();

      expect(Editor.insertText).toHaveBeenCalledWith(
        mockStore.editor,
        'Line1 Line2',
      );
    });
  });

  describe('uploadImage', () => {
    it('应该创建文件上传输入框', () => {
      const mockInput = {
        id: '',
        type: '',
        accept: '',
        onchange: null,
        click: vi.fn(),
        remove: vi.fn(),
        value: '',
        dataset: {},
      };
      const createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockInput as any);

      keyboardTask.uploadImage();

      expect(createElementSpy).toHaveBeenCalledWith('input');
      expect(mockInput.type).toBe('file');
      expect(mockInput.accept).toBe('image/*');
      expect(mockInput.click).toHaveBeenCalled();
      expect(mockInput.remove).toHaveBeenCalled();
    });
  });

  describe('head', () => {
    it('应该设置标题级别', async () => {
      const { Editor, Transforms, EditorUtils } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      EditorUtils.isTop.mockReturnValue(true);

      keyboardTask.head(1);

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockStore.editor,
        { type: 'head', level: 1 },
        { at: [0] },
      );
    });

    it('应该将级别4转换为普通段落', () => {
      const paragraphSpy = vi.spyOn(keyboardTask, 'paragraph');

      keyboardTask.head(4);

      expect(paragraphSpy).toHaveBeenCalled();
    });
  });

  describe('paragraph', () => {
    it('应该将标题转换为普通段落', async () => {
      const { Editor, Transforms } = await import('slate');
      const mockNodes = [[{ type: 'head' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);

      keyboardTask.paragraph();

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockStore.editor,
        { type: 'paragraph' },
        { at: [0] },
      );
    });
  });

  describe('increaseHead', () => {
    it('应该增加标题级别', async () => {
      const { Editor, Transforms, EditorUtils } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      EditorUtils.isTop.mockReturnValue(true);

      keyboardTask.increaseHead();

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockStore.editor,
        { type: 'head', level: 4 },
        { at: [0] },
      );
    });
  });

  describe('decreaseHead', () => {
    it('应该降低标题级别', async () => {
      const { Editor, Transforms, EditorUtils } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      EditorUtils.isTop.mockReturnValue(true);

      keyboardTask.decreaseHead();

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockStore.editor,
        { type: 'head', level: 1 },
        { at: [0] },
      );
    });
  });

  describe('insertQuote', () => {
    it('应该插入引用块', async () => {
      const { Editor, Transforms, Node } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.parent.mockReturnValue({ type: 'paragraph' });

      keyboardTask.insertQuote();

      expect(Transforms.wrapNodes).toHaveBeenCalledWith(mockStore.editor, {
        type: 'blockquote',
        children: [],
      });
    });

    it('应该移除现有的引用块', async () => {
      const { Editor, Transforms, Node, Path } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.parent.mockReturnValue({ type: 'blockquote' });
      Path.parent.mockReturnValue([0]);

      keyboardTask.insertQuote();

      expect(Transforms.unwrapNodes).toHaveBeenCalledWith(mockStore.editor, {
        at: [0],
      });
    });
  });

  describe('insertTable', () => {
    it('应该插入表格', async () => {
      const { Editor, Transforms, Node, Path, EditorUtils } = await import(
        'slate'
      );
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.string.mockReturnValue('');
      Path.next.mockReturnValue([1]);
      EditorUtils.wrapperCardNode.mockReturnValue({ type: 'table' });
      Editor.start.mockReturnValue({ path: [1], offset: 0 });

      keyboardTask.insertTable();

      expect(Transforms.insertNodes).toHaveBeenCalled();
      expect(Transforms.select).toHaveBeenCalled();
    });
  });

  describe('insertCode', () => {
    it('应该插入代码块', async () => {
      const { Editor, Transforms, Node, Path } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.string.mockReturnValue('');
      Path.next.mockReturnValue([1]);
      Editor.end.mockReturnValue({ path: [1], offset: 0 });

      keyboardTask.insertCode();

      expect(Transforms.insertNodes).toHaveBeenCalled();
      expect(Transforms.select).toHaveBeenCalled();
    });

    it('应该插入 Mermaid 代码块', async () => {
      const { Editor, Transforms, Node, Path } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.string.mockReturnValue('');
      Path.next.mockReturnValue([1]);
      Editor.end.mockReturnValue({ path: [1], offset: 0 });

      keyboardTask.insertCode('mermaid');

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        mockStore.editor,
        expect.objectContaining({
          type: 'code',
          language: 'mermaid',
        }),
        { at: [1] },
      );
    });
  });

  describe('horizontalLine', () => {
    it('应该插入水平分割线', async () => {
      const { Editor, Transforms, Node, Path } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Node.string.mockReturnValue('');
      Path.next.mockReturnValue([1]);
      Editor.hasPath.mockReturnValue(true);
      Editor.start.mockReturnValue({ path: [1], offset: 0 });

      keyboardTask.horizontalLine();

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        mockStore.editor,
        { type: 'hr', children: [{ text: '' }] },
        { at: [1] },
      );
    });
  });

  describe('list', () => {
    it('应该创建有序列表', async () => {
      const { Editor, Transforms, Range } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Range.isCollapsed.mockReturnValue(true);

      keyboardTask.list('ordered');

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        mockStore.editor,
        expect.objectContaining({
          type: 'list',
          order: true,
        }),
        expect.any(Object),
      );
    });

    it('应该创建无序列表', async () => {
      const { Editor, Transforms, Range } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Range.isCollapsed.mockReturnValue(true);

      keyboardTask.list('unordered');

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        mockStore.editor,
        expect.objectContaining({
          type: 'list',
          order: false,
        }),
        expect.any(Object),
      );
    });

    it('应该创建任务列表', async () => {
      const { Editor, Transforms, Range } = await import('slate');
      const mockNodes = [[{ type: 'paragraph' }, [0]]];
      Editor.nodes.mockReturnValue(mockNodes);
      Range.isCollapsed.mockReturnValue(true);

      keyboardTask.list('task');

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        mockStore.editor,
        expect.objectContaining({
          type: 'list',
          task: true,
        }),
        expect.any(Object),
      );
    });
  });

  describe('format', () => {
    it('应该切换文本格式', async () => {
      const { EditorUtils } = await import(
        '../../../../src/MarkdownEditor/editor/utils/editorUtils'
      );

      keyboardTask.format('bold');

      expect(EditorUtils.toggleFormat).toHaveBeenCalledWith(
        mockStore.editor,
        'bold',
      );
    });
  });

  describe('clear', () => {
    it('应该清除文本格式', async () => {
      const { EditorUtils, Range } = await import('slate');
      Range.isCollapsed.mockReturnValue(false);

      keyboardTask.clear();

      expect(EditorUtils.clearMarks).toHaveBeenCalledWith(
        mockStore.editor,
        true,
      );
    });

    it('应该在没有选区时不执行任何操作', async () => {
      const { EditorUtils } = await import(
        '../../../../src/MarkdownEditor/editor/utils/editorUtils'
      );
      mockStore.editor.selection = null;

      keyboardTask.clear();

      expect(EditorUtils.clearMarks).not.toHaveBeenCalled();
    });
  });

  describe('undo', () => {
    it('应该撤销上一步操作', () => {
      const undoSpy = vi.spyOn(mockStore.editor, 'undo');

      keyboardTask.undo();

      expect(undoSpy).toHaveBeenCalled();
    });

    it('应该处理撤销错误', () => {
      vi.spyOn(mockStore.editor, 'undo').mockImplementation(() => {
        throw new Error('Undo failed');
      });

      expect(() => keyboardTask.undo()).not.toThrow();
    });
  });

  describe('redo', () => {
    it('应该重做上一步被撤销的操作', () => {
      const redoSpy = vi.spyOn(mockStore.editor, 'redo');

      keyboardTask.redo();

      expect(redoSpy).toHaveBeenCalled();
    });

    it('应该处理重做错误', () => {
      vi.spyOn(mockStore.editor, 'redo').mockImplementation(() => {
        throw new Error('Redo failed');
      });

      expect(() => keyboardTask.redo()).not.toThrow();
    });
  });
});

describe('useSystemKeyboard', () => {
  let mockKeyTask$: Subject<any>;
  let mockStore: EditorStore;
  let mockProps: MarkdownEditorProps;
  let mockContainerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockKeyTask$ = new Subject();
    mockStore = {
      editor: {
        selection: null,
        undo: vi.fn(),
        redo: vi.fn(),
      } as any,
    } as EditorStore;

    mockProps = {
      readonly: false,
    } as MarkdownEditorProps;

    mockContainerRef = {
      current: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any,
    };
  });

  it('应该正确设置键盘事件监听器', async () => {
    const { useSubject } = await import(
      '../../../../src/MarkdownEditor/hooks/subscribe'
    );
    useSubject.mockImplementation(() => {
      // 模拟订阅
    });

    useSystemKeyboard(mockKeyTask$, mockStore, mockProps, mockContainerRef);

    expect(mockContainerRef.current?.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('应该在只读模式下不设置事件监听器', async () => {
    const { useSubject } = await import(
      '../../../../src/MarkdownEditor/hooks/subscribe'
    );
    useSubject.mockImplementation(() => {
      // 模拟订阅
    });

    mockProps.readonly = true;

    useSystemKeyboard(mockKeyTask$, mockStore, mockProps, mockContainerRef);

    expect(mockContainerRef.current?.addEventListener).not.toHaveBeenCalled();
  });

  it('应该在没有 store 时不设置事件监听器', async () => {
    const { useSubject } = await import(
      '../../../../src/MarkdownEditor/hooks/subscribe'
    );
    useSubject.mockImplementation(() => {
      // 模拟订阅
    });

    useSystemKeyboard(mockKeyTask$, null as any, mockProps, mockContainerRef);

    expect(mockContainerRef.current?.addEventListener).not.toHaveBeenCalled();
  });
});
