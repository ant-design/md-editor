import {
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Image } from 'antd';
import React, { type FC, useState } from 'react';
import type {
  FileProps,
  FileNode,
  FileType,
  GroupNode,
} from '../types';
import { PreviewComponent } from './PreviewComponent';
import { getFileTypeIcon, isImageFile, canPreviewFile } from './utils';
import { formatFileSize, formatLastModified } from '../utils';
import type { MarkdownEditorProps } from '../../MarkdownEditor';

// 通用的键盘事件处理函数
const handleKeyboardEvent = (
  e: React.KeyboardEvent,
  callback: (e: any) => void,
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    callback(e);
  }
};

// 通用的可访问按钮组件
interface AccessibleButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  ariaLabel: string;
}

const AccessibleButton: FC<AccessibleButtonProps> = ({
  icon,
  onClick,
  className,
  ariaLabel,
}) => (
  <div
    className={className}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => handleKeyboardEvent(e, onClick)}
    aria-label={ariaLabel}
  >
    {icon}
  </div>
);

// 文件项组件
const FileItemComponent: FC<{
  file: FileNode;
  onClick?: (file: FileNode) => void;
  onDownload?: (file: FileNode) => void;
  onPreview?: (file: FileNode) => void;
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
    <AccessibleButton
      icon={
        <>
          <div className="workspace-file-item__icon">
            {getFileTypeIcon(file.type, file.icon, file.name)}
          </div>
          <div className="workspace-file-item__info">
            <div className="workspace-file-item__name">{file.name}</div>
            <div className="workspace-file-item__details">
              <span className="workspace-file-item__type">{file.type}</span>
              {file.size && (
                <>
                  <span className="workspace-file-item__separator">|</span>
                  <span className="workspace-file-item__size">
                    {formatFileSize(file.size)}
                  </span>
                </>
              )}
              {file.lastModified && (
                <>
                  <span className="workspace-file-item__separator">|</span>
                  <span className="workspace-file-item__time">
                    {formatLastModified(file.lastModified)}
                  </span>
                </>
              )}
            </div>
          </div>
          {(showPreviewButton || showDownloadButton) && (
            <div className="workspace-file-item__actions" onClick={e => e.stopPropagation()}>
              {showPreviewButton && (
                <AccessibleButton
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                  className="workspace-file-item__preview-icon"
                  ariaLabel={`预览文件：${file.name}`}
                />
              )}
              {showDownloadButton && (
                <AccessibleButton
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  className="workspace-file-item__download-icon"
                  ariaLabel={`下载文件：${file.name}`}
                />
              )}
            </div>
          )}
        </>
      }
      onClick={handleClick}
      className="workspace-file-item"
      ariaLabel={`文件：${file.name}`}
    />
  );
};

// 分组标题栏组件
const GroupHeader: FC<{
  group: GroupNode;
  onToggle?: (type: FileType, collapsed: boolean) => void;
  onGroupDownload?: (files: FileNode[], groupType: FileType) => void;
}> = ({ group, onToggle, onGroupDownload }) => {
  const handleToggle = () => {
    onToggle?.(group.type, !group.collapsed);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGroupDownload?.(group.children, group.type);
  };

  const CollapseIcon = group.collapsed ? RightOutlined : DownOutlined;

  // 获取分组的代表性文件名，用于决定图标
  const getRepresentativeFileName = (): string | undefined => {
    if (group.children.length === 0) return undefined;
    // 优先使用第一个文件的名称
    return group.children[0].name;
  };

  return (
    <AccessibleButton
      icon={
        <>
          <div className="workspace-file-group__header-left">
            <CollapseIcon className="workspace-file-group__toggle-icon" />
            <div className="workspace-file-group__type-icon">
              {getFileTypeIcon(group.type, group.icon, getRepresentativeFileName())}
            </div>
            <span className="workspace-file-group__type-name">
              {group.displayName}
            </span>
          </div>
          <div className="workspace-file-group__header-right">
            <span className="workspace-file-group__count">
              {group.children.length}
            </span>
            <AccessibleButton
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="workspace-file-group__download-icon"
              ariaLabel={`下载${group.displayName}文件`}
            />
          </div>
        </>
      }
      onClick={handleToggle}
      className="workspace-file-group__header"
      ariaLabel={`${group.collapsed ? '展开' : '收起'}${group.displayName}分组`}
    />
  );
};

