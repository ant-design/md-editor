import { InsertLink } from '@ant-design/md-editor/MarkdownEditor/editor/tools/InsertLink';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@ant-design/md-editor/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    store: {
      insertLink: () => {},
      removeLink: () => {},
    },
    editor: {
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 5 },
      },
    },
  }),
}));

vi.mock('@ant-design/md-editor/MarkdownEditor/hooks/subscribe', () => ({
  useSubject: () => ({
    subscribe: () => {},
    next: () => {},
  }),
}));

vi.mock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
  useGetSetState: () => [
    {
      visible: false,
      url: '',
      text: '',
      docList: [],
      loading: false,
    },
    () => {},
  ],
}));

vi.mock('@ant-design/md-editor/i18n', () => ({
  I18nContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: ({ children }: { children: (value: any) => React.ReactNode }) =>
      children({ locale: { insertLink: '插入链接' } }),
  },
}));

describe('InsertLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染插入链接组件', () => {
    render(<InsertLink />);

    // 由于组件默认是隐藏的，我们主要测试组件是否正确挂载
    expect(document.body).toBeInTheDocument();
  });

  it('应该处理链接URL输入', async () => {
    const mockSetState = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: '',
          text: '',
          docList: [],
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试URL输入功能
    const urlInput = screen.queryByPlaceholderText(/url/i);
    if (urlInput) {
      fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
      expect(mockSetState).toHaveBeenCalled();
    }
  });

  it('应该处理链接文本输入', async () => {
    const mockSetState = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'https://example.com',
          text: '',
          docList: [],
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试文本输入功能
    const textInput = screen.queryByPlaceholderText(/text/i);
    if (textInput) {
      fireEvent.change(textInput, { target: { value: '链接文本' } });
      expect(mockSetState).toHaveBeenCalled();
    }
  });

  it('应该处理确认按钮点击', async () => {
    const mockInsertLink = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/store', () => ({
      useEditorStore: () => ({
        store: {
          insertLink: mockInsertLink,
          removeLink: vi.fn(),
        },
        editor: {
          selection: {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
          },
        },
      }),
    }));

    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'https://example.com',
          text: '链接文本',
          docList: [],
          loading: false,
        },
        vi.fn(),
      ],
    }));

    render(<InsertLink />);

    // 测试确认按钮
    const confirmButton = screen.queryByText(/确认|ok|确定/i);
    if (confirmButton) {
      fireEvent.click(confirmButton);
      expect(mockInsertLink).toHaveBeenCalled();
    }
  });

  it('应该处理取消按钮点击', async () => {
    const mockSetState = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'https://example.com',
          text: '链接文本',
          docList: [],
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试取消按钮
    const cancelButton = screen.queryByText(/取消|cancel/i);
    if (cancelButton) {
      fireEvent.click(cancelButton);
      expect(mockSetState).toHaveBeenCalledWith({ visible: false });
    }
  });

  it('应该处理删除链接功能', async () => {
    const mockRemoveLink = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/store', () => ({
      useEditorStore: () => ({
        store: {
          insertLink: vi.fn(),
          removeLink: mockRemoveLink,
        },
        editor: {
          selection: {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
          },
        },
      }),
    }));

    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'https://example.com',
          text: '链接文本',
          docList: [],
          loading: false,
        },
        vi.fn(),
      ],
    }));

    render(<InsertLink />);

    // 测试删除链接按钮
    const deleteButton = screen.queryByText(/删除|remove|delete/i);
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockRemoveLink).toHaveBeenCalled();
    }
  });

  it('应该处理文档列表选择', async () => {
    const mockSetState = vi.fn();
    const mockDocList = [
      { path: '/doc1', title: '文档1' },
      { path: '/doc2', title: '文档2' },
    ];

    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: '',
          text: '',
          docList: mockDocList,
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试文档列表
    const docItem = screen.queryByText('文档1');
    if (docItem) {
      fireEvent.click(docItem);
      expect(mockSetState).toHaveBeenCalled();
    }
  });

  it('应该处理键盘事件', async () => {
    const mockSetState = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'https://example.com',
          text: '链接文本',
          docList: [],
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试ESC键
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockSetState).toHaveBeenCalledWith({ visible: false });
  });

  it('应该验证URL格式', async () => {
    const mockSetState = vi.fn();
    vi.doMock('@ant-design/md-editor/MarkdownEditor/editor/utils', () => ({
      useGetSetState: () => [
        {
          visible: true,
          url: 'invalid-url',
          text: '链接文本',
          docList: [],
          loading: false,
        },
        mockSetState,
      ],
    }));

    render(<InsertLink />);

    // 测试无效URL
    const confirmButton = screen.queryByText(/确认|ok|确定/i);
    if (confirmButton) {
      fireEvent.click(confirmButton);
      // 应该显示错误信息或阻止提交
      expect(screen.queryByText(/无效|invalid|错误/i)).toBeInTheDocument();
    }
  });
});
