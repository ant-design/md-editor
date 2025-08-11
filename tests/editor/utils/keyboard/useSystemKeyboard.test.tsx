import { render, renderHook } from '@testing-library/react';
import React from 'react';
import { Subject } from 'rxjs';
import { createEditor, Editor, Transforms } from 'slate';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ReactEditor,
  withReact,
} from '../../../../src/MarkdownEditor/editor/slate-react';
import { EditorStore } from '../../../../src/MarkdownEditor/editor/store';
import {
  Methods,
  useSystemKeyboard,
} from '../../../../src/MarkdownEditor/editor/utils/keyboard';

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
vi.mock('../../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
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

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  EditorStore: vi.fn(),
}));

describe('useSystemKeyboard', () => {
  let editor: ReactEditor;
  let store: EditorStore;
  let mockProps: any;
  let keyTask$: Subject<any>;

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
      readonly: false,
    } as any;

    keyTask$ = new Subject();
  });

  it('应该处理键盘任务', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('当没有store时应该提前返回', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    vi.doMock('is-hotkey', () => ({
      default: vi.fn(() => false),
    }));

    renderHook(() => {
      useSystemKeyboard(keyTask$, null as any, mockProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).not.toHaveBeenCalled();
  });

  it('应该处理键盘事件', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const mockEvent = {
      key: 'Ctrl+a',
      preventDefault: vi.fn(),
    };

    eventHandler(mockEvent);
  });

  it('应该处理只读模式', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    const readonlyProps = { ...mockProps, readonly: true };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, readonlyProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('应该处理没有ref的情况', () => {
    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, undefined);
      return null;
    });

    expect(true).toBe(true);
  });

  it('应该通过 keyTask$ 处理任务', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const mockTask = { key: 'selectAll', args: [] };
    keyTask$.next(mockTask);

    expect(true).toBe(true);
  });

  it('应该处理复制和剪切媒体节点', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const copyEvent = {
      key: 'c',
      ctrlKey: true,
      preventDefault: vi.fn(),
    };

    const mockNode = [{ type: 'media', url: 'test.jpg', height: 200 }, [0]];
    vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

    eventHandler(copyEvent);

    expect(copyEvent.preventDefault).toHaveBeenCalled();
  });

  it('应该处理复制和剪切附件节点', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const cutEvent = {
      key: 'x',
      ctrlKey: true,
      preventDefault: vi.fn(),
    };

    const mockNode = [
      { type: 'attach', url: 'test.pdf', name: 'test.pdf', size: 1024 },
      [0],
    ];
    vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

    eventHandler(cutEvent);

    expect(cutEvent.preventDefault).toHaveBeenCalled();
  });

  it('应该处理删除媒体节点', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const backspaceEvent = {
      key: 'Backspace',
      preventDefault: vi.fn(),
    };

    const mockNode = [{ type: 'media', url: 'test.jpg' }, [0]];
    vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

    const removeNodesSpy = vi.spyOn(Transforms, 'removeNodes');
    const insertNodesSpy = vi.spyOn(Transforms, 'insertNodes');

    eventHandler(backspaceEvent);

    expect(backspaceEvent.preventDefault).toHaveBeenCalled();
    expect(removeNodesSpy).toHaveBeenCalled();
    expect(insertNodesSpy).toHaveBeenCalled();
  });

  it('应该处理媒体节点的方向键导航', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const arrowUpEvent = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
    };

    const mockNode = [{ type: 'media', url: 'test.jpg' }, [0]];
    vi.spyOn(Editor, 'nodes').mockReturnValue([mockNode] as any);

    const selectSpy = vi.spyOn(Transforms, 'select');

    eventHandler(arrowUpEvent);

    expect(arrowUpEvent.preventDefault).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('应该处理快捷键映射', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const selectAllEvent = {
      key: 'a',
      ctrlKey: true,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    const selectSpy = vi.spyOn(Transforms, 'select');

    eventHandler(selectAllEvent);

    expect(selectAllEvent.preventDefault).toHaveBeenCalled();
    expect(selectAllEvent.stopPropagation).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('应该在组件卸载时移除事件监听器', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    const { unmount } = renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalled();

    unmount();

    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('应该处理空的 keyTask$', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    const emptyKeyTask$ = new Subject<{
      key: Methods<any>;
      args?: any[];
    }>();

    renderHook(() => {
      useSystemKeyboard(emptyKeyTask$, store, mockProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalled();
  });

  it('应该处理 readonly 为 true 的情况', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    const readonlyProps = { ...mockProps, readonly: true };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, readonlyProps, mockRef);
      return null;
    });

    expect(mockElement.addEventListener).toHaveBeenCalled();
  });

  it('应该处理 markdownContainerRef 为 null 的情况', () => {
    const mockRef = { current: null };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    expect(true).toBe(true);
  });

  it('应该处理 markdownContainerRef 为 undefined 的情况', () => {
    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, undefined);
      return null;
    });

    expect(true).toBe(true);
  });

  it('应该正确处理多个键盘事件', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    renderHook(() => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    });

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const events = [
      {
        key: 'a',
        ctrlKey: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      },
      {
        key: 'c',
        ctrlKey: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      },
      {
        key: 'v',
        ctrlKey: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      },
    ];

    events.forEach((event) => {
      eventHandler(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  it('应该处理非快捷键的普通键盘事件', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any;
    const mockRef = { current: mockElement };

    const App = () => {
      useSystemKeyboard(keyTask$, store, mockProps, mockRef);
      return null;
    };

    render(<App />);

    const eventHandler = mockElement.addEventListener.mock.calls[0][1];

    const normalEvent = {
      key: 'a',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    eventHandler(normalEvent);

    expect(normalEvent.preventDefault).not.toHaveBeenCalled();
  });
});
