import katex from 'katex';
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { useEditorStore } from '../../../../MarkdownEditor/editor/store';
import { EditorUtils } from '../../../../MarkdownEditor/editor/utils/editorUtils';
import { CodeNode } from '../../../../MarkdownEditor/el';
import './katex.min.css';

export const Katex = observer((props: { el: CodeNode }) => {
  const { store } = useEditorStore();
  const [state, setState] = useGetSetState({
    code: '',
    error: '',
  });
  const divRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  useEffect(() => {
    const code = props.el.value || '';
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setState({
          code: code,
        });
        if (state().code) {
          try {
            if (divRef.current) {
              katex.render(state().code, divRef.current!, {
                strict: false,
                output: 'htmlAndMathml',
                throwOnError: false,
                displayMode: true,
                macros: {
                  '\\f': '#1f(#2)',
                },
              });
            }
          } catch (e) {
            console.log('err', e);
          }
        } else {
          setState({ error: '' });
        }
      },
      !state().code ? 0 : 300,
    );
    return () => window.clearTimeout(timer.current);
  }, [props.el]);
  return (
    <div
      style={{
        marginBottom: '0.75em',
        cursor: 'default',
        userSelect: 'none',
        textAlign: 'center',
        backgroundColor: 'rgba(107, 114, 128, 0.05)',
        paddingTop: '1em',
        paddingBottom: '1em',
        borderRadius: '0.25em',
      }}
      onClick={() => {
        const editor = store.codes.get(props.el);
        if (editor) {
          EditorUtils.focusAceEnd(editor);
        }
      }}
      contentEditable={false}
    >
      <div
        ref={divRef}
        className={`${!state().code.trim() ? 'hidden' : ''} katex-container`}
      />
      {!state().code.trim() && (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>Formula</div>
      )}
    </div>
  );
});
