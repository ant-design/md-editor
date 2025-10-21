import { Eye, FileFailed, FileUploadingSpin } from '@sofa-design/icons';
import { Image } from 'antd';
import React from 'react';
import { getFileTypeIcon } from '../../../Workspace/File/utils';
import { FileType } from '../../../Workspace/types';
import { AttachmentFile } from '../types';
import { isImageFile } from '../utils';

/**
 * AttachmentFileIcon 组件 - 附件文件图标组件
 *
 * 该组件根据文件类型显示不同的图标或预览。如果是图片文件，则显示图片预览；
 * 如果是其他类型文件，则显示对应的文件图标。
 *
 * @component
 * @description 附件文件图标组件，根据文件类型显示图标或预览
 * @param {Object} props - 组件属性
 * @param {AttachmentFile} props.file - 附件文件对象
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * <AttachmentFileIcon
 *   file={fileData}
 *   className="custom-icon"
 *   style={{ fontSize: '24px' }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的文件图标或预览组件
 *
 * @remarks
 * - 支持图片文件预览显示
 * - 支持多种文件类型图标
 * - 自动识别文件类型
 * - 提供自定义样式支持
 * - 响应式布局
 * - 图片自适应显示
 * - 图标居中显示
 */
export const AttachmentFileIcon: React.FC<{
  file: AttachmentFile;
  className: string;
  style?: React.CSSProperties;
}> = (props) => {
  const file = props.file;
  if (file.status === 'uploading') {
    return <FileUploadingSpin />;
  }
  if (file.status === 'error') {
    return <FileFailed />;
  }
  if (isImageFile(file)) {
    return (
      <Image
        src={file.url}
        style={{
          width: '40px',
          height: '40px',
          overflow: 'hidden',
        }}
        rootClassName={props.className}
        preview={{
          mask: (
            <div>
              <Eye />
            </div>
          ),
          visible: false,
        }}
        alt={file.name}
      />
    );
  }
  return getFileTypeIcon(
    file.type?.split('/').at(-1) as FileType,
    '',
    file.name,
  );
};
