import {
  FileExcelFilled,
  FileTextFilled,
  FileZipFilled,
  VideoCameraFilled,
} from '@ant-design/icons';
import React, { useMemo } from 'react';
import {
  CSSIcon,
  DOCSIcon,
  HTMLIcon,
  JSONIcon,
  MarkDownIcon,
  PDFIcon,
  PPTIcon,
  PPTXIcon,
  XLSIcon,
  XLSXIcon,
  YMLIcon,
} from '../../../icons/FileIconList';
import { isImageFile } from '../index';
import { AttachmentFile } from './index';

/**
 * 根据文件名和扩展名返回对应类型的文件图标组件
 *
 * @param file - 附件文件对象，包含文件名等信息
 * @returns React图标组件，根据文件扩展名选择适当的图标
 *
 * @example
 * // 返回Markdown文件图标
 * getFileIconByFileName({name: "document.md"})
 *
 * // 返回Excel文件图标
 * getFileIconByFileName({name: "spreadsheet.xlsx"})
 *
 * // 返回默认文件图标
 * getFileIconByFileName({name: "unknown.xyz"})
 */
export const getFileIconByFileName = (file: AttachmentFile) => {
  const fileName = file.name || '';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // Return appropriate icon based on file extension
  switch (extension) {
    case 'md':
      return <MarkDownIcon />;
    case 'pdf':
      return <PDFIcon />;
    case 'html':
      return <HTMLIcon />;
    case 'css':
      return <CSSIcon />;
    case 'xls':
      return <XLSIcon />;
    case 'xlsx':
      return <XLSXIcon />;
    case 'csv':
      return <FileExcelFilled />;
    case 'doc':
      return <DOCSIcon />;
    case 'docx':
      return <DOCSIcon />;
    case 'ppt':
      return <PPTIcon />;
    case 'pptx':
      return <PPTXIcon />;
    case 'yml':
      return <YMLIcon />;
    case 'json':
      return <JSONIcon />;
    case 'yaml':
      return <YMLIcon />;
    case 'zip':
    case 'rar':
    case '7z':
      return (
        <FileZipFilled
          style={{
            fontSize: 18,
          }}
        />
      );
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'mkv':
    case 'webm':
      return (
        <VideoCameraFilled
          style={{
            fontSize: 18,
          }}
        />
      );
    default:
      return (
        <FileTextFilled
          style={{
            fontSize: 18,
          }}
        />
      );
  }
};

/**
 * 附件文件图标组件
 *
 * 该组件根据文件类型显示不同的图标或预览。如果是图片文件，则显示图片预览；
 * 如果是其他类型文件，则显示对应的文件图标。
 *
 * @param props - 组件属性
 * @param props.file - 附件文件对象
 * @param props.className - 可选的自定义类名
 * @param props.prefixCls - 可选的类名前缀
 * @param props.hashId - 可选的哈希ID，通常用于CSS-in-JS方案
 * @returns React元素
 */
export const AttachmentFileIcon: React.FC<{
  file: AttachmentFile;
  className?: string;
  style?: React.CSSProperties;
}> = (props) => {
  const file = props.file;
  return useMemo(() => {
    if (isImageFile(file)) {
      return (
        <img
          className={props.className}
          src={file.previewUrl}
          style={{
            borderRadius: '6px',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...props.style,
          }}
        />
      );
    }
    return (
      <div
        className={props.className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '32px',
          ...props.style,
        }}
      >
        {getFileIconByFileName(file)}
      </div>
    );
  }, [file, props.className, props.style]);
};
