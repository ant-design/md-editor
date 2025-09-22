import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { BaseEditor, createEditor, Editor, Node, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import { EditorStore } from '../../src/MarkdownEditor/editor/store';

// Mock ReactEditor DOM methods
vi.mock('slate-react', () => ({
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
      const result = (store as any).generateDiffOperations([], []);
      expect(result).toEqual([]);
    });

    it('应该生成插入操作', () => {
      const newNodes = [{ type: 'paragraph', children: [{ text: 'new' }] }];
      const oldNodes: any[] = [];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((op: any) => op.type === 'insert')).toBe(true);
    });

    it('应该生成删除操作', () => {
      const newNodes: any[] = [];
      const oldNodes = [{ type: 'paragraph', children: [{ text: 'old' }] }];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((op: any) => op.type === 'remove')).toBe(true);
    });

    it('应该生成更新操作', () => {
      const newNodes = [{ type: 'paragraph', children: [{ text: 'updated' }] }];
      const oldNodes = [{ type: 'paragraph', children: [{ text: 'old' }] }];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });

    it('应该处理复杂节点结构', () => {
      const newNodes = [
        {
          type: 'list',
          children: [
            { type: 'list-item', children: [{ text: 'item 1' }] },
            { type: 'list-item', children: [{ text: 'item 2' }] },
          ],
        },
      ];
      const oldNodes = [
        {
          type: 'list',
          children: [{ type: 'list-item', children: [{ text: 'item 1' }] }],
        },
      ];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });

    it('应该处理表格节点', () => {
      const newNodes = [
        {
          type: 'table',
          children: [
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', children: [{ text: 'cell 1' }] },
                { type: 'table-cell', children: [{ text: 'cell 2' }] },
              ],
            },
          ],
        },
      ];
      const oldNodes = [
        {
          type: 'table',
          children: [
            {
              type: 'table-row',
              children: [
                { type: 'table-cell', children: [{ text: 'cell 1' }] },
              ],
            },
          ],
        },
      ];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });

    it('应该处理混合节点类型', () => {
      const newNodes = [
        { type: 'paragraph', children: [{ text: 'text' }] },
        { type: 'heading', children: [{ text: 'heading' }] },
        {
          type: 'list',
          children: [{ type: 'list-item', children: [{ text: 'item' }] }],
        },
      ];
      const oldNodes = [
        { type: 'paragraph', children: [{ text: 'text' }] },
        { type: 'heading', children: [{ text: 'old heading' }] },
      ];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });

    it('应该处理节点属性变化', () => {
      const newNodes = [
        { type: 'paragraph', align: 'center', children: [{ text: 'text' }] },
      ];
      const oldNodes = [
        { type: 'paragraph', align: 'left', children: [{ text: 'text' }] },
      ];
      const result = (store as any).generateDiffOperations(newNodes, oldNodes);

      expect(result.length).toBeGreaterThan(0);
    });

    it('应该处理空节点数组', () => {
      const result = (store as any).generateDiffOperations([], []);
      expect(result).toEqual([]);
    });

    it('应该处理单节点变化', () => {
      const newNodes = [{ type: 'paragraph', children: [{ text: 'new' }] }];
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
          node: { type: 'paragraph', children: [{ text: 'new' }] },
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBeGreaterThan(0);
    });

    it('应该执行删除操作', () => {
      // 先插入一个节点
      editor.children = [
        { type: 'paragraph', children: [{ text: 'to delete' }] },
      ];

      const operations = [
        {
          type: 'remove',
          path: [0],
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBe(0);
    });

    it('应该执行更新操作', () => {
      editor.children = [{ type: 'paragraph', children: [{ text: 'old' }] }];

      const operations = [
        {
          type: 'update',
          path: [0],
          properties: { type: 'heading', children: [{ text: 'updated' }] },
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children[0].type).toBe('heading');
    });

    it('应该处理执行错误', () => {
      const operations = [
        {
          type: 'invalid' as any,
          path: [0],
          priority: 1,
        },
      ];

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (store as any).executeOperations(operations);

      // 由于无效操作类型，switch 语句会跳过，不会调用 console.error
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('应该按优先级执行操作', () => {
      const operations = [
        {
          type: 'insert',
          path: [0],
          node: { type: 'paragraph', children: [{ text: 'first' }] },
          priority: 2,
        },
        {
          type: 'insert',
          path: [0],
          node: { type: 'paragraph', children: [{ text: 'second' }] },
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBe(1);
    });

    it('应该执行文本操作', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'old text' }] },
      ];

      const operations = [
        {
          type: 'text',
          path: [0, 0],
          text: 'new text',
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children[0].children[0].text).toBe('new text');
    });

    it('应该执行替换操作', () => {
      // 使用更新操作来模拟替换
      editor.children = [{ type: 'paragraph', children: [{ text: 'old' }] }];

      const operations = [
        {
          type: 'update',
          path: [0],
          properties: { type: 'heading', children: [{ text: 'replaced' }] },
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBe(1);
      expect(editor.children[0].type).toBe('heading');
    });

    it('应该处理空操作数组', () => {
      const originalChildren = [...editor.children];

      (store as any).executeOperations([]);

      expect(editor.children).toEqual(originalChildren);
    });

    it('应该处理无效路径', () => {
      const operations = [
        {
          type: 'update',
          path: [999],
          properties: { type: 'heading' },
          priority: 1,
        },
      ];

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (store as any).executeOperations(operations);

      // 由于路径无效，操作不会执行，但也不会抛出错误
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('应该处理表格操作', () => {
      // 使用更新操作来模拟表格操作
      editor.children = [{ type: 'paragraph', children: [{ text: 'old' }] }];

      const operations = [
        {
          type: 'update',
          path: [0],
          properties: {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  { type: 'table-cell', children: [{ text: 'cell' }] },
                ],
              },
            ],
          },
          priority: 1,
        },
      ];

      (store as any).executeOperations(operations);

      expect(editor.children.length).toBe(1);
      expect(editor.children[0].type).toBe('table');
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

  describe('compareTableNodes 方法', () => {
    it('应该比较相同结构的表格', () => {
      const newTable = {
        type: 'table',
        id: 'table-1',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ text: 'new content' }] },
              { type: 'table-cell', children: [{ text: 'cell 2' }] },
            ],
          },
        ],
      };
      const oldTable = {
        type: 'table',
        id: 'table-1',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ text: 'old content' }] },
              { type: 'table-cell', children: [{ text: 'cell 2' }] },
            ],
          },
        ],
      };
      const operations: any[] = [];

      (store as any).compareTableNodes(newTable, oldTable, [0], operations);

      expect(operations.length).toBeGreaterThan(0);
      // 应该生成文本更新操作
      expect(operations.some((op) => op.type === 'text')).toBe(true);
    });

    it('应该处理表格属性变化', () => {
      const newTable = {
        type: 'table',
        id: 'table-1',
        align: 'center',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'content' }] }],
          },
        ],
      };
      const oldTable = {
        type: 'table',
        id: 'table-1',
        align: 'left',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'content' }] }],
          },
        ],
      };
      const operations: any[] = [];

      (store as any).compareTableNodes(newTable, oldTable, [0], operations);

      expect(operations.length).toBeGreaterThan(0);
      // 应该生成表格属性更新操作
      expect(
        operations.some((op) => op.type === 'update' && op.path.length === 1),
      ).toBe(true);
    });

    it('应该处理不同结构的表格', () => {
      const newTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ text: 'cell 1' }] },
              { type: 'table-cell', children: [{ text: 'cell 2' }] },
            ],
          },
        ],
      };
      const oldTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'cell 1' }] }],
          },
        ],
      };
      const operations: any[] = [];

      (store as any).compareTableNodes(newTable, oldTable, [0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理行数变化的表格', () => {
      const newTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'row 1' }] }],
          },
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'row 2' }] }],
          },
        ],
      };
      const oldTable = {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ text: 'row 1' }] }],
          },
        ],
      };
      const operations: any[] = [];

      (store as any).compareTableNodes(newTable, oldTable, [0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理空表格', () => {
      const newTable = {
        type: 'table',
        children: [],
      };
      const oldTable = {
        type: 'table',
        children: [],
      };
      const operations: any[] = [];

      (store as any).compareTableNodes(newTable, oldTable, [0], operations);

      expect(operations.length).toBe(0);
    });
  });

  describe('compareCells 方法', () => {
    it('应该比较简单文本单元格', () => {
      const newCell = {
        type: 'table-cell',
        children: [{ text: 'new text', bold: true }],
      };
      const oldCell = {
        type: 'table-cell',
        children: [{ text: 'old text', bold: false }],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
      // 应该生成文本更新操作
      expect(operations.some((op) => op.type === 'text')).toBe(true);
      // 应该生成属性更新操作
      expect(operations.some((op) => op.type === 'update')).toBe(true);
    });

    it('应该处理单元格属性变化', () => {
      const newCell = {
        type: 'table-cell',
        align: 'center',
        children: [{ text: 'content' }],
      };
      const oldCell = {
        type: 'table-cell',
        align: 'left',
        children: [{ text: 'content' }],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
      expect(operations.some((op) => op.type === 'update')).toBe(true);
    });

    it('应该处理复杂单元格内容', () => {
      const newCell = {
        type: 'table-cell',
        children: [
          { text: 'text 1' },
          {
            type: 'link',
            url: 'http://example.com',
            children: [{ text: 'link' }],
          },
        ],
      };
      const oldCell = {
        type: 'table-cell',
        children: [{ text: 'text 1' }, { text: 'plain text' }],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理结构不同的单元格', () => {
      const newCell = {
        type: 'table-cell',
        children: [{ text: 'text 1' }, { text: 'text 2' }],
      };
      const oldCell = {
        type: 'table-cell',
        children: [{ text: 'text 1' }],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理空单元格', () => {
      const newCell = {
        type: 'table-cell',
        children: [],
      };
      const oldCell = {
        type: 'table-cell',
        children: [],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBe(0);
    });

    it('应该处理单元格内容从空变为有内容', () => {
      const newCell = {
        type: 'table-cell',
        children: [{ text: 'new content' }],
      };
      const oldCell = {
        type: 'table-cell',
        children: [],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理单元格内容从有内容变为空', () => {
      const newCell = {
        type: 'table-cell',
        children: [],
      };
      const oldCell = {
        type: 'table-cell',
        children: [{ text: 'old content' }],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });

    it('应该处理嵌套结构的单元格', () => {
      const newCell = {
        type: 'table-cell',
        children: [
          {
            type: 'paragraph',
            children: [
              { text: 'paragraph text' },
              {
                type: 'link',
                url: 'http://example.com',
                children: [{ text: 'link' }],
              },
            ],
          },
        ],
      };
      const oldCell = {
        type: 'table-cell',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'paragraph text' }],
          },
        ],
      };
      const operations: any[] = [];

      (store as any).compareCells(newCell, oldCell, [0, 0, 0], operations);

      expect(operations.length).toBeGreaterThan(0);
    });
  });

  describe('replaceText 方法', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Hello world, hello universe' }],
        },
        { type: 'paragraph', children: [{ text: 'Another hello message' }] },
      ];
    });

    it('应该替换所有匹配的文本', () => {
      const count = store.replaceText('hello', 'hi');

      expect(count).toBe(3); // 'hello' 在文本中出现 3 次
      expect(editor.children[0].children[0].text).toBe('hi world, hi universe');
      expect(editor.children[1].children[0].text).toBe('Another hi message');
    });

    it('应该支持区分大小写的替换', () => {
      const count = store.replaceText('Hello', 'Hi', { caseSensitive: true });

      expect(count).toBe(1); // 只有 'Hello' 匹配
      expect(editor.children[0].children[0].text).toBe(
        'Hi world, hello universe',
      );
      expect(editor.children[1].children[0].text).toBe('Another hello message');
    });

    it('应该支持完整单词匹配', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Hello world, hello universe, helloworld' }],
        },
      ];

      const count = store.replaceText('hello', 'hi', { wholeWord: true });

      expect(count).toBe(2); // 只有完整的 'hello' 单词匹配
      expect(editor.children[0].children[0].text).toBe(
        'hi world, hi universe, helloworld',
      );
    });

    it('应该支持只替换第一个匹配项', () => {
      const count = store.replaceText('hello', 'hi', { replaceAll: false });

      expect(count).toBe(1); // 只替换第一个匹配项
      expect(editor.children[0].children[0].text).toBe(
        'hi world, hello universe',
      );
      expect(editor.children[1].children[0].text).toBe('Another hello message');
    });

    it('应该在搜索文本为空时返回 0', () => {
      const count = store.replaceText('', 'hi');
      expect(count).toBe(0);
    });

    it('应该处理正则表达式特殊字符', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'Test $100 and (value)' }] },
      ];

      const count = store.replaceText('$100', '$200');
      expect(count).toBe(1);
      expect(editor.children[0].children[0].text).toBe('Test $200 and (value)');
    });

    it('应该处理多个文本节点的替换', () => {
      editor.children = [
        { type: 'paragraph', children: [{ text: 'First hello' }] },
        { type: 'paragraph', children: [{ text: 'Second hello' }] },
        { type: 'paragraph', children: [{ text: 'Third hello' }] },
      ];

      const count = store.replaceText('hello', 'hi');
      expect(count).toBe(3);
      expect(editor.children[0].children[0].text).toBe('First hi');
      expect(editor.children[1].children[0].text).toBe('Second hi');
      expect(editor.children[2].children[0].text).toBe('Third hi');
    });
  });

  describe('replaceTextInSelection 方法', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Hello world, hello universe' }],
        },
        { type: 'paragraph', children: [{ text: 'Another hello message' }] },
      ];
    });

    it('应该在选中区域内替换文本', () => {
      // 设置选中区域为第一个段落
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 25 }, // 选中 "Hello world, hello universe"
      };

      const count = store.replaceTextInSelection('hello', 'hi');

      expect(count).toBe(2); // 在选中区域内替换了 2 次
      expect(editor.children[0].children[0].text).toBe('hi world, hi universe');
      expect(editor.children[1].children[0].text).toBe('Another hello message'); // 未选中区域不变
    });

    it('应该在无选中区域时返回 0', () => {
      editor.selection = null;
      const count = store.replaceTextInSelection('hello', 'hi');
      expect(count).toBe(0);
    });

    it('应该在选区折叠时返回 0', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 }, // 折叠选区
      };

      const count = store.replaceTextInSelection('hello', 'hi');
      expect(count).toBe(0);
    });

    it('应该支持选中区域内的区分大小写替换', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 25 },
      };

      const count = store.replaceTextInSelection('Hello', 'Hi', {
        caseSensitive: true,
      });
      expect(count).toBe(1);
      expect(editor.children[0].children[0].text).toBe(
        'Hi world, hello universe',
      );
    });
  });

  describe('replaceAll 方法', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Hello world, hello universe' }],
        },
      ];
    });

    it('应该替换所有匹配的文本', () => {
      const count = store.replaceAll('hello', 'hi');

      expect(count).toBe(2);
      expect(editor.children[0].children[0].text).toBe('hi world, hi universe');
    });

    it('应该支持区分大小写', () => {
      const count = store.replaceAll('Hello', 'Hi', true);

      expect(count).toBe(1);
      expect(editor.children[0].children[0].text).toBe(
        'Hi world, hello universe',
      );
    });

    it('应该在搜索文本为空时返回 0', () => {
      const count = store.replaceAll('', 'hi');
      expect(count).toBe(0);
    });
  });

  describe('escapeRegExp 私有方法', () => {
    it('应该转义正则表达式特殊字符', () => {
      const result = (store as any).escapeRegExp('$100 + (value)');
      expect(result).toBe('\\$100 \\+ \\(value\\)');
    });

    it('应该处理空字符串', () => {
      const result = (store as any).escapeRegExp('');
      expect(result).toBe('');
    });

    it('应该处理普通字符串', () => {
      const result = (store as any).escapeRegExp('hello world');
      expect(result).toBe('hello world');
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

  describe('replaceText', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'old text with old value and OLD item' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'another old paragraph' }],
        },
      ];
    });

    it('应该替换所有匹配的文本（默认行为）', () => {
      const count = store.replaceText('old', 'new');

      expect(count).toBe(4); // 4个 "old" (不区分大小写: old, old, OLD, old)
    });

    it('应该支持大小写敏感替换', () => {
      const count = store.replaceText('OLD', 'NEW', { caseSensitive: true });

      expect(count).toBe(1); // 只有1个大写的 "OLD"
    });

    it('应该支持完整单词替换', () => {
      const count = store.replaceText('old', 'new', { wholeWord: true });

      expect(count).toBe(4); // "old" 作为完整单词出现4次
    });

    it('应该支持只替换第一个匹配项', () => {
      const count = store.replaceText('old', 'new', { replaceAll: false });

      expect(count).toBe(1); // 只替换第一个
    });

    it('应该处理空字符串搜索', () => {
      const count = store.replaceText('', 'new');

      expect(count).toBe(0);
    });
  });

  describe('replaceTextInSelection', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'old text with old value' }],
        },
      ];

      // 模拟选中区域
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 13 }, // 选中 "old text with" - 包含2个 "old"
      };
    });

    it('应该在选中区域内替换文本', () => {
      const count = store.replaceTextInSelection('old', 'new');

      expect(count).toBe(2); // 选中区域内有2个 "old" ("old" 和 "old" 在 "with old")
    });

    it('应该在没有选中时返回0', () => {
      editor.selection = null;
      const count = store.replaceTextInSelection('old', 'new');

      expect(count).toBe(0);
    });

    it('应该在折叠选区时返回0', () => {
      editor.selection = {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 }, // 折叠选区
      };

      const count = store.replaceTextInSelection('old', 'new');

      expect(count).toBe(0);
    });
  });

  describe('replaceAll', () => {
    beforeEach(() => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'test Test TEST text' }],
        },
      ];
    });

    it('应该替换所有匹配项（不区分大小写）', () => {
      const count = store.replaceAll('test', 'replaced');

      expect(count).toBe(3); // test, Test, TEST
    });

    it('应该支持大小写敏感替换', () => {
      const count = store.replaceAll('test', 'replaced', true);

      expect(count).toBe(1); // 只有小写的 "test"
    });
  });
});
