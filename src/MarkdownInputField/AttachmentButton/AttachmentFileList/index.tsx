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
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context?.getPrefixCls('md-editor-attachment-list');
  const { wrapSSR, hashId } = useStyle(prefix);
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

  return wrapSSR(
    <div
      className={classNames(`${prefix}-container`, hashId, {
        [`${prefix}-container-empty`]:
          Array.from(props.fileMap?.values() || []).length === 0,
      })}
    >
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
              onRetry={() => props.onRetry?.(file)}
            />
          ))}
        </AnimatePresence>
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
      </motion.div>
      {Array.from(props.fileMap?.values() || []).every(
        (file) => file.status !== 'uploading',
      ) ? (
        <ActionIconBox
          style={{
            opacity: props.fileMap?.size ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={() => {
            props.onClearFileMap?.();
          }}
          className={classNames(`${`${prefix}`}-close-icon`, hashId)}
        >
          <X />
        </ActionIconBox>
      ) : null}
    </div>,
  );
};
