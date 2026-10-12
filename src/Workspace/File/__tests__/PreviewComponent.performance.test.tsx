import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileCategory } from '../../types';
import { DataSourceType, PreviewCapability } from '../DataSourceStrategy';
import { PreviewComponent } from '../PreviewComponent';
import { usePreviewContent } from '../preview/usePreviewContent';

const { editorRender, setMDContent } = vi.hoisted(() => ({
  editorRender: vi.fn(),
  setMDContent: vi.fn(),
}));

vi.mock('../../../MarkdownEditor', () => ({
  MarkdownEditor: (props: {
    initValue: string;
    editorRef?: React.RefObject<unknown>;
  }) => {
    editorRender(props);
    if (props.editorRef) {
      Object.assign(props.editorRef, { current: { store: { setMDContent } } });
    }
    return <div data-testid="preview-markdown">{props.initValue}</div>;
  },
}));

vi.mock('../preview/usePreviewContent', () => ({
  usePreviewContent: vi.fn(),
}));

const ready = (content: string) => ({
  processResult: {
    typeInference: {
      category: FileCategory.Text,
      fileType: 'markdown' as const,
    },
    dataSource: {
      sourceType: DataSourceType.CONTENT,
      previewCapability: PreviewCapability.FULL,
      needsCleanup: false,
    },
    canPreview: true,
    previewMode: 'inline' as const,
  },
  contentState: {
    status: 'ready' as const,
    mdContent: content,
    rawContent: content,
  },
});

const file = { id: 'readme', name: 'README.md', content: '# Ready' };

describe('PreviewComponent lightweight readonly content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePreviewContent).mockReturnValue(ready('# Ready'));
  });

  it('mounts the readonly Markdown view with its actual document and no imperative rewrite', () => {
    render(<PreviewComponent file={file} />);
    expect(screen.getByTestId('preview-markdown').textContent).toBe('# Ready');
    expect(editorRender.mock.calls[0][0]).toMatchObject({
      initValue: '# Ready',
      renderMode: 'markdown',
      readonly: true,
    });
    expect(setMDContent).not.toHaveBeenCalled();
  });

  it('clears the displayed document when content becomes empty', () => {
    const { rerender } = render(<PreviewComponent file={file} />);
    vi.mocked(usePreviewContent).mockReturnValue(ready(''));
    rerender(<PreviewComponent file={{ ...file, content: '' }} />);
    expect(screen.getByTestId('preview-markdown').textContent).toBe('');
  });

  it('preserves explicitly requested Slate render modes and the renderType alias', () => {
    const { rerender } = render(
      <PreviewComponent
        file={file}
        markdownEditorProps={{ renderMode: 'slate' }}
      />,
    );
    expect(editorRender.mock.lastCall?.[0].renderMode).toBe('slate');
    rerender(
      <PreviewComponent
        file={file}
        markdownEditorProps={{ renderType: 'slate' }}
      />,
    );
    expect(editorRender.mock.lastCall?.[0].renderMode).toBe('slate');
  });

  it('keeps the lightweight default when optional renderMode is undefined', () => {
    render(
      <PreviewComponent
        file={file}
        markdownEditorProps={{ renderMode: undefined }}
      />,
    );
    expect(editorRender.mock.lastCall?.[0].renderMode).toBe('markdown');
  });

  it('shows a processing failure even when no process result could be created', () => {
    vi.mocked(usePreviewContent).mockReturnValue({
      processResult: null,
      contentState: { status: 'error', error: 'Cannot read file' },
    });
    render(<PreviewComponent file={file} />);
    expect(screen.getByRole('alert').textContent).toContain('Cannot read file');
    expect(editorRender).not.toHaveBeenCalled();
  });
});
