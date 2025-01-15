import { CloseOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Avatar, ConfigProvider, Popconfirm } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { Transforms } from 'slate';
import {
  CommentDataType,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../../../index';
import { EditorStoreContext, useEditorStore } from '../../store';
import { useStyle } from './style';

export const CommentList: React.FC<{
  commentList: CommentDataType[];
  comment: MarkdownEditorProps['comment'];
  instance: MarkdownEditorInstance;
}> = (props) => {
  const { readonly } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const { setShowComment } = useContext(EditorStoreContext) || {};
  const baseCls = context.getPrefixCls('md-editor-comment-view');
  const { wrapSSR, hashId } = useStyle(baseCls);
  return wrapSSR(
    <>
      <div
        style={{
          width: '300px',
        }}
      />
      <motion.div
        className={classNames(hashId, baseCls)}
        initial={{ transform: 'translateX(100%)', opacity: 0 }}
        animate={{ transform: 'translateX(0)', opacity: 1 }}
        exit={{ transform: 'translateX(100%)', opacity: 0 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          划词评论 ({props.commentList?.length})
          <CloseOutlined
            onClick={() => {
              setShowComment?.([]);
            }}
          />
        </div>
        {props.commentList?.map((item, index) => {
          return (
            <div key={index} className={classNames(`${baseCls}-item`, hashId)}>
              <div className={classNames(`${baseCls}-item-header`, hashId)}>
                <div
                  className={classNames(`${baseCls}-item-header-title`, hashId)}
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
                        ?.map((item) => item?.split('').at(0)?.toUpperCase())
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
                            props.instance.store?.editor,
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
              <div className={classNames(`${baseCls}-item-content`, hashId)}>
                {item.content}
              </div>
            </div>
          );
        })}
      </motion.div>
    </>,
  );
};
