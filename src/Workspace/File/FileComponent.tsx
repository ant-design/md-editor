import {
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Image, Typography } from 'antd';
import React, { type FC, useState } from 'react';
import type { MarkdownEditorProps } from '../../MarkdownEditor';
import type { FileNode, FileProps, FileType, GroupNode } from '../types';
import { formatFileSize, formatLastModified } from '../utils';
import { fileTypeProcessor, isImageFile } from './FileTypeProcessor';
import { PreviewComponent } from './PreviewComponent';
import { generateUniqueId, getFileTypeIcon } from './utils';

// 通用的键盘事件处理函数
const handleKeyboardEvent = (
  e: React.KeyboardEvent,
  callback: (e: any) => void,
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    callback(e);
  }
};

// 通用的下载处理函数
const handleFileDownload = (file: FileNode) => {
  let blobUrl: string | null = null;

  try {
    // 创建下载链接
    const link = document.createElement('a');

    if (file.url) {
      // 使用url作为下载链接
      link.href = file.url;
    } else if (file.content) {
      // 使用文件内容创建 Blob 对象
      const blob = new Blob([file.content], { type: 'text/plain' });
      blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
    } else if (file.file instanceof File || file.file instanceof Blob) {
      // 处理 File 或 Blob 对象
      blobUrl = URL.createObjectURL(file.file);
      link.href = blobUrl;
    } else {
      return; // 没有可下载的内容
    }

    // 设置文件名（如果是 File 对象且没有指定文件名，使用 File 对象的名称）
    link.download =
      file.name || (file.file instanceof File ? file.file.name : '');

    // 执行下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    // 清理 Blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
  }
};

// 确保节点有唯一ID的辅助函数
const ensureNodeWithId = <T extends FileNode | GroupNode>(node: T): T => ({
  ...node,
  id: node.id || generateUniqueId(node),
});

// 获取文件预览源的辅助函数
const getPreviewSource = (file: FileNode): string => {
  return file.previewUrl || file.url || '';
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
  // 确保文件有唯一ID
  const fileWithId = ensureNodeWithId(file);
  const fileTypeInfo = fileTypeProcessor.inferFileType(fileWithId);

  const handleClick = () => {
    onClick?.(fileWithId);
  };

  // 判断是否显示下载按钮：有用户方法、有url、有content或有file对象
  const showDownloadButton =
    onDownload || fileWithId.url || fileWithId.content || fileWithId.file;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 优先使用用户传入的下载方法
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

  // 判断是否显示预览按钮：
  // 1. 如果用户设置了 canPreview，优先使用用户的设置
  // 2. 如果没有设置，则使用系统默认逻辑：图片类型有 url 就可以预览；其他类型按原有逻辑判断
  const showPreviewButton = (() => {
    // 如果用户明确设置了 canPreview，直接使用用户设置
    if (fileWithId.canPreview !== undefined) {
      return fileWithId.canPreview;
    }

    // 否则使用系统默认逻辑
    return (
      onPreview &&
      (isImageFile(fileWithId)
        ? !!(fileWithId.url || fileWithId.previewUrl)
        : fileTypeProcessor.processFile(fileWithId).canPreview)
    );
  })();

  return (
    <AccessibleButton
      icon={
        <>
          <div className="workspace-file-item__icon">
            {getFileTypeIcon(
              fileTypeInfo.fileType,
              fileWithId.icon,
              fileWithId.name,
            )}
          </div>
          <div className="workspace-file-item__info">
            <div className="workspace-file-item__name">
              <Typography.Text ellipsis={{ tooltip: fileWithId.name }}>
                {fileWithId.name}
              </Typography.Text>
            </div>
            <div className="workspace-file-item__details">
              <Typography.Text type="secondary" ellipsis>
                <span className="workspace-file-item__type">
                  {fileTypeInfo.displayType || fileTypeInfo.fileType}
                </span>
                {fileWithId.size && (
                  <>
                    <span className="workspace-file-item__separator">|</span>
                    <span className="workspace-file-item__size">
                      {formatFileSize(fileWithId.size)}
                    </span>
                  </>
                )}
                {fileWithId.lastModified && (
                  <>
                    <span className="workspace-file-item__separator">|</span>
                    <span className="workspace-file-item__time">
                      {formatLastModified(fileWithId.lastModified)}
                    </span>
                  </>
                )}
              </Typography.Text>
            </div>
          </div>
          <div
            className="workspace-file-item__actions"
            onClick={(e) => e.stopPropagation()}
          >
            {showPreviewButton && (
              <AccessibleButton
                icon={<EyeOutlined />}
                onClick={handlePreview}
                className="workspace-file-item__preview-icon"
                ariaLabel={`预览文件：${fileWithId.name}`}
              />
            )}
            {showDownloadButton && (
              <AccessibleButton
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                className="workspace-file-item__download-icon"
                ariaLabel={`下载文件：${fileWithId.name}`}
              />
            )}
          </div>
        </>
      }
      onClick={handleClick}
      className="workspace-file-item"
      ariaLabel={`文件：${fileWithId.name}`}
    />
  );
};

