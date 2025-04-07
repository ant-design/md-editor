import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { LoadingIcon } from '../../../icons/LoadingIcon';
import { AttachmentFileIcon } from './AttachmentFileIcon';
import { AttachmentFile, kbToSize } from './index';

export const AttachmentFileListItem: React.FC<{
  file: AttachmentFile;
  onDelete: () => void;
  onPreview: () => void;
  onDownload: () => void;
  className?: string;
  prefixCls?: string;
  hashId?: string;
}> = (props) => {
  const file = props.file;
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
        },
      }}
      onClick={() => {
        if (file.status === 'done') {
          props.onPreview?.();
        }
      }}
      className={props.className}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={classNames(`${props.prefixCls}-file-icon`, props.hashId)}>
        {file.status === 'uploading' ? (
          <div
            className={classNames(
              `${props.prefixCls}-uploading-icon`,
              props.hashId,
            )}
          >
            <LoadingIcon />
          </div>
        ) : null}
        {file.status === 'done' ? <AttachmentFileIcon file={file} /> : null}
      </div>
      <div className={classNames(`${props.prefixCls}-file-info`, props.hashId)}>
        <div
          className={classNames(`${props.prefixCls}-file-name`, props.hashId)}
        >
          <span
            className={classNames(
              `${props.prefixCls}-file-name-text`,
              props.hashId,
            )}
          >
            {file.name.split('.').slice(0, -1).join('.')}
          </span>
          <span
            className={classNames(
              `${props.prefixCls}-file-name-extension`,
              props.hashId,
            )}
          >
            .{file.name.split('.').slice(-1)}
          </span>
        </div>
        <div
          className={classNames(`${props.prefixCls}-file-size`, props.hashId)}
        >
          {kbToSize(file.size / 1024)}
        </div>
      </div>
      {file.status === 'done' ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.stopPropagation();
            props.onDelete?.();
          }}
          className={classNames(`${props.prefixCls}-close-icon`, props.hashId)}
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
    </motion.div>
  );
};
