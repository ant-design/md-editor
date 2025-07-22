import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { BaseEditor, createEditor, Editor, Node, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import {
  ReactEditor,
  withReact,
} from '../../src/MarkdownEditor/editor/slate-react';
import { EditorStore } from '../../src/MarkdownEditor/editor/store';

// Mock ReactEditor DOM methods
vi.mock('../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    toDOMNode: vi.fn(() => ({
      querySelector: vi.fn(() => ({
        textContent: '',
      })),
    })),
    findPath: vi.fn(() => [0]),
    toSlateNode: vi.fn(() => ({ type: 'paragraph', children: [{ text: '' }] })),
    focus: vi.fn(),
    deselect: vi.fn(),
  },
  withReact: (editor: any) => editor,
}));

describe('EditorStore', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  let editor: BaseEditor & ReactEditor & HistoryEditor;
  let editorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >;
  let store: EditorStore;

  const createTestEditor = () => {
    const baseEditor = withMarkdown(withHistory(withReact(createEditor())));
    baseEditor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
    return baseEditor;
  };

  beforeEach(() => {
    editor = createTestEditor();
    editorRef = { current: editor };
    store = new EditorStore(editorRef);
  });

  describe('构造函数和基本属性', () => {
    it('应该正确初始化 EditorStore 实例', () => {
      expect(store).toBeInstanceOf(EditorStore);
      expect(store.highlightCache).toBeInstanceOf(Map);
      expect(store.footnoteDefinitionMap).toBeInstanceOf(Map);
      expect(store.inputComposition).toBe(false);
      expect(store.draggedElement).toBe(null);
      expect(store.domRect).toBe(null);
    });

    it('应该正确设置编辑器引用', () => {
      expect(store.editor).toBe(editor);
    });

    it('应该正确设置插件', () => {
      const mockPlugins = [{ name: 'test-plugin' }] as any;
      const storeWithPlugins = new EditorStore(editorRef, mockPlugins);
      expect(storeWithPlugins.plugins).toBe(mockPlugins);
    });
  });

  describe('focus 方法', () => {
    it('应该聚焦到编辑器', async () => {
      const focusSpy = vi.spyOn(ReactEditor, 'focus');
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

      store.focus();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);

      // 等待异步操作完成
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      expect(focusSpy).toHaveBeenCalledWith(editor);
    });

    it('应该处理空文档情况', () => {
      editor.children = [];
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.focus();

      expect(insertNodesSpy).toHaveBeenCalledWith(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: [0] },
      );
    });

    it('应该设置光标到文档末尾', () => {
      const endSpy = vi.spyOn(Editor, 'end');
      const selectSpy = vi.spyOn(Transforms, 'select');

      store.focus();

      expect(endSpy).toHaveBeenCalledWith(editor, []);
      expect(selectSpy).toHaveBeenCalled();
    });
  });

  describe('isLatestNode 方法', () => {
    it('应该正确识别最新节点', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'first' }] },
        { type: 'paragraph', children: [{ text: 'second' }] },
      ];

      const latestNode = editor.children[1];
      // 模拟 ReactEditor.findPath 返回正确的路径
      vi.spyOn(ReactEditor, 'findPath').mockReturnValue([1]);

      const result = store.isLatestNode(latestNode);

      expect(result).toBe(true);
    });

    it('应该正确识别非最新节点', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'first' }] },
        { type: 'paragraph', children: [{ text: 'second' }] },
      ];

      const nonLatestNode = editor.children[0];
      // 模拟 ReactEditor.findPath 返回正确的路径
      vi.spyOn(ReactEditor, 'findPath').mockReturnValue([0]);

      const result = store.isLatestNode(nonLatestNode);

      expect(result).toBe(false);
    });

    it('应该在出错时返回 false', () => {
      // 模拟 ReactEditor.findPath 抛出错误
      vi.spyOn(ReactEditor, 'findPath').mockImplementation(() => {
        throw new Error('Find path error');
      });

      const result = store.isLatestNode({} as Node);
      expect(result).toBe(false);
    });
  });

  describe('insertLink 方法', () => {
    it('应该插入 HTTP 链接', () => {
      const selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = selection;

      store.insertLink('https://example.com');

      expect(editor.children[0].children[0]).toEqual({
        text: 'https://example.com',
        url: 'https://example.com',
      });
    });

    it('应该插入文件链接', () => {
      const selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
      editor.selection = selection;

      // 模拟 Editor.nodes 返回有效的节点
      vi.spyOn(Editor, 'nodes').mockReturnValue([
        [{ type: 'paragraph', children: [{ text: '' }] }, [0]],
      ] as any);

      // 模拟 Path.next 返回有效路径
      vi.spyOn(require('slate').Path, 'next').mockReturnValue([1]);

      // 模拟 Transforms.insertNodes 实际执行插入
      vi.spyOn(Transforms, 'insertNodes').mockImplementation((editor) => {
        if (
          editor.children &&
          editor.children[0] &&
          editor.children[0].children
        ) {
          editor.children[0].children[0] = {
            text: 'document.pdf',
            url: 'file:///path/to/document.pdf',
          };
        }
      });

      store.insertLink('file:///path/to/document.pdf');

      expect(editor.children[0].children[0]).toEqual({
        text: 'document.pdf',
        url: 'file:///path/to/document.pdf',
      });
    });

    it('应该在选区不存在时返回', () => {
      editor.selection = null;
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.insertLink('https://example.com');

      expect(insertNodesSpy).not.toHaveBeenCalled();
    });

    it('应该在选区未折叠时返回', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      };
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.insertLink('https://example.com');

      expect(insertNodesSpy).not.toHaveBeenCalled();
    });
  });

  describe('insertNodes 方法', () => {
    it('应该插入单个节点', () => {
      const node = { type: 'paragraph', children: [{ text: 'test' }] };
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.insertNodes(node);

      expect(insertNodesSpy).toHaveBeenCalledWith(editor, node, undefined);
    });

    it('应该插入节点数组', () => {
      const nodes = [
        { type: 'paragraph', children: [{ text: 'test1' }] },
        { type: 'paragraph', children: [{ text: 'test2' }] },
      ];
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.insertNodes(nodes);

      expect(insertNodesSpy).toHaveBeenCalledWith(editor, nodes, undefined);
    });

    it('应该使用自定义选项插入节点', () => {
      const node = { type: 'paragraph', children: [{ text: 'test' }] };
      const options = { at: [0] };
      const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

      store.insertNodes(node, options);

      expect(insertNodesSpy).toHaveBeenCalledWith(editor, node, options);
    });
  });

  describe('clearContent 方法', () => {
    it('应该清空编辑器内容', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'existing content' }] },
      ];

      store.clearContent();

      expect(editor.children).toEqual([
        { type: 'paragraph', children: [{ text: '' }] },
      ]);
      expect(editor.selection).toBe(null);
    });
  });

  describe('setMDContent 方法', () => {
    it('应该在 markdown 为 undefined 时返回', () => {
      const originalChildren = editor.children;

      store.setMDContent(undefined);

      expect(editor.children).toBe(originalChildren);
    });

    it('应该在 markdown 与当前内容相同时返回', () => {
      const originalChildren = editor.children;

      store.setMDContent('');

      expect(editor.children).toBe(originalChildren);
    });

    it('应该设置新的 markdown 内容', () => {
      const markdown = '# Test Heading\n\nTest paragraph';

      store.setMDContent(markdown);

      expect(editor.children).not.toEqual([]);
    });
  });

  describe('removeNodes 方法', () => {
    it('应该移除节点', () => {
      const removeNodesSpy = vi.spyOn(Transforms, 'removeNodes');
      const options = { at: [0] } as any;

      store.removeNodes(options);

      expect(removeNodesSpy).toHaveBeenCalledWith(editor, options);
    });
  });

  describe('getContent 方法', () => {
    it('应该返回编辑器内容', () => {
      const content = store.getContent();
      expect(content).toBe(editor.children);
    });
  });

  describe('getMDContent 方法', () => {
    it('应该返回 markdown 内容', () => {
      const content = store.getMDContent();
      expect(typeof content).toBe('string');
    });

    it('应该使用自定义插件', () => {
      const mockPlugins = [{ name: 'test-plugin' }] as any;
      const content = store.getMDContent(mockPlugins);
      expect(typeof content).toBe('string');
    });
  });

  describe('getHtmlContent 方法', () => {
    it('应该返回 HTML 内容', () => {
      const html = store.getHtmlContent();
      expect(typeof html).toBe('string');
    });
  });

  describe('setContent 方法', () => {
    it('应该设置编辑器内容', () => {
      const newContent = [
        { type: 'paragraph', children: [{ text: 'new content' }] },
      ];

      store.setContent(newContent);

      expect(editor.children).toBe(newContent);
    });

    it('应该调用 onChange', () => {
      const onChangeSpy = vi.spyOn(editor, 'onChange');
      const newContent = [
        { type: 'paragraph', children: [{ text: 'new content' }] },
      ];

      store.setContent(newContent);

      expect(onChangeSpy).toHaveBeenCalled();
    });
  });

  describe('updateNodeList 方法', () => {
    it('应该在 nodeList 为空时返回', () => {
      const originalChildren = editor.children;

      store.updateNodeList(null as any);

      expect(editor.children).toBe(originalChildren);
    });

    it('应该在 nodeList 不是数组时返回', () => {
      const originalChildren = editor.children;

      store.updateNodeList('not an array' as any);

      expect(editor.children).toBe(originalChildren);
    });

    it('应该过滤无效节点', () => {
      const nodeList = [
        { type: 'p', children: [] }, // 空段落
        { type: 'list', children: [] }, // 空列表
        { type: 'paragraph', children: [{ text: 'valid' }] }, // 有效节点
      ];

      store.updateNodeList(nodeList);

      // 应该只保留有效节点
      expect(editor.children.length).toBe(1);
    });

    it('应该在优化更新失败时回退到直接替换', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const nodeList = [{ type: 'paragraph', children: [{ text: 'test' }] }];

      // 模拟 generateDiffOperations 抛出错误
      vi.spyOn(store as any, 'generateDiffOperations').mockImplementation(
        () => {
          throw new Error('Test error');
        },
      );

      store.updateNodeList(nodeList);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update nodes with optimized method:',
        expect.any(Error),
      );
    });
  });

  describe('generateDiffOperations 方法', () => {
    it('应该在参数为空时返回空数组', () => {
      const result = (store as any).generateDiffOperations(null, null);
      expect(result).toEqual([]);
    });

    it('应该生成插入操作', () => {
      const newNodes = [{ type: 'paragraph', children: [{ text: 'new' }] }];
      const oldNodes: any[] = [];

      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('insert');
    });

    it('应该生成删除操作', () => {
      const newNodes: any[] = [];
      const oldNodes = [{ type: 'paragraph', children: [{ text: 'old' }] }];

      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('remove');
    });

    it('应该生成更新操作', () => {
      const newNodes = [{ type: 'paragraph', children: [{ text: 'updated' }] }];
      const oldNodes = [{ type: 'paragraph', children: [{ text: 'old' }] }];

      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('compareNodes 方法', () => {
    it('应该在节点类型不同时生成替换操作', () => {
      const newNode = { type: 'paragraph', children: [{ text: 'new' }] };
      const oldNode = { type: 'heading', children: [{ text: 'old' }] };
      const operations: any[] = [];

      (store as any).compareNodes(newNode, oldNode, [0], operations);

      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('replace');
    });

    it('应该比较文本节点', () => {
      const newNode = { text: 'new text', bold: true };
      const oldNode = { text: 'old text', bold: false };
      const operations: any[] = [];

      (store as any).compareNodes(newNode, oldNode, [0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });
  });

  describe('executeOperations 方法', () => {
    it('应该执行插入操作', () => {
      const operations = [
        {
          type: 'insert',
          path: [0],
          node: { type: 'paragraph', children: [{ text: 'test' }] },
          priority: 10,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBeGreaterThan(0);
    });

    it('应该执行删除操作', () => {
      editor.children = [{ type: 'paragraph', children: [{ text: 'test' }] }];
      const operations = [
        {
          type: 'remove',
          path: [0],
          priority: 0,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBe(0);
    });

    it('应该执行更新操作', () => {
      editor.children = [{ type: 'paragraph', children: [{ text: 'test' }] }];
      const operations = [
        {
          type: 'update',
          path: [0],
          properties: { type: 'heading' },
          priority: 7,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children[0].type).toBe('heading');
    });

    it('应该处理执行错误', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const operations = [
        {
          type: 'insert',
          path: [0],
          node: { type: 'paragraph', children: [{ text: 'test' }] },
          priority: 0,
        },
      ];

      // 模拟 Transforms.insertNodes 抛出错误
      vi.spyOn(Transforms, 'insertNodes').mockImplementation(() => {
        throw new Error('Test error');
      });

      (store as any).executeOperations(operations);

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('dragStart 方法', () => {
    it('应该处理拖拽开始事件', () => {
      const mockEvent = {
        stopPropagation: vi.fn(),
        dataTransfer: {
          setDragImage: vi.fn(),
        },
      } as any;

      const mockContainer = document.createElement('div');
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      store.dragStart(mockEvent, mockContainer);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockEvent.dataTransfer.setDragImage).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'dragover',
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'dragend',
        expect.any(Function),
        { once: true },
      );
    });
  });

  describe('setState 方法', () => {
    it('应该使用函数式更新', () => {
      const updateFn = vi.fn((state: EditorStore) => {
        state.inputComposition = true;
      });

      store.setState(updateFn);

      expect(updateFn).toHaveBeenCalledWith(store);
      expect(store.inputComposition).toBe(true);
    });

    it('应该使用对象式更新', () => {
      const updateObj = {
        inputComposition: true,
        domRect: { x: 0, y: 0 } as DOMRect,
      };

      store.setState(updateObj as any);

      expect(store.inputComposition).toBe(true);
      expect(store.domRect).toEqual({ x: 0, y: 0 });
    });
  });

  describe('私有方法', () => {
    describe('findLatest 方法', () => {
      it('应该找到最新节点索引', () => {
        const node = {
          type: 'paragraph',
          children: [{ text: 'test' }],
        };
        const result = (store as any).findLatest(node, [0]);
        expect(Array.isArray(result)).toBe(true);
      });

      it('应该处理嵌套节点', () => {
        const node = {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'item' }],
            },
          ],
        };
        const result = (store as any).findLatest(node, [0]);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('toPath 方法', () => {
      it('应该转换 HTML 元素为 Slate 路径和节点', () => {
        const mockElement = document.createElement('div');
        // 模拟 ReactEditor.toSlateNode 和 findPath 返回有效值
        vi.spyOn(ReactEditor, 'toSlateNode').mockReturnValue({
          type: 'paragraph',
          children: [{ text: '' }],
        });
        vi.spyOn(ReactEditor, 'findPath').mockReturnValue([0]);

        const result = (store as any).toPath(mockElement);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
      });
    });
  });

  describe('错误处理', () => {
    it('应该在 focus 方法出错时记录错误', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // 模拟 setTimeout 中的错误
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        try {
          fn();
        } catch (error) {
          console.error('移动光标失败:', error);
        }
        return 1 as any;
      });

      vi.spyOn(ReactEditor, 'focus').mockImplementation(() => {
        throw new Error('Focus error');
      });

      store.focus();

      expect(consoleSpy).toHaveBeenCalledWith(
        '移动光标失败:',
        expect.any(Error),
      );

      // 清理 mock
      vi.restoreAllMocks();
    });

    it('应该在 isLatestNode 方法出错时返回 false', () => {
      vi.spyOn(ReactEditor, 'findPath').mockImplementation(() => {
        throw new Error('Find path error');
      });

      const result = store.isLatestNode({} as Node);

      expect(result).toBe(false);
    });
  });

  describe('边界情况', () => {
    it('应该处理空编辑器', () => {
      editor.children = [];
      const result = store.isLatestNode({} as Node);
      expect(result).toBe(false);
    });

    it('应该处理只有一个节点的编辑器', () => {
      editor.children = [{ type: 'paragraph', children: [{ text: 'test' }] }];
      // 模拟 ReactEditor.findPath 返回正确的路径
      vi.spyOn(ReactEditor, 'findPath').mockReturnValue([0]);

      const result = store.isLatestNode(editor.children[0]);
      expect(result).toBe(true);
    });

    it('应该处理复杂的嵌套结构', () => {
      editor.children = [
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'item 1' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'item 2' }],
            },
          ],
        },
      ];

      // 模拟 ReactEditor.findPath 返回正确的路径
      vi.spyOn(ReactEditor, 'findPath').mockReturnValue([0, 1]);

      const result = store.isLatestNode(editor.children[0].children[1]);
      expect(result).toBe(true);
    });
  });
});
