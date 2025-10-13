import {
  AudioOutlined,
  FileImageOutlined,
  FileTextFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { kbToSize } from './utils';

export type AttachmentButtonPopoverProps = {
  children?: React.ReactNode;
  supportedFormat?: {
    type: string;
    maxSize: number;
    extensions: string[];
    icon: React.ReactNode;
    content?: React.ReactNode;
  };
};

/**
 * 支持的文件格式配置
 *
 * 定义系统支持的文件类型、大小限制和扩展名等信息。
 * 包括图片、文档、音频、视频等常见文件类型。
 */
export const SupportedFileFormats = {
  image: {
    icon: <FileImageOutlined />,
    type: '图片',
    maxSize: 10 * 1024,
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  },
  document: {
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
  audio: {
    icon: <AudioOutlined />,
    type: '音频',
    maxSize: 50 * 1024,
    extensions: ['mp3', 'wav'],
  },
  video: {
    icon: <VideoCameraOutlined />,
    type: '视频',
    maxSize: 100 * 1024,
    extensions: ['mp4', 'avi', 'mov'],
  },
};

/**
 * AttachmentSupportedFormatsContent 组件 - 附件支持格式内容组件
 *
 * 该组件用于显示支持的文件格式信息，包括文件类型、大小限制、扩展名等。
 * 提供文件上传格式的说明和指导。
 *
 * @component
 * @description 附件支持格式内容组件，显示支持的文件格式信息
 * @param {AttachmentButtonPopoverProps} props - 组件属性
 * @param {React.ReactNode} [props.children] - 子组件
 * @param {Object} [props.supportedFormat] - 自定义支持的文件格式
 *
 * @example
 * ```tsx
 * <AttachmentSupportedFormatsContent
 *   supportedFormat={customFormat}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的支持格式内容组件
 *
 * @remarks
 * - 显示支持的文件类型
 * - 显示文件大小限制
 * - 显示文件扩展名
 * - 提供文件类型图标
 * - 支持自定义格式配置
 * - 响应式布局
 */
export const AttachmentSupportedFormatsContent = (
  props: AttachmentButtonPopoverProps,
) => {
  const supportedFormat = useMemo(() => {
    if (props.supportedFormat) {
      return props.supportedFormat;
    }
    return SupportedFileFormats.image;
  }, [
    props.supportedFormat,
  ]) as AttachmentButtonPopoverProps['supportedFormat'];

  if (!supportedFormat) return null;

  if (supportedFormat.content) {
    return supportedFormat.content;
  }

  return (
    <div
      style={{
        fontSize: 16,
        lineHeight: '1.5em',
        maxWidth: 275,
      }}
    >
      {`支持上传文件，每个文件不超过 ${kbToSize(supportedFormat?.maxSize || 5000)}，支持 ${supportedFormat?.extensions?.join(', ') || ''}等格式。`}
    </div>
  );
};

/**
 * AttachmentButtonPopover 组件 - 附件按钮弹出框组件
 *
 * 该组件提供一个弹出框，用于显示支持的文件格式信息。
 * 当用户悬停在附件按钮上时，显示支持的文件类型、大小限制等详细信息。
 *
 * @component
 * @description 附件按钮弹出框组件，显示支持的文件格式信息
 * @param {AttachmentButtonPopoverProps} props - 组件属性
 * @param {React.ReactNode} [props.children] - 子组件，通常是附件按钮
 * @param {Object} [props.supportedFormat] - 自定义支持的文件格式
 *
 * @example
 * ```tsx
 * <AttachmentButtonPopover supportedFormat={customFormat}>
 *   <Button>上传附件</Button>
 * </AttachmentButtonPopover>
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的弹出框组件，无支持格式时返回null
 *
 * @remarks
 * - 提供悬停触发的弹出框
 * - 显示支持的文件格式信息
 * - 支持自定义格式配置
 * - 集成Ant Design Popover组件
 * - 响应式布局
 * - 美观的信息展示
 */
export const AttachmentButtonPopover: React.FC<AttachmentButtonPopoverProps> = (
  props,
) => {
  if (!props?.supportedFormat) return null;
  return (
    <Tooltip
      arrow={false}
      title={
        <AttachmentSupportedFormatsContent
          supportedFormat={props.supportedFormat}
        />
      }
      mouseEnterDelay={0.3}
      mouseLeaveDelay={0.1}
      trigger="hover"
      placement="topRight"
    >
      {props.children}
    </Tooltip>
  );
};

export default AttachmentButtonPopover;
