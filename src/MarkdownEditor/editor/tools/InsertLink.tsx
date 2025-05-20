/* eslint-disable @typescript-eslint/no-use-before-define */
import { DeleteOutlined } from '@ant-design/icons';
import { Input, InputRef, Modal, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';
import { Selection, Text, Transforms } from 'slate';
import { IEditor } from '../../BaseMarkdownEditor';
import { useSubject } from '../../hooks/subscribe';
import { useEditorStore } from '../store';
import { useGetSetState } from '../utils';
import { EditorUtils } from '../utils/editorUtils';
import { isLink, parsePath } from '../utils/path';

type DocItem = IEditor & { path: string; parentPath?: string };

/**
 * 插入链接组件
 *
 * @component
 * @example
 * <InsertLink />
 *
 * @description
 * 该组件用于在 Markdown 编辑器中插入链接。它使用 `useEditorStore` 获取编辑器的状态和引用，
 * 并使用 `useGetSetState` 管理组件的状态。组件通过 `useSubject` 监听 `store.openInsertLink$`，
 * 当触发时打开插入链接的模态框。用户可以输入链接或选择文档中的锚点来插入链接。
 *
 * @returns {JSX.Element | null} 如果 `state().open` 为 `false`，返回 `null`，否则返回模态框。
 *
 * @function
 * @name InsertLink
 *
 * @hook
 * @name useEditorStore
 * @description 获取编辑器的状态和引用。
 *
 * @hook
 * @name useGetSetState
 * @description 管理组件的状态。
 *
 * @hook
 * @name useSubject
 * @description 监听 `store.openInsertLink$`，当触发时打开插入链接的模态框。
 *
 * @hook
 * @name useCallback
 * @description 创建 `prevent` 和 `setPath` 回调函数。
 *
 * @hook
 * @name useRef
 * @description 创建 `selRef` 和 `inputRef` 引用。
 *
 * @param {WheelEvent} e - 滚轮事件，用于阻止默认行为。
 * @param {string} path - 链接路径，用于设置链接。
 * @param {string} url - 链接 URL，用于关闭模态框时设置链接。
 *
 * @typedef {Object} State
 * @property {boolean} open - 模态框是否打开。
 * @property {string} inputKeyword - 输入的关键字。
 * @property {string} oldUrl - 旧的 URL。
 * @property {number} index - 当前选择的索引。
 * @property {DocItem[]} docs - 文档列表。
 * @property {DocItem[]} filterDocs - 过滤后的文档列表。
 * @property {Array<{ item: DocItem; value: string }>} anchors - 锚点列表。
 * @property {Array<{ item: DocItem; value: string }>} filterAnchors - 过滤后的锚点列表。
 *
 * @typedef {Object} DocItem
 * @property {string} path - 文档路径。
 *
 * @typedef {Object} InputRef
 * @property {Function} focus - 聚焦输入框。
 */
export const InsertLink = observer(() => {
  const { store, openInsertLink$, setOpenLinkPanel, markdownEditorRef } =
    useEditorStore();
  const selRef = useRef<Selection>();
  const inputRef = useRef<InputRef>(null);

  const [state, setState] = useGetSetState({
    open: false,
    inputKeyword: '',
    oldUrl: '',
    index: 0,
    docs: [] as DocItem[],
    filterDocs: [] as DocItem[],
    anchors: [] as { item: DocItem; value: string }[],
    filterAnchors: [] as { item: DocItem; value: string }[],
  });

  const prevent = useCallback((e: WheelEvent) => {
    e.preventDefault();
  }, []);

  const setPath = useCallback((path: string) => {
    if (isLink(path)) {
      close(path);
    } else {
      const parse = parsePath(path);
      if (!parse.path && parse.hash) {
        return close('#' + parse.hash);
      }
      const realPath = parse.path;
      const relativePath = realPath;
      close(`${relativePath}${parse.hash ? `#${parse.hash}` : ''}`);
    }
  }, []);

  useSubject(openInsertLink$, (sel) => {
    if (store.domRect) {
      selRef.current = sel;
      store.container!.parentElement?.addEventListener('wheel', prevent, {
        passive: false,
      });

      const url = EditorUtils.getUrl(markdownEditorRef.current);
      let path = url;
      if (url && !url.startsWith('#') && !isLink(url)) {
        path = url;
      }
      const parse = parsePath(path);
      setState({
        oldUrl: url || '',
        open: true,
        filterDocs: [],
        docs: [],
        inputKeyword: path,
      });
      if (parse.hash) {
      } else {
        setState({
          filterAnchors: [],
          anchors: [],
        });
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 16);
    }
  });

  const close = useCallback((url?: string) => {
    store.container!.parentElement?.removeEventListener('wheel', prevent);
    setState({ open: false });
    EditorUtils.focus(markdownEditorRef.current);
    Transforms.setNodes(
      markdownEditorRef.current,
      { url },
      { match: Text.isText, split: true },
    );
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia === 'undefined') return;
    setOpenLinkPanel?.(false);
  }, []);

  if (!state().open) return null;

  return (
    <Modal
      onClose={() => {
        close(state().oldUrl);
      }}
      open={state().open}
      onOk={(e) => {
        e.preventDefault();
        if (isLink(state().inputKeyword)) {
          close(state().inputKeyword);
        } else {
          if (state().anchors.length) {
            const target = state().filterAnchors[state().index];
            if (target) {
              setPath(target.item.path + target.value);
            }
          } else {
            const target = state().filterDocs[state().index];
            if (target) {
              setPath(target.path);
            } else {
              close(state().inputKeyword);
            }
          }
        }
      }}
      onCancel={() => {
        close(state().oldUrl);
      }}
      style={{
        pointerEvents: 'auto',
        width: 370,
      }}
      title=" "
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 6px',
          width: '100%',
          gap: 8,
        }}
      >
        <Input.TextArea
          ref={inputRef}
          value={state().inputKeyword}
          spellCheck={false}
          onKeyDown={(e) => {
            if (
              e.key.toLowerCase() === 'backspace' &&
              state().anchors.length &&
              (e.metaKey ||
                e.altKey ||
                state().inputKeyword.endsWith('#') ||
                !state().inputKeyword.includes('#'))
            ) {
              setState({
                anchors: [],
                filterAnchors: [],
              });
            }
          }}
          onChange={(e) => {
            const key = e.target.value.toLowerCase();
            if (state().anchors.length) {
              const parse = parsePath(key);
              const filterAnchors = state().anchors.filter((d) => {
                return (
                  !parse.hash || d.value.toLowerCase().includes(parse.hash)
                );
              });
              setState({
                filterAnchors,
              });
            } else {
              const filterDocs = state().docs.filter((d) => {
                return d.path.toLowerCase().includes(key);
              });
              setState({
                filterDocs,
              });
            }
            setState({
              inputKeyword: e.target.value,
              index: 0,
            });
          }}
          style={{
            flex: 1,
          }}
        />
        <Tooltip title={'移除链接'}>
          <div
            style={{
              cursor: 'pointer',
              fontSize: '1.1em',
              color: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => {
              close();
            }}
          >
            <DeleteOutlined />
          </div>
        </Tooltip>
      </div>
    </Modal>
  );
});
