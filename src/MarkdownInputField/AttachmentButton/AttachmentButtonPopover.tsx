import {
  AudioOutlined,
  FileImageOutlined,
  FileTextFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Popover } from 'antd';
import React, { useContext, useMemo } from 'react';
import { I18nContext } from '../../i18n';
import { kbToSize } from './utils';

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

/**
 * 支持的文件格式配置
 *
 * 定义系统支持的文件类型、大小限制和扩展名等信息。
 * 包括图片、文档、音频、视频等常见文件类型。
 */
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
 * @param {Array} [props.supportedFormats] - 自定义支持的文件格式
 *
 * @example
 * ```tsx
 * <AttachmentSupportedFormatsContent
 *   supportedFormats={customFormats}
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
  const { locale } = useContext(I18nContext);
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
      {locale?.attachmentSupportedFormats || '支持上传的文件类型和格式：'}
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
                <div>
                  {locale?.attachmentSingleMax || '单个最大'}{' '}
                  {kbToSize(format.maxSize)}
                </div>
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
 * @param {Array} [props.supportedFormats] - 自定义支持的文件格式
 *
 * @example
 * ```tsx
 * <AttachmentButtonPopover supportedFormats={customFormats}>
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
