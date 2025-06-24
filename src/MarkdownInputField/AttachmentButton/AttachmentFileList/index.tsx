import { DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Image } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext } from 'react';
import { isImageFile } from '..';
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
  onPreview?: (file: AttachmentFile) => void;
  onDownload?: (file: AttachmentFile) => void;
  onClearFileMap?: () => void;
};

export const kbToSize = (kb: number) => {
  const sizes = ['KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(kb) / Math.log(1024));
  return parseFloat((kb / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * @description 附件文件列表组件，用于展示已上传的附件
 * @component
 *
 * @param {Object} props - 组件属性
 * @param {Map<string, any>} props.fileMap - 文件映射表，键为文件唯一标识，值为文件对象
 * @param {Function} props.onDelete - 删除文件的回调函数，参数为被删除的文件
 * @param {Function} [props.onPreview] - 预览文件的回调函数，参数为被预览的文件
 * @param {Function} props.onDownload - 下载文件的回调函数，参数为被下载的文件
 * @param {Function} [props.onClearFileMap] - 清空所有文件的回调函数
 *
 * @example
 * <AttachmentFileList
 *   fileMap={fileMap}
 *   onDelete={handleDelete}
 *   onPreview={handlePreview}
 *   onDownload={handleDownload}
 *   onClearFileMap={handleClearAll}
 * />
 *
 * @returns {React.ReactElement} 渲染的附件文件列表组件
 */
export const AttachmentFileList: React.FC<AttachmentFileListProps> = (
  props,
) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context.getPrefixCls('md-editor-attachment-list');
  const { wrapSSR, hashId } = useStyle(prefix);
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

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
        <Image
          key="preview"
          src={imgSrc}
          alt="Preview"
          style={{ display: 'none' }}
          preview={{
            visible: !!imgSrc,
            scaleStep: 1,
            src: imgSrc,
            onVisibleChange: (value) => {
              if (!value) {
                setImgSrc(undefined);
              }
            },
          }}
        />
        <AnimatePresence initial={false}>
          {Array.from(props.fileMap?.values() || []).map((file, index) => (
            <AttachmentFileListItem
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              key={file?.uuid || file?.name || index}
              file={file}
              onDelete={() => {
                props.onDelete(file);
              }}
              onPreview={() => {
                if (props.onPreview) {
                  props.onPreview?.(file);
                  return;
                }
                if (isImageFile(file)) {
                  setImgSrc(file.previewUrl || file.url);
                  return;
                }
                if (typeof window === 'undefined') return;
                window.open(file.previewUrl || file.url, '_blank');
              }}
              onDownload={() => props.onDownload?.(file)}
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