// 分组标题栏组件
const GroupHeader: FC<{
  group: GroupNode;
  onToggle?: (type: FileType, collapsed: boolean) => void;
  onGroupDownload?: (files: FileNode[], groupType: FileType) => void;
}> = ({ group, onToggle, onGroupDownload }) => {
  const groupTypeInfo = fileTypeProcessor.inferFileType(group);
  const groupType = group.type || groupTypeInfo.fileType;

  const handleToggle = () => {
    onToggle?.(groupType, !group.collapsed);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGroupDownload?.(group.children, groupType);
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
              {getFileTypeIcon(
                groupType,
                group.icon,
                getRepresentativeFileName(),
              )}
            </div>
            <span className="workspace-file-group__type-name">
              {group.name}
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
              ariaLabel={`下载${group.name}文件`}
            />
          </div>
        </>
      }
      onClick={handleToggle}
      className="workspace-file-group__header"
      ariaLabel={`${group.collapsed ? '展开' : '收起'}${group.name}分组`}
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
  const [previewFile, setPreviewFile] = useState<
    FileNode | React.ReactNode | null
  >(null);
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
  const handlePreview = async (file: FileNode) => {
    // 如果用户提供了预览方法，尝试使用用户的方法
    if (onPreview) {
      const previewData = await onPreview(file);
      if (previewData) {
        // 如果返回的是FileNode或ReactNode，直接设置预览文件
        setPreviewFile(previewData);
        return;
      }
      // 如果用户方法没有返回值，继续使用内部预览逻辑
    }

    // 使用组件库内部的预览逻辑
    if (isImageFile(file)) {
      const previewSrc = getPreviewSource(file);
      setImagePreview({
        visible: true,
        src: previewSrc,
      });
      return;
    }
    setPreviewFile(file);
  };

  const handleBackToList = () => {
    setPreviewFile(null);
  };

  // 处理预览页面的下载
  const handleDownloadInPreview = (file: FileNode) => {
    // 优先使用用户传入的下载方法
    if (onDownload) {
      onDownload(file);
      return;
    }

    handleFileDownload(file);
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
          const nodeWithId = ensureNodeWithId(node);

          if ('children' in nodeWithId) {
            // 分组节点，使用内部状态覆盖外部的 collapsed 属性
            const nodeTypeInfo = fileTypeProcessor.inferFileType(nodeWithId);
            const groupNode: GroupNode = {
              ...nodeWithId,
              collapsed:
                collapsedGroups[nodeTypeInfo.fileType] ?? nodeWithId.collapsed,
              // 确保子节点也有唯一ID
              children: nodeWithId.children.map(ensureNodeWithId),
            };
            return (
              <FileGroupComponent
                key={nodeWithId.id}
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
              key={nodeWithId.id}
              file={nodeWithId as FileNode}
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
