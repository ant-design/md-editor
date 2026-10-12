import { cleanup, render, screen } from '@testing-library/react';
import DOMPurify from 'dompurify';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MarkdownEditorProps } from '../../../MarkdownEditor';

const editor = vi.hoisted(() => vi.fn());
vi.mock('../../../MarkdownEditor', () => ({
  MarkdownEditor: (props: MarkdownEditorProps) => {
    editor(props);
    return <div data-testid="code">{props.initValue}</div>;
  },
}));
vi.mock('../style', () => ({
  useHtmlPreviewStyle: () => ({ hashId: '' }),
}));

import { HtmlPreview } from '../index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  editor.mockClear();
});

describe('HtmlPreview rendering', () => {
  it('keeps the iframe element stable while updating sanitized HTML', () => {
    const { rerender } = render(
      <HtmlPreview html="<p>First</p>" status="done" />,
    );
    const iframe = screen.getByTitle('html-preview');
    rerender(
      <HtmlPreview
        html={'<p>Next</p><script>alert(1)</script>'}
        status="done"
      />,
    );
    expect(screen.getByTitle('html-preview')).toBe(iframe);
    expect(iframe).toHaveAttribute('srcdoc', '<p>Next</p>');
  });

  it('skips HTML parsing in code mode and uses the lightweight readonly renderer', () => {
    const sanitize = vi.spyOn(DOMPurify, 'sanitize');
    const { rerender } = render(
      <HtmlPreview html="<p>First</p>" viewMode="code" />,
    );
    rerender(<HtmlPreview html="<p>Next</p>" viewMode="code" />);
    expect(sanitize).not.toHaveBeenCalled();
    expect(screen.getByTestId('code')).toHaveTextContent('<p>Next</p>');
    expect(editor.mock.lastCall?.[0]).toMatchObject({
      renderMode: 'markdown',
      readonly: true,
    });

    rerender(<HtmlPreview html="<p>Next</p>" viewMode="preview" />);
    expect(screen.getByTitle('html-preview')).toHaveAttribute(
      'srcdoc',
      '<p>Next</p>',
    );
    expect(sanitize).toHaveBeenCalledTimes(1);
  });

  it('honors explicit legacy renderer configuration', () => {
    render(
      <HtmlPreview
        html="<p>Code</p>"
        viewMode="code"
        markdownEditorProps={{ renderType: 'slate' }}
      />,
    );
    expect(editor.mock.lastCall?.[0].renderMode).toBe('slate');
  });

  it('only invokes the renderer for the visible state', () => {
    const loadingRender = vi.fn(() => 'Waiting');
    const errorRender = vi.fn();
    const emptyRender = vi.fn();
    render(
      <HtmlPreview
        html="<p>Partial</p>"
        status="loading"
        loadingRender={loadingRender}
        errorRender={errorRender}
        emptyRender={emptyRender}
      />,
    );
    expect(screen.getByText('Waiting')).toBeInTheDocument();
    expect(loadingRender).toHaveBeenCalledTimes(1);
    expect(errorRender).not.toHaveBeenCalled();
    expect(emptyRender).not.toHaveBeenCalled();
  });
});
