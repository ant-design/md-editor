import isHotkey from 'is-hotkey';
import React, { useMemo } from 'react';
import {
  BaseEditor,
  Editor,
  Element,
  Node,
  Path,
  Range,
  Transforms,
} from 'slate';
import { HistoryEditor } from 'slate-history';
import { MarkdownEditorProps } from '../../BaseMarkdownEditor';
import { ReactEditor } from '../slate-react';
import { EditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { keyArrow } from './hotKeyCommands/arrow';
import { BackspaceKey } from './hotKeyCommands/backspace';
import { EnterKey } from './hotKeyCommands/enter';
import { MatchKey } from './hotKeyCommands/match';
import { TabKey } from './hotKeyCommands/tab';

import { useEditorStore } from '../store';

export const useKeyboard = (
  store: EditorStore,
  markdownEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >,
  props: MarkdownEditorProps,
) => {
  return useMemo(() => {
    const {
      openInsertCompletion,
      insertCompletionText$,
      setOpenInsertCompletion,
    } = useEditorStore();
    const tab = new TabKey(markdownEditorRef.current);
    const backspace = new BackspaceKey(markdownEditorRef.current);
    const enter = new EnterKey(store, backspace);
    const match = new MatchKey(markdownEditorRef.current);
    return (e: React.KeyboardEvent) => {
      if (openInsertCompletion && (isHotkey('up', e) || isHotkey('down', e))) {
        e.preventDefault();
        return;
      }
      if (isHotkey('mod+z', e) || isHotkey('mod+shift+z', e)) {
        store.doManual();
      }
      if (isHotkey('mod+ArrowDown', e)) {
        e.preventDefault();
        Transforms.select(
          markdownEditorRef.current,
          Editor.end(markdownEditorRef.current, []),
        );
      }
      if (isHotkey('mod+ArrowUp', e)) {
        e.preventDefault();
        Transforms.select(
          markdownEditorRef.current,
          Editor.start(markdownEditorRef.current, []),
        );
      }
      if (isHotkey('backspace', e) && markdownEditorRef.current.selection) {
        if (Range.isCollapsed(markdownEditorRef.current.selection)) {
          if (backspace.run()) {
            e.stopPropagation();
            e.preventDefault();
          }
        } else {
          if (backspace.range()) e.preventDefault();
        }
      }
      if (isHotkey('mod+shift+v', e)) {
        e.preventDefault();
      }
      if (isHotkey('mod+alt+v', e) || isHotkey('mod+opt+v', e)) {
        e.preventDefault();
      }
      if (isHotkey('mod+shift+s', e)) {
        e.preventDefault();
      }
      if (props?.markdown?.matchInputToNode) {
        match.run(e);
      }

      if (e.key.toLowerCase().startsWith('arrow')) {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) return;
        return;
        keyArrow(store, e);
      } else {
        if (e.key === 'Tab') tab.run(e);
        if (props.textAreaProps?.triggerSendKey === 'Enter') {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.stopPropagation();
            e.preventDefault();
            enter.run(e);
          }
        } else if (props.textAreaProps?.triggerSendKey === 'Mod+Enter') {
          if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
            e.stopPropagation();
            e.preventDefault();
            enter.run(e);
          }
        } else {
          if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
            e.stopPropagation();
            e.preventDefault();
            enter.run(e);
          }
        }
        const [node] = Editor.nodes<any>(markdownEditorRef.current, {
          match: (n) => Element.isElement(n),
          mode: 'lowest',
        });
        if (!node) return;
        if (node[0].type === 'paragraph') {
          const [node] = Editor.nodes<any>(markdownEditorRef.current, {
            match: (n) => Element.isElement(n) && n.type === 'paragraph',
            mode: 'lowest',
          });
          if (
            node &&
            node[0].children.length === 1 &&
            !EditorUtils.isDirtLeaf(node[0].children[0]) &&
            (e.key === 'Backspace' || /^[^\n]$/.test(e.key))
          ) {
            let str = Node.string(node[0]) || '';
            const codeMatch = str.match(/^```([\w+\-#]+)$/i);
            if (codeMatch) {
            } else {
              const insertMatch = str.match(/^\/([^\n]+)?$/i);
              if (
                insertMatch &&
                !(
                  !Path.hasPrevious(node[1]) &&
                  Node.parent(markdownEditorRef.current, node[1]).type ===
                    'list-item'
                )
              ) {
                setOpenInsertCompletion?.(true);
                setTimeout(() => {
                  insertCompletionText$.next(insertMatch[1]);
                });
              }
            }
          }
        }
      }
    };
  }, [markdownEditorRef.current]);
};
