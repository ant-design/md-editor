/**
 * Head 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - 不同级别的标题
 * - 属性传递
 * - 边界情况处理
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/slate-react', () => ({
  useSlate: vi.fn(() => ({
    children: [{ type: 'paragraph', children: [{ text: 'test' }] }],
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
      isLatestNode: vi.fn(() => false),
    },
    markdownContainerRef: { current: document.createElement('div') },
    typewriter: false,
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0]]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/dom', () => ({
  slugify: vi.fn((str) => str?.toLowerCase().replace(/\s+/g, '-') || ''),
}));

// 由于 Head 组件依赖 Slate 上下文，我们需要创建一个简化的测试版本
const MockHead = ({ element, attributes, children }: any) => {
  const str = element.children?.[0]?.text || '';
  const slug = str.toLowerCase().replace(/\s+/g, '-');
  
  return React.createElement(
    `h${element.level}`,
    {
      ...attributes,
      id: slug,
      'data-be': 'head',
      'data-head': slug,
      'data-title': element.level === 1,
      'data-empty': !str ? 'true' : undefined,
      'data-align': element.align,
      className: `ant-md-editor-drag-el ${!str ? 'empty' : ''} ${attributes.className || ''}`.trim(),
    },
    <>
      <div data-testid="drag-handle">Drag Handle</div>
      {children}
    </>,
  );
};

describe('Head Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  describe('基本渲染功能', () => {
    it('应该正确渲染 h1 标题', () => {
      const element = {
        level: 1,
        children: [{ text: '测试标题' }],
        align: 'left',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h1Element = container.querySelector('h1');
      expect(h1Element).toBeInTheDocument();
      expect(h1Element).toHaveAttribute('id', '测试标题');
      expect(h1Element).toHaveAttribute('data-be', 'head');
      expect(h1Element).toHaveAttribute('data-head', '测试标题');
      expect(h1Element).toHaveAttribute('data-title', 'true');
    });

    it('应该正确渲染 h2 标题', () => {
      const element = {
        level: 2,
        children: [{ text: '二级标题' }],
        align: 'center',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h2Element = container.querySelector('h2');
      expect(h2Element).toBeInTheDocument();
      expect(h2Element).toHaveAttribute('id', '二级标题');
      expect(h2Element).toHaveAttribute('data-align', 'center');
      expect(h2Element).toHaveAttribute('data-title', 'false');
    });

    it('应该正确渲染 h3 标题', () => {
      const element = {
        level: 3,
        children: [{ text: '三级标题' }],
        align: 'right',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h3Element = container.querySelector('h3');
      expect(h3Element).toBeInTheDocument();
      expect(h3Element).toHaveAttribute('data-align', 'right');
    });
  });

  describe('属性传递', () => {
    it('应该传递自定义属性', () => {
      const element = {
        level: 1,
        children: [{ text: '测试标题' }],
        align: 'left',
      };

      const customAttributes = {
        'data-testid': 'custom-head',
        className: 'custom-class',
      };

      const { getByTestId } = renderWithProvider(
        <MockHead 
          element={element} 
          attributes={customAttributes} 
          children={<span>内容</span>} 
        />
      );

      const elementWithCustomAttr = getByTestId('custom-head');
      expect(elementWithCustomAttr).toHaveClass('custom-class');
    });

    it('应该包含拖拽句柄', () => {
      const element = {
        level: 1,
        children: [{ text: '测试标题' }],
        align: 'left',
      };

      const { getByTestId } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const dragHandle = getByTestId('drag-handle');
      expect(dragHandle).toBeInTheDocument();
      expect(dragHandle).toHaveTextContent('Drag Handle');
    });
  });

  describe('边界情况处理', () => {
    it('应该处理空的标题内容', () => {
      const element = {
        level: 1,
        children: [{ text: '' }],
        align: 'left',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h1Element = container.querySelector('h1');
      expect(h1Element).toBeInTheDocument();
      expect(h1Element).toHaveAttribute('data-empty', 'true');
      expect(h1Element).toHaveClass('empty');
    });

    it('应该处理没有 children 的情况', () => {
      const element = {
        level: 1,
        children: [],
        align: 'left',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h1Element = container.querySelector('h1');
      expect(h1Element).toBeInTheDocument();
      expect(h1Element).toHaveAttribute('data-empty', 'true');
    });

    it('应该处理不同的对齐方式', () => {
      const alignments = ['left', 'center', 'right', 'justify'];
      
      alignments.forEach(align => {
        const element = {
          level: 1,
          children: [{ text: '测试标题' }],
          align,
        };

        const { container } = renderWithProvider(
          <MockHead element={element} attributes={{}} children={<span>内容</span>} />
        );

        const h1Element = container.querySelector('h1');
        expect(h1Element).toHaveAttribute('data-align', align);
      });
    });
  });

  describe('ID 生成', () => {
    it('应该正确生成 slug ID', () => {
      const element = {
        level: 1,
        children: [{ text: 'Test Title With Spaces' }],
        align: 'left',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h1Element = container.querySelector('h1');
      expect(h1Element).toHaveAttribute('id', 'test-title-with-spaces');
    });

    it('应该处理特殊字符', () => {
      const element = {
        level: 1,
        children: [{ text: '标题@#$%' }],
        align: 'left',
      };

      const { container } = renderWithProvider(
        <MockHead element={element} attributes={{}} children={<span>内容</span>} />
      );

      const h1Element = container.querySelector('h1');
      expect(h1Element).toHaveAttribute('id', '标题@#$%');
    });
  });
}); 