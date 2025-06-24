import { RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Image } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { isImageFile } from '../AttachmentButton';
import { AttachmentFile } from '../AttachmentButton/AttachmentFileList';
import { FileMapViewItem } from './FileMapViewItem';
import { useStyle } from './style';

export type FileMapViewProps = {
  fileMap?: Map<string, AttachmentFile>;
  onPreview?: (file: AttachmentFile) => void;
  onDownload?: (file: AttachmentFile) => void;
};

export type { AttachmentFile } from '../AttachmentButton/AttachmentFileList';

/**
 * @component FileMapView
 * @description 文件地图视图组件，用于显示文件列表并提供预览和下载功能
 *
 * @param {FileMapViewProps} props - 组件属性
 * @param {Map<string, any>} [props.fileMap] - 文件映射表，键为文件ID，值为文件对象
 * @param {Function} [props.onPreview] - 文件预览回调函数，如果提供则覆盖默认预览行为
 * @param {Function} [props.onDownload] - 文件下载回调函数
 *
 * @remarks
 * 该组件具有以下特点:
 * - 支持文件列表的展开和收起功能（当文件数量超过4个时）
 * - 对于图片文件，提供内置的预览功能
 * - 对于非图片文件，默认在新标签页中打开
 * - 支持自定义预览和下载行为
 * - 使用动画效果展示文件列表项
 *
 * @example
 * ```tsx
 * <FileMapView
 *   fileMap={myFileMap}
 *   onPreview={(file) => console.log('预览文件', file)}
 *   onDownload={(file) => console.log('下载文件', file)}
 * />
 * ```
 */
export const FileMapView: React.FC<FileMapViewProps> = (props) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context.getPrefixCls('md-editor-file-view-list');
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
