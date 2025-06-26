import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Bubble } from '../src/Bubble';
import { BubbleProps, MessageBubbleData } from '../src/Bubble/type';
import { AttachmentFile } from '../src/MarkdownInputField/AttachmentButton/AttachmentFileList';

const mockMessage: MessageBubbleData = {
  content: 'Test message',
  id: '1',
  role: 'assistant',
  createAt: Date.now(),
  updateAt: Date.now(),
  extra: {
    preMessage: {
      content: 'preTest message',
    },
  },
};

const defaultProps: BubbleProps = {
  avatar: {
    title: 'Test Bot',
    avatar: 'https://example.com/avatar.png',
  },
  placement: 'left',
  originData: mockMessage,
};

describe('Bubble Component', () => {
  it('renders basic message correctly', async () => {
    await act(async () => {
      render(<Bubble {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-content')).toBeInTheDocument();
      expect(screen.getByTestId('bubble-title')).toHaveTextContent('Test Bot');
    });
  });

  it('handles avatar click event', async () => {
    const onAvatarClick = vi.fn();
    await act(async () => {
      render(<Bubble {...defaultProps} onAvatarClick={onAvatarClick} />);
    });

    const avatar = await waitFor(() => screen.getByTestId('bubble-avatar'));
    await act(async () => {
      fireEvent.click(avatar);
    });
    expect(onAvatarClick).toHaveBeenCalled();
  });

  it('handles double click event', async () => {
    const onDoubleClick = vi.fn();
    await act(async () => {
      render(<Bubble {...defaultProps} onDoubleClick={onDoubleClick} />);
    });

    const messageContent = await waitFor(() =>
      screen.getByTestId('message-content'),
    );
    await act(async () => {
      fireEvent.doubleClick(messageContent);
    });
    expect(onDoubleClick).toHaveBeenCalled();
  });

  it('renders in pure mode correctly', async () => {
    await act(async () => {
      render(<Bubble {...defaultProps} pure />);
    });

    const container = await waitFor(() => screen.getByTestId('chat-message'));
    expect(container).toHaveClass('ant-agent-list-bubble-container-pure');
  });

  it('shows loading state correctly', async () => {
    await act(async () => {
      render(<Bubble {...defaultProps} loading />);
    });

    const messageContent = await waitFor(() =>
      screen.getByTestId('message-content'),
    );
    expect(messageContent).toHaveStyle('opacity: 0');
  });

  it('renders custom content through bubbleRenderConfig', async () => {
    const customContent = 'Custom Content';
    const bubbleRenderConfig = {
      contentRender: () => (
        <div data-testid="custom-content">{customContent}</div>
      ),
    };

    await act(async () => {
      render(
        <Bubble {...defaultProps} bubbleRenderConfig={bubbleRenderConfig} />,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('custom-content')).toHaveTextContent(
        customContent,
      );
    });
  });

  it('handles like/dislike actions', async () => {
    const onLike = vi.fn();
    const onDisLike = vi.fn();

    let containerDom;
    await act(async () => {
      const { container } = render(
        <Bubble
          {...defaultProps}
          isLast={true}
          onLike={onLike}
          onDisLike={onDisLike}
        />,
      );
      containerDom = container;
    });

    const [likeButton, dislikeButton] = await waitFor(() => [
      screen.getByTestId('like-button'),
      screen.getByTestId('dislike-button'),
    ]);

    await act(async () => {
      fireEvent.click(likeButton);
    });

    expect(onLike).toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(dislikeButton);
    });
    expect(onDisLike).toHaveBeenCalled();
  });

  it('renders markdown content correctly', async () => {
    const markdownMessage = {
      ...mockMessage,
      content: '# Heading\n**bold**',
    };

    await act(async () => {
      render(<Bubble {...defaultProps} originData={markdownMessage} />);
    });

    await waitFor(() => {
      const heading = screen.getByTestId('markdown-heading');
      const boldText = screen.getByTestId('markdown-bold');
      expect(heading).toHaveTextContent('Heading');
      expect(boldText).toHaveTextContent('bold');
    });
  });

  it('handles reply action', async () => {
    const onReply = vi.fn();

    await act(async () => {
      render(<Bubble {...defaultProps} onReply={onReply} isLast={true} />);
    });

    const replyButton = await waitFor(() => screen.getByTestId('reply-button'));

    await act(async () => {
      fireEvent.click(replyButton);
    });

    expect(onReply).toHaveBeenCalled();
  });

  it('renders file attachments correctly', async () => {
    const mockFile = {
      name: 'test.pdf',
      size: 1024,
      type: 'application/pdf',
      url: 'https://example.com/test.pdf',
      status: 'done' as const,
      uuid: '123',
      lastModified: Date.now(),
      webkitRelativePath: '',
      arrayBuffer: async () => new ArrayBuffer(0),
      slice: () => new Blob(),
      stream: () => new ReadableStream(),
      text: async () => '',
    } as unknown as AttachmentFile;

    const messageWithFile = {
      ...mockMessage,
      fileMap: new Map([['file1', mockFile]]),
    };

    await act(async () => {
      render(<Bubble {...defaultProps} originData={messageWithFile} />);
    });

    const fileItem = await waitFor(() => screen.getByTestId('file-item'));
    expect(fileItem).toHaveTextContent('test');
    expect(fileItem).toHaveTextContent('1 KB');
  });
});
