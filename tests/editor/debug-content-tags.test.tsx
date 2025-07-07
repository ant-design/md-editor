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

describe('Debug Content Tags', () => {
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

  it('should debug code tag behavior', () => {
    const codeTagNode = {
      text: '`code',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [codeTagNode],
      },
    ];

    console.log('Before deleteBackward (code tag):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中标签节点的开始位置 (offset < 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward (code tag):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));

    expect(true).toBe(true);
  });

  it('should debug whitespace with tick tag behavior', () => {
    const tagWithTriggerNode = {
      text: '`   ',
      tag: true,
      code: true,
      triggerText: '`',
    };

    editor.children = [
      {
        type: 'paragraph',
        children: [tagWithTriggerNode],
      },
    ];

    console.log('Before deleteBackward (tick + whitespace):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));
    console.log('Trim length:', Node.get(editor, [0, 0]).text?.trim()?.length);

    // 选中标签节点的开始位置 (offset < 1)
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    });

    // 执行删除操作
    editor.deleteBackward('character');

    console.log('After deleteBackward (tick + whitespace):');
    console.log('Node:', JSON.stringify(Node.get(editor, [0, 0]), null, 2));

    expect(true).toBe(true);
  });
});
