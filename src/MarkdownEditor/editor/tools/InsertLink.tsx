/* eslint-disable @typescript-eslint/no-use-before-define */
import { DeleteOutlined } from '@ant-design/icons';
import { Input, InputRef, Modal, Tooltip } from 'antd';
import isHotkey from 'is-hotkey';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';

import { Selection, Text, Transforms } from 'slate';
import { IEditor } from '../..';
import { useSubject } from '../../hooks/subscribe';
import { useEditorStore } from '../store';
import { useGetSetState } from '../utils';
import { EditorUtils } from '../utils/editorUtils';
import { isLink, parsePath } from '../utils/path';

type DocItem = IEditor & { path: string; parentPath?: string };

const width = 370;

/**
 * 链接的配置面板
 */
export const InsertLink = observer(() => {
  const { store, markdownEditorRef } = useEditorStore();
  const selRef = useRef<Selection>();
  const inputRef = useRef<InputRef>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useGetSetState({
    open: false,
    left: 0,
    y: 0,
    mode: 'top',
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

  const keydown = React.useCallback((e: KeyboardEvent) => {
    if (isHotkey('esc', e)) {
      close(state().oldUrl);
    }
    if (isHotkey('tab', e) && !isLink(state().inputKeyword)) {
      if (state().filterAnchors.length) {
        const target = state().filterAnchors[state().index];
        if (target) {
          e.preventDefault();
          setState({ inputKeyword: target.item.path + target.value });
        }
      } else {
        const target = state().filterDocs[state().index];
        if (target) {
          e.preventDefault();
          setState({ inputKeyword: target.path });
        }
      }
    }
    if (isHotkey('up', e)) {
      e.preventDefault();
      if (
        (state().filterDocs.length || state().filterAnchors.length) &&
        state().index > 0
      ) {
        setState({
          index: state().index - 1,
        });
      }
    }
    if (isHotkey('down', e)) {
      e.preventDefault();
      if (state().anchors.length) {
        if (state().index < state().filterAnchors.length - 1) {
          setState({
            index: state().index + 1,
          });
        }
      } else if (state().index < state().filterDocs.length - 1) {
        setState({
          index: state().index + 1,
        });
      }
    }
    if (isHotkey('enter', e)) {
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
    }
    const target = scrollRef.current?.children?.[
      state()?.index
    ] as HTMLDivElement;
    if (target) {
      const { scrollTop, clientHeight } = scrollRef.current!;
      if (target.offsetTop > scrollTop + clientHeight - 50) {
        scrollRef.current!.scroll({
          top: target.offsetTop,
        });
      }
      if (target.offsetTop < scrollTop) {
        scrollRef.current!.scroll({
          top: target.offsetTop - 150,
        });
      }
    }
  }, []);

  useSubject(store.openInsertLink$, (sel) => {
    if (store.domRect) {
      selRef.current = sel;
      store.container!.parentElement?.addEventListener('wheel', prevent, {
        passive: false,
      });
      const mode =
        window.innerHeight - store.domRect.top - store.domRect.height < 230
          ? 'bottom'
          : 'top';
      let y =
        mode === 'bottom'
          ? window.innerHeight - store.domRect.top + 5
          : store.domRect.top + store.domRect.height + 5;
      let left = store.domRect.x;
      left = left - (width - store.domRect.width) / 2;
      if (left > window.innerWidth - width)
        left = window.innerWidth - width - 4;
      if (left < 4) left = 4;
      if (left + width > window.innerWidth - 4) {
        left = window.innerWidth - 4 - width;
      }

      const url = EditorUtils.getUrl(markdownEditorRef.current);
      let path = url;
      if (url && !url.startsWith('#') && !isLink(url)) {
        path = url;
      }
      const parse = parsePath(path);
      setState({
        left,
        y: y,
        oldUrl: url || '',
        mode,
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
      window.addEventListener('keydown', keydown);
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
    window.removeEventListener('keydown', keydown);
    runInAction(() => {
      if (typeof window === 'undefined') return;
      if (typeof window.matchMedia === 'undefined') return;
      store.openLinkPanel = false;
    });
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
      title="设置超链接"
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
