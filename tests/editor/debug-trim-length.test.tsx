import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { BaseEditor, createEditor, Node, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import {
  ReactEditor,
  withReact,
} from '../../src/MarkdownEditor/editor/slate-react';

// Mock ReactEditor DOM methods
vi.mock('../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    toDOMNode: vi.fn(() => ({
      querySelector: vi.fn(() => ({
        textContent: '',
      })),
    })),
  },
  withReact: (editor: any) => editor,
}));

describe('Debug Trim Length Condition', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  let editor: BaseEditor & ReactEditor & HistoryEditor;

  const createTestEditor = () => {
    const baseEditor = withMarkdown(withHistory(withReact(createEditor())));
    baseEditor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
    return baseEditor;
  };

  beforeEach(() => {
    editor = createTestEditor();
  });

  it('should debug empty tag behavior', () => {
    const emptyTagNode = {
      text: '',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [emptyTagNode],
      },
    ];

    console.log('Before deleteBackward:');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中空标签节点的开始位置 (offset < 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });

    console.log('Selection:', editor.selection);

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward:');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));

    // 让测试通过，主要是为了观察日志
    expect(true).toBe(true);
  });

  it('should debug whitespace tag behavior', () => {
    const whitespaceTagNode = {
      text: '   ',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [whitespaceTagNode],
      },
    ];

    console.log('Before deleteBackward (whitespace):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中标签节点的开始位置 (offset < 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward (whitespace):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));

    expect(true).toBe(true);
  });

  it('should debug tag with content behavior', () => {
    const contentTagNode = {
      text: ' hello ',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [contentTagNode],
      },
    ];

    console.log('Before deleteBackward (content):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中标签节点的开始位置 (offset < 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward (content):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));

    expect(true).toBe(true);
  });

  it('should debug offset >= 1 behavior', () => {
    const emptyTagNode = {
      text: '  ',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [emptyTagNode],
      },
    ];

    console.log('Before deleteBackward (offset >= 1):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中标签节点的中间位置 (offset >= 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    });

    console.log('Selection offset:', editor.selection?.anchor.offset);

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward (offset >= 1):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log(
      'New trim length:',
      Node.get(editor, [0, 0]).text?.trim()?.length,
    );

    expect(true).toBe(true);
  });
});
