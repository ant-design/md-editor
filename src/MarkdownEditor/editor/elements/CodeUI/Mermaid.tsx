import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { CodeLineNode, CodeNode } from '../../../el';

export const Mermaid = observer(
  (props: { lines: CodeLineNode[]; el: CodeNode }) => {
    const editor = useSlateStatic();
    const [state, setState] = useGetSetState({
      code: '',
      error: '',
    });
    const divRef = React.useRef<HTMLDivElement>(null);
    const timer = useRef(0);

    const render = useCallback(() => {}, []);

    useEffect(() => {
      const code = props.lines.map((c) => Node.string(c)).join('\n');
      if (state().code !== code) {
        clearTimeout(timer.current);
        timer.current = window.setTimeout(
          () => {
            setState({ code: code });
            if (state().code) {
              render();
            } else {
              setState({ error: '' });
            }
          },
          !state().code ? 0 : 300,
        );
      }
      return () => window.clearTimeout(timer.current);
    }, [props.lines]);
    return (
      <div
        className={'mermaid-container'}
        contentEditable={false}
        onClick={() => {
          Transforms.select(
            editor,
            Editor.start(editor, ReactEditor.findPath(editor, props.el)),
          );
        }}
      >
        <div
          contentEditable={false}
          ref={divRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
          className={`${state().code && !state().error ? '' : 'hidden'}`}
        ></div>
        {state().error && (
          <div
            style={{
              textAlign: 'center',
              color: 'red',
            }}
          >
            {state().error}
          </div>
        )}
        {!state().code && !state().error && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: 'rgba(0,0,0,.4)',
              background: 'rgba(0,0,0,.05)',
            }}
          >
            Empty
          </div>
        )}
      </div>
    );
  },
);
