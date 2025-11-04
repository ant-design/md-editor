import {
  AudioOutlined,
  FileImageOutlined,
  FileTextFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { kbToSize } from './utils';

export type SupportedFormat = {
  type: string;
  maxSize: number;
  extensions: string[];
  icon: React.ReactNode;
  content?: React.ReactNode;
};

export type AttachmentButtonPopoverProps = {
  children?: React.ReactNode;
  supportedFormat?: SupportedFormat;
};

const FILE_SIZE_UNITS = {
  KB: 1024,
  MB: 1024 * 1024,
};

const DEFAULT_MAX_SIZE = 5000;

const CONTENT_STYLE: React.CSSProperties = {
  fontSize: 16,
  lineHeight: '1.5em',
  maxWidth: 275,
};

export const SupportedFileFormats = {
  image: {
    icon: <FileImageOutlined />,
    type: '图片',
    maxSize: 10 * FILE_SIZE_UNITS.KB,
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  },
  document: {
    icon: <FileTextFilled />,
    type: '文档',
    maxSize: 10 * FILE_SIZE_UNITS.KB,
    extensions: [
      'pdf',
      'markdown',
      'ppt',
      'html',
      'xls',
      'xlsx',
      'cs',
      'docx',
      'pptx',
      'xml',
    ],
  },
  audio: {
    icon: <AudioOutlined />,
    type: '音频',
    maxSize: 50 * FILE_SIZE_UNITS.KB,
    extensions: ['mp3', 'wav'],
  },
  video: {
    icon: <VideoCameraOutlined />,
    type: '视频',
    maxSize: 100 * FILE_SIZE_UNITS.KB,
    extensions: ['mp4', 'avi', 'mov'],
  },
};

const buildFormatMessage = (format: SupportedFormat) => {
  const maxSize = kbToSize(format.maxSize || DEFAULT_MAX_SIZE);
  const extensions = format.extensions?.join(', ') || '';
  return `支持上传文件，每个文件不超过 ${maxSize}，支持 ${extensions}等格式。`;
};

const FormatContent: React.FC<{ format: SupportedFormat }> = ({ format }) => {
  if (format.content) return <>{format.content}</>;

  return <div style={CONTENT_STYLE}>{buildFormatMessage(format)}</div>;
};

export const AttachmentSupportedFormatsContent: React.FC<
  AttachmentButtonPopoverProps
> = ({ supportedFormat }) => {
  const format = supportedFormat || SupportedFileFormats.image;
  return <FormatContent format={format} />;
};

export const AttachmentButtonPopover: React.FC<
  AttachmentButtonPopoverProps
> = ({ children, supportedFormat }) => {
  return (
    <Tooltip
      arrow={false}
      mouseEnterDelay={2}
      trigger={['hover', 'click']}
      title={
        <AttachmentSupportedFormatsContent supportedFormat={supportedFormat} />
      }
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default AttachmentButtonPopover;
