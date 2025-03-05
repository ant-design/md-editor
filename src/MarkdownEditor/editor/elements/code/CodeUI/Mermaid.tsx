import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { CodeNode } from '../../../../el';
import { useEditorStore } from '../../../store';
import { EditorUtils } from '../../../utils/editorUtils';

export const MermaidElement = observer((props: { el: CodeNode }) => {
  const { store } = useEditorStore();
  const [state, setState] = useGetSetState({
    code: '',
    error: '',
  });
  const divRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const id = useMemo(
    () => 'm' + (Date.now() + Math.ceil(Math.random() * 1000)),
    [],
  );
  const render = useCallback(async () => {
    const mermaid = await import('mermaid').then((module) => module.default);
    mermaid
      .render(id, state().code)
      .then((res) => {
        setState({ error: '' });
        divRef.current!.innerHTML = res.svg;
      })
      .catch(() => {
        mermaid.parse(state().code).catch((e) => {
          setState({ error: e.toString(), code: '' });
        });
      })
      .finally(() => {
        document.querySelector('#d' + id)?.classList.add('hidden');
      });
  }, []);

  useEffect(() => {
    const code = props.el.value || '';
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
  }, [props.el]);

  return (
    <div
      style={{
        marginBottom: '0.75em',
        cursor: 'default',
        userSelect: 'none',
        padding: '0.75rem 0',
        backgroundColor: 'rgba(15, 17, 20, 0.05)',
        borderRadius: '0.25em',
        display: 'flex',
        justifyContent: 'center',
      }}
      contentEditable={false}
      onClick={() => {
        const editor = store.codes.get(props.el);
        if (editor) {
          EditorUtils.focusAceEnd(editor);
        }
      }}
    >
      <div
        contentEditable={false}
        ref={divRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          visibility: state().code && !state().error ? 'visible' : 'hidden',
        }}
      ></div>
      {state().error && (
        <div style={{ textAlign: 'center', color: 'rgba(239, 68, 68, 0.8)' }}>
          {state().error}
        </div>
      )}
      {!state().code && !state().error && (
        <div style={{ textAlign: 'center', color: '#6B7280' }}>Empty</div>
      )}
    </div>
  );
});
