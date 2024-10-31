import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect } from 'react';
import { BaseRange, Editor, Range, Transforms } from 'slate';
import { IEditor } from '../../../index';
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
export const FloatBar = observer((props: { readonly: boolean }) => {
  const { store } = useEditorStore();
  const [state, setState] = useLocalState({
    open: false,
    left: 0,
    top: 0,
    url: '',
  });

  const sel = React.useRef<BaseRange>();

  const resize = useCallback(
    (force = false) => {
      if (store.domRect && !store.openLinkPanel) {
        let left = store.domRect.x;
        left = left - ((props.readonly ? 65 : 178) - store.domRect.width) / 2;

        console.log('store.domRect', store.domRect);

        const container = store.container!;
        if (left < 4) left = 4;
        const barWidth = props.readonly ? 65 : 232;

        if (left > container.clientWidth - barWidth)
          left = container.clientWidth - barWidth / 2;

        let top = state.open && !force ? state.top : store.domRect.top - 32;

        setState({
          open: true,
          left: Math.max(left - container.getBoundingClientRect().left, 4),
          top: Math.max(top - container.getBoundingClientRect().top, 4),
        });
      }
    },
    [props.readonly, state.open],
  );

  useEffect(() => {
    if (store.domRect && store.editor) {
      resize(true);
      sel.current = store.editor.selection!;
    } else {
      setState({ open: false });
      fileMap.clear();
    }
  }, [store.domRect]);

  useEffect(() => {
    store.setFloatBarOpen(state.open);
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !store.openLinkPanel) {
        e.preventDefault();
        setState({ open: false });
        fileMap.clear();
        const end = Range.end(sel.current!).path;
        if (Editor.hasPath(store?.editor, end)) {
          Transforms.select(store?.editor, Editor.end(store?.editor, end));
        }
        store.setFloatBarOpen(false);
      }
    };
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('keydown', close);
      store.setFloatBarOpen(false);
    };
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

  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context.getPrefixCls(`md-editor-float-bar`);

  const { wrapSSR, hashId } = useStyle(baseClassName);

  return wrapSSR(
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
      className={classNames(baseClassName, hashId)}
    >
      {props.readonly ? (
        <ReadonlyBaseBar prefix={baseClassName} hashId={hashId} />
      ) : (
        <BaseToolBar prefix={baseClassName} hashId={hashId} />
      )}
    </div>,
  );
});
