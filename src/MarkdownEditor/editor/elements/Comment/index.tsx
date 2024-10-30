import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import {
  CommentDataType,
  MarkdownEditorProps,
} from '@ant-design/md-editor/MarkdownEditor';
import { Avatar, ConfigProvider, Popconfirm, Popover } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { useEditorStore } from '../../store';
import { useStyle } from './style';

export const CommentView = (props: {
  children: React.ReactNode;
  comment: MarkdownEditorProps['comment'];
  commentItem: CommentDataType[];
}) => {
  const { readonly } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const editor = useSlate();
  const baseCls = context.getPrefixCls('md-editor-comment-view');
  const { wrapSSR, hashId } = useStyle(baseCls);
  if (!props.commentItem?.length) {
    return <>{props.children}</>;
  }

  return wrapSSR(
    <Popover
      align={{
        offset: [0, 8],
      }}
      trigger="click"
      overlayInnerStyle={{
        padding: 0,
      }}
      content={() => {
        const dom = (
          <div className={classNames(hashId, baseCls)}>
            {props.commentItem?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={classNames(`${baseCls}-item`, hashId)}
                >
                  <div className={classNames(`${baseCls}-item-header`, hashId)}>
                    <div
                      className={classNames(
                        `${baseCls}-item-header-title`,
                        hashId,
                      )}
                    >
                      <span
                        className={classNames(
                          `${baseCls}-item-header-name`,
                          hashId,
                        )}
                      >
                        <Avatar src={item.user?.avatar} size={14}>
                          {item.user?.name
                            ?.split(' ')
                            ?.map((item) =>
                              item?.split('').at(0)?.toUpperCase(),
                            )
                            ?.join('') || ''}
                        </Avatar>
                        {item.user?.name}
                      </span>
                      <span
                        className={classNames(
                          `${baseCls}-item-header-time`,
                          hashId,
                        )}
                      >
                        {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                    {readonly ? null : (
                      <div
                        className={classNames(
                          `${baseCls}-item-header-action`,
                          hashId,
                        )}
                      >
                        <Popconfirm
                          title={
                            props.comment?.deleteConfirmText ||
                            'Are you sure to delete this comment?'
                          }
                          onConfirm={async (e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                            try {
                              await props.comment?.onDelete?.(item.id, item);
                              // 更新时间戳,触发一下dom的rerender，不然不给我更新
                              Transforms.setNodes(
                                editor,
                                {
                                  updateTimestamp: Date.now(),
                                },
                                {
                                  at: item.path,
                                },
                              );
                            } catch (error) {}
                          }}
                        >
                          <span
                            className={classNames(
                              `${baseCls}-item-header-action-item`,
                              hashId,
                            )}
                          >
                            <DeleteFilled />
                          </span>
                        </Popconfirm>
                        <span
                          className={classNames(
                            `${baseCls}-item-header-action-item`,
                            hashId,
                          )}
                        >
                          <EditOutlined />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={classNames(`${baseCls}-item-content`, hashId)}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>
        );
        if (props.comment?.previewRender) {
          return props.comment.previewRender(
            { comment: props.commentItem },
            dom,
          );
        }
        return dom;
      }}
    >
      {props.children}
    </Popover>,
  );
};

export const CommentCreate = (props: {
  comment: MarkdownEditorProps['comment'];
}) => {
  const dom = <div></div>;
  if (props.comment?.editorRender) {
    return props.comment.editorRender(dom);
  }
  return <div></div>;
};
