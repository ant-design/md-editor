import { FileFailed, FileUploadingSpin, X } from '@sofa-design/icons';
import { Tooltip } from 'antd';
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
 * @param {() => void} [props.onRetry] - 重试上传文件回调（文件上传失败时调用）
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
 *   onRetry={() => handleRetry(fileData)}
 *   className="custom-file-item"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的附件文件列表项组件
 *
 * @remarks
 * - 显示文件图标、名称和大小
 * - 支持文件预览、下载、删除、重试操作
 * - 提供动画效果
 * - 显示文件状态（上传中、完成、错误）
 * - 支持自定义样式
 * - 文件名自动分割显示
 * - 文件大小格式化显示
 * - 响应式布局
 * - 文件上传失败时，点击文件名可重试上传
 */
export const AttachmentFileListItem: React.FC<{
  file: AttachmentFile;
  onDelete: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onRetry?: () => void;
  className?: string;
  prefixCls?: string;
  hashId?: string;
}> = (props) => {
  const { file, prefixCls, hashId, onPreview, onRetry, onDelete } = props;

  // 处理文件点击
  const handleFileClick = () => {
    if (file.status !== 'done') return;
    onPreview?.();
  };

  // 处理重试点击
  const handleRetryClick = () => {
    if (file.status !== 'error') return;
    onRetry?.();
  };

  // 处理删除点击
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  // 渲染文件图标
  const renderFileIcon = () => {
    const iconClassName = classNames(`${prefixCls}-file-icon`, hashId);

    if (file.status === 'uploading') {
      return (
        <div className={iconClassName}>
          <div className={classNames(`${prefixCls}-uploading-icon`, hashId)}>
            <FileUploadingSpin />
          </div>
        </div>
      );
    }

    if (file.status === 'error') {
      return (
        <div className={iconClassName}>
          <div className={classNames(`${prefixCls}-error-icon`, hashId)}>
            <FileFailed />
          </div>
        </div>
      );
    }

    return (
      <div className={iconClassName}>
        <AttachmentFileIcon
          file={file}
          className={classNames(`${prefixCls}-file-icon-img`, hashId)}
        />
      </div>
    );
  };

  // 获取文件名（不含扩展名）
  const getFileName = () => {
    return file.name.split('.').slice(0, -1).join('.');
  };

  // 渲染文件状态信息
  const renderFileStatus = () => {
    const statusClassName = classNames(`${prefixCls}-file-size`, hashId);

    if (file.status === 'uploading') {
      return <div className={statusClassName}>上传中...</div>;
    }

    if (file.status === 'error') {
      return (
        <div
          className={classNames(
            statusClassName,
            `${prefixCls}-file-size-error`,
          )}
        >
          上传失败
        </div>
      );
    }

    // 状态为 'done'
    const fileExtension = file.name.split('.').slice(-1)[0];
    const fileSize = file.size ? kbToSize(file.size / 1024) : '';
    const sizeItems = [fileExtension, fileSize].filter(Boolean);

    return (
      <div className={statusClassName}>
        {sizeItems.map((item) => (
          <span
            key={item}
            className={classNames(`${prefixCls}-file-size-item`, hashId)}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // 渲染删除按钮
  const renderDeleteButton = () => {
    if (file.status === 'uploading') return null;

    return (
      <div
        onClick={handleDeleteClick}
        className={classNames(`${prefixCls}-close-icon`, hashId)}
      >
        <X role="img" aria-label="X" />
      </div>
    );
  };

  return (
    <Tooltip
      title={'点击重试'}
      open={file.status !== 'error' ? false : undefined}
    >
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        onClick={handleFileClick}
        className={props.className}
        exit={{ opacity: 0, y: -20 }}
      >
        {renderFileIcon()}
        <div className={classNames(`${prefixCls}-file-info`, hashId)}>
          <div
            onClick={handleRetryClick}
            className={classNames(`${prefixCls}-file-name`, hashId)}
          >
            <span className={classNames(`${prefixCls}-file-name-text`, hashId)}>
              {getFileName()}
            </span>
          </div>
          {renderFileStatus()}
        </div>
        {renderDeleteButton()}
      </motion.div>
    </Tooltip>
  );
};
