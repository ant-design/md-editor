import {
  BoldOutlined,
  CaretDownOutlined,
  ClearOutlined,
  CodeOutlined,
  FontColorsOutlined,
  ItalicOutlined,
  LinkOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import { BaseRange, Editor, NodeEntry, Range, Text, Transforms } from 'slate';
import { useSubject } from '../../hooks/subscribe';
import { IFileItem } from '../../index';
import { useEditorStore } from '../store';
import { getSelRect } from '../utils/dom';
import { EditorUtils } from '../utils/editorUtils';
import { useLocalState } from '../utils/useLocalState';

const tools = [
  {
    type: 'bold',
    icon: <BoldOutlined />,
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
export const FloatBar = observer(() => {
  const store = useEditorStore();
  const inputRef = useRef<any>();
  const [state, setState] = useLocalState({
    open: false,
    left: 0,
    top: 0,
    url: '',
    hoverSelectColor: false,
    openSelectColor: false,
  });

  const sel = useRef<BaseRange>();
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
  const resize = useCallback((force = false) => {
    if (store.domRect && !store.openLinkPanel) {
      let left = store.domRect.x;
      left = left - (228 - store.domRect.width) / 2;
      const container = store.container!;
      if (left < 4) left = 4;
      const barWidth = state.openSelectColor ? 264 : 232;
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
  useSubject(store.floatBar$, (type) => {
    if (type === 'link') {
      const [text] = Editor.nodes(store.editor, {
        match: Text.isText,
      });
      if (text && text[0].url) {
        Transforms.select(store.editor, text[1]);
      }
      setTimeout(() => {
        store.setState((store) => (store.domRect = getSelRect()));
        resize(true);
        openLink();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 16);
      });
    } else if (type === 'highlight') {
      if (!Range.isCollapsed(store.editor.selection!)) {
        setState({ openSelectColor: true, hoverSelectColor: false });
        resize(true);
      }
    }
  });
  useEffect(() => {}, [store.refreshFloatBar]);

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
    } else {
      setState({ openSelectColor: false, hoverSelectColor: false });
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

  // const setLink = useCallback(() => {
  //   Transforms.setNodes(
  //     store.editor,
  //     { url: state.url || undefined },
  //     { match: Text.isText, split: true },
  //   );
  // }, []);
  return (
    <div
      style={{
        left: state.left,
        top: state.top,
        display: state.open ? undefined : 'none',
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`float-bar`}
    >
      <div
        style={{
          height: '100%',
          overflow: 'hidden',
          padding: '0 6px',
        }}
      >
        {!state.openSelectColor && (
          <div
            style={{
              display: 'flex',
              height: '100%',
              gap: '1px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                padding: '2px 6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  padding: '2px 6px',
                  color: EditorUtils.isFormatActive(store.editor, 'highColor')
                    ? '#000'
                    : undefined,
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onClick={() => {
                  if (EditorUtils.isFormatActive(store.editor, 'highColor')) {
                    EditorUtils.highColor(store.editor);
                  } else {
                    EditorUtils.highColor(
                      store.editor,
                      localStorage.getItem('high-color') || '#10b981',
                    );
                  }
                }}
              >
                <FontColorsOutlined />
              </div>
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  padding: '2px 6px',
                }}
                onMouseEnter={() => setState({ hoverSelectColor: true })}
                onMouseLeave={() => setState({ hoverSelectColor: false })}
                onClick={() => {
                  setState({ openSelectColor: true, hoverSelectColor: false });
                  resize();
                }}
              >
                <CaretDownOutlined
                  style={{
                    transform: state.hoverSelectColor
                      ? 'rotate(180deg)'
                      : 'none',
                  }}
                />
              </div>
            </div>
            {tools.map((t) => (
              <div
                key={t.type}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  EditorUtils.toggleFormat(store.editor, t.type);
                }}
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  padding: '2px 6px',
                  color: EditorUtils.isFormatActive(store.editor, t.type)
                    ? '#000'
                    : undefined,
                }}
              >
                {t.icon}
              </div>
            ))}
            <div
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                openLink();
              }}
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                padding: '2px 6px',
                color: EditorUtils.isFormatActive(store.editor, 'url')
                  ? '#000'
                  : undefined,
              }}
            >
              <LinkOutlined />
              <span>Link</span>
            </div>
            <div
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                padding: '2px 6px',
              }}
              onClick={() => {
                EditorUtils.clearMarks(store.editor, true);
                EditorUtils.highColor(store.editor);
              }}
            >
              <ClearOutlined />
            </div>
          </div>
        )}
        {state.openSelectColor && (
          <div
            style={{
              display: 'flex',
              gap: 2,
              height: '100%',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                EditorUtils.highColor(store.editor);
                setState({ openSelectColor: false });
                resize();
              }}
            >
              /
            </div>
            {colors.map((c) => (
              <div
                key={c.color}
                style={{ backgroundColor: c.color, cursor: 'pointer' }}
                className={`float-color-icon`}
                onClick={() => {
                  localStorage.setItem('high-color', c.color);
                  EditorUtils.highColor(store.editor, c.color);
                  setState({ openSelectColor: false });
                  resize();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
