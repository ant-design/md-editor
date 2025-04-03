import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { AttachmentFileListItem } from './AttachmentFileListItem';
import { useStyle } from './style';

export type AttachmentFile = File & {
  url?: string;
  status?: 'error' | 'uploading' | 'done';
  uuid?: string;
  previewUrl?: string;
};

export type AttachmentFileListProps = {
  fileMap?: Map<string, AttachmentFile>;
  onDelete: (file: AttachmentFile) => void;
  onClearFileMap?: () => void;
};

export const kbToSize = (kb: number) => {
  const sizes = ['KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(kb) / Math.log(1024));
  return parseFloat((kb / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AttachmentFileList: React.FC<AttachmentFileListProps> = (
  props,
) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context.getPrefixCls('lui-chat-attachment-list');
  const { wrapSSR, hashId } = useStyle(prefix);
  return wrapSSR(
    <>
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
        {Array.from(props.fileMap?.values?.() || []).map((file, index) => (
          <AttachmentFileListItem
            prefixCls={`${prefix}-item`}
            hashId={hashId}
            className={classNames(hashId, `${prefix}-item`)}
            key={index}
            file={file}
            onDelete={() => props.onDelete(file)}
            onPreview={() => {}}
            onDownload={() => {}}
          />
        ))}
      </motion.div>
      {Array.from(props.fileMap?.values() || []).every(
        (file) => file.status === 'done',
      ) ? (
        <div
          style={{
            opacity: props.fileMap?.size ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={() => {
            props.onClearFileMap?.();
          }}
          className={classNames(`${`${prefix}`}-close-icon`, hashId)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="none"
            version="1.1"
            width="1em"
            height="1em"
            viewBox="0 0 10.34375 10.34375"
          >
            <g transform="matrix(0.704716145992279,0.7094893455505371,-0.7094893455505371,0.704716145992279,1.5317849926650524,-3.6804759800434113)">
              <g>
                <path
                  d="M12.0435,4.1095985L5.6435,4.1095985L5.6435,4.1084555C5.391658,4.1084555,5.1875,3.9042975,5.1875,3.6524555C5.1875,3.4006135,5.391658,3.19645536,5.6435,3.19645536L5.6435,3.1953125L12.0435,3.1953125L12.0435,3.19645536C12.29534,3.19645536,12.499500000000001,3.4006135,12.499500000000001,3.6524555C12.499500000000001,3.9042975,12.29534,4.1084555,12.0435,4.1084555L12.0435,4.1095985Z"
                  fillRule="evenodd"
                  fill="currentColor"
                  fillOpacity={1}
                />
              </g>
              <g>
                <path
                  d="M8.847768,0C8.595926,0,8.39176786,0.204158,8.39176786,0.456L8.390625,0.456L8.390625,6.856L8.39176786,6.856C8.39176786,7.10784,8.595926,7.312,8.847768,7.312C9.09961,7.312,9.303768,7.10784,9.303768,6.856L9.304911,6.856L9.304911,0.456L9.303768,0.456C9.303768,0.204158,9.09961,0,8.847768,0Z"
                  fillRule="evenodd"
                  fill="currentColor"
                  fillOpacity={1}
                />
              </g>
            </g>
          </svg>
        </div>
      ) : null}
    </>,
  );
};
