import { FileSearch } from '@sofa-design/icons';
import { ConfigProvider, Image } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { AttachmentFile } from '../AttachmentButton/types';
import { isImageFile } from '../AttachmentButton/utils';
import { FileMapViewItem } from './FileMapViewItem';
import { useStyle } from './style';

export type FileMapViewProps = {
  /** 文件映射表 */
  fileMap?: Map<string, AttachmentFile>;
  /** 预览文件回调 */
  onPreview?: (file: AttachmentFile) => void;
  /** 下载文件回调 */
  onDownload?: (file: AttachmentFile) => void;
  /** 点击“查看所有文件”回调，携带当前所有文件列表 */
  onViewAll?: (files: AttachmentFile[]) => void;
  /** 自定义更多操作 DOM（优先于 onMore，传入则展示该 DOM，不传则不展示更多按钮） */
  renderMoreAction?: (file: AttachmentFile) => React.ReactNode;
  /** 自定义悬浮动作区 slot（传入则覆盖默认『预览/下载/更多』动作区） */
  customSlot?: React.ReactNode | ((file: AttachmentFile) => React.ReactNode);
  /** 自定义根容器样式（可覆盖布局，如 flexDirection、gap、wrap 等） */
  style?: React.CSSProperties;
  /** 自定义根容器类名 */
  className?: string;
  /** 最多展示的文件数量，默认展示 3 个 */
  maxDisplayCount?: number;
  placement?: 'left' | 'right';
  /** 是否展示“查看此任务中的所有文件”按钮（默认展示） */
  showMoreButton?: boolean;
};

/**
 * FileMapView 组件 - 文件映射视图组件
 *
 * 该组件用于显示文件列表，支持图片预览、文件下载、文件预览等功能。
 * 根据文件类型提供不同的显示方式，图片文件以网格形式显示，其他文件以列表形式显示。
 *
 * @component
 * @description 文件映射视图组件，显示文件列表和预览功能
 * @param {FileMapViewProps} props - 组件属性
 * @param {Map<string, AttachmentFile>} props.fileMap - 文件映射表
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {(file: AttachmentFile) => void} [props.onFileClick] - 文件点击回调
 * @param {(file: AttachmentFile) => void} [props.onPreview] - 文件预览回调
 * @param {(file: AttachmentFile) => void} [props.onDownload] - 文件下载回调
 * @param {boolean} [props.collapsible] - 是否可折叠
 * @param {number} [props.maxDisplayCount] - 最大显示数量
 *
 * @example
 * ```tsx
 * <FileMapView
 *   fileMap={fileMap}
 *   onFileClick={(file) => console.log('点击文件', file)}
 *   onPreview={(file) => console.log('预览文件', file)}
 *   onDownload={(file) => console.log('下载文件', file)}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的文件映射视图组件
 *
 * @remarks
 * - 支持图片文件的网格预览
 * - 支持其他文件类型的列表显示
 * - 提供文件预览和下载功能
 * - 支持文件列表折叠
 * - 提供动画效果
 * - 自动识别文件类型
 * - 支持自定义样式和交互
 */
export const FileMapView: React.FC<FileMapViewProps> = (props) => {
  const { placement = 'left' } = props;
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context?.getPrefixCls('md-editor-file-view-list');
  const { wrapSSR, hashId } = useStyle(prefix);

  const maxCount = props.maxDisplayCount ?? 3;

  const fileList = useMemo(() => {
    if (!props.fileMap) {
      return [];
    }
    return Array.from(props.fileMap?.values() || []);
  }, [props.fileMap]);

  const limitedFiles = useMemo(() => {
    // 需求：当 showMoreButton === false 时，展示全部文件；否则仅展示前 maxCount 个
    if (props.showMoreButton === false) {
      return fileList;
    }
    return fileList.slice(0, Math.max(0, maxCount));
  }, [fileList, maxCount, props.showMoreButton]);

  const imgList = useMemo(() => {
    return limitedFiles.filter((file) => isImageFile(file));
  }, [fileList]);

  const noImageFileList = useMemo(() => {
    return limitedFiles.filter((file) => !isImageFile(file));
  }, [fileList]);

  return wrapSSR(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: placement === 'left' ? 'flex-start' : 'flex-end',
      }}
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
        animate={'visible'}
        style={props.style}
        className={classNames(
          prefix,
          hashId,
          props.className,
          `${prefix}-${placement}`,
          `${prefix}-image-list-view`,
        )}
      >
        <Image.PreviewGroup>
          {imgList.map((file, index) => {
            return (
              <Image
                rootClassName={`${prefix}-image-view`}
                className={classNames(`${prefix}-image`, hashId)}
                width={124}
                height={124}
                src={file.previewUrl || file.url}
                key={file.uuid || file.name || index}
              />
            );
          })}
        </Image.PreviewGroup>
      </motion.div>
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
        animate={'visible'}
        className={classNames(
          prefix,
          hashId,
          props.className,
          `${prefix}-${placement}`,
          {
            [`${prefix}-vertical`]: placement === 'left',
          },
        )}
        style={props.style}
      >
        {noImageFileList.map((file, index) => {
          return (
            <FileMapViewItem
              style={{ width: props.style?.width }}
              onPreview={() => {
                if (props.onPreview) {
                  props.onPreview?.(file);
                  return;
                }
                if (typeof window === 'undefined') return;
                window.open(file.previewUrl || file.url, '_blank');
              }}
              onDownload={() => {
                props.onDownload?.(file);
              }}
              renderMoreAction={props.renderMoreAction}
              customSlot={props.customSlot}
              key={file?.uuid || file?.name || index}
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              file={file}
            />
          );
        })}
        {props.showMoreButton !== false && fileList.length > maxCount ? (
          <div
            style={{ width: props.style?.width }}
            className={classNames(hashId, `${prefix}-more-file-container`)}
            onClick={() => props.onViewAll?.(fileList)}
          >
            <FileSearch color="var(--color-gray-text-secondary)" />
            <div className={classNames(hashId, `${prefix}-more-file-name`)}>
              <span style={{ whiteSpace: 'nowrap' }}>
                查看此任务中的所有文件
              </span>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>,
  );
};
