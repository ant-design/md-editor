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

/**
 * FileMapViewItem 组件 - 文件映射视图项组件
 *
 * 该组件用于显示单个文件项，包括文件图标、文件名、文件大小等信息。
 * 支持文件预览和下载操作，提供动画效果和工具提示。
 *
 * @component
 * @description 文件映射视图项组件，显示单个文件信息
 * @param {Object} props - 组件属性
 * @param {AttachmentFile} props.file - 文件对象
 * @param {() => void} props.onPreview - 预览文件回调
 * @param {() => void} props.onDownload - 下载文件回调
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} [props.prefixCls] - 前缀类名
 * @param {string} [props.hashId] - 哈希ID
 *
 * @example
 * ```tsx
 * <FileMapViewItem
 *   file={fileData}
 *   onPreview={() => handlePreview(fileData)}
 *   onDownload={() => handleDownload(fileData)}
 *   className="custom-file-item"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的文件映射视图项组件
 *
 * @remarks
 * - 显示文件图标、名称和大小
 * - 支持文件预览和下载操作
 * - 提供动画效果
 * - 显示工具提示
 * - 自动处理文件状态
 * - 支持自定义样式
 */
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
          data-testid="file-item"
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
                {file?.name?.split('.').slice(0, -1).join('.')}
              </span>
              <span
                className={classNames(
                  `${props.prefixCls}-file-name-extension`,
                  props.hashId,
                )}
              >
                .{file?.name?.split('.').slice(-1)}
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
