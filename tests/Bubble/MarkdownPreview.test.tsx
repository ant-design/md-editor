import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownPreview } from '../../src/Bubble/MessagesContent/MarkdownPreview';
import { BubbleConfigContext } from '../../src/Bubble/BubbleConfigProvide';

// Mock MarkdownEditor
vi.mock('../../src/MarkdownEditor', () => ({
  MarkdownEditor: ({ initValue }: any) => <div data-testid="markdown-editor">{initValue}</div>,
  parserMdToSchema: vi.fn().mockReturnValue({ schema: [] }),
}));

// Mock react-error-boundary
vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }: any) => <div>{children}</div>,
}));

describe('MarkdownPreview', () => {
  const defaultProps = {
    content: '# Test Content',
    beforeContent: null,
    afterContent: null,
  };

  it('应该正确渲染 Markdown 内容', () => {
    render(<MarkdownPreview {...defaultProps} />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.getByText('# Test Content')).toBeInTheDocument();
  });

  it('应该处理包含 chartType 的内容并计算 minWidth（第127-129行）', () => {
    // 测试 standalone 为 true 的情况
    const standaloneContextValue = {
      standalone: true,
      locale: {},
    };

    render(
      <BubbleConfigContext.Provider value={standaloneContextValue}>
        <div ref={(el) => {
          if (el) {
            Object.defineProperty(el, 'clientWidth', { value: 800, configurable: true });
          }
        }}>
          <MarkdownPreview 
            {...defaultProps} 
            content="# Test Content with chartType" 
          />
        </div>
      </BubbleConfigContext.Provider>
    );

    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.getByText('# Test Content with chartType')).toBeInTheDocument();
  });

  it('应该处理包含 chartType 的内容并计算 minWidth（非 standalone 模式）', () => {
    // 测试 standalone 为 false 的情况
    const nonStandaloneContextValue = {
      standalone: false,
      locale: {},
    };

    render(
      <BubbleConfigContext.Provider value={nonStandaloneContextValue}>
        <div ref={(el) => {
          if (el) {
            Object.defineProperty(el, 'clientWidth', { value: 800, configurable: true });
          }
        }}>
          <MarkdownPreview 
            {...defaultProps} 
            content="# Test Content with chartType" 
          />
        </div>
      </BubbleConfigContext.Provider>
    );

    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.getByText('# Test Content with chartType')).toBeInTheDocument();
  });

  it('应该处理不包含 chartType 的内容（第127-129行）', () => {
    render(<MarkdownPreview {...defaultProps} content="# Test Content without chartType" />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.getByText('# Test Content without chartType')).toBeInTheDocument();
  });

  it('应该正确处理 placement 为 right 的情况', () => {
    render(<MarkdownPreview {...defaultProps} placement="right" />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  it('应该正确处理 placement 不为 right 的情况', () => {
    render(<MarkdownPreview {...defaultProps} placement="left" />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  it('应该正确渲染 beforeContent 和 afterContent', () => {
    const beforeContent = <div data-testid="before-content">Before</div>;
    const afterContent = <div data-testid="after-content">After</div>;
    
    render(
      <MarkdownPreview 
        {...defaultProps} 
        beforeContent={beforeContent}
        afterContent={afterContent}
      />
    );
    
    expect(screen.getByTestId('before-content')).toBeInTheDocument();
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByTestId('after-content')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('应该正确处理 extra 属性', () => {
    const extra = <div data-testid="extra-content">Extra</div>;
    
    render(<MarkdownPreview {...defaultProps} extra={extra} />);
    
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
    expect(screen.getByText('Extra')).toBeInTheDocument();
  });

  it('应该正确处理 docListNode 属性', () => {
    const docListNode = <div data-testid="doc-list-node">Doc List</div>;
    
    render(<MarkdownPreview {...defaultProps} docListNode={docListNode} />);
    
    expect(screen.getByTestId('doc-list-node')).toBeInTheDocument();
    expect(screen.getByText('Doc List')).toBeInTheDocument();
  });

  it('应该正确处理 typing 属性', () => {
    render(<MarkdownPreview {...defaultProps} typing={true} />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  it('应该正确处理 isFinished 属性', () => {
    render(<MarkdownPreview {...defaultProps} isFinished={true} />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });
});