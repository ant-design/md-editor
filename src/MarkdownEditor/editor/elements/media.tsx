import { Image } from 'antd';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import { useGetSetState } from 'react-use';
import { Transforms } from 'slate';
import { ElementProps, MediaNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { DragHandle } from '../tools/DragHandle';
import { mediaType } from '../utils/dom';
import { EditorUtils } from '../utils/editorUtils';

/**
 * 修复图片大小的问题
 * @param props
 * @returns
 */
export const ResizeImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    onResizeStart?: (e: React.SyntheticEvent) => void;
    onResizeStop?: (
      e: React.SyntheticEvent,
      size: {
        width: number | string;
        height: number | string;
      },
    ) => void;
    supportResize?: boolean;
    defaultSize?: {
      width?: number;
      height?: number;
    };
  },
) => {
  const radio = useRef<number>(1);
  const [size, setSize] = React.useState({
    width: props.defaultSize?.width || '100%',
    height: props.defaultSize?.height || 'auto',
  } as {
    width: number | string;
    height: number | string;
  });
  return (
    <ResizableBox
      onResizeStart={props.onResizeStart}
      onResizeStop={(e) => {
        props.onResizeStop?.(e, size);
      }}
      handle={!props.supportResize ? <div /> : undefined}
      width={size.width as number}
      height={size.height as number}
      onResize={(_, { size }) => {
        setSize({
          width: size.width,
          height: size.width / radio.current,
        });
      }}
    >
      <img
        draggable={false}
        onLoad={(e) => {
          const width = (e.target as HTMLImageElement).clientWidth;
          const height = (e.target as HTMLImageElement).clientHeight;
          radio.current = width / height;
          setSize({
            width: (e.target as HTMLImageElement).clientWidth,
            height: (e.target as HTMLImageElement).clientHeight,
          });
        }}
        alt={'image'}
        referrerPolicy={'no-referrer'}
        crossOrigin={'anonymous'}
        width={'100%'}
        style={{
          width: '100%',
          height: 'auto',
          position: 'relative',
          zIndex: 99,
          minHeight: 20,
        }}
        {...props}
      />
    </ResizableBox>
  );
};
export function Media({
  element,
  attributes,
  children,
}: ElementProps<MediaNode>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, path, store] = useSelStatus(element);
  const htmlRef = React.useRef<HTMLDivElement>(null);
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
    let type = mediaType(element.url);
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
      img.onerror = () => {
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
    <div {...attributes}>
      <div
        className={'drag-el'}
        data-be="media"
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
        onDragStart={(e) => store.dragStart(e)}
        draggable={!state().selected}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!store.focus) {
            EditorUtils.focus(store.editor);
          }
          EditorUtils.selectMedia(store, path);
        }}
      >
        <DragHandle />
        <div
          onClick={() => {
            setTimeout(() => {
              setState({ selected: true });
            }, 16);
          }}
          onBlur={() => {
            setState({ selected: false });
          }}
          tabIndex={-1}
          style={{
            color: 'transparent',
            padding: 4,
          }}
          ref={htmlRef}
          draggable={false}
          contentEditable={false}
        >
          {!store?.readonly ? (
            <ResizeImage
              defaultSize={{
                width: element.width,
                height: element.height,
              }}
              supportResize={state().selected}
              src={state().url}
              onResizeStart={() => {
                setState({ selected: true });
              }}
              onResizeStop={(_, size) => {
                Transforms.setNodes(store.editor, size, { at: path });
                setState({ selected: false });
              }}
            />
          ) : (
            <Image
              src={state().url}
              alt={'image'}
              referrerPolicy={'no-referrer'}
              crossOrigin={'anonymous'}
              draggable={false}
              width={element.width}
              height={element.height}
            />
          )}
        </div>
        <span
          style={{
            fontSize: (htmlRef.current?.clientHeight || 200) * 0.75,
            width: '2px',
            height: (htmlRef.current?.clientHeight || 200) * 0.75,
            lineHeight: 1,
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
