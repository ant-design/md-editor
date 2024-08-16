import {
  BoldOutlined,
  ClearOutlined,
  ItalicOutlined,
  LinkOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { ColorPicker, Divider, Dropdown } from 'antd';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editor, Element, NodeEntry, Transforms } from 'slate';
import { keyTask$ } from '../../index';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { getInsertOptions } from './InsertAutocomplete';

const LineCode = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="1.3em"
      height="1.3em"
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M153.770667 517.558857l200.387047-197.241905L302.86019 268.190476 48.761905 518.290286l254.439619 243.614476 50.590476-52.833524-200.021333-191.512381zM658.285714 320.316952L709.583238 268.190476l254.098286 250.09981L709.241905 761.904762l-50.590476-52.833524 200.021333-191.512381L658.285714 320.316952z m-112.981333-86.186666L393.99619 785.554286l70.534096 19.358476 151.30819-551.399619-70.534095-19.358476z"
      ></path>
    </svg>
  );
};

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
    icon: <LineCode />,
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
    const [highColor, setHighColor] = React.useState<string | null>(null);

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
    const [node] = Editor.nodes<any>(store.editor, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });
    const isHeader = node && node[0].type === 'head';

    const insert = useCallback((op: any) => {
      const [node] = Editor.nodes<any>(store.editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest',
      });
      if (!node) {
        return;
      }
      const path = node[1];
      if (op.task === 'uploadImage') {
        keyTask$.next({
          key: op.task,
          args: op.args,
        });
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

    useEffect(() => {
      if (typeof localStorage === 'undefined') return undefined;
      setHighColor(localStorage.getItem('high-color'));
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
              .filter((o) => {
                if (!store.editorProps?.image && o.task === 'uploadImage') {
                  return false;
                }
                return true;
              })
          : [],
      [store.editorProps],
    );
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '1px',
          alignItems: 'center',
        }}
      >
        {isHeader ? (
          <Dropdown
            menu={{
              items: ['H1', 'H2', 'H3'].map((item, index) => {
                return {
                  label: item,
                  key: item,
                  onClick: () => {
                    Transforms.setNodes(
                      store.editor,
                      {
                        type: 'head',
                        level: index + 1,
                      },
                      {
                        match: (n) => Element.isElement(n) && n.type === 'head',
                        at: node[1],
                      },
                    );
                  },
                };
              }),
            }}
          >
            <div role="button" className={`${baseClassName}-item`}>
              h{node[0].level}
            </div>
          </Dropdown>
        ) : null}
        {insertOptions.map((t) => {
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
        {insertOptions.length > 0 && (
          <Divider
            type="vertical"
            style={{
              margin: '0 8px',
              height: '16px',
              borderColor: 'rgba(0,0,0,0.35)',
            }}
          />
        )}

        <div
          role="button"
          className={`${baseClassName}-item`}
          style={{
            position: 'relative',
          }}
        >
          <ColorPicker
            style={{
              position: 'absolute',
              opacity: 0,
              top: 0,
              left: 0,
            }}
            size="small"
            value={highColor}
            presets={[
              {
                label: 'Colors',
                colors: colors.map((c) => c.color),
              },
            ]}
            onChange={(e) => {
              localStorage.setItem('high-color', e.toHexString());
              EditorUtils.highColor(store.editor, e.toHexString());
              setHighColor(e.toHexString());
              setRefresh((r) => !r);
            }}
          />
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              fontWeight: EditorUtils.isFormatActive(store.editor, 'highColor')
                ? 'bold'
                : undefined,
              textDecoration: 'underline solid ' + highColor,
              textDecorationLine: 'underline',
              textDecorationThickness: 2,
              lineHeight: 1,
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
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                textAlign: 'center',
                marginTop: -1,
              }}
            >
              A
            </span>
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
              alignItems: 'center',
              height: '100%',
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
    );
  },
);
