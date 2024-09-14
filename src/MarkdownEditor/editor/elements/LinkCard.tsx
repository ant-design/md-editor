import { EyeOutlined } from '@ant-design/icons';
import React from 'react';
import { ElementProps, LinkCardNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { AvatarList } from '../components/ContributorAvatar';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils/editorUtils';

export function LinkCard({
  element,
  attributes,
  children,
}: ElementProps<
  LinkCardNode<{
    url: string;
    collaborators: { [key: string]: number }[];
    updateTime: string;
  }>
>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, path, store] = useSelStatus(element);
  const htmlRef = React.useRef<HTMLDivElement>(null);
  return (
    <div {...attributes}>
      <div
        className={'md-editor-drag-el'}
        data-be="media"
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
        onDragStart={(e) => store.dragStart(e)}
        draggable={store.readonly ? false : true}
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
          ref={htmlRef}
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
            {element.icon ? <img src={element.icon} width={56} /> : null}
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <a
                href={element.url}
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
                {element.title || element.name || 'Link'}
              </a>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginTop: 4,
                  lineHeight: '24px',
                  display: 'flex',
                  fontSize: 12,
                  color: 'rgba(0,0,0,0.45)',
                  justifyContent: 'space-between',
                }}
              >
                {element.description ? element.description : element.url}
              </div>
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
                window.open(element.url);
              }}
              style={{
                fontSize: 16,
                cursor: 'pointer',
              }}
            />
          </div>
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
