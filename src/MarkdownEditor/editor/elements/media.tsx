import { EyeOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import { useGetSetState } from 'react-use';
import { Transforms } from 'slate';
import { ElementProps, MediaNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { AvatarList } from '../components/ContributorAvatar';
import { DragHandle } from '../tools/DragHandle';
import { getMediaType } from '../utils/dom';
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
          let width = (e.target as HTMLImageElement).clientWidth;
          const height = (e.target as HTMLImageElement).clientHeight;
          radio.current = width / height;
          width = Math.min(
            width,
            600,
            document.documentElement.clientWidth * 0.8 || 600,
          );
          setSize({
            width: width,
            height: width / radio.current,
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
    type: getMediaType(element.url, element.alt),
  });
  const updateElement = useCallback(
    (attr: Record<string, any>) => {
      Transforms.setNodes(store.editor, attr, { at: path });
    },
    [path],
  );

  const initial = useCallback(async () => {
    let type = getMediaType(element.url, element.alt);
    type = !type ? 'image' : type;
    setState({
      type: ['image', 'video', 'autio', 'attachment'].includes(type!)
        ? type!
        : 'other',
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

  const imageDom = useMemo(() => {
    if (state().type !== 'image' && state().type !== 'other') return null;

    return !store?.readonly ? (
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
        style={{
          maxWidth: 800,
          marginBottom: 12,
        }}
        width={element.width}
        height={element.height}
      />
    );
  }, [state().type, state().url, store?.readonly, state().selected]);

  const mediaElement = useMemo(() => {
    if (state().type === 'video')
      return (
        <video
          controls
          style={{
            width: '100%',
            height: 'auto',
          }}
          src={state().url || ''}
        />
      );

    if (state().type === 'audio') {
      return (
        <audio
          controls
          style={{
            width: '100%',
            height: 'auto',
          }}
          src={state().url || ''}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      );
    }
    if (state().type === 'attachment') {
      return (
        <div
          style={{
            padding: 12,
            border: '1px solid #f0f0f0',
            borderRadius: 16,
            width: '100%',
            backgroundImage:
              'linear-gradient(rgb(249, 251, 255) 0%, rgb(243, 248, 255) 100%)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#262626',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#262626',
              fontSize: 16,
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              width={32}
              src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*DPzkQ5dfwDQAAAAAAAAAAAAADkN6AQ/original"
            />
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <a
                href={state().url}
                style={{
                  overflow: 'ellipsis',
                  textOverflow: 'ellipsis',
                  textWrap: 'nowrap',
                  textDecoration: 'none',
                  display: 'block',
                  color: '#262626',
                }}
                download={
                  element.alt?.replace('attachment:', '') || 'attachment'
                }
              >
                {element.alt?.replace('attachment:', '') || 'attachment'}
              </a>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {element.otherProps?.collaborators ? (
                  <div>
                    <AvatarList
                      displayList={
                        element.otherProps?.collaborators
                          ?.map((item: { [key: string]: number }) => {
                            return {
                              name: Object.keys(item)?.at(0) as string,
                              collaboratorNumber:
                                Object.values(item)?.at(0) || 0,
                            };
                          })
                          .slice(0, 5) || []
                      }
                    />
                  </div>
                ) : (
                  <div />
                )}
                {element.otherProps?.updateTime ? (
                  <div
                    style={{
                      color: 'rgba(0,0,0,0.45)',
                      fontSize: 12,
                    }}
                  >
                    {element.otherProps.updateTime}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="editor-icon-box">
            <EyeOutlined
              onClick={() => {
                window.open(state().url);
              }}
              style={{
                fontSize: 16,
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  }, [state().type, state().url]);

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
            width: mediaElement ? '100%' : undefined,
          }}
          ref={htmlRef}
          draggable={false}
          contentEditable={false}
          className="md-editor-media"
        >
          {mediaElement}
          {imageDom}
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
