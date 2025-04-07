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
                window.open(file.previewUrl || file.url, '_blank');
              }}
              onDownload={() => {
                props.onDownload?.(file);
              }}
              prefixCls={`${prefix}-item`}
              hashId={hashId}
              className={classNames(hashId, `${prefix}-item`)}
              file={file}
              key={index}
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
