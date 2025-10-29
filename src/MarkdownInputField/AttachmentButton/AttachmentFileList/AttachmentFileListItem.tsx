import { FileFailed, FileUploadingSpin, X } from '@sofa-design/icons';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { AttachmentFile } from '../types';
import { kbToSize } from '../utils';
import { AttachmentFileIcon } from './AttachmentFileIcon';

interface FileListItemProps {
  file: AttachmentFile;
  onDelete: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onRetry?: () => void;
  className?: string;
  prefixCls?: string;
  hashId?: string;
}

const getFileNameWithoutExtension = (fileName: string) => {
  return fileName.split('.').slice(0, -1).join('.');
};

const getFileExtension = (fileName: string) => {
  return fileName.split('.').slice(-1)[0];
};

const FileIcon: React.FC<{
  file: AttachmentFile;
  prefixCls?: string;
  hashId?: string;
}> = ({ file, prefixCls, hashId }) => {
  const iconClassName = classNames(`${prefixCls}-file-icon`, hashId);
  const status = file.status || 'done';
  const iconMap: Record<'uploading' | 'error' | 'done', React.ReactNode> = {
    uploading: (
      <div className={classNames(`${prefixCls}-uploading-icon`, hashId)}>
        <FileUploadingSpin />
      </div>
    ),
    error: (
      <div className={classNames(`${prefixCls}-error-icon`, hashId)}>
        <FileFailed />
      </div>
    ),
    done: (
      <AttachmentFileIcon
        file={file}
        className={classNames(`${prefixCls}-file-icon-img`, hashId)}
      />
    ),
  };

  return <div className={iconClassName}>{iconMap[status]}</div>;
};

const FileStatus: React.FC<{
  file: AttachmentFile;
  prefixCls?: string;
  hashId?: string;
}> = ({ file, prefixCls, hashId }) => {
  const statusClassName = classNames(`${prefixCls}-file-size`, hashId);

  if (file.status === 'uploading') {
    return <div className={statusClassName}>上传中...</div>;
  }

  if (file.status === 'error') {
    return (
      <div
        className={classNames(statusClassName, `${prefixCls}-file-size-error`)}
      >
        上传失败
      </div>
    );
  }

  const fileExtension = getFileExtension(file.name);
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

const DeleteButton: React.FC<{
  file: AttachmentFile;
  onClick: (e: React.MouseEvent) => void;
  prefixCls?: string;
  hashId?: string;
}> = ({ file, onClick, prefixCls, hashId }) => {
  if (file.status === 'uploading') return null;

  return (
    <div
      onClick={onClick}
      className={classNames(`${prefixCls}-close-icon`, hashId)}
    >
      <X role="img" aria-label="X" />
    </div>
  );
};

export const AttachmentFileListItem: React.FC<FileListItemProps> = ({
  file,
  prefixCls,
  hashId,
  onPreview,
  onRetry,
  onDelete,
  className,
}) => {
  const handleFileClick = () => {
    if (file.status !== 'done') return;
    onPreview?.();
  };

  const handleRetryClick = () => {
    if (file.status !== 'error') return;
    onRetry?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Tooltip title={'点击重试'} open={file.status === 'error' || undefined}>
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        onClick={handleFileClick}
        className={className}
        exit={{ opacity: 0, y: -20 }}
      >
        <FileIcon file={file} prefixCls={prefixCls} hashId={hashId} />
        <div className={classNames(`${prefixCls}-file-info`, hashId)}>
          <div
            onClick={handleRetryClick}
            className={classNames(`${prefixCls}-file-name`, hashId)}
          >
            <span className={classNames(`${prefixCls}-file-name-text`, hashId)}>
              {getFileNameWithoutExtension(file.name)}
            </span>
          </div>
          <FileStatus file={file} prefixCls={prefixCls} hashId={hashId} />
        </div>
        <DeleteButton
          file={file}
          onClick={handleDeleteClick}
          prefixCls={prefixCls}
          hashId={hashId}
        />
      </motion.div>
    </Tooltip>
  );
};
