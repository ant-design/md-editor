import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  CommentCreate,
  CommentView,
} from '../../../src/MarkdownEditor/editor/elements/Comment';
import { EditorStoreContext } from '../../../src/MarkdownEditor/editor/store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the store context
const mockSetShowComment = vi.fn();

const MockEditorStoreProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: any;
}) => (
  <EditorStoreContext.Provider
    value={value || { setShowComment: mockSetShowComment }}
  >
    {children}
  </EditorStoreContext.Provider>
);

describe('CommentView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when no comment items', () => {
    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={[]}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children when comment items exist', () => {
    const commentItems = [
      { id: '1', content: 'Comment 1' },
      { id: '2', content: 'Comment 2' },
    ];

    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={commentItems}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call setShowComment when clicked', () => {
    const commentItems = [
      { id: '1', content: 'Comment 1' },
      { id: '2', content: 'Comment 2' },
    ];

    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={commentItems}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    const clickableElement = screen.getByText('Test Content').closest('span');
    fireEvent.click(clickableElement!);

    expect(mockSetShowComment).toHaveBeenCalledWith(commentItems);
  });

  it('should handle click when setShowComment is undefined', () => {
    const commentItems = [{ id: '1', content: 'Comment 1' }];

    render(
      <MockEditorStoreProvider value={{}}>
        <CommentView comment={undefined} commentItem={commentItems}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    const clickableElement = screen.getByText('Test Content').closest('span');

    // Should not throw error when setShowComment is undefined
    expect(() => fireEvent.click(clickableElement!)).not.toThrow();
  });

  it('should render with complex children', () => {
    const commentItems = [{ id: '1', content: 'Comment 1' }];

    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={commentItems}>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('should handle null comment items', () => {
    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={null as any}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should handle undefined comment items', () => {
    render(
      <MockEditorStoreProvider>
        <CommentView comment={undefined} commentItem={undefined as any}>
          <span>Test Content</span>
        </CommentView>
      </MockEditorStoreProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});

describe('CommentCreate Component', () => {
  it('should render default div when no editorRender', () => {
    render(<CommentCreate comment={undefined} />);

    const div = screen.getByRole('generic');
    expect(div).toBeInTheDocument();
  });

  it('should render custom editor when editorRender is provided', () => {
    const mockEditorRender = jest.fn((dom) => (
      <div data-testid="custom-editor">
        Custom Editor
        {dom}
      </div>
    ));

    const comment = {
      editorRender: mockEditorRender,
    };

    render(<CommentCreate comment={comment} />);

    expect(screen.getByTestId('custom-editor')).toBeInTheDocument();
    expect(screen.getByText('Custom Editor')).toBeInTheDocument();
    expect(mockEditorRender).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should render default div when editorRender returns null', () => {
    const mockEditorRender = jest.fn(() => null);

    const comment = {
      editorRender: mockEditorRender,
    };

    render(<CommentCreate comment={comment} />);

    const div = screen.getByRole('generic');
    expect(div).toBeInTheDocument();
    expect(mockEditorRender).toHaveBeenCalled();
  });

  it('should handle editorRender that returns undefined', () => {
    const mockEditorRender = jest.fn(() => undefined);

    const comment = {
      editorRender: mockEditorRender,
    };

    render(<CommentCreate comment={comment} />);

    const div = screen.getByRole('generic');
    expect(div).toBeInTheDocument();
    expect(mockEditorRender).toHaveBeenCalled();
  });

  it('should handle editorRender that throws error', () => {
    const mockEditorRender = jest.fn(() => {
      throw new Error('Test error');
    });

    const comment = {
      editorRender: mockEditorRender,
    };

    // Should not crash and render default div
    render(<CommentCreate comment={comment} />);

    const div = screen.getByRole('generic');
    expect(div).toBeInTheDocument();
  });
});
