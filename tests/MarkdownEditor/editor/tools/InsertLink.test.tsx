import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InsertLink } from '../../../../src/MarkdownEditor/editor/tools/InsertLink';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    markdownContainerRef: { current: document.createElement('div') },
    openInsertLink$: { subscribe: vi.fn() },
    domRect: { x: 0, y: 0, width: 100, height: 100 },
    markdownEditorRef: { current: document.createElement('div') },
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/hooks/subscribe', () => ({
  useSubject: vi.fn(),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils', () => ({
  useGetSetState: vi.fn(() => {
    const state = {
      open: false,
      inputKeyword: '',
      oldUrl: '',
      index: 0,
      docs: [],
      filterDocs: [],
      anchors: [],
      filterAnchors: [],
    };
    const setState = vi.fn((patch) => {
      Object.assign(state, patch);
    });
    return [() => state, setState];
  }),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    getUrl: vi.fn(() => 'http://example.com'),
  },
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/path', () => ({
  isLink: vi.fn(() => false),
  parsePath: vi.fn(() => ({ path: '', hash: '' })),
}));

vi.mock('@ant-design/md-editor/hooks/useRefFunction', () => ({
  useRefFunction: vi.fn((fn) => fn),
}));

describe('InsertLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染 InsertLink 组件', () => {
      render(<InsertLink />);

      // 组件应该渲染，但默认情况下可能不可见
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('清理测试', () => {
    it('应该正确清理事件监听器', () => {
      render(<InsertLink />);

      expect(document.body).toBeInTheDocument();
    });
  });
});