// 文件分组组件
const FileGroupComponent: FC<{
  group: GroupNode;
  onToggle?: (type: FileType, collapsed: boolean) => void;
  onGroupDownload?: (files: FileNode[], groupType: FileType) => void;
  onDownload?: (file: FileNode) => void;
  onFileClick?: (file: FileNode) => void;
  onPreview?: (file: FileNode) => void;
}> = ({
  group,
  onToggle,
  onGroupDownload,
  onDownload,
  onFileClick,
  onPreview,
}) => {
  return (
    <div className="workspace-file-container--group">
      <GroupHeader
        group={group}
        onToggle={onToggle}
        onGroupDownload={onGroupDownload}
      />
      {!group.collapsed && (
        <div className="workspace-file-group__content">
          {group.children.map((file) => (
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
export const FileComponent: FC<{
  nodes: FileProps['nodes'];
  onGroupDownload?: FileProps['onGroupDownload'];
  onDownload?: FileProps['onDownload'];
  onFileClick?: FileProps['onFileClick'];
  onToggleGroup?: FileProps['onToggleGroup'];
  onPreview?: FileProps['onPreview'];
  /**
   * MarkdownEditor 的配置项，用于自定义预览效果
   * @description 这里的配置会覆盖默认的预览配置
   */
  markdownEditorProps?: Partial<
    Omit<MarkdownEditorProps, 'editorRef' | 'initValue' | 'readonly'>
  >;
}> = ({
  nodes,
  onGroupDownload,
  onDownload,
  onFileClick,
  onToggleGroup,
  onPreview,
  markdownEditorProps,
}) => {
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
  const [imagePreview, setImagePreview] = useState<{
    visible: boolean;
    src: string;
  }>({
    visible: false,
    src: '',
  });
  // 添加内部状态来管理分组的折叠状态
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  if (!nodes || nodes.length === 0) {
    return null;
  }

  // 处理分组折叠/展开
  const handleToggleGroup = (type: FileType, collapsed: boolean) => {
    // 更新内部状态
    setCollapsedGroups((prev) => ({
      ...prev,
      [type]: collapsed,
    }));
    // 如果外部提供了回调，也调用它
    onToggleGroup?.(type, collapsed);
  };

  // 预览文件处理
  const handlePreview = (file: FileNode) => {
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
  const handleDownloadInPreview = (file: FileNode) => {
    onDownload?.(file);
  };

  // 图片预览组件
  const ImagePreviewComponent = (
    <Image
      style={{ display: 'none' }}
      src={imagePreview.src}
      preview={{
        visible: imagePreview.visible,
        onVisibleChange: (visible) => {
          setImagePreview((prev) => ({ ...prev, visible }));
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
          onDownload={handleDownloadInPreview}
          markdownEditorProps={markdownEditorProps}
        />
        {ImagePreviewComponent}
      </>
    );
  }

  // 渲染文件列表
  return (
    <>
      <div className="workspace-file-container">
        {nodes.map((node: FileNode | GroupNode) => {
          if ('children' in node && 'displayName' in node) {
            // 分组节点，使用内部状态覆盖外部的 collapsed 属性
            const groupNode: GroupNode = {
              ...node,
              collapsed: collapsedGroups[node.type] ?? node.collapsed,
              displayName: node.displayName,
              children: node.children,
            };
            return (
              <FileGroupComponent
                key={node.id}
                group={groupNode}
                onToggle={handleToggleGroup}
                onGroupDownload={onGroupDownload}
                onDownload={onDownload}
                onFileClick={onFileClick}
                onPreview={handlePreview}
              />
            );
          }

          // 文件节点
          return (
            <FileItemComponent
              key={node.id}
              file={node as FileNode}
              onClick={onFileClick}
              onDownload={onDownload}
              onPreview={handlePreview}
            />
          );
        })}
      </div>
      {ImagePreviewComponent}
    </>
  );
};
