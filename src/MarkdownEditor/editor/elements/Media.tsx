import { DeleteFilled, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Popover } from 'antd';
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import { useDebounceFn } from '@ant-design/pro-components';
import { Rnd } from 'react-rnd';
import { Transforms } from 'slate';
import { ActionIconBox } from '../../../components/ActionIconBox';
import { I18nContext } from '../../../i18n';
import { ElementProps, MediaNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { AvatarList } from '../components/ContributorAvatar';
import { useEditorStore } from '../store';
import { useGetSetState } from '../utils';
import { getMediaType } from '../utils/dom';
import { ImageAndError } from './Image';

/**
 * 可调整大小的图片组件的属性接口
 */
interface ResizeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 调整大小开始时的回调函数 */
  onResizeStart?: () => void;
  /** 调整大小结束时的回调函数 */
  onResizeStop?: (size: {
    width: number | string;
    height: number | string;
  }) => void;
  /** 默认尺寸配置 */
  defaultSize?: { width?: number; height?: number };
  /** 是否被选中状态 */
  selected?: boolean;
}

/**
 * 可调整大小的图片组件
 *
 * 功能特性：
 * - 支持拖拽调整图片尺寸
 * - 保持图片宽高比
 * - 加载状态处理
 * - 选中状态视觉反馈
 * - 响应式尺寸调整
 *
 * @param props - 组件属性
 * @returns 可调整大小的图片元素
 *
 * @example
 * ```tsx
 * <ResizeImage
 *   src="image.jpg"
 *   selected={true}
 *   defaultSize={{ width: 300, height: 200 }}
 *   onResizeStop={(size) => console.log('新尺寸:', size)}
 * />
 * ```
 */
export const ResizeImage = ({
  onResizeStart,
  onResizeStop,
  selected,
  defaultSize,
  ...props
}: ResizeImageProps) => {
  const [loading, setLoading] = React.useState(true);
  const radio = useRef<number>(1);
  const [size, setSize] = React.useState({
    width: defaultSize?.width || 400,
    height: defaultSize?.height || 0,
  } as {
    width: number | string;
    height: number | string;
  });
  const imgRef = useRef<HTMLImageElement>(null);

  //@ts-expect-error
  const resize = useDebounceFn((size) => {
    setSize({
      width: size.width,
      height: size.width / radio.current,
    });
    imgRef.current?.style.setProperty('width', `${size.width}px`);
    imgRef.current?.style.setProperty(
      'height',
      `${(size.width || 0) / radio.current}px`,
    );
  }, 160);

  return (
    <div
      data-testid="resize-image-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        overflow: 'hidden',
        width: size.width as number,
        height: size.height as number,
      }}
    >
      {loading ? (
        <div
          style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: 12,
          }}
        >
          <LoadingOutlined
            style={{
              fontSize: 24,
              color: '#1890ff',
            }}
          />
        </div>
      ) : null}
      <Rnd
        onResizeStart={onResizeStart}
        onResizeStop={() => {
          onResizeStop?.(size);
        }}
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
        }}
        size={size}
        disableDragging
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onResize={(_, dir, ele) => {
          imgRef.current?.style.setProperty('width', `${ele.clientWidth}px`);
          imgRef.current?.style.setProperty(
            'height',
            `${(ele.clientWidth || 0) / radio.current}px`,
          );

          resize.cancel();
          resize.run({
            width: ele.clientWidth,
            height: (ele.clientWidth || 0) / radio.current,
          });
        }}
      >
        <img
          data-testid="resize-image"
          draggable={false}
          onLoad={(e) => {
            setLoading(false);
            let width = (e.target as HTMLImageElement).naturalWidth;
            const height = (e.target as HTMLImageElement).naturalHeight;
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
          width={`min(${size.width}px, 100%)`}
          ref={imgRef}
          style={{
            width: '100%',
            height: 'auto',
            position: 'relative',
            zIndex: 99,
            outline: selected ? '2px solid #1890ff' : 'none',
            boxShadow: selected ? '0 0 0 2px #1890ff' : 'none',
            minHeight: 20,
            display: loading ? 'none' : 'block',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            pointerEvents: 'none',
          }}
          {...props}
        />
      </Rnd>
    </div>
  );
};

