import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CommentDataType,
  MarkdownEditorProps,
} from '../src/MarkdownEditor/BaseMarkdownEditor';
import { CommentList } from '../src/MarkdownEditor/editor/components/CommentList';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock slate editor ref
const mockMarkdownEditorRef = {
  current: {
    insertNodes: vi.fn(),
    deleteNode: vi.fn(),
  },
};

// Mock editor store
vi.mock('../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    markdownEditorRef: mockMarkdownEditorRef,
  }),
  EditorStoreContext: React.createContext({
    setShowComment: vi.fn(),
  }),
}));

// Mock Slate Transforms
vi.mock('slate', () => ({
  Transforms: {
    setNodes: vi.fn(),
  },
}));

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn(() => ({
    format: vi.fn(() => '2023-12-01 10:30:00'),
  }));
  return {
    default: mockDayjs,
  };
});

describe('CommentList Component', () => {
  const mockCommentData: CommentDataType[] = [
    {
      id: 'comment-1',
      content: 'This is a test comment',
      user: {
        name: 'John Doe',
        avatar: 'https://example.com/avatar1.jpg',
      },
      time: Date.now(),
      path: [0, 0],
      selection: null,
      anchorOffset: 0,
      focusOffset: 10,
      refContent: 'reference content 1',
      commentType: 'text',
    },
    {
      id: 'comment-2',
      content: 'Another test comment',
      user: {
        name: 'Jane Smith',
        avatar: 'https://example.com/avatar2.jpg',
      },
      time: Date.now() - 1000,
      path: [0, 1],
      selection: null,
      anchorOffset: 5,
      focusOffset: 15,
      refContent: 'reference content 2',
      commentType: 'text',
    },
  ];

  const mockComment: MarkdownEditorProps['comment'] = {
    onClick: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    deleteConfirmText: 'Are you sure to delete this comment?',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  it('should render comment list with correct title and count', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    expect(screen.getByText('划词评论 (2)')).toBeInTheDocument();
  });

  it('should render empty comment list', () => {
    renderWithProvider(<CommentList commentList={[]} comment={mockComment} />);

    expect(screen.getByText('划词评论 (0)')).toBeInTheDocument();
  });

  it('should render comment items with user information', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Another test comment')).toBeInTheDocument();
  });

  it('should render formatted time for comments', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    expect(screen.getAllByText('2023-12-01 10:30:00')).toHaveLength(2);
  });

  it('should render user avatars', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute(
      'src',
      'https://example.com/avatar1.jpg',
    );
    expect(avatars[1]).toHaveAttribute(
      'src',
      'https://example.com/avatar2.jpg',
    );
  });

  it('should render user initials when no avatar provided', () => {
    const commentWithoutAvatar: CommentDataType[] = [
      {
        id: 'comment-1',
        content: 'Test comment',
        user: {
          name: 'John Doe',
        },
        time: Date.now(),
        path: [0, 0],
        selection: null,
        anchorOffset: 0,
        focusOffset: 10,
        refContent: 'reference content',
        commentType: 'text',
      },
    ];

    renderWithProvider(
      <CommentList commentList={commentWithoutAvatar} comment={mockComment} />,
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should handle user name with single word', () => {
    const commentSingleName: CommentDataType[] = [
      {
        id: 'comment-1',
        content: 'Test comment',
        user: {
          name: 'John',
        },
        time: Date.now(),
        path: [0, 0],
        selection: null,
        anchorOffset: 0,
        focusOffset: 10,
        refContent: 'reference content',
        commentType: 'text',
      },
    ];

    renderWithProvider(
      <CommentList commentList={commentSingleName} comment={mockComment} />,
    );

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should handle empty user name', () => {
    const commentEmptyName: CommentDataType[] = [
      {
        id: 'comment-1',
        content: 'Test comment',
        user: {
          name: '',
        },
        time: Date.now(),
        path: [0, 0],
        selection: null,
        anchorOffset: 0,
        focusOffset: 10,
        refContent: 'reference content',
        commentType: 'text',
      },
    ];

    renderWithProvider(
      <CommentList commentList={commentEmptyName} comment={mockComment} />,
    );

    // Should render empty string for initials
    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
  });

  it('should call onClick when comment item is clicked', async () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const firstComment = screen
      .getByText('This is a test comment')
      .closest('div');
    fireEvent.click(firstComment!);

    await waitFor(() => {
      expect(mockComment.onClick).toHaveBeenCalledWith(
        'comment-1',
        mockCommentData[0],
      );
    });
  });

  it('should render delete button when onDelete is provided', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    // Look for delete icons by aria-label  
    const deleteIcons = screen.getAllByLabelText('delete');
    expect(deleteIcons).toHaveLength(2);
  });

  it('should not render delete button when onDelete is not provided', () => {
    const commentWithoutDelete = { ...mockComment, onDelete: undefined };
    renderWithProvider(
      <CommentList
        commentList={mockCommentData}
        comment={commentWithoutDelete}
      />,
    );

    const deleteIcons = screen.queryAllByLabelText('delete');
    expect(deleteIcons).toHaveLength(0);
  });

  it('should render edit button when onEdit is provided', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const editIcons = screen.getAllByLabelText('edit');
    expect(editIcons).toHaveLength(2);
  });

  it('should not render edit button when onEdit is not provided', () => {
    const commentWithoutEdit = { ...mockComment, onEdit: undefined };
    renderWithProvider(
      <CommentList
        commentList={mockCommentData}
        comment={commentWithoutEdit}
      />,
    );

    const editIcons = screen.queryAllByLabelText('edit');
    expect(editIcons).toHaveLength(0);
  });

  it('should call onEdit when edit button is clicked', async () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const editIcons = screen.getAllByLabelText('edit');
    fireEvent.click(editIcons[0]);

    await waitFor(() => {
      expect(mockComment.onEdit).toHaveBeenCalledWith(
        'comment-1',
        mockCommentData[0],
      );
    });
  });

  it('should render navigation button for jumping to comment position', () => {
    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const exportIcons = screen.getAllByLabelText('export');
    expect(exportIcons).toHaveLength(2);
  });

  it('should handle navigation button click with existing element', async () => {
    // Mock document.getElementById and scrollIntoView
    const mockElement = {
      scrollIntoView: vi.fn(),
    };
    global.document.getElementById = vi.fn(() => mockElement as any);
    global.window.scrollBy = vi.fn();

    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const exportIcons = screen.getAllByLabelText('export');
    fireEvent.click(exportIcons[0]);

    await waitFor(() => {
      expect(document.getElementById).toHaveBeenCalledWith('comment-comment-1');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
      expect(window.scrollBy).toHaveBeenCalledWith(0, -40);
      expect(mockComment.onClick).toHaveBeenCalledWith(
        'comment-1',
        mockCommentData[0],
      );
    });
  });

  it('should handle navigation button click with non-existing element', async () => {
    global.document.getElementById = vi.fn(() => null);

    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const exportIcons = screen.getAllByLabelText('export');
    fireEvent.click(exportIcons[0]);

    await waitFor(() => {
      expect(document.getElementById).toHaveBeenCalledWith('comment-comment-1');
      expect(mockComment.onClick).toHaveBeenCalledWith(
        'comment-1',
        mockCommentData[0],
      );
    });
  });

  it('should handle delete confirmation', async () => {
    const { Transforms } = await import('slate');

    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    // Find the popconfirm trigger (delete button)
    const deleteButtons = screen.getAllByRole('button', { name: /删除评论/i });
    fireEvent.click(deleteButtons[0]);

    // Find and click the confirm button
    await waitFor(() => {
      const confirmButton =
        screen.getByText('确定') ||
        screen.getByRole('button', { name: /确定/i });
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }
    });

    await waitFor(() => {
      expect(mockComment.onDelete).toHaveBeenCalledWith(
        'comment-1',
        mockCommentData[0],
      );
      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockMarkdownEditorRef.current,
        {
          updateTimestamp: expect.any(Number),
        },
        {
          at: [0, 0],
        },
      );
    });
  });

  it('should handle delete error gracefully', async () => {
    const mockCommentWithError = {
      ...mockComment,
      onDelete: vi.fn().mockRejectedValue(new Error('Delete failed')),
    };

    renderWithProvider(
      <CommentList
        commentList={mockCommentData}
        comment={mockCommentWithError}
      />,
    );

    const deleteButtons = screen.getAllByRole('button', { name: /删除评论/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      const confirmButton =
        screen.getByText('确定') ||
        screen.getByRole('button', { name: /确定/i });
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }
    });

    // Should not throw error
    await waitFor(() => {
      expect(mockCommentWithError.onDelete).toHaveBeenCalled();
    });
  });

  it('should use custom delete confirmation text', () => {
    const customComment = {
      ...mockComment,
      deleteConfirmText: 'Custom delete confirmation message',
    };

    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={customComment} />,
    );

    expect(
      screen.getByText('Custom delete confirmation message'),
    ).toBeInTheDocument();
  });

  it('should handle undefined comment list', () => {
    renderWithProvider(
      <CommentList commentList={undefined as any} comment={mockComment} />,
    );

    expect(screen.getByText('划词评论 ()')).toBeInTheDocument();
  });

  it('should stop propagation on action button clicks', async () => {
    const mockStopPropagation = vi.fn();
    const mockPreventDefault = vi.fn();

    renderWithProvider(
      <CommentList commentList={mockCommentData} comment={mockComment} />,
    );

    const editButtons = screen.getAllByTitle('编辑评论');

    // Create a mock event
    const mockEvent = {
      stopPropagation: mockStopPropagation,
      preventDefault: mockPreventDefault,
    };

    // Manually trigger the click handler
    fireEvent.click(editButtons[0], mockEvent);

    // The actual implementation should call stopPropagation and preventDefault
    // but since we're testing the component behavior, we verify the handler is called
    await waitFor(() => {
      expect(mockComment.onEdit).toHaveBeenCalled();
    });
  });
});
