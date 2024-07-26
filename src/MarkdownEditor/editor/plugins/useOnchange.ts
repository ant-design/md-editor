/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { toMarkdown } from '../utils';

export const selChange$ = new Subject<{
  sel: BaseSelection;
  node: NodeEntry<any>;
} | null>();
const floatBarIgnoreNode = new Set(['code-line']);

export function useOnchange(
  editor: Editor,
  store: EditorStore,
  onChange?: (value: string, schema: Elements[]) => void,
) {
  const rangeContent = useRef('');
  return React.useMemo(() => {
    return (_value: any, _operations: BaseOperation[]) => {
      if (onChange) {
        onChange(toMarkdown(_value), _value);
      }
      const sel = editor.selection;
      const [node] = Editor.nodes<Element>(editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });
      setTimeout(() => {
        selChange$.next({
          sel,
          node,
        });
      });

      runInAction(() => (store.sel = sel));
      if (!node) return;
      setTimeout(() => {
        selChange$.next({
          sel,
          node,
        });
      });

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
          store.setState((state) => (state.domRect = rect));
        }
      } else if (store.domRect) {
        rangeContent.current = '';
        store.setState((state) => (state.domRect = null));
      }

      if (node && node[0].type === 'media') {
        store.mediaNode$.next(node);
      } else {
        store.mediaNode$.next(null);
      }
      if (node && node[0].type === 'table-cell') {
        store.setState((state) => {
          state.tableCellNode = node;
          state.refreshTableAttr = !state.refreshTableAttr;
        });
      } else if (store.tableCellNode) {
        store.setState((state) => {
          state.tableCellNode = null;
          state.refreshTableAttr = !state.refreshTableAttr;
        });
      }

      if (node && node[0].type === 'chart') {
        store.chartNode = node;
      } else if (store.chartNode) {
        store.chartNode = null;
      }
    };
  }, [editor]);
}