export function Media({
  element,
  attributes,
  children,
}: ElementProps<MediaNode>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, path] = useSelStatus(element);
  const { markdownEditorRef, readonly } = useEditorStore();
  const { locale } = useContext(I18nContext);
  const htmlRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = useGetSetState({
    height: element.height,
    dragging: false,
    loadSuccess: true,
    url: '',
    selected: false,
    type: getMediaType(element?.url, element.alt),
  });
  const updateElement = useCallback(
    (attr: Record<string, any>) => {
      if (!markdownEditorRef.current) return;
      Transforms.setNodes(markdownEditorRef.current, attr, { at: path });
    },
    [path],
  );

  const initial = useCallback(async () => {
    let type = getMediaType(element?.url, element.alt);
    type = !type ? 'image' : type;
    setState({
      type: ['image', 'video', 'autio', 'attachment'].includes(type!)
        ? type!
        : 'other',
    });
    let realUrl = element?.url;

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
    initial();
  }, [element?.url]);

  const imageDom = useMemo(() => {
    if (state().type !== 'image' && state().type !== 'other') return null;

    return !readonly ? (
      <ResizeImage
        defaultSize={{
          width: element.width,
          height: element.height,
        }}
        selected={state().selected}
        src={state()?.url}
        onResizeStart={() => {
          setState({ selected: true });
        }}
        onResizeStop={(size) => {
          Transforms.setNodes(markdownEditorRef.current, size, { at: path });
          setState({ selected: false });
        }}
      />
    ) : (
      <ImageAndError
        src={state()?.url || element?.url}
        alt={'image'}
        preview={{
          getContainer: () => document.body,
        }}
        referrerPolicy={'no-referrer'}
        crossOrigin={'anonymous'}
        draggable={false}
        style={{
          maxWidth: 800,
        }}
        width={element.width}
        height={element.height}
      />
    );
  }, [state().type, state()?.url, readonly, state().selected]);

  const mediaElement = useMemo(() => {
    if (state().type === 'video')
      return (
        <video
          data-testid="video-element"
          controls={element.controls !== false}
          autoPlay={element.autoplay}
          loop={element.loop}
          muted={element.muted}
          poster={element.poster}
          style={{
            width: element.width ? `${element.width}px` : '100%',
            height: element.height ? `${element.height}px` : 'auto',
            maxWidth: 600,
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          src={state()?.url || ''}
          preload="metadata"
          onError={() => {
            console.warn('Video failed to load:', state()?.url);
          }}
        />
      );

    if (state().type === 'audio') {
      return (
        <audio
          data-testid="audio-element"
          controls
          style={{
            width: '100%',
            height: 'auto',
          }}
          src={state()?.url || ''}
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
            boxSizing: 'border-box',
            border: '1px solid #f0f0f0',
            borderRadius: '0.5em',
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
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <a
                href={state()?.url}
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
          <div
            className="editor-icon-box"
            style={{
              padding: '0 18px',
            }}
          >
            <EyeOutlined
              onClick={() => {
                if (typeof window === 'undefined') return;
                window.open(state()?.url);
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
  }, [state().type, state()?.url]);

  return (
    <div {...attributes}>
      <div
        className={'ant-md-editor-drag-el'}
        data-be="media"
        data-testid="media-container"
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        draggable={false}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Popover
          arrow={false}
          styles={{
            body: {
              padding: 8,
            },
          }}
          trigger="click"
          open={state().selected && !readonly ? undefined : false}
          content={
            <ActionIconBox
              title={locale?.delete || '删除'}
              type="danger"
              onClick={(e) => {
                e.stopPropagation();
                Modal.confirm({
                  title: locale?.deleteMedia || '删除媒体',
                  content: locale?.confirmDelete || '确定删除该媒体吗？',
                  onOk: () => {
                    Transforms.removeNodes(markdownEditorRef.current, {
                      at: path,
                    });
                  },
                });
              }}
            >
              <DeleteFilled />
            </ActionIconBox>
          }
        >
          <div
            onClick={() => {
              setTimeout(() => {
                setState({ selected: true });
              }, 16);
            }}
            tabIndex={-1}
            style={{
              color: 'transparent',
              padding: 4,
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              width: mediaElement ? '100%' : undefined,
            }}
            ref={htmlRef}
            draggable={false}
            contentEditable={false}
            className="md-editor-media"
          >
            {mediaElement}
            {imageDom}
            <div
              style={{
                display: 'none',
              }}
            >
              {children}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}
