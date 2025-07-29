import {
  DownloadOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import React, { type FC } from 'react';
import type {
  FileComponentData,
  FileGroup,
  FileItem,
  FileType,
} from '../types';
import { getFileTypeIcon } from './utils';

// 文件项组件
const FileItemComponent: FC<{
  file: FileItem;
  onClick?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
}> = ({ file, onClick, onDownload }) => {
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
    
    // 如果有downloadUrl，组件内部直接下载
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 判断是否显示下载按钮：有用户方法或有downloadUrl
  const showDownloadButton = onDownload || file.downloadUrl;

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
            <span className="workspace-file-item__size">{file.size}</span>
          )}
          {file.createTime && (
            <span className="workspace-file-item__time">{file.createTime}</span>
          )}
        </div>
      </div>
      {showDownloadButton && (
        <div className="workspace-file-item__actions">
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
}> = ({ group, onToggle, onGroupDownload, onDownload, onFileClick }) => {
  return (
    <div className="workspace-file-group">
      <GroupHeader group={group} onToggle={onToggle} onGroupDownload={onGroupDownload} />
      {!group.collapsed && (
        <div className="workspace-file-group__content">
          {group.files.map((file) => (
            <FileItemComponent
              key={file.id}
              file={file}
              onClick={onFileClick}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 主文件组件
export const FileComponent: FC<{ data?: FileComponentData }> = ({ data }) => {
  if (!data) {
    return null;
  }

  const { mode, groups, files, onGroupDownload, onDownload, onFileClick, onToggleGroup } = data;

  // 分组展示模式
  if (mode === 'group' && groups) {
    return (
      <div className="workspace-file-container workspace-file-container--group">
        {groups.map((group) => (
          <FileGroupComponent
            key={group.type}
            group={group}
            onToggle={onToggleGroup}
            onGroupDownload={onGroupDownload}
            onDownload={onDownload}
            onFileClick={onFileClick}
          />
        ))}
      </div>
    );
  }

  // 平铺展示模式
  if (mode === 'flat' && files) {
    return (
      <div className="workspace-file-container workspace-file-container--flat">
        {files.map((file) => (
          <FileItemComponent 
            key={file.id} 
            file={file} 
            onClick={onFileClick}
            onDownload={onDownload}
          />
        ))}
      </div>
    );
  }

  return null;
};
