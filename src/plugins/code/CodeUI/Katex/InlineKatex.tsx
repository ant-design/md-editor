import { Popover } from 'antd';
import katex from 'katex';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { Editor, Node, Transforms } from 'slate';
import { useEditorStore } from '../../../../MarkdownEditor/editor/store';
import { InlineChromiumBugfix } from '../../../../MarkdownEditor/editor/utils/InlineChromiumBugfix';
import { ElementProps, InlineKatexNode } from '../../../../MarkdownEditor/el';
import { useSelStatus } from '../../../../MarkdownEditor/hooks/editor';

export const InlineKatex = observer(
  ({ children, element, attributes }: ElementProps<InlineKatexNode>) => {
    const renderEl = useRef<HTMLElement>(null);
    const { store, readonly } = useEditorStore();
    const [open, setOpen] = React.useState(false);
    const [, path] = useSelStatus(element);
    useEffect(() => {
      const value = Node.string(element);
      if (!renderEl.current) {
        return;
      }
      katex.render(value, renderEl.current!, {
        strict: false,
        output: 'html',
        throwOnError: false,
        macros: {
          '\\f': '#1f(#2)',
        },
      });
    }, [open]);

    if (process.env.NODE_ENV === 'test') {
      return <InlineChromiumBugfix />;
    }

    if (readonly) {
      return useMemo(
        () => (
          <span {...attributes} data-be={'inline-katex'} className={`relative`}>
            <span
              contentEditable={false}
              ref={renderEl}
              onClick={() => {
                Transforms.select(store.editor, Editor.end(store.editor, path));
              }}
            />
            <span
              style={{
                display: 'none',
              }}
            >
              <InlineChromiumBugfix />
              {children}
              <InlineChromiumBugfix />
            </span>
          </span>
        ),
        [element, element.children],
      );
    }
    return useMemo(
      () => (
        <span {...attributes} data-be={'inline-katex'} className={`relative`}>
          <Popover
            onOpenChange={setOpen}
            content={
              <span
                contentEditable={false}
                ref={renderEl}
                onClick={() => {
                  Transforms.select(
                    store.editor,
                    Editor.end(store.editor, path),
                  );
                }}
              />
            }
          >
            <span>
              <InlineChromiumBugfix />
              {children}
              <InlineChromiumBugfix />
            </span>
          </Popover>
        </span>
      ),
      [element, element.children],
    );
  },
);
