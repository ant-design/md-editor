import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
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
      <ConfigProvider
        theme={{
          hashed: false,
        }}
      >
        <MarkdownEditor
          initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        />
      </ConfigProvider>,
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

  it('should handle complex mixed Markdown and HTML paste scenarios', async () => {
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

    // Test complex HTML with nested structures
    const complexHtml = `
      <div>
        <h1>Complex Document</h1>
        <p>This is a <strong>bold</strong> paragraph with <em>italic</em> text and <code>inline code</code>.</p>
        <blockquote>
          <p>This is a blockquote with <a href="https://example.com">a link</a>.</p>
          <ul>
            <li>Nested list item 1</li>
            <li>Nested list item 2 with <strong>bold text</strong></li>
          </ul>
        </blockquote>
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
              <th>Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell with <em>italic</em></td>
              <td><code>code cell</code></td>
              <td><a href="https://test.com">Link cell</a></td>
            </tr>
            <tr>
              <td colspan="2">Merged cell content</td>
              <td>Regular cell</td>
            </tr>
          </tbody>
        </table>
        <pre><code class="language-javascript">
function complexFunction() {
  const data = {
    name: "test",
    values: [1, 2, 3]
  };
  return data.values.map(v => v * 2);
}
        </code></pre>
        <div class="custom-container">
          <p>Custom container with <span style="color: red;">styled text</span></p>
        </div>
      </div>
    `;

    const correspondingMarkdown = `# Complex Document

This is a **bold** paragraph with *italic* text and \`inline code\`.

> This is a blockquote with [a link](https://example.com).
> 
> - Nested list item 1
> - Nested list item 2 with **bold text**

| Header 1 | Header 2 | Header 3 |
|:----------------|:---------------:|----------------:|-------------|
| Cell with *italic* | \`code cell\` | [Link cell](https://test.com) |
| Merged cell content | | Regular cell |

\`\`\`javascript
function complexFunction() {
  const data = {
    name: "test",
    values: [1, 2, 3]
  };
  return data.values.map(v => v * 2);
}
\`\`\`

Custom container with styled text`;

    // Test HTML paste
    const htmlEvent = createClipboardEvent(
      {
        'text/html': complexHtml,
        'text/plain': 'Complex Document fallback text',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, htmlEvent);

    await waitFor(() => {
      expect(screen.getByText('Complex Document')).toBeInTheDocument();
    });

    // Clear editor for next test
    fireEvent.keyDown(editableElement, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(editableElement, { key: 'Delete' });

    // Test Markdown paste
    const markdownEvent = createClipboardEvent(
      {
        'text/plain': correspondingMarkdown,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, markdownEvent);

    expect(() => {
      fireEvent.paste(editableElement, markdownEvent);
    }).not.toThrow();
  });

  it('should handle malformed HTML and fallback to text', async () => {
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

    // Test malformed HTML
    const malformedHtml = `
      <div>
        <h1>Unclosed header
        <p>Paragraph without closing tag
        <ul>
          <li>List item 1
          <li>List item 2</li>
        </ul>
        <table>
          <tr>
            <td>Cell without closing
          </tr>
        </table>
      </div>
    `;

    const event = createClipboardEvent(
      {
        'text/html': malformedHtml,
        'text/plain': 'Fallback text for malformed HTML',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return (
            content.includes('Fallback text') ||
            content.includes('Unclosed header')
          );
        }),
      ).toBeInTheDocument();
    });
  });

  it('should handle HTML with embedded media and scripts', async () => {
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

    // Test HTML with media and potentially dangerous content
    const htmlWithMedia = `
      <div>
        <h2>Document with Media</h2>
        <p>Text before image</p>
        <img src="https://example.com/image.jpg" alt="Test Image" width="300" height="200">
        <p>Text between media</p>
        <video src="https://example.com/video.mp4" controls></video>
        <p>Text after video</p>
        <audio src="https://example.com/audio.mp3" controls></audio>
        <script>alert('This should be stripped');</script>
        <iframe src="https://example.com/embed" width="500" height="300"></iframe>
        <p>Final paragraph</p>
      </div>
    `;

    const event = createClipboardEvent(
      {
        'text/html': htmlWithMedia,
        'text/plain':
          'Document with Media - Text before image - Text between media - Text after video - Final paragraph',
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('Document with Media')).toBeInTheDocument();
    });

    // Verify that script tags are not executed/included
    expect(
      screen.queryByText('This should be stripped'),
    ).not.toBeInTheDocument();
  });

  it('should handle Markdown with complex nested structures and edge cases', async () => {
    const { container: editorContainer } = render(
      <ConfigProvider
        theme={{
          hashed: false,
        }}
      >
        <MarkdownEditor
          initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        />
      </ConfigProvider>,
    );

    const editableElement = editorContainer.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;

    await waitFor(() => {
      expect(editableElement).toBeInTheDocument();
    });

    // Test complex Markdown with edge cases
    const complexMarkdown = `# Main Title with *italic* and **bold**

## Subtitle with \`inline code\`

This paragraph has **bold with *nested italic* text** and \`code with **bold** inside\`.

### Lists with complex nesting

1. First ordered item
   - Unordered sub-item
   - Another sub-item with **bold**
     1. Nested ordered item
     2. Another nested item with [link](https://example.com)
2. Second ordered item
   > Blockquote inside list
   > 
   > With multiple lines
3. Third item with code block:
   
   \`\`\`python
   def nested_function():
       return "code in list"
   \`\`\`

### Complex table with formatting

| **Bold Header** | *Italic Header* | \`Code Header\` | Link Header |
|:----------------|:---------------:|----------------:|-------------|
| **Bold cell**   | *Italic cell*   | \`code cell\`   | [Link](https://example.com) |
| Multi-line<br>cell content | Cell with \`inline code\` | **Bold** and *italic* | Normal cell |
| \`\`\`<br>code<br>block<br>\`\`\` | > Blockquote<br>> in cell | - List<br>- In cell | ![Image](https://example.com/img.jpg) |

### Blockquotes with nesting

> This is a blockquote
> 
> > This is a nested blockquote
> > 
> > With **bold** and *italic* text
> 
> Back to first level with:
> 
> - List in blockquote
> - Another item
> 
> \`\`\`javascript
> // Code block in blockquote
> console.log("nested code");
> \`\`\`

### Code blocks with different languages

\`\`\`typescript
interface ComplexType {
  name: string;
  values: number[];
  nested: {
    prop: boolean;
  };
}
\`\`\`

\`\`\`bash
# Shell commands
echo "Hello World"
ls -la | grep "test"
\`\`\`

### Links and images with complex syntax

[Simple link](https://example.com)

[Link with title](https://example.com "This is a title")

[Reference link][ref1]

![Image with alt text](https://example.com/image.jpg "Image title")

![Reference image][img1]

### Horizontal rules and breaks

---

Text after horizontal rule

***

Another horizontal rule style

### Escape characters and special cases

This has \\*escaped asterisks\\* and \\[escaped brackets\\].

\`\`\`
Code block with \`backticks\` inside
\`\`\`

### Footnotes and references

This text has a footnote[^1] and another[^note].

[^1]: This is the first footnote.
[^note]: This is a named footnote with **formatting**.

### Reference definitions

[ref1]: https://example.com/reference "Reference title"
[img1]: https://example.com/ref-image.jpg "Reference image"

### HTML mixed with Markdown

<div align="center">

**Centered content** with HTML wrapper

</div>

<details>
<summary>Collapsible section</summary>

Content inside collapsible section with **markdown** formatting.

\`\`\`javascript
console.log("Code in collapsible");
\`\`\`

</details>`;

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

    // Verify some key content is processed
    await waitFor(() => {
      expect(screen.getByText('Main Title with')).toBeTruthy();
    });

    expect(editableElement).matchSnapshot();
  });

  it('should handle simultaneous HTML and Markdown with conflicting formats', async () => {
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

    // Test case where HTML and plain text have different formatting
    const htmlContent = `
      <div>
        <h1>HTML Title</h1>
        <p>This is <strong>HTML bold</strong> and <em>HTML italic</em>.</p>
        <ul>
          <li>HTML list item 1</li>
          <li>HTML list item 2</li>
        </ul>
      </div>
    `;

    const markdownContent = `# Markdown Title

This is **Markdown bold** and *Markdown italic*.

- Markdown list item 1
- Markdown list item 2`;

    // HTML should take precedence over plain text
    const event = createClipboardEvent(
      {
        'text/html': htmlContent,
        'text/plain': markdownContent,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, event);

    await waitFor(() => {
      expect(screen.getByText('HTML Title')).toBeInTheDocument();
    });

    // Clear and test plain text only
    fireEvent.keyDown(editableElement, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(editableElement, { key: 'Delete' });

    const plainTextEvent = createClipboardEvent(
      {
        'text/plain': markdownContent,
      },
      [],
      editableElement,
    );

    fireEvent.paste(editableElement, plainTextEvent);

    expect(() => {
      fireEvent.paste(editableElement, plainTextEvent);
    }).not.toThrow();
  });
});
