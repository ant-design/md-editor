import {
  AudioOutlined,
  FileImageOutlined,
  FileTextFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Popover } from 'antd';
import React, { useMemo } from 'react';
import { kbToSize } from './AttachmentFileList';

export type AttachmentButtonPopoverProps = {
  children?: React.ReactNode;
  supportedFormats?: {
    type: string;
    maxSize: number;
    extensions: string[];
    icon: React.ReactNode;
    content?: React.ReactNode;
  }[];
};

export const SupportedFileFormats = [
  {
    icon: <FileImageOutlined />,
    type: '图片',
    maxSize: 10 * 1024,
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  },
  {
    icon: <FileTextFilled />,
    type: '文档',
    maxSize: 10 * 1024,
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
  {
    icon: <AudioOutlined />,
    type: '音频',
    maxSize: 50 * 1024,
    extensions: ['mp3', 'wav'],
  },
  {
    icon: <VideoCameraOutlined />,
    type: '视频',
    maxSize: 100 * 1024,
    extensions: ['mp4', 'avi', 'mov'],
  },
];

export const AttachmentSupportedFormatsContent = (
  props: AttachmentButtonPopoverProps,
) => {
  // 默认支持的文件格式
  const supportedFormats = useMemo(() => {
    if (props.supportedFormats) {
      return props.supportedFormats;
    }
    return SupportedFileFormats;
  }, [
    props.supportedFormats,
  ]) as AttachmentButtonPopoverProps['supportedFormats'];

  if (!supportedFormats?.length) return null;

  return (
    <div
      style={{
        fontSize: 16,
        lineHeight: '1.5em',
      }}
    >
      支持上传的文件类型和格式：
      <div
        style={{
          fontSize: '1em',
          lineHeight: '1.2em',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16,
          gap: 8,
        }}
      >
        {supportedFormats?.map((format, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              marginBottom: 8,
              gap: 12,
            }}
          >
            <div
              style={{
                height: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 16,
                  gap: 4,
                }}
              >
                {format.icon}
                {format.type}:
              </div>
            </div>
            {format?.content ? (
              format.content
            ) : (
              <div
                style={{
                  maxWidth: 180,
                  textWrap: 'wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div>单个最大 {kbToSize(format.maxSize)}</div>
                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.45)',
                  }}
                >
                  {format.extensions.join(', ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AttachmentButtonPopover: React.FC<AttachmentButtonPopoverProps> = (
  props,
) => {
  if (!props?.supportedFormats?.length) return null;
  return (
    <Popover
      arrow={false}
      content={
        <AttachmentSupportedFormatsContent
          supportedFormats={props.supportedFormats}
        />
      }
      trigger="hover"
      placement="topRight"
    >
      {props.children}
    </Popover>
  );
};

export default AttachmentButtonPopover;
