import { CloseOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Avatar, ConfigProvider, Popconfirm } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { Transforms } from 'slate';
import { CommentDataType, MarkdownEditorProps } from '../../../index';

import { EditorStoreContext, useEditorStore } from '../../store';
import { useStyle } from './style';

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
export const CommentList: React.FC<{
  commentList: CommentDataType[];
  comment: MarkdownEditorProps['comment'];
}> = (props) => {
  const { readonly, markdownEditorRef } = useEditorStore();
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
        <motion.div
          variants={navVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
          initial="closed"
          whileInView="open"
        >
          {props.commentList?.map((item, index) => {
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  await props.comment?.onClick?.(item.id, item);
                }}
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
                              markdownEditorRef.current,
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
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </>,
  );
};
