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
import { BackspaceKey } from './hotKeyCommands/backspace';
import { EnterKey } from './hotKeyCommands/enter';
import { MatchKey } from './hotKeyCommands/match';
import { TabKey } from './hotKeyCommands/tab';

import { useEditorStore } from '../store';

/**
 * 用于处理 Markdown 编辑器中的键盘事件的自定义 Hook。
 *
 * 该 Hook 负责拦截和处理各种键盘快捷键（如 Tab、Backspace、Enter、方向键等），
 * 并根据编辑器状态和配置执行相应的操作，如移动光标、插入特殊字符、触发补全面板等。
 *
 * @param store 编辑器的全局状态管理对象
 * @param markdownEditorRef 指向编辑器实例的 ref
 * @param props 编辑器的属性配置
 * @returns 返回一个用于绑定到编辑器组件的键盘事件处理函数
 */
export const useKeyboard = (
  store: EditorStore,
  markdownEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >,
  props: MarkdownEditorProps,
) => {
  const {
    openInsertCompletion,
    insertCompletionText$,
    setOpenInsertCompletion,
  } = useEditorStore();
  return useMemo(() => {
    const tab = new TabKey(markdownEditorRef.current);
    const backspace = new BackspaceKey(markdownEditorRef.current);
    const enter = new EnterKey(store, backspace);
    const match = new MatchKey(markdownEditorRef.current);
    return (e: React.KeyboardEvent) => {
      if (openInsertCompletion && (isHotkey('up', e) || isHotkey('down', e))) {
        e.preventDefault();
        return;
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
            return;
          }
        }
        if (backspace.range()) {
          e.stopPropagation();
          e.preventDefault();
          return;
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
        return;
      }

      if (e.key.toLowerCase().startsWith('arrow')) {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) return;
        // 处理 tag 前的空格插入
        if (e.key === 'ArrowLeft') {
          const selection = markdownEditorRef.current.selection;
          if (selection && Range.isCollapsed(selection)) {
            const [node] = Editor.nodes(markdownEditorRef.current, {
              at: selection.focus.path,
              match: (n) => n.tag === true,
            });

            if (node) {
              const [tagNode, tagPath] = node;
              const offset = selection.focus.offset;
              // 当光标在 tag 开始位置时，检查前面是否需要插入空格
              if (offset === 0) {
                const [prevNode] =
                  Editor.previous(markdownEditorRef.current, { at: tagPath }) ||
                  [];
                if (!prevNode || !(prevNode as any).text?.endsWith('\uFEFF')) {
                  e.preventDefault();
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    [{ text: '\uFEFF' }],
                    {
                      at: tagPath,
                      select: true,
                    },
                  );
                  return;
                }
              }
            }
          }
        }
        return;
      }

      if (e.key === 'Tab') tab.run(e);

      if (props.textAreaProps?.triggerSendKey === 'Enter') {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.stopPropagation();
          e.preventDefault();
          enter.run(e);
          return;
        }
        return;
      }
      if (props.textAreaProps?.triggerSendKey === 'Mod+Enter') {
        if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
          e.stopPropagation();
          e.preventDefault();
          enter.run(e);
        }
        return;
      }
      if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
        e.stopPropagation();
        e.preventDefault();
        enter.run(e);
      }

      const [node] = Editor.nodes<any>(markdownEditorRef.current, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });
      if (!node) return;
      if (node?.[0]?.type === 'paragraph') {
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
    };
  }, [markdownEditorRef.current]);
};
