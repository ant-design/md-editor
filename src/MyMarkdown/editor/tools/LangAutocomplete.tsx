/* eslint-disable @typescript-eslint/no-use-before-define */
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { useSubject } from '../../hooks/subscribe';
import { useEditorStore } from '../store';
import { getOffsetLeft, getOffsetTop } from '../utils/dom';
import { useLocalState } from '../utils/useLocalState';
import { langIconMap } from './langIconMap';

const list = Array.from(langIconMap)
  .map((item) => {
    return { icon: item[1], lang: item[0] };
  })
  .sort((a, b) => (a.lang > b.lang ? 1 : -1));
export const LangAutocomplete = observer(() => {
  const store = useEditorStore();
  const dom = useRef<HTMLDivElement>(null);
  const path = useRef<number[]>([]);
  const [state, setState] = useLocalState({
    index: -1,
    showOptions: [] as { icon: string; lang: string }[],
    left: 0,
    top: 0 as number | undefined,
    bottom: 0 as number | undefined,
    text: '',
  });
  const keydown = useCallback((e: KeyboardEvent) => {
    if (
      state.showOptions.length &&
      (e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
      e.preventDefault();
      if (e.key === 'ArrowUp' && state.index > 0) {
        setState({ index: state.index - 1 });
        const target = dom.current!.children[state.index] as HTMLDivElement;
        if (dom.current!.scrollTop > target.offsetTop) {
          dom.current!.scroll({
            top: dom.current!.scrollTop - 160 + 30,
          });
        }
      }
      if (e.key === 'ArrowDown' && state.index < state.showOptions.length - 1) {
        setState({ index: state.index + 1 });
        const target = dom.current!.children[state.index] as HTMLDivElement;
        if (
          target.offsetTop >
          dom.current!.scrollTop + dom.current!.clientHeight - 30
        ) {
          dom.current!.scroll({
            top: target.offsetTop,
          });
        }
      }
    }
    if (e.key === 'Enter' && store.openLangCompletion) {
      e.preventDefault();
      const current = state.showOptions[state.index];
      createCodeFence(current ? current.lang : state.text);
    }
  }, []);
  useSubject(store.langCompletionText, (text) => {
    let tempText = text || '';
    setState({
      index: -1,
      text: tempText,
      showOptions: list.filter((l) =>
        l.lang.startsWith(tempText.toLowerCase()),
      ),
    });
  });
  useEffect(() => {
    if (store.openLangCompletion) {
      // @ts-ignore
      const [node] = Editor.nodes<any>(store.editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });
      path.current = node[1];
      window.addEventListener('keydown', keydown);
      if (node[0].type === 'paragraph') {
        const el = ReactEditor.toDOMNode(store.editor, node[0]);
        if (el) {
          let top = getOffsetTop(el, store.container!);
          if (
            top >
            store.container!.scrollTop +
              store.container!.clientHeight -
              164 -
              el.clientHeight
          ) {
            setState({
              top: undefined,
              bottom: -(top - store.container!.clientHeight),
              left: getOffsetLeft(el, store.container!),
            });
          } else {
            setState({
              left: getOffsetLeft(el, store.container!),
              top: top + el.clientHeight,
              bottom: undefined,
            });
          }
        }
      }
    } else {
      window.removeEventListener('keydown', keydown);
    }
  }, [store.openLangCompletion]);

  const createCodeFence = useCallback((lang: string) => {
    Transforms.delete(store.editor, { at: path.current });
    Transforms.insertNodes(
      store.editor,
      {
        type: 'code',
        language: lang,
        children: [{ type: 'code-line', children: [{ text: '' }] }],
      },
      { at: path.current, select: true },
    );
    runInAction(() => (store.openLangCompletion = false));
    ReactEditor.focus(store.editor);
  }, []);
  return (
    <div
      ref={dom}
      className={`
      ${!store.openLangCompletion || !state.showOptions.length ? 'hidden' : ''}
      absolute z-50 w-40 max-h-40 overflow-y-auto ctx-panel
      rounded-lg py-1 text-gray-700/90 dark:text-gray-300 dark:border-gray-200/10
      `}
      style={{
        left: state.left,
        top: state.top,
        bottom: state.bottom,
      }}
    >
      {state.showOptions.map((l, i) => (
        <div
          key={l.lang}
          className={`px-2 py-1.5 flex items-center cursor-pointer
          ${i === state.index ? 'bg-gray-100 dark:bg-gray-300/10' : ''}`}
          onMouseEnter={() => setState({ index: i })}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createCodeFence(l.lang);
          }}
        >
          <img src={l.icon} alt="" className={'w-4 h-4 mr-1.5'} />
          <span>{l.lang}</span>
        </div>
      ))}
    </div>
  );
});
