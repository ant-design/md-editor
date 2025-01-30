/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDebounceFn } from '@ant-design/pro-components';
import { runInAction } from 'mobx';
import React, { useRef } from 'react';
import { Subject } from 'rxjs';
import {
  BaseOperation,
  BaseSelection,
  Editor,
  Element,
  NodeEntry,
  Path,
  Range,
} from 'slate';
import { Elements } from '../../el';
import { EditorStore } from '../store';
import { schemaToMarkdown } from '../utils';

export const selChange$ = new Subject<{
  sel: BaseSelection;
  node: NodeEntry<any>;
} | null>();
const floatBarIgnoreNode = new Set(['code-line']);

/**
 * 用于处理编辑器内容变化的自定义钩子函数。
 *
 * @param editor - Slate 编辑器实例。
 * @param store - 编辑器状态存储实例。
 * @param onChange - 可选的回调函数，当编辑器内容变化时调用，传递 Markdown 格式的内容和元素数组。
 *
 * @returns 一个函数，用于处理编辑器内容变化。
 */
export function useOnchange(
  editor: Editor,
  store: EditorStore,
  onChange?: (value: string, schema: Elements[]) => void,
) {
  const rangeContent = useRef('');
  const onChangeDebounce = useDebounceFn(async () => {
    if (!onChange) return;
    onChange?.(schemaToMarkdown(editor.children), editor.children);
  }, 300);

  const setSelDebounce = useDebounceFn(async () => {
    runInAction(() => {
      if (typeof window === 'undefined') return;
      if (typeof window.matchMedia === 'undefined') return;
      store.sel = editor.selection;
    });
  }, 300);
  const selChange = useDebounceFn(
    async (changeSel: { sel: BaseSelection; node: NodeEntry<any> }) => {
      selChange$.next(changeSel);
    },
    160,
  );
  return React.useMemo(() => {
    return (_value: any, _operations: BaseOperation[]) => {
      if (onChangeDebounce) {
        onChangeDebounce.cancel();
        onChangeDebounce?.run(schemaToMarkdown(_value), _value);
      }
      const sel = editor.selection;
      const [node] = Editor.nodes<Element>(editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });

      // 选区变化
      selChange.cancel();
      selChange.run({
        sel,
        node,
      });
      setSelDebounce.cancel();
      setSelDebounce.run();
      // ------选区变化end----------

      if (!node) return;

      if (
        sel &&
        !floatBarIgnoreNode.has(node[0].type) &&
        !Range.isCollapsed(sel) &&
        Path.equals(Path.parent(sel.focus.path), Path.parent(sel.anchor.path))
      ) {
        const domSelection = window.getSelection();
        const domRange = domSelection?.getRangeAt(0);
        store.setState(
          (state) => (state.refreshFloatBar = !state.refreshFloatBar),
        );
        rangeContent.current = domRange?.toString() || '';
        const rect = domRange?.getBoundingClientRect();
        if (rect) {
          store.setState((state) => {
            state.domRect = rect;
          });
        }
      } else if (store.domRect) {
        rangeContent.current = '';
        store.setState((state) => (state.domRect = null));
      }

      if (node && node[0].type === 'table-cell') {
        store.setState((state) => {
          state.tableCellNode = node;
        });
      } else if (store.tableCellNode) {
        store.setState((state) => {
          state.tableCellNode = null;
        });
      }
    };
  }, [editor]);
}
