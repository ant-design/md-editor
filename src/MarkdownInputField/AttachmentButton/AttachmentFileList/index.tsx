import { DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext } from 'react';
import { AttachmentFileListItem } from './AttachmentFileListItem';
import { useStyle } from './style';

export type AttachmentFile = File & {
  url?: string;
  status?: 'error' | 'uploading' | 'done';
  uuid?: string;
  previewUrl?: string;
};

export type AttachmentFileListProps = {
  fileMap?: Map<string, AttachmentFile>;
  onDelete: (file: AttachmentFile) => void;
  onClearFileMap?: () => void;
};

export const kbToSize = (kb: number) => {
  const sizes = ['KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(kb) / Math.log(1024));
  return parseFloat((kb / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AttachmentFileList: React.FC<AttachmentFileListProps> = (
  props,
) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context.getPrefixCls('md-editor-attachment-list');
  const { wrapSSR, hashId } = useStyle(prefix);
  return wrapSSR(
    <>
      <motion.div
        variants={{
          visible: {
            opacity: 1,
            transition: {
              when: 'beforeChildren',
              staggerChildren: 0.1,
            },
          },
          hidden: {
            opacity: 0,
            transition: {
              when: 'afterChildren',
            },
          },
        }}
        whileInView="visible"
        initial="hidden"
        animate="visible"
        style={
          props.fileMap?.size
            ? {}
            : { height: 0, overflow: 'hidden', padding: 0 }
        }
        className={classNames(prefix, hashId)}
      >
        <AnimatePresence initial={false}>
          {Array.from(props.fileMap?.values() || []).map((file, index) => (
            <AttachmentFileListItem
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              key={index}
              file={file}
              onDelete={() => props.onDelete(file)}
              onPreview={() => {}}
              onDownload={() => {}}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      {Array.from(props.fileMap?.values() || []).every(
        (file) => file.status === 'done',
      ) ? (
        <div
          style={{
            opacity: props.fileMap?.size ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={() => {
            props.onClearFileMap?.();
          }}
          className={classNames(`${`${prefix}`}-close-icon`, hashId)}
        >
          <DeleteOutlined />
        </div>
      ) : null}
    </>,
  );
};
