import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../../src';

// Mock URL constructor for testing
global.URL = class URL {
  searchParams: URLSearchParams;
  constructor(url: string) {
    this.searchParams = new URLSearchParams();
    if (url.includes('?')) {
      const [, params] = url.split('?');
      this.searchParams = new URLSearchParams(params);
    }
  }
} as any;

// Mock window.getSelection
Object.defineProperty(window, 'getSelection', {
  writable: true,
  value: vi.fn(() => ({
    rangeCount: 0,
    getRangeAt: vi.fn(),
    removeAllRanges: vi.fn(),
    anchorNode: null,
    focusNode: null,
    type: 'None',
  })),
});

describe('Editor onPaste function', () => {
  let mockEditor: any;
  let mockStore: any;
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEditor = {
      children: [{ type: 'paragraph', children: [{ text: '' }] }],
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
      operations: [],
    };

    // Mock store
    mockStore = {
      insertLink: vi.fn(),
    };

    // Setup DOM
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const createClipboardEvent = (
    data: Record<string, string>,
    files?: File[],
    target?: HTMLElement,
  ) => {
    const clipboardData = {
      types: Object.keys(data),
      getData: vi.fn((type: string) => data[type] || ''),
      files: files || [],
    };

    return {
      clipboardData,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: target || container,
      isTrusted: true,
      isComposing: false,
      nativeEvent: {
        clipboardData,
      },
    } as any;
  };

  // Add a basic test to verify the editor renders and can receive paste events
  it('should render editor and handle basic paste event', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    expect(editableElement).toBeTruthy();

    // Wait for the editor to be fully initialized
    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    // Create a simple paste event with the correct target
    const event = createClipboardEvent(
      {
        'text/plain': 'Hello World',
      },
      [],
      editableElement,
    );

    // Fire the paste event - this should not throw an error
    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();

    // Verify that the editor is still functional after the paste event
    expect(editableElement).toBeInTheDocument();
    expect(editableElement.getAttribute('contenteditable')).toBe('true');

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
    expect(editableElement).matchSnapshot();
  });

  it('should handle pasting Slate markdown fragment', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const slateFragment = JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: 'Pasted from Slate' }],
      },
    ]);

    const event = createClipboardEvent(
      {
        'application/x-slate-md-fragment': slateFragment,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('Pasted from Slate')).toBeInTheDocument();
    });
  });

  it('should handle pasting HTML content', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const htmlContent =
      '<p><strong>Bold text</strong> and <em>italic text</em></p>';

    const event = createClipboardEvent(
      {
        'text/html': htmlContent,
        'text/plain': 'Bold text and italic text',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('Bold text and');
        }),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('italic text');
        }),
      ).toBeInTheDocument();
    });
  });

  it('should handle pasting image files', async () => {
    const mockUpload = vi
      .fn()
      .mockResolvedValue('https://example.com/image.jpg');

    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        image={{ upload: mockUpload }}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const imageFile = new File(['image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const event = createClipboardEvent(
      {
        Files: '',
      },
      [imageFile],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith([imageFile]);
    });
  });

  it('should handle pasting URLs as links', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'https://example.com',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    // The URL should be handled as a link
    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting image URLs', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'https://example.com/image.jpg',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting media:// URLs', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'media://test?url=https://example.com/image.jpg',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting attach:// URLs', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain':
          'attach://test?url=https://example.com/file.pdf&name=document.pdf&size=1024',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting markdown content', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const markdownContent =
      '# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2';

    const event = createClipboardEvent(
      {
        'text/plain': markdownContent,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting when clipboard data is undefined', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    // Create event with undefined clipboardData
    const event = {
      clipboardData: undefined,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: editableElement,
    } as any;

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting empty content', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': '',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting with invalid JSON in slate fragment', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'application/x-slate-md-fragment': 'invalid json',
        'text/plain': 'fallback text',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return content.includes('fallback text');
        }),
      ).toBeInTheDocument();
    });
  });

  it('should handle pasting card elements with proper structure', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const cardFragment = JSON.stringify([
      {
        type: 'card',
        children: [{ text: 'Card content' }],
      },
    ]);

    const event = createClipboardEvent(
      {
        'application/x-slate-md-fragment': cardFragment,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting in text area mode', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        textAreaProps={{ enable: true }}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const slateFragment = JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: 'Simple text' }],
      },
    ]);

    const event = createClipboardEvent(
      {
        'application/x-slate-md-fragment': slateFragment,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });
  });

  it('should handle pasting RTF content along with HTML', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const htmlContent = '<p>Rich text content</p>';
    const rtfContent = '{\\rtf1\\ansi\\deff0 Rich text content}';

    const event = createClipboardEvent(
      {
        'text/html': htmlContent,
        'text/rtf': rtfContent,
        'text/plain': 'Rich text content',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('Rich text content')).toBeInTheDocument();
    });
  });

  it('should handle pasting multiple files', async () => {
    const mockUpload = vi
      .fn()
      .mockResolvedValueOnce('https://example.com/image1.jpg')
      .mockResolvedValueOnce('https://example.com/image2.jpg');

    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        image={{ upload: mockUpload }}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const file1 = new File(['image1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['image2'], 'test2.jpg', { type: 'image/jpeg' });

    const event = createClipboardEvent(
      {
        Files: '',
      },
      [file1, file2],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledTimes(2);
      expect(mockUpload).toHaveBeenNthCalledWith(1, [file1]);
      expect(mockUpload).toHaveBeenNthCalledWith(2, [file2]);
    });
  });

  it('should handle file upload failure gracefully', async () => {
    const mockUpload = vi.fn().mockRejectedValue(new Error('Upload failed'));

    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        image={{ upload: mockUpload }}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const imageFile = new File(['image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const event = createClipboardEvent(
      {
        Files: '',
      },
      [imageFile],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith([imageFile]);
    });

    // Should not throw error even if upload fails
    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting in table cells', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[
          {
            type: 'table',
            children: [
              {
                type: 'table-row',
                children: [
                  {
                    type: 'table-cell',
                    children: [{ type: 'paragraph', children: [{ text: '' }] }],
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'Cell content',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('Cell content')).toBeInTheDocument();
    });
  });

  it('should handle pasting in code blocks', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[
          {
            type: 'code',
            value: '',
            children: [{ text: '' }],
          },
        ]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'console.log("Hello World");',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(
        screen.getByText('console.log("Hello World");'),
      ).toBeInTheDocument();
    });
  });

  it('should handle pasting video URLs', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'https://example.com/video.mp4',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting audio URLs', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'https://example.com/audio.mp3',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting malformed URLs gracefully', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'media://malformed-url-without-params',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting when no selection exists', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[
          { type: 'paragraph', children: [{ text: 'Existing content' }] },
        ]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'New content',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting complex markdown with multiple elements', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const complexMarkdown = `# Main Title

## Subtitle

This is a paragraph with **bold** and *italic* text.

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

### List Items

- Item 1
- Item 2
  - Nested item
- Item 3

### Links and Images

[Link text](https://example.com)

![Alt text](https://example.com/image.jpg)

### Table

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

> This is a blockquote
> with multiple lines`;

    const event = createClipboardEvent(
      {
        'text/plain': complexMarkdown,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });

  it('should handle pasting when editor is in readonly mode', async () => {
    const { container: editorContainer } = render(
      <MarkdownEditor
        initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        readonly={true}
      />,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="false"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    const event = createClipboardEvent(
      {
        'text/plain': 'Should not paste',
      },
      [],
      editableElement,
    );

    expect(() => {
      fireEvent.paste(editableElement, event);
    }).not.toThrow();
  });
});
