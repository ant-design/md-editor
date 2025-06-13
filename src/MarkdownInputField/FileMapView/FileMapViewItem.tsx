import { EyeFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { I18nContext } from '../../i18n';
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
  const { locale } = useContext(I18nContext);
  return useMemo(
    () => (
      <Tooltip
        title={
          <div>
            <EyeFilled /> {locale?.clickToPreview}
          </div>
        }
        placement="topLeft"
        arrow={false}
      >
        <motion.div
          onClick={() => {
            if (file.status === 'error') {
              return;
            }
            props.onPreview?.();
          }}
          variants={{
            hidden: { x: 20, opacity: 0 },
            visible: {
              x: 0,
              opacity: 1,
            },
            exit: { x: -20, opacity: 0 },
          }}
          exit={{ opacity: 0, x: -20 }}
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
