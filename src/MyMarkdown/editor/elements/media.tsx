import {
  AlignLeftOutlined,
  AlignRightOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementProps, MediaNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { mediaType } from '../utils/dom';
import { EditorUtils } from '../utils/editorUtils';
import { getRemoteMediaType } from '../utils/media';

const alignType = new Map([
  ['left', 'justify-start'],
  ['right', 'justify-end'],
]);
const resize = (ctx: {
  e: React.MouseEvent;
  dom: HTMLElement;
  height?: number;
  cb: Function;
}) => {
  const height = ctx.height || ctx.dom.clientHeight;
  const startY = ctx.e.clientY;
  let resizeHeight = height;
  const move = (e: MouseEvent) => {
    resizeHeight = height + e.clientY - startY;
    ctx.dom.parentElement!.style.height = resizeHeight + 'px';
  };
  window.addEventListener('mousemove', move);
  window.addEventListener(
    'mouseup',
    (e) => {
      window.removeEventListener('mousemove', move);
      e.stopPropagation();
      ctx.cb(resizeHeight);
    },
    { once: true },
  );
};
export function Media({
  element,
  attributes,
  children,
}: ElementProps<MediaNode>) {
  const [selected, path, store] = useSelStatus(element);
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useGetSetState({
    height: element.height,
    dragging: false,
    loadSuccess: true,
    url: '',
    selected: false,
    type: mediaType(element.url),
  });
  const updateElement = useCallback(
    (attr: Record<string, any>) => {
      Transforms.setNodes(store.editor, attr, { at: path });
    },
    [path],
  );
  const initial = useCallback(async () => {
    let type = !element.url?.startsWith('http')
      ? mediaType(element.url)
      : await getRemoteMediaType(element.url);
    type = !type ? 'image' : type;
    setState({
      type: ['image', 'video', 'autio'].includes(type!) ? type! : 'other',
    });
    let realUrl = element.url;
    setState({ url: realUrl });
    if (state().type === 'image' || state().type === 'other') {
      const img = document.createElement('img');
      img.referrerPolicy = 'no-referrer';
      img.crossOrigin = 'anonymous';
      img.src = realUrl!;
      img.onerror = (e) => {
        setState({ loadSuccess: false });
      };
      img.onload = () => setState({ loadSuccess: true });
    }
    if (!element.mediaType) {
      updateElement({
        mediaType: state().type,
      });
    }
  }, [element]);
  useLayoutEffect(() => {
    if (element.downloadUrl) {
      return;
    }
    initial();
  }, [element.url, element.downloadUrl]);

  return (
    <div
      className={'py-2 relative group'}
      contentEditable={false}
      {...attributes}
    >
      {state().loadSuccess && state().type === 'image' && (
        <div
          className={`text-base  text-white group-hover:flex hidden items-center space-x-1 *:duration-200 *:cursor-pointer
            z-10 rounded border border-white/20 absolute bg-black/70 backdrop-blur right-3 top-4 px-1 h-7`}
        >
          <div
            title={'Valid when the image width is not full'}
            className={`p-0.5 ${
              element.align === 'left' ? 'text-blue-500' : 'hover:text-gray-300'
            }`}
            onClick={() =>
              updateElement({
                align: element.align === 'left' ? undefined : 'left',
              })
            }
          >
            <AlignLeftOutlined />
          </div>
          <div
            title={'Valid when the image width is not full'}
            className={`p-0.5 ${
              element.align === 'right'
                ? 'text-blue-500'
                : 'hover:text-gray-300'
            }`}
            onClick={() =>
              updateElement({
                align: element.align === 'right' ? undefined : 'right',
              })
            }
          >
            <AlignRightOutlined />
          </div>
          <div
            className={'p-0.5 hover:text-gray-300'}
            onClick={() => {
              store.openPreviewImages(element);
            }}
          >
            <FullscreenOutlined />
          </div>
        </div>
      )}
      {selected && (
        <>
          <div
            className={
              'absolute text-center w-full truncate left-0 -top-2 text-xs h-4 leading-4 dark:text-gray-500 text-gray-400'
            }
          >
            {element.url}
          </div>
        </>
      )}

      <div
        className={`drag-el group cursor-default relative flex justify-center mb-2 border-2 rounded ${
          selected
            ? 'border-gray-300 dark:border-gray-300/50'
            : 'border-transparent'
        }`}
        data-be={'media'}
        style={{ padding: state().type === 'document' ? '10px 0' : undefined }}
        draggable={true}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        onDragStart={(e) => {
          try {
            store.dragStart(e);
            store.dragEl = ReactEditor.toDOMNode(store.editor, element);
          } catch (e) {}
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!store.focus) {
            EditorUtils.focus(store.editor);
          }
          EditorUtils.selectMedia(store, path);
        }}
        onClick={(e) => {
          e.preventDefault();
          if (e.detail === 2) {
            Transforms.setNodes(
              store.editor,
              { height: undefined },
              { at: path },
            );
            setState({ height: undefined });
          }
        }}
      >
        <div
          className={`w-full h-full flex ${
            state().type === 'image' && element.align
              ? alignType.get(element.align) || 'justify-center'
              : 'justify-center'
          }`}
          style={{
            height:
              state().height || (state().type === 'other' ? 260 : undefined),
          }}
        >
          {state().type === 'video' && (
            <video
              src={state().url}
              controls={true}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              className={`rounded h-full select-none ${
                state().dragging ? 'pointer-events-none' : ''
              }`}
              // @ts-ignore
              ref={ref}
            />
          )}
          {state().type === 'audio' && (
            <audio
              controls={true}
              src={state().url}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              className={`select-none ${
                state().dragging ? 'pointer-events-none' : ''
              }`}
              // @ts-ignore
              ref={ref}
            />
          )}
          {state().type === 'other' && (
            <div
              className={'p-2 rounded bg-black/5 dark:bg-white/10 flex-1'}
              // @ts-ignore
              ref={ref}
            >
              <webview
                src={state().url}
                className={`w-full h-full select-none border-none rounded ${
                  state().dragging ? 'pointer-events-none' : ''
                }`}
                allowFullScreen={true}
              />
            </div>
          )}
          {state().type === 'image' && (
            <img
              src={state().url}
              alt={'image'}
              referrerPolicy={'no-referrer'}
              crossOrigin={'anonymous'}
              draggable={false}
              // @ts-ignore
              ref={ref}
              className={
                'align-text-bottom h-full rounded border border-transparent min-w-[20px] min-h-[20px] block object-contain'
              }
            />
          )}
          {selected && (
            <div
              draggable={false}
              className={
                'w-20 h-[6px] rounded-lg bg-zinc-500 dark:bg-zinc-400 absolute z-50 left-1/2 -ml-10 -bottom-[3px] cursor-row-resize'
              }
              onMouseDown={(e) => {
                e.preventDefault();
                setState({ dragging: true });
                resize({
                  e,
                  height: state().height,
                  dom: ref.current!,
                  cb: (height: number) => {
                    setState({ height, dragging: false });
                    Transforms.setNodes(store.editor, { height }, { at: path });
                  },
                });
              }}
            />
          )}
        </div>
        <span contentEditable={false}>{children}</span>
      </div>
    </div>
  );
}
