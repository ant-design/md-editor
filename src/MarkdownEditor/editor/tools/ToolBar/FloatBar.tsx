import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useCallback, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BaseRange, Editor, Range, Transforms } from 'slate';
import { IEditor } from '../../../BaseMarkdownEditor';
import { useEditorStore } from '../../store';
import { getSelRect } from '../../utils/dom';
import { useLocalState } from '../../utils/useLocalState';
import { BaseToolBar } from './BaseBar';
import { useStyle } from './floatBarStyle';
import { ReadonlyBaseBar } from './ReadonlyBaseBar';
const fileMap = new Map<string, IEditor>();

/**
 * 浮动工具栏,用于设置文本样式
 */
export const FloatBar = (props: { readonly: boolean }) => {
  const { domRect, setDomRect, markdownContainerRef, markdownEditorRef } =
    useEditorStore();
  const [state, setState] = useLocalState({
    open: false,
    left: 0,
    top: 0,
    url: '',
    initialLeft: 0,
    initialTop: 0,
  });

  const sel = React.useRef<BaseRange>();

  const resize = useCallback(
    (force = false) => {
      if (domRect) {
        let left = domRect.x;
        left = left - ((props.readonly ? 65 : 178) - domRect.width) / 2;

        const container = markdownContainerRef.current!;
        if (left < 4) left = 4;
        const barWidth = props.readonly ? 65 : 232;

        if (left > container.clientWidth - barWidth)
          left = container.clientWidth - barWidth / 2;

        let top = state.open && !force ? state.top : domRect.top - 32;

        const finalLeft = Math.max(left, 4);
        const finalTop = Math.max(top, 4);

        setState({
          open: true,
          left: finalLeft,
          top: finalTop,
          initialLeft: force ? domRect.x : state.initialLeft,
          initialTop: force ? domRect.top : state.initialTop,
        });
      } else {
        setState({ open: false });
      }
    },
    [props.readonly, state.open, domRect, markdownContainerRef],
  );

  useEffect(() => {
    if (domRect && markdownEditorRef.current) {
      resize(true);
      sel.current = markdownEditorRef.current.selection!;
    } else {
      setState({ open: false });
      fileMap.clear();
    }
  }, [domRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setState({ open: false });
        fileMap.clear();
        if (!sel.current) return;
        //@ts-ignore
        const end = Range.end(sel.current!).path;
        if (Editor.hasPath(markdownEditorRef.current, end)) {
          Transforms.select(
            markdownEditorRef.current,
            Editor.end(markdownEditorRef.current, end),
          );
        }
      }
    };
    markdownContainerRef?.current?.addEventListener('keydown', close);
    return () => {
      markdownContainerRef?.current?.removeEventListener('keydown', close);
    };
  }, [state.open]);

  useEffect(() => {
    const change = () => {
      if (state.open) {
        const rect = getSelRect();
        if (rect) {
          setDomRect?.(rect);
        }
        resize(true);
      }
    };
    window.addEventListener('resize', change);
    return () => window.removeEventListener('resize', change);
  }, []);

  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls(`md-editor-float-bar`);

  const { wrapSSR, hashId } = useStyle(baseClassName);

  if (!markdownContainerRef.current) return null;

  return ReactDOM.createPortal(
    wrapSSR(
      <motion.div
        style={{
          left: state.left,
          top: state.top,
          position: 'fixed',
          opacity: state.open ? 1 : 0,
          display: state.open ? undefined : 'none',
        }}
        initial={{
          left: state.initialLeft,
          top: state.initialTop,
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          left: state.left,
          top: state.top,
          scale: 1,
          opacity: state.open ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        layout
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={classNames(baseClassName, hashId)}
      >
        {props.readonly ? (
          <ReadonlyBaseBar prefix={baseClassName} hashId={hashId} />
        ) : (
          <BaseToolBar prefix={baseClassName} hashId={hashId} />
        )}
      </motion.div>,
    ),
    document.body,
  );
};
