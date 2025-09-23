import { RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Image } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { AttachmentFile } from '../AttachmentButton/types';
import { isImageFile } from '../AttachmentButton/utils';
import { FileMapViewItem } from './FileMapViewItem';
import { useStyle } from './style';

export type FileMapViewProps = {
  fileMap?: Map<string, AttachmentFile>;
  onPreview?: (file: AttachmentFile) => void;
  onDownload?: (file: AttachmentFile) => void;
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
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context?.getPrefixCls('md-editor-file-view-list');
  const { wrapSSR, hashId } = useStyle(prefix);

  const [collapse, setCollapse] = React.useState(false);

  const fileList = useMemo(() => {
    if (!props.fileMap) {
      return [];
    }
    if (collapse) {
      return Array.from(props.fileMap.values()).slice(0, 4);
    }
    return Array.from(props.fileMap?.values() || []);
  }, [collapse]);

  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);

  const everythingIsImage = useMemo(() => {
    return fileList.every((file) => isImageFile(file));
  }, [fileList]);

  if (everythingIsImage) {
    return wrapSSR(
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
        className={classNames(prefix, hashId)}
      >
        <Image.PreviewGroup>
          {fileList.map((file, index) => {
            return (
              <Image
                className={classNames(`${prefix}-image`, hashId)}
                width={178}
                height={178}
                src={file.previewUrl || file.url}
                key={file.uuid || file.name || index}
              />
            );
          })}
        </Image.PreviewGroup>
      </motion.div>,
    );
  }

  return wrapSSR(
    <>
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
        className={classNames(prefix, hashId)}
      >
        {fileList.map((file, index) => {
          return (
            <FileMapViewItem
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
              onDownload={() => {
                props.onDownload?.(file);
              }}
              key={file?.uuid || file?.name || index}
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              file={file}
            />
          );
        })}
      </motion.div>

      {(props.fileMap?.size || 0) > 4 && (
        <div>
          <div
            className={classNames(`${prefix}-collapse-button`, hashId)}
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            <RightOutlined
              className={classNames(
                `${prefix}-collapse-button-icon`,
                {
                  [`${prefix}-collapse-button-icon-collapse`]: collapse,
                },
                hashId,
              )}
            />
            <span>{collapse ? '展开' : '收起'}</span>
          </div>
        </div>
      )}
    </>,
  );
};
