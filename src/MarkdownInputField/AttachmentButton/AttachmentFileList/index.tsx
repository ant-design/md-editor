import { X } from '@sofa-design/icons';
import { ConfigProvider, Image } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext } from 'react';
import { ActionIconBox } from '../../../components/ActionIconBox';
import { AttachmentFile } from '../types';
import { isImageFile } from '../utils';
import { AttachmentFileListItem } from './AttachmentFileListItem';
import { useStyle } from './style';

export type AttachmentFileListProps = {
  fileMap?: Map<string, AttachmentFile>;
  onDelete: (file: AttachmentFile) => void;
  onPreview?: (file: AttachmentFile) => void;
  onDownload?: (file: AttachmentFile) => void;
  onRetry?: (file: AttachmentFile) => void;
  onClearFileMap?: () => void;
};

// 动画配置
const ANIMATION_VARIANTS = {
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
};

// 隐藏样式
const HIDDEN_STYLE: React.CSSProperties = {
  height: 0,
  overflow: 'hidden',
  padding: 0,
};

// 清空按钮样式
const CLEAR_BUTTON_STYLE: React.CSSProperties = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// 图片预览隐藏样式
const IMAGE_PREVIEW_STYLE: React.CSSProperties = {
  display: 'none',
};

/**
 * AttachmentFileList 组件 - 附件文件列表组件
 *
 * 该组件用于展示已上传的附件文件列表，支持文件预览、下载、删除、重试等功能。
 * 提供动画效果、图片预览、文件状态显示等特性。
 *
 * @component
 * @description 附件文件列表组件，用于展示已上传的附件
 * @param {AttachmentFileListProps} props - 组件属性
 * @param {Map<string, AttachmentFile>} [props.fileMap] - 文件映射表
 * @param {(file: AttachmentFile) => void} props.onDelete - 删除文件回调
 * @param {(file: AttachmentFile) => void} [props.onPreview] - 预览文件回调
 * @param {(file: AttachmentFile) => void} [props.onDownload] - 下载文件回调
 * @param {(file: AttachmentFile) => void} [props.onRetry] - 重试上传文件回调（文件上传失败时调用）
 * @param {() => void} [props.onClearFileMap] - 清空文件映射回调
 *
 * @example
 * ```tsx
 * <AttachmentFileList
 *   fileMap={fileMap}
 *   onDelete={handleDelete}
 *   onPreview={handlePreview}
 *   onDownload={handleDownload}
 *   onRetry={handleRetry}
 *   onClearFileMap={handleClearAll}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的附件文件列表组件
 *
 * @remarks
 * - 支持文件预览和下载
 * - 提供文件删除和重试功能
 * - 集成动画效果
 * - 支持图片预览
 * - 显示文件状态（上传中、完成、错误）
 * - 响应式布局
 * - 支持文件大小格式化
 * - 集成Ant Design组件
 * - 文件上传失败时可重试上传
 */
export const AttachmentFileList: React.FC<AttachmentFileListProps> = (
  props,
) => {
  const { fileMap, onDelete, onPreview, onDownload, onRetry, onClearFileMap } =
    props;

  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context?.getPrefixCls('md-editor-attachment-list');
  const { wrapSSR, hashId } = useStyle(prefix);
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

  // 获取文件列表
  const fileList = Array.from(fileMap?.values() || []);
  const hasFiles = fileList.length > 0;
  const isAnyUploading = fileList.some((file) => file.status === 'uploading');

  // 处理文件预览
  const handlePreview = (file: AttachmentFile) => {
    // 如果有自定义预览函数，使用它
    if (onPreview) {
      onPreview(file);
      return;
    }

    // 图片文件使用内置预览
    if (isImageFile(file)) {
      setImgSrc(file.previewUrl || file.url);
      return;
    }

    // 其他文件在新窗口打开
    if (typeof window === 'undefined') return;
    window.open(file.previewUrl || file.url, '_blank');
  };

  // 处理预览关闭
  const handlePreviewClose = (visible: boolean) => {
    if (!visible) {
      setImgSrc(undefined);
    }
  };

  // 获取容器样式
  const getContainerStyle = () => {
    return fileMap?.size ? {} : HIDDEN_STYLE;
  };

  // 获取清空按钮样式
  const getClearButtonStyle = (): React.CSSProperties => {
    return {
      ...CLEAR_BUTTON_STYLE,
      opacity: fileMap?.size ? 1 : 0,
    };
  };

  // 渲染清空按钮
  const renderClearButton = () => {
    if (isAnyUploading) return null;

    return (
      <ActionIconBox
        style={getClearButtonStyle()}
        onClick={onClearFileMap}
        className={classNames(`${prefix}-close-icon`, hashId)}
      >
        <X />
      </ActionIconBox>
    );
  };

  return wrapSSR(
    <div
      className={classNames(`${prefix}-container`, hashId, {
        [`${prefix}-container-empty`]: !hasFiles,
      })}
    >
      <motion.div
        variants={ANIMATION_VARIANTS}
        whileInView="visible"
        initial="hidden"
        animate="visible"
        style={getContainerStyle()}
        className={classNames(prefix, hashId)}
      >
        <AnimatePresence initial={false}>
          {fileList.map((file, index) => (
            <AttachmentFileListItem
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              key={file?.uuid || file?.name || index}
              file={file}
              onDelete={() => onDelete(file)}
              onPreview={() => handlePreview(file)}
              onDownload={() => onDownload?.(file)}
              onRetry={() => onRetry?.(file)}
            />
          ))}
        </AnimatePresence>
        <Image
          key="preview"
          src={imgSrc}
          alt="Preview"
          style={IMAGE_PREVIEW_STYLE}
          preview={{
            visible: !!imgSrc,
            scaleStep: 1,
            src: imgSrc,
            onVisibleChange: handlePreviewClose,
          }}
        />
      </motion.div>
      {renderClearButton()}
    </div>,
  );
};
