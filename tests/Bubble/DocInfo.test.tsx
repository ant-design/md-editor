import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocInfoList } from '../../src/Bubble/MessagesContent/DocInfo';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock antd components
vi.mock('antd', () => ({
  Popover: ({ children, content, ...props }: any) => (
    <div data-testid="popover" {...props}>
      {children}
      {content}
    </div>
  ),
  Drawer: ({ children, title, onClose, ...props }: any) => (
    <div data-testid="drawer" {...props}>
      <div data-testid="drawer-title">{title}</div>
      <button data-testid="drawer-close" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  ),
  Descriptions: ({ children, ...props }: any) => (
    <div data-testid="descriptions" {...props}>
      {children}
    </div>
  ),
  DescriptionsItem: ({ children, ...props }: any) => (
    <div data-testid="descriptions-item" {...props}>
      {children}
    </div>
  ),
  theme: {
    useToken: () => ({
      token: {
        colorError: '#ff4d4f',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorInfo: '#1890ff',
        colorText: '#000000',
        colorTextSecondary: '#666666',
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        borderRadius: 6,
        fontSize: 14,
        lineHeight: 1.5714,
        padding: 12,
        margin: 8,
      },
    }),
  },
}));

// Mock @ant-design/icons
vi.mock('@ant-design/icons', () => ({
  FileTextOutlined: () => <div data-testid="file-icon">File</div>,
  ExportOutlined: () => <div data-testid="export-icon">Export</div>,
  BoldOutlined: () => <div data-testid="bold-icon">Bold</div>,
  ItalicOutlined: () => <div data-testid="italic-icon">Italic</div>,
  UnderlineOutlined: () => <div data-testid="underline-icon">Underline</div>,
  StrikethroughOutlined: () => (
    <div data-testid="strikethrough-icon">Strikethrough</div>
  ),
  CodeOutlined: () => <div data-testid="code-icon">Code</div>,
  OrderedListOutlined: () => (
    <div data-testid="ordered-list-icon">OrderedList</div>
  ),
  UnorderedListOutlined: () => (
    <div data-testid="unordered-list-icon">UnorderedList</div>
  ),
  BlockquoteOutlined: () => <div data-testid="blockquote-icon">Blockquote</div>,
  LinkOutlined: () => <div data-testid="link-icon">Link</div>,
  PictureOutlined: () => <div data-testid="picture-icon">Picture</div>,
  TableOutlined: () => <div data-testid="table-icon">Table</div>,
  H1Outlined: () => <div data-testid="h1-icon">H1</div>,
  H2Outlined: () => <div data-testid="h2-icon">H2</div>,
  H3Outlined: () => <div data-testid="h3-icon">H3</div>,
  H4Outlined: () => <div data-testid="h4-icon">H4</div>,
  H5Outlined: () => <div data-testid="h5-icon">H5</div>,
  H6Outlined: () => <div data-testid="h6-icon">H6</div>,
  LoadingOutlined: () => <div data-testid="loading-icon">Loading</div>,
}));

// Mock dayjs
vi.mock('dayjs', () => ({
  default: {
    format: vi.fn(() => '2024-01-01'),
    fromNow: vi.fn(() => '1 hour ago'),
  },
}));

// Mock classnames
vi.mock('classnames', () => ({
  default: vi.fn(() => 'test-class'),
}));

describe('DocInfoList', () => {
  const defaultProps = {
    options: [
      {
        content: 'Test document 1',
        docMeta: {
          doc_name: 'Document 1',
          doc_url: 'https://example.com/doc1',
        },
      },
      {
        content: 'Test document 2',
        docMeta: {
          doc_name: 'Document 2',
          doc_url: 'https://example.com/doc2',
        },
      },
    ],
    reference_url_info_list: [
      {
        content: 'Reference 1',
        docMeta: {
          doc_name: 'Ref Doc 1',
          doc_url: 'https://example.com/ref1',
        },
      },
    ],
    onOriginUrlClick: vi.fn(),
    render: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染文档列表', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
    });

    it('应该显示正确的文档数量', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('options-count')).toHaveTextContent('2');
      expect(screen.getByTestId('reference-count')).toHaveTextContent('1');
    });

    it('应该渲染文档内容', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-option-0')).toHaveTextContent(
        'Test document 1',
      );
      expect(screen.getByTestId('doc-option-1')).toHaveTextContent(
        'Test document 2',
      );
    });
  });

  describe('文档项测试', () => {
    it('应该渲染文档项', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-option-0')).toBeInTheDocument();
      expect(screen.getByTestId('doc-option-1')).toBeInTheDocument();
    });

    it('应该显示文档名称', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
    });

    it('应该渲染操作按钮', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('origin-click')).toBeInTheDocument();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该处理自定义渲染函数', () => {
      const customRender = vi.fn(() => (
        <div data-testid="custom-doc-render">Custom</div>
      ));
      const props = {
        ...defaultProps,
        render: customRender,
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('custom-doc-render')).toBeInTheDocument();
    });
  });

  describe('引用URL信息测试', () => {
    it('应该处理空的引用URL信息列表', () => {
      const props = {
        ...defaultProps,
        reference_url_info_list: [],
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('reference-count')).toHaveTextContent('0');
    });

    it('应该处理多个引用URL信息', () => {
      const props = {
        ...defaultProps,
        reference_url_info_list: [
          {
            content: 'Reference 1',
            docMeta: { doc_name: 'Ref 1' },
          },
          {
            content: 'Reference 2',
            docMeta: { doc_name: 'Ref 2' },
          },
        ],
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('reference-count')).toHaveTextContent('2');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无选项的情况', () => {
      const props = {
        ...defaultProps,
        options: [],
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('options-count')).toHaveTextContent('0');
    });

    it('应该处理空内容的情况', () => {
      const props = {
        ...defaultProps,
        options: [
          {
            content: '',
            docMeta: { doc_name: 'Empty Doc' },
          },
        ],
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('doc-option-0')).toHaveTextContent('');
    });

    it('应该处理无originUrl的情况', () => {
      const props = {
        ...defaultProps,
        options: [
          {
            content: 'Test content',
            docMeta: { doc_name: 'No URL Doc' },
          },
        ],
      };

      render(<DocInfoList {...props} />);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
    });
  });

  describe('样式测试', () => {
    it('应该应用正确的样式类名', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
    });

    it('应该处理紧凑模式的样式', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
    });
  });

  describe('动画测试', () => {
    it('应该应用正确的动画属性', () => {
      render(<DocInfoList {...defaultProps} />);

      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });
  });
});
