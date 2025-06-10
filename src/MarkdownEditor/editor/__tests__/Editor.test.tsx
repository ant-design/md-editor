import { render, screen } from '@testing-library/react';
import React from 'react';
import { Subject } from 'rxjs';
import { BaseEditor, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CodeNode,
  ElementProps,
  Elements,
  MarkdownEditorInstance,
  ParagraphNode,
} from '../../BaseMarkdownEditor';
import { SlateMarkdownEditor } from '../Editor';
import { ReactEditor, withReact } from '../slate-react';
import { EditorStore, EditorStoreContext } from '../store';

describe('SlateMarkdownEditor', () => {
  let mockInstance: MarkdownEditorInstance;
  let mockStore: EditorStore;
  let mockContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  let mockEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >;

  beforeEach(() => {
    const editor = withHistory(withReact(createEditor())) as BaseEditor &
      ReactEditor &
      HistoryEditor;

    // Initialize editor with empty children
    editor.children = [{ type: 'paragraph', children: [{ text: '' }] }];

    mockEditorRef = {
      current: editor,
    } as React.MutableRefObject<BaseEditor & ReactEditor & HistoryEditor>;

    mockContainerRef = {
      current: null,
    } as React.MutableRefObject<HTMLDivElement | null>;

    mockStore = new EditorStore(mockEditorRef);

    mockInstance = {
      store: mockStore,
      markdownContainerRef: mockContainerRef,
      markdownEditorRef: mockEditorRef,
      exportHtml: async () => '',
    };
  });

  // Test plugin that handles code blocks
  const codeBlockPlugin = {
    elements: {
      code: (props: ElementProps<CodeNode>) => (
        <pre>
          <code data-testid="plugin-code-block">{props.children}</code>
        </pre>
      ),
    },
  };

  // Test plugin that handles custom blocks
  const customBlockPlugin = {
    elements: {
      paragraph: (props: ElementProps<ParagraphNode>) => (
        <div data-testid="plugin-custom-block" className="custom-block">
          {props.children}
        </div>
      ),
    },
  };

  // Custom eleItemRender function
  const customEleItemRender = (
    props: ElementProps,
    defaultDom: React.ReactNode,
  ) => {
    if (props.element.type === 'code') {
      return (
        <div data-testid="custom-code-wrapper" className="code-wrapper">
          {defaultDom}
          <button className="copy-button">Copy</button>
        </div>
      );
    }
    if (props.element.type === 'paragraph') {
      return (
        <div data-testid="custom-block-wrapper" className="block-wrapper">
          {defaultDom}
          <span className="custom-indicator">★</span>
        </div>
      );
    }
    return defaultDom as React.ReactElement;
  };

  it('should render default elements when no plugins or eleItemRender provided', () => {
    const initValue: Elements[] = [
      {
        type: 'paragraph',
        children: [{ text: 'Hello World' }],
      } as ParagraphNode,
    ];

    render(
      <EditorStoreContext.Provider
        value={{
          store: mockStore,
          typewriter: false,
          readonly: false,
          keyTask$: new Subject(),
          insertCompletionText$: new Subject(),
          openInsertLink$: new Subject(),
          domRect: null,
          setDomRect: () => {},
          editorProps: {},
          markdownEditorRef: mockEditorRef,
          markdownContainerRef: mockContainerRef,
          setShowComment: () => {},
        }}
      >
        <SlateMarkdownEditor
          instance={mockInstance}
          initSchemaValue={initValue}
        />
      </EditorStoreContext.Provider>,
    );

    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('should apply plugin rendering for code blocks', () => {
    const initValue: Elements[] = [
      {
        type: 'code',
        children: [{ text: 'const x = 1;' }],
        value: 'const x = 1;',
        lang: 'javascript',
      } as CodeNode,
    ];

    render(
      <EditorStoreContext.Provider
        value={{
          store: mockStore,
          typewriter: false,
          readonly: false,
          keyTask$: new Subject(),
          insertCompletionText$: new Subject(),
          openInsertLink$: new Subject(),
          domRect: null,
          setDomRect: () => {},
          editorProps: {},
          markdownEditorRef: mockEditorRef,
          markdownContainerRef: mockContainerRef,
          setShowComment: () => {},
        }}
      >
        <SlateMarkdownEditor
          instance={mockInstance}
          initSchemaValue={initValue}
          plugins={[codeBlockPlugin]}
        />
      </EditorStoreContext.Provider>,
    );

    const codeBlock = screen.getByTestId('plugin-code-block');
    expect(codeBlock).toBeDefined();
    expect(codeBlock.textContent).toBe('const x = 1;');
  });

  it('should apply eleItemRender after plugin rendering', () => {
    const initValue: Elements[] = [
      {
        type: 'code',
        children: [{ text: 'const x = 1;' }],
        value: 'const x = 1;',
        lang: 'javascript',
      } as CodeNode,
    ];

    render(
      <EditorStoreContext.Provider
        value={{
          store: mockStore,
          typewriter: false,
          readonly: false,
          keyTask$: new Subject(),
          insertCompletionText$: new Subject(),
          openInsertLink$: new Subject(),
          domRect: null,
          setDomRect: () => {},
          editorProps: {},
          markdownEditorRef: mockEditorRef,
          markdownContainerRef: mockContainerRef,
          setShowComment: () => {},
        }}
      >
        <SlateMarkdownEditor
          instance={mockInstance}
          initSchemaValue={initValue}
          plugins={[codeBlockPlugin]}
          eleItemRender={customEleItemRender}
        />
      </EditorStoreContext.Provider>,
    );

    const wrapper = screen.getByTestId('custom-code-wrapper');
    const pluginBlock = screen.getByTestId('plugin-code-block');
    const copyButton = screen.getByText('Copy');

    expect(wrapper).toBeDefined();
    expect(pluginBlock).toBeDefined();
    expect(copyButton).toBeDefined();
  });

  it('should handle multiple plugins and eleItemRender combinations', () => {
    const initValue: Elements[] = [
      {
        type: 'code',
        children: [{ text: 'const x = 1;' }],
        value: 'const x = 1;',
        lang: 'javascript',
      } as CodeNode,
      {
        type: 'paragraph',
        children: [{ text: 'Custom content' }],
      } as ParagraphNode,
    ];

    render(
      <EditorStoreContext.Provider
        value={{
          store: mockStore,
          typewriter: false,
          readonly: false,
          keyTask$: new Subject(),
          insertCompletionText$: new Subject(),
          openInsertLink$: new Subject(),
          domRect: null,
          setDomRect: () => {},
          editorProps: {},
          markdownEditorRef: mockEditorRef,
          markdownContainerRef: mockContainerRef,
          setShowComment: () => {},
        }}
      >
        <SlateMarkdownEditor
          instance={mockInstance}
          initSchemaValue={initValue}
          plugins={[codeBlockPlugin, customBlockPlugin]}
          eleItemRender={customEleItemRender}
        />
      </EditorStoreContext.Provider>,
    );

    // Check code block rendering
    expect(screen.getByTestId('custom-code-wrapper')).toBeDefined();
    expect(screen.getByTestId('plugin-code-block')).toBeDefined();
    expect(screen.getByText('Copy')).toBeDefined();

    // Check custom block rendering
    expect(screen.getByTestId('custom-block-wrapper')).toBeDefined();
    expect(screen.getByTestId('plugin-custom-block')).toBeDefined();
    expect(screen.getByText('★')).toBeDefined();
  });

  it('should not apply eleItemRender to table cells and rows', () => {
    const initValue: Elements[] = [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: 'Cell content' }],
          },
        ],
      },
    ];

    render(
      <EditorStoreContext.Provider
        value={{
          store: mockStore,
          typewriter: false,
          readonly: false,
          keyTask$: new Subject(),
          insertCompletionText$: new Subject(),
          openInsertLink$: new Subject(),
          domRect: null,
          setDomRect: () => {},
          editorProps: {},
          markdownEditorRef: mockEditorRef,
          markdownContainerRef: mockContainerRef,
          setShowComment: () => {},
        }}
      >
        <SlateMarkdownEditor
          instance={mockInstance}
          initSchemaValue={initValue}
          eleItemRender={customEleItemRender}
        />
      </EditorStoreContext.Provider>,
    );

    expect(screen.getByText('Cell content')).toBeDefined();
    expect(screen.queryByTestId('custom-block-wrapper')).toBeNull();
  });
});
