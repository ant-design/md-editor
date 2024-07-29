import {
  BoldOutlined,
  CaretDownOutlined,
  ClearOutlined,
  CodeOutlined,
  ItalicOutlined,
  LinkOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editor, Element, NodeEntry, Transforms } from 'slate';
import { keyTask$ } from '../../index';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { getInsertOptions } from './InsertAutocomplete';

const tools = [
  {
    type: 'bold',
    icon: (<BoldOutlined />) as React.ReactNode,
  },
  {
    type: 'italic',
    icon: <ItalicOutlined />,
  },
  {
    type: 'strikethrough',
    icon: <StrikethroughOutlined />,
  },
  {
    type: 'code',
    icon: <CodeOutlined />,
  },
];

const colors = [
  { color: 'rgba(16,185,129,1)' },
  { color: 'rgba(245,158,11,1)' },
  { color: 'rgba(59,130,246,1)' },
  { color: 'rgba(156,163,175,.8)' },
  { color: 'rgba(99,102, 241,1)' },
  { color: 'rgba(244,63,94,1)' },
  { color: 'rgba(217,70,239,1)' },
  { color: 'rgba(14, 165, 233, 1)' },
];

/**
 * 基础工具栏
 * @param props
 * @returns
 */
export const BaseToolBar = observer(
  (props: {
    prefix?: string;
    showInsertAction?: boolean;
    extra?: React.ReactNode[];
  }) => {
    const store = useEditorStore();

    const [, setRefresh] = React.useState(false);
    const [openSelectColor, setOpenSelectColor] = React.useState(false);

    const el = useRef<NodeEntry<any>>();

    const openLink = useCallback(() => {
      const sel = store.editor.selection!;
      el.current = Editor.parent(store.editor, sel.focus.path);
      store.highlightCache.set(el.current[0], [{ ...sel, highlight: true }]);
      store.openInsertLink$.next(sel);
      runInAction(() => {
        store.refreshHighlight = !store.refreshHighlight;
        store.openLinkPanel = true;
      });
    }, []);

    useEffect(() => {
      setRefresh((r) => !r);
    }, [store.refreshFloatBar]);

    const insert = useCallback((op: any) => {
      const [node] = Editor.nodes<any>(store.editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });
      if (!node) {
        return;
      }
      const path = node[1];

      if (op.task === 'image' || op.task === 'attachment') {
        return;
      } else if (op) {
        Transforms.insertText(store.editor, '', {
          at: {
            anchor: Editor.start(store.editor, path),
            focus: Editor.end(store.editor, path),
          },
        });

        keyTask$.next({
          key: op.task,
          args: op.args,
        });
        runInAction(() => {
          store.openInsertCompletion = false;
        });
      }
    }, []);

    const highColor = React.useMemo(() => {
      if (typeof localStorage === 'undefined') return undefined;
      return localStorage.getItem('high-color');
    }, [EditorUtils.isFormatActive(store.editor, 'highColor')]);

    const baseClassName = props.prefix || `toolbar-action`;

    const insertOptions = useMemo(
      () =>
        props.showInsertAction
          ? getInsertOptions({
              isTop: false,
            })
              .map((o) => o.children)
              .flat(1)
          : [],
      [],
    );

    return (
      <>
        {!openSelectColor && (
          <div
            style={{
              display: 'flex',
              height: '100%',
              gap: '1px',
              alignItems: 'center',
            }}
          >
            {insertOptions
              .filter(
                //@ts-ignore
                (item) => item.task !== 'image' && item.task !== 'attachment',
              )
              .map((t) => {
                return (
                  <div
                    role="button"
                    key={t.key}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      insert(t);
                    }}
                    className={`${baseClassName}-item`}
                  >
                    {t.icon}
                  </div>
                );
              })}
            <Divider
              type="vertical"
              style={{
                margin: '0 8px',
                height: '16px',
                borderColor: 'rgba(0,0,0,0.35)',
              }}
            />
            <div role="button" className={`${baseClassName}-item`}>
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  fontWeight: EditorUtils.isFormatActive(
                    store.editor,
                    'highColor',
                  )
                    ? 'bold'
                    : undefined,
                  textDecoration: 'underline solid ' + highColor,
                  textDecorationLine: 'underline',
                  textDecorationThickness: 2,
                }}
                role="button"
                onMouseEnter={(e) => e.stopPropagation()}
                onClick={() => {
                  if (EditorUtils.isFormatActive(store.editor, 'highColor')) {
                    EditorUtils.highColor(store.editor);
                  } else {
                    EditorUtils.highColor(store.editor, highColor || '#10b981');
                  }
                }}
              >
                A
              </div>
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  fontSize: 12,
                }}
                onClick={() => {
                  setOpenSelectColor(true);
                }}
              >
                <CaretDownOutlined />
              </div>
            </div>
            {tools.map((t) => (
              <div
                role="button"
                key={t.type}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  EditorUtils.toggleFormat(store.editor, t.type);
                }}
                className={`${baseClassName}-item`}
                style={{
                  color: EditorUtils.isFormatActive(store.editor, t.type)
                    ? '#000'
                    : undefined,
                }}
              >
                {t.icon}
              </div>
            ))}
            <Divider
              type="vertical"
              style={{
                margin: '0 8px',
                height: '16px',
                borderColor: 'rgba(0,0,0,0.35)',
              }}
            />
            <div
              role="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                openLink();
              }}
              className={`${baseClassName}-item`}
              style={{
                color: EditorUtils.isFormatActive(store.editor, 'url')
                  ? '#000'
                  : undefined,
              }}
            >
              <LinkOutlined />
              <span>Link</span>
            </div>
            <Divider
              type="vertical"
              style={{
                margin: '0 8px',
                height: '16px',
                borderColor: 'rgba(0,0,0,0.35)',
              }}
            />
            <div
              role="button"
              className={`${baseClassName}-item`}
              onClick={() => {
                EditorUtils.clearMarks(store.editor, true);
                EditorUtils.highColor(store.editor);
              }}
            >
              <ClearOutlined />
            </div>
            {props.extra ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {props.extra?.map((item, index) => {
                  return (
                    <div className={`${baseClassName}-item`} key={index}>
                      {item}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
        {openSelectColor && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              className={`${baseClassName}-item`}
              style={{
                cursor: 'pointer',
              }}
              role="button"
              onClick={() => {
                EditorUtils.highColor(store.editor);
                setOpenSelectColor(false);
              }}
            >
              /
            </div>
            {colors.map((c) => (
              <div
                role="button"
                className={`${baseClassName}-item-color`}
                key={c.color}
                style={{ backgroundColor: c.color, cursor: 'pointer' }}
                onClick={() => {
                  localStorage.setItem('high-color', c.color);
                  EditorUtils.highColor(store.editor, c.color);
                  setOpenSelectColor(false);
                }}
              />
            ))}
          </div>
        )}
      </>
    );
  },
);
