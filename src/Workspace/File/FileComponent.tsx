import {
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Image } from 'antd';
import React, { type FC, useState } from 'react';
import type {
  FileComponentData,
  FileGroup,
  FileItem,
  FileType,
} from '../types';
import { PreviewComponent } from './PreviewComponent';
import { canPreviewFile, getFileTypeIcon, isImageFile } from './utils';

// 文件项组件
const FileItemComponent: FC<{
  file: FileItem;
  onClick?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onPreview?: (file: FileItem) => void;
}> = ({ file, onClick, onDownload, onPreview }) => {
  const handleClick = () => {
    onClick?.(file);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 优先使用用户传入的下载方法
    if (onDownload) {
      onDownload(file);
      return;
    }

    // 使用url作为下载链接
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(file);
  };

  // 判断是否显示下载按钮：有用户方法或有url
  const showDownloadButton = onDownload || file.url;
  
  // 判断是否显示预览按钮：支持预览且有预览回调
  const showPreviewButton = onPreview && canPreviewFile(file);

  return (
    <div
      className="workspace-file-item"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`文件：${file.name}`}
    >
      <div className="workspace-file-item__icon">
        {getFileTypeIcon(file.type, file.icon)}
      </div>
      <div className="workspace-file-item__info">
        <div className="workspace-file-item__name">{file.name}</div>
        <div className="workspace-file-item__details">
          <span className="workspace-file-item__type">{file.type}</span>
          {file.size && (
            <>
              <span className="workspace-file-item__separator">|</span>
              <span className="workspace-file-item__size">{file.size}</span>
            </>
          )}
          {file.lastModified && (
            <>
              <span className="workspace-file-item__separator">|</span>
              <span className="workspace-file-item__time">
                {file.lastModified}
              </span>
            </>
          )}
        </div>
      </div>
      {(showPreviewButton || showDownloadButton) && (
        <div className="workspace-file-item__actions">
          {showPreviewButton && (
            <EyeOutlined
              className="workspace-file-item__preview-icon"
              onClick={handlePreview}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePreview(e as any);
                }
              }}
              aria-label={`预览文件：${file.name}`}
            />
          )}
          {showDownloadButton && (
            <DownloadOutlined
              className="workspace-file-item__download-icon"
              onClick={handleDownload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDownload(e as any);
                }
              }}
              aria-label={`下载文件：${file.name}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

// 分组标题栏组件
const GroupHeader: FC<{
  group: FileGroup;
  onToggle?: (type: FileType, collapsed: boolean) => void;
  onGroupDownload?: (files: FileItem[], groupType: FileType) => void;
}> = ({ group, onToggle, onGroupDownload }) => {
  const handleToggle = () => {
    onToggle?.(group.type, !group.collapsed);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGroupDownload?.(group.files, group.type);
  };

  const CollapsedIcon = group.collapsed ? RightOutlined : DownOutlined;

  return (
    <div
      className="workspace-file-group__header"
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggle();
        }
      }}
      aria-label={`${group.collapsed ? '展开' : '收起'}${group.typeName}分组`}
    >
      <div className="workspace-file-group__header-left">
        <CollapsedIcon className="workspace-file-group__toggle-icon" />
        <div className="workspace-file-group__type-icon">
          {getFileTypeIcon(group.type, group.icon)}
        </div>
        <span className="workspace-file-group__type-name">
          {group.typeName}
        </span>
      </div>
      <div className="workspace-file-group__header-right">
        <span className="workspace-file-group__count">
          {group.files.length}
        </span>
        <DownloadOutlined
          className="workspace-file-group__download-icon"
          onClick={handleDownload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDownload(e as any);
            }
          }}
          aria-label={`下载${group.typeName}文件`}
        />
      </div>
    </div>
  );
};

// 文件分组组件
const FileGroupComponent: FC<{
  group: FileGroup;
  onToggle?: (type: FileType, collapsed: boolean) => void;
  onGroupDownload?: (files: FileItem[], groupType: FileType) => void;
  onDownload?: (file: FileItem) => void;
  onFileClick?: (file: FileItem) => void;
  onPreview?: (file: FileItem) => void;
}> = ({ group, onToggle, onGroupDownload, onDownload, onFileClick, onPreview }) => {
  return (
    <div className="workspace-file-group">
      <GroupHeader
        group={group}
        onToggle={onToggle}
        onGroupDownload={onGroupDownload}
      />
      {!group.collapsed && (
        <div className="workspace-file-group__content">
          {group.files.map((file) => (
            <FileItemComponent
              key={file.id}
              file={file}
              onClick={onFileClick}
              onDownload={onDownload}
              onPreview={onPreview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 主文件组件
export const FileComponent: FC<{ data?: FileComponentData }> = ({ data }) => {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [imagePreview, setImagePreview] = useState<{ visible: boolean; src: string }>({
    visible: false,
    src: '',
  });

  if (!data) {
    return null;
  }

  const {
    mode,
    groups,
    files,
    onGroupDownload,
    onDownload,
    onFileClick,
    onToggleGroup,
    onPreview,
  } = data;

  // 预览文件处理
  const handlePreview = (file: FileItem) => {
    if (onPreview) {
      onPreview(file);
    } else {
      // 如果是图片文件，使用 Antd Image 组件预览
      if (isImageFile(file)) {
        setImagePreview({
          visible: true,
          src: file.url || '',
        });
      } else {
        // 非图片文件进入预览页面
        setPreviewFile(file);
      }
    }
  };

  const handleBackToList = () => {
    setPreviewFile(null);
  };

  // 处理预览页面的下载
  const handlePreviewDownload = (file: FileItem) => {
    onDownload?.(file);
  };

  // 图片预览组件
  const imagePreviewComponent = (
    <Image
      style={{ display: 'none' }}
      src={imagePreview.src}
      preview={{
        visible: imagePreview.visible,
        onVisibleChange: (visible) => {
          setImagePreview(prev => ({ ...prev, visible }));
        },
      }}
    />
  );

  // 如果正在预览文件，显示预览组件
  if (previewFile) {
    return (
      <>
        <PreviewComponent 
          file={previewFile} 
          onBack={handleBackToList}
          onDownload={handlePreviewDownload}
        />
        {imagePreviewComponent}
      </>
    );
  }

  // 分组展示模式
  if (mode === 'group' && groups) {
    return (
      <>
        <div className="workspace-file-container workspace-file-container--group">
          {groups.map((group) => (
            <FileGroupComponent
              key={group.type}
              group={group}
              onToggle={onToggleGroup}
              onGroupDownload={onGroupDownload}
              onDownload={onDownload}
              onFileClick={onFileClick}
              onPreview={handlePreview}
            />
          ))}
        </div>
        {imagePreviewComponent}
      </>
    );
  }

  // 平铺展示模式
  if (mode === 'flat' && files) {
    return (
      <>
        <div className="workspace-file-container workspace-file-container--flat">
          {files.map((file) => (
            <FileItemComponent
              key={file.id}
              file={file}
              onClick={onFileClick}
              onDownload={onDownload}
              onPreview={handlePreview}
            />
          ))}
        </div>
        {imagePreviewComponent}
      </>
    );
  }

  return (
    <>
      {imagePreviewComponent}
    </>
  );
};
