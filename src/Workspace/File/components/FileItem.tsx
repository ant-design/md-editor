/**
 * FileItem 组件 - 文件项组件
 * 
 * 从 FileComponent.tsx 中提取，用于显示单个文件项
 */

import { ConfigProvider, Typography } from 'antd';
import {
  Download as DownloadIcon,
  Eye as EyeIcon,
  SquareArrowOutUpRight as ShareIcon,
} from '@sofa-design/icons';
import classNames from 'classnames';
import React, { type FC, useContext } from 'react';
import { ActionIconBox } from '../../../Components/ActionIconBox';
import { I18nContext } from '../../../I18n';
import type { FileNode } from '../../types';
import { formatFileSize, formatLastModified } from '../../utils';
import { handleDefaultShare, handleFileDownload, ensureNodeWithId, getFileTypeIcon } from '../utils';
import { fileTypeProcessor, isImageFile } from '../FileTypeProcessor';
import { AccessibleButton } from './AccessibleButton';

export interface FileItemProps {
  file: FileNode;
  onClick?: (file: FileNode) => void;
  onDownload?: (file: FileNode) => void;
  onPreview?: (file: FileNode) => void;
  onShare?: (
    file: FileNode,
    ctx?: { anchorEl?: HTMLElement; origin: 'list' | 'preview' },
  ) => void;
  prefixCls?: string;
  hashId?: string;
}

export const FileItem: FC<FileItemProps> = ({
  file,
  onClick,
  onDownload,
  onPreview,
  onShare,
  prefixCls,
  hashId,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const finalPrefixCls = prefixCls || getPrefixCls('workspace-file');
  const fileWithId = ensureNodeWithId(file);
  const fileTypeInfo = fileTypeProcessor.inferFileType(fileWithId);

  const handleClick = () => {
    if (onClick) {
      onClick(fileWithId);
      return;
    }
    if (onPreview) {
      onPreview(fileWithId);
    }
  };

  const showDownloadButton = (() => {
    if (fileWithId.canDownload !== undefined) {
      return fileWithId.canDownload;
    }
    return Boolean(
      onDownload || fileWithId.url || fileWithId.content || fileWithId.file,
    );
  })();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(fileWithId);
      return;
    }
    handleFileDownload(fileWithId);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(fileWithId);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(fileWithId, {
        anchorEl: e.currentTarget as HTMLElement,
        origin: 'list',
      });
      return;
    }
    handleDefaultShare(fileWithId, locale);
  };

  const showPreviewButton = (() => {
    if (fileWithId.canPreview !== undefined) {
      return fileWithId.canPreview;
    }
    return (
      onPreview &&
      (isImageFile(fileWithId)
        ? !!(fileWithId.url || fileWithId.previewUrl)
        : fileTypeProcessor.processFile(fileWithId).canPreview)
    );
  })();

  const showShareButton = fileWithId.canShare === true;

  return (
    <AccessibleButton
      icon={
        <>
          <div className={classNames(`${finalPrefixCls}-item-icon`, hashId)}>
            {getFileTypeIcon(
              fileTypeInfo.fileType,
              fileWithId.icon,
              fileWithId.name,
            )}
          </div>
          <div className={classNames(`${finalPrefixCls}-item-info`, hashId)}>
            <div className={classNames(`${finalPrefixCls}-item-name`, hashId)}>
              <Typography.Text ellipsis={{ tooltip: fileWithId.name }}>
                {fileWithId.name}
              </Typography.Text>
            </div>
            <div
              className={classNames(`${finalPrefixCls}-item-details`, hashId)}
            >
              <Typography.Text type="secondary" ellipsis>
                <span
                  className={classNames(`${finalPrefixCls}-item-type`, hashId)}
                >
                  {fileTypeInfo.displayType || fileTypeInfo.fileType}
                </span>
                {fileWithId.size && (
                  <>
                    <span
                      className={classNames(
                        `${finalPrefixCls}-item-separator`,
                        hashId,
                      )}
                    >
                      |
                    </span>
                    <span
                      className={classNames(
                        `${finalPrefixCls}-item-size`,
                        hashId,
                      )}
                    >
                      {formatFileSize(fileWithId.size)}
                    </span>
                  </>
                )}
                {fileWithId.lastModified && (
                  <>
                    <span
                      className={classNames(
                        `${finalPrefixCls}-item-separator`,
                        hashId,
                      )}
                    >
                      |
                    </span>
                    <span
                      className={classNames(
                        `${finalPrefixCls}-item-time`,
                        hashId,
                      )}
                    >
                      {formatLastModified(fileWithId.lastModified)}
                    </span>
                  </>
                )}
              </Typography.Text>
            </div>
          </div>
          <div
            className={classNames(`${finalPrefixCls}-item-actions`, hashId)}
            onClick={(e) => e.stopPropagation()}
          >
            {showPreviewButton && (
              <ActionIconBox
                title={locale?.['workspace.file.preview'] || '预览'}
                onClick={handlePreview}
                tooltipProps={{ mouseEnterDelay: 0.3 }}
                className={classNames(
                  `${finalPrefixCls}-item-action-btn`,
                  hashId,
                )}
              >
                <EyeIcon />
              </ActionIconBox>
            )}
            {showShareButton && (
              <ActionIconBox
                title={locale?.['workspace.file.share'] || '分享'}
                onClick={handleShare}
                tooltipProps={{ mouseEnterDelay: 0.3 }}
                className={classNames(
                  `${finalPrefixCls}-item-action-btn`,
                  hashId,
                )}
              >
                <ShareIcon />
              </ActionIconBox>
            )}
            {showDownloadButton && (
              <ActionIconBox
                title={locale?.['workspace.file.download'] || '下载'}
                onClick={handleDownload}
                tooltipProps={{ mouseEnterDelay: 0.3 }}
                className={classNames(
                  `${finalPrefixCls}-item-action-btn`,
                  hashId,
                )}
              >
                <DownloadIcon />
              </ActionIconBox>
            )}
          </div>
        </>
      }
      onClick={handleClick}
      className={classNames(`${finalPrefixCls}-item`, hashId)}
      ariaLabel={`${locale?.['workspace.file'] || '文件'}：${fileWithId.name}`}
    />
  );
};

