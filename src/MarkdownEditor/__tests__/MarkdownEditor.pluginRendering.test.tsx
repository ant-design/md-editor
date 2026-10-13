import { act, render, screen } from '@testing-library/react';
import React, { useContext, useEffect } from 'react';
import { Transforms } from 'slate';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../index';
import { PluginContext, type MarkdownEditorPlugin } from '../plugin';
import type { MarkdownEditorInstance } from '../types';

describe('MarkdownEditor plugin rendering', () => {
  it('allows later custom renderers to override standard code rendering', () => {
    const first: MarkdownEditorPlugin = {
      elements: {
        code: ({ attributes, children }) => (
          <div {...attributes}>first renderer{children}</div>
        ),
      },
    };
    const last: MarkdownEditorPlugin = {
      elements: {
        code: ({ attributes, children }) => (
          <div {...attributes}>custom renderer{children}</div>
        ),
      },
    };
    render(
      <MarkdownEditor
        readonly
        initValue={'```text\nsource code\n```'}
        plugins={[first, last]}
      />,
    );
    expect(screen.getByText('custom renderer')).toBeInTheDocument();
    expect(screen.queryByText('first renderer')).not.toBeInTheDocument();
  });

  it('keeps plugin subscriptions stable when only editor presentation changes', () => {
    const configure = vi.fn();
    const plugins: MarkdownEditorPlugin[] = [
      {
        elements: {
          paragraph: ({ attributes, children }) => {
            const activePlugins = useContext(PluginContext);
            useEffect(() => {
              configure();
            }, [activePlugins]);
            return <p {...attributes}>{children}</p>;
          },
        },
      },
    ];
    const view = render(<MarkdownEditor initValue="hello" plugins={plugins} />);
    const configured = configure.mock.calls.length;
    view.rerender(
      <MarkdownEditor
        initValue="hello"
        plugins={plugins}
        className="updated"
      />,
    );
    expect(configure).toHaveBeenCalledTimes(configured);
  });

  it('preserves the editor, selection and document when display plugins are added', () => {
    const editorRef = React.createRef<MarkdownEditorInstance>();
    const withEditor = vi.fn((editor) => editor);
    const behavior: MarkdownEditorPlugin = {
      withEditor,
      withEditorKey: 'stable',
    };
    const display: MarkdownEditorPlugin = { elements: {} };
    const view = render(
      <MarkdownEditor
        initValue="keep selection"
        editorRef={editorRef}
        plugins={[behavior]}
      />,
    );
    const editor = editorRef.current!.markdownEditorRef.current;
    act(() => {
      Transforms.select(editor, { path: [0, 0], offset: 3 });
    });
    const selection = editor.selection;
    const document = editor.children;
    view.rerender(
      <MarkdownEditor
        initValue="keep selection"
        editorRef={editorRef}
        plugins={[display, behavior, display]}
      />,
    );
    expect(editorRef.current!.markdownEditorRef.current).toBe(editor);
    expect(editor.selection).toEqual(selection);
    expect(editor.children).toBe(document);
    expect(withEditor).toHaveBeenCalledTimes(1);
  });
});
