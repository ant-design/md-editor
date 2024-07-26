import {
  BoldOutlined,
  CaretDownOutlined,
  ClearOutlined,
  CodeOutlined,
  ItalicOutlined,
  LinkOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { BaseRange, Editor, NodeEntry, Range, Transforms } from 'slate';
import { IFileItem } from '../../index';
import { useEditorStore } from '../store';
import { getSelRect } from '../utils/dom';
import { EditorUtils } from '../utils/editorUtils';
import { useLocalState } from '../utils/useLocalState';

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
const fileMap = new Map<string, IFileItem>();

/**
 * 基础工具栏
 * @param props
 * @returns
 */
export const BaseToolBar = observer((props: { prefix?: string }) => {
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

  const highColor = React.useMemo(() => {
    if (typeof localStorage === 'undefined') return undefined;
    return localStorage.getItem('high-color');
  }, [EditorUtils.isFormatActive(store.editor, 'highColor')]);

  const baseClassName = props.prefix || `toolbar-action`;

  return (
    <>
      {!openSelectColor && (
        <div
          style={{
            display: 'flex',
            height: '100%',
            gap: '1px',
          }}
        >
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
        </div>
      )}
      {openSelectColor && (
        <div
          style={{
            display: 'flex',
            gap: 4,
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
});
/**
 * 浮动工具栏,用于设置文本样式
 */
export const FloatBar = observer(() => {
  const store = useEditorStore();
  const [state, setState] = useLocalState({
    open: false,
    left: 0,
    top: 0,
    url: '',
  });

  const sel = useRef<BaseRange>();

  const resize = useCallback((force = false) => {
    if (store.domRect && !store.openLinkPanel) {
      let left = store.domRect.x;
      left = left - (228 - store.domRect.width) / 2;
      const container = store.container!;
      if (left < 4) left = 4;
      const barWidth = 232;
      if (left > container.clientWidth - barWidth)
        left = container.clientWidth - barWidth;
      let top =
        state.open && !force
          ? state.top
          : container.scrollTop + store.domRect.top - 80;
      setState({
        open: true,
        left,
        top,
      });
    }
  }, []);

  useEffect(() => {
    if (store.domRect) {
      resize(true);
      sel.current = store.editor.selection!;
    } else {
      setState({ open: false });
      fileMap.clear();
    }
  }, [store.domRect, store.openSearch]);

  useEffect(() => {
    if (state.open) {
      const close = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !store.openLinkPanel) {
          e.preventDefault();
          setState({ open: false });
          fileMap.clear();
          const end = Range.end(sel.current!).path;
          if (Editor.hasPath(store.editor, end)) {
            Transforms.select(store.editor, Editor.end(store.editor, end));
          }
        }
      };
      window.addEventListener('keydown', close);
      return () => window.removeEventListener('keydown', close);
    }
    return () => {};
  }, [state.open]);

  useEffect(() => {
    const change = () => {
      if (state.open) {
        const rect = getSelRect();
        if (rect) {
          store.setState((state) => (state.domRect = rect));
        }
        resize(true);
      }
    };
    window.addEventListener('resize', change);
    return () => window.removeEventListener('resize', change);
  }, []);

  const baseClassName = `float-bar`;
  return (
    <div
      style={{
        left: state.left,
        top: state.top,
        display: state.open ? undefined : 'none',
        padding: 4,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={baseClassName}
    >
      <BaseToolBar prefix={baseClassName} />
    </div>
  );
});
