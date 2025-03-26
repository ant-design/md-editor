import katex from 'katex';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { Editor, Node, Transforms } from 'slate';
import { useEditorStore } from '../../../../MarkdownEditor/editor/store';
import { InlineChromiumBugfix } from '../../../../MarkdownEditor/editor/utils/InlineChromiumBugfix';
import { ElementProps, InlineKatexNode } from '../../../../MarkdownEditor/el';
import { useSelStatus } from '../../../../MarkdownEditor/hooks/editor';
import './katex.min.css';

export const InlineKatex = observer(
  ({ children, element, attributes }: ElementProps<InlineKatexNode>) => {
    const renderEl = useRef<HTMLElement>(null);
    const { markdownEditorRef, readonly } = useEditorStore();
    const [selected, path] = useSelStatus(element);
    useEffect(() => {
      if (!selected) {
        const value = Node.string(element);
        katex.render(value, renderEl.current!, {
          strict: false,
          output: 'html',
          throwOnError: false,
          macros: {
            '\\f': '#1f(#2)',
          },
        });
      }
    }, [selected]);
    if (process.env.NODE_ENV === 'test') {
      return <InlineChromiumBugfix />;
    }

    if (readonly) {
      return useMemo(
        () => (
          <span
            {...attributes}
            data-be={'inline-katex'}
            style={{
              position: 'relative',
            }}
          >
            <span contentEditable={false} ref={renderEl} />
            <span
              style={{
                display: 'none',
              }}
            >
              {children}
            </span>
          </span>
        ),
        [element, element.children],
      );
    }

    return useMemo(
      () => (
        <span {...attributes} data-be={'inline-katex'} className={`relative`}>
          <span
            style={{
              display: 'inline-flex',
              padding: selected ? '0.25rem' : '0',
              visibility: selected ? 'visible' : 'hidden',
              width: selected ? 'auto' : '0',
              height: selected ? 'auto' : '0',
              overflow: 'hidden',
              position: selected ? 'static' : 'absolute',
            }}
            className={selected ? 'inline-code-input' : ''}
          >
            <InlineChromiumBugfix />
            {children}
            <InlineChromiumBugfix />
          </span>
          <span
            contentEditable={false}
            ref={renderEl}
            onClick={() => {
              Transforms.select(
                markdownEditorRef.current,
                Editor.end(markdownEditorRef.current, path),
              );
            }}
            style={{
              margin: '0 0.25rem',
              userSelect: 'none',
              visibility: selected ? 'hidden' : 'visible',
              width: selected ? '0' : 'auto',
              height: selected ? '0' : 'auto',
              overflow: selected ? 'hidden' : 'visible',
              position: selected ? 'absolute' : 'static',
            }}
          />
        </span>
      ),
      [element, element.children, selected],
    );
  },
);
