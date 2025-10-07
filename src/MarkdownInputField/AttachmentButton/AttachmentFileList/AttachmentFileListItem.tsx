import { FileFailed, FileUploadingSpin, X } from '@sofa-design/icons';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { AttachmentFile } from '../types';
import { kbToSize } from '../utils';
import { AttachmentFileIcon } from './AttachmentFileIcon';

/**
 * AttachmentFileListItem 组件 - 附件文件列表项组件
 *
 * 该组件用于显示单个附件文件项，包括文件图标、文件名、文件大小等信息。
 * 支持文件预览、下载、删除操作，提供动画效果和状态显示。
 *
 * @component
 * @description 附件文件列表项组件，显示单个文件信息
 * @param {Object} props - 组件属性
 * @param {AttachmentFile} props.file - 文件对象
 * @param {() => void} props.onDelete - 删除文件回调
 * @param {() => void} props.onPreview - 预览文件回调
 * @param {() => void} props.onDownload - 下载文件回调
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} [props.prefixCls] - 前缀类名
 * @param {string} [props.hashId] - 哈希ID
 *
 * @example
 * ```tsx
 * <AttachmentFileListItem
 *   file={fileData}
 *   onDelete={() => handleDelete(fileData)}
 *   onPreview={() => handlePreview(fileData)}
 *   onDownload={() => handleDownload(fileData)}
 *   className="custom-file-item"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的附件文件列表项组件
 *
 * @remarks
 * - 显示文件图标、名称和大小
 * - 支持文件预览、下载、删除操作
 * - 提供动画效果
 * - 显示文件状态（上传中、完成、错误）
 * - 支持自定义样式
 * - 文件名自动分割显示
 * - 文件大小格式化显示
 * - 响应式布局
 */
export const AttachmentFileListItem: React.FC<{
  file: AttachmentFile;
  onDelete: () => void;
  onPreview: () => void;
  onDownload: () => void;
  className?: string;
  prefixCls?: string;
  hashId?: string;
}> = (props) => {
  const file = props.file;

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
        },
      }}
      onClick={() => {
        if (file.status === 'done') {
          props.onPreview?.();
        }
      }}
      className={props.className}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={classNames(`${props.prefixCls}-file-icon`, props.hashId)}>
        {file.status === 'uploading' ? (
          <div
            className={classNames(
              `${props.prefixCls}-uploading-icon`,
              props.hashId,
            )}
          >
            <FileUploadingSpin />
          </div>
        ) : null}
        {file.status === 'error' ? (
          <div
            className={classNames(
              `${props.prefixCls}-uploading-icon`,
              props.hashId,
            )}
          >
            <FileFailed />
          </div>
        ) : null}
        {file.status === 'done' ? <AttachmentFileIcon file={file} /> : null}
      </div>
      <div className={classNames(`${props.prefixCls}-file-info`, props.hashId)}>
        <div
          className={classNames(`${props.prefixCls}-file-name`, props.hashId)}
        >
          <span
            className={classNames(
              `${props.prefixCls}-file-name-text`,
              props.hashId,
            )}
          >
            {file.name.split('.').slice(0, -1).join('.')}
          </span>
        </div>
        <div
          className={classNames(`${props.prefixCls}-file-size`, props.hashId)}
        >
          {[file.name.split('.').slice(-1), kbToSize(file.size / 1024)]
            .filter(Boolean)
            .map((item) => {
              return (
                <span
                  key={item?.toString() + ''}
                  className={classNames(
                    `${props.prefixCls}-file-size-item`,
                    props.hashId,
                  )}
                >
                  {item}
                </span>
              );
            })}
        </div>
      </div>
      {file.status === 'done' ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.stopPropagation();
            props.onDelete?.();
          }}
          className={classNames(`${props.prefixCls}-close-icon`, props.hashId)}
        >
          <X role="img" aria-label="X" />
        </div>
      ) : null}
    </motion.div>
  );
};
