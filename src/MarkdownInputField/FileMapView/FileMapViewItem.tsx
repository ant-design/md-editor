import { EyeFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import {
  AttachmentFile,
  kbToSize,
} from '../AttachmentButton/AttachmentFileList';
import { AttachmentFileIcon } from '../AttachmentButton/AttachmentFileList/AttachmentFileIcon';

export const FileMapViewItem: React.FC<{
  file: AttachmentFile;
  onPreview: () => void;
  onDownload: () => void;
  className?: string;
  prefixCls?: string;
  hashId?: string;
}> = (props) => {
  const file = props.file;
  return useMemo(
    () => (
      <Tooltip
        title={
          <div>
            <EyeFilled /> 点击可查看预览
          </div>
        }
        placement="topLeft"
        arrow={false}
      >
        <motion.div
          onClick={() => {
            props.onPreview?.();
          }}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className={props.className}
        >
          <div
            className={classNames(`${props.prefixCls}-file-icon`, props.hashId)}
          >
            <AttachmentFileIcon file={file} />
          </div>
          <div
            className={classNames(`${props.prefixCls}-file-info`, props.hashId)}
          >
            <div
              className={classNames(
                `${props.prefixCls}-file-name`,
                props.hashId,
              )}
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
              className={classNames(
                `${props.prefixCls}-file-size`,
                props.hashId,
              )}
            >
              {kbToSize(file.size / 1024)}
            </div>
          </div>
        </motion.div>
      </Tooltip>
    ),
    [file, file.status],
  );
};
