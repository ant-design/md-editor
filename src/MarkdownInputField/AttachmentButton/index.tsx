import { ConfigProvider, message } from 'antd';
import classNames from 'classnames';
import { default as React, useContext, useMemo } from 'react';
import { AttachmentIcon } from '../../icons/AttachmentIcon';
import AttachmentButtonPopover, {
  AttachmentButtonPopoverProps,
  SupportedFileFormats,
} from './AttachmentButtonPopover';
import { AttachmentFile } from './AttachmentFileList';
import { useStyle } from './style';
export * from './AttachmentButtonPopover';

/**
 * AttachmentButton 组件的属性
 */
export type AttachmentButtonProps = {
  /**
   * 处理文件上传的函数。返回一个 Promise，解析为字符串（通常是 URL 或文件 ID）。
   * @param file - 要上传的附件文件
   * @returns 解析为已上传文件标识符的 Promise
   * @example
   * const uploadFile = async (file: AttachmentFile) => {
   *   const response = await api.uploadFile(file);
   *   return response.fileId;
   * }
   */
  upload?: (file: AttachmentFile) => Promise<string>;

  /**
   * 存储当前附件文件的 Map，以文件 ID 为键，文件对象为值
   * @example
   * const fileMap = new Map<string, AttachmentFile>([
   *   ['file-1', { name: 'document.pdf', size: 1024, type: 'application/pdf' }]
   * ]);
   */
  fileMap?: Map<string, AttachmentFile>;

  /**
   * 当附件文件集合发生变化时触发的回调
   * @param files - 更新后的文件 Map
   * @example
   * const handleFilesChange = (files: Map<string, AttachmentFile>) => {
   *   console.log('Files changed:', Array.from(files.values()));
   *   setAttachedFiles(files);
   * }
   */
  onFileMapChange?: (files?: Map<string, AttachmentFile>) => void;

  /**
   * 定义附件按钮支持的文件格式
   * @see AttachmentButtonPopoverProps.supportedFormats
   * @example
   * const formats ={
   *   icon: <FileImageOutlined />,
   *   type: '图片',
   *   maxSize: 10 * 1024,
   *   extensions: ['jpg', 'jpeg', 'png', 'gif'],
   * };
   */
  supportedFormats?: AttachmentButtonPopoverProps['supportedFormats'];

  /**
   * 是否禁用附件上传按钮
   */
  disabled?: boolean;

  /**
   * 删除文件的回调函数
   * @param file - 被删除的文件对象
   * @example
   * const handleDelete = async (file: AttachmentFile) => {
   *   await api.deleteFile(file.id);
   *  console.log('File deleted:', file.name);
   * }
   */
  onDelete?: (file: AttachmentFile) => Promise<void>;
  onPreview?: (file: AttachmentFile) => Promise<void>;
  onDownload?: (file: AttachmentFile) => Promise<void>;

  maxFileSize?: number;
  maxFileCount?: number;
  minFileCount?: number;
};

export const isImageFile = (file: AttachmentFile) => {
  if (file?.name?.includes('.svg')) {
    return true;
  }
  if (file?.type?.includes('.png')) {
    return true;
  }
  if (file?.type?.includes('jpg') || file?.type?.includes('jpeg')) {
    return true;
  }
  if (file?.type?.includes('gif')) {
    return true;
  }
  if (file?.type?.includes('webp')) {
    return true;
  }
  if (file?.type?.includes('bmp')) {
    return true;
  }
  if (file?.type?.includes('tiff')) {
    return true;
  }
  if (file?.type?.includes('webp')) {
    return true;
  }
  if (file?.type?.includes('bmp')) {
    return true;
  }
  if (file?.type?.includes('tiff')) {
    return true;
  }
  return file?.type?.startsWith('image/');
};

const waitTime = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const upLoadFileToServer = async (
  files: ArrayLike<File>,
  props: {
    fileMap?: Map<string, AttachmentFile>;
    onFileMapChange?: (files?: Map<string, AttachmentFile>) => void;
    upload?: (file: AttachmentFile) => Promise<string>;
    maxFileSize?: number;
    maxFileCount?: number;
    minFileCount?: number;
  },
) => {
  const map = props.fileMap || new Map<string, AttachmentFile>();
  const hideLoading = message.loading('Uploading...');
  const fileList = (Array.from(files) as AttachmentFile[]) || [];
  fileList?.forEach((file) => {
    file.status = 'uploading';
    file.uuid = Date.now() + Math.random() * 1000 + file.name;
    if (isImageFile(file)) {
      file.previewUrl = URL.createObjectURL(file);
    }
    if (file.uuid) {
      map.set(file.uuid || '', file);
    }
  });
  if (props.maxFileCount && fileList.length > props.maxFileCount) {
    message.error(`最多只能上传 ${props.maxFileCount} 个文件`);
    return;
  }
  if (props.minFileCount && fileList.length < props.minFileCount) {
    message.error(`至少需要上传 ${props.minFileCount} 个文件`);
    return;
  }
  props.onFileMapChange?.(map);
  try {
    for await (const file of fileList) {
      await waitTime(16);
      if (props.maxFileSize && file.size > props.maxFileSize) {
        file.status = 'error';
        map.set(file.uuid || '', file);
        props.onFileMapChange?.(map);
        message.error(`文件大小超过 ${props.maxFileSize / 1024} KB`);
        continue;
      }
      const url = (await props?.upload?.(file)) || file.previewUrl;
      if (url) {
        file.status = 'done';
        file.url = url;
        map.set(file.uuid || '', file);
        props.onFileMapChange?.(map);
        message.success('Upload success');
      } else {
        file.status = 'error';
        map.set(file.uuid || '', file);
        props.onFileMapChange?.(map);
        message.error('Upload failed');
      }
    }
  } catch (error) {
    fileList.forEach((file) => {
      file.status = 'error';
      if (file.uuid) {
        map.set(file.uuid || '', file);
      }
    });
    message.error('Upload failed');
    props.onFileMapChange?.(map);
  } finally {
    hideLoading();
  }
};

/**
 * 附件上传按钮组件
 *
 * 该组件提供一个可点击的按钮，用于上传文件附件。支持多种文件格式，包括图片、文档、音频和视频。
 *
 * @component
 * @param {object} props - 组件属性
 * @param {Map<string, AttachmentFile>} [props.fileMap] - 文件映射表，用于存储上传的文件
 * @param {(map: Map<string, AttachmentFile>) => void} [props.onFileMapChange] - 文件映射表变更时的回调函数
 * @param {(file: AttachmentFile) => Promise<string>} [props.upload] - 文件上传处理函数，返回文件URL的Promise
 * @param {Array<{icon: React.ReactNode, type: string, maxSize: number, extensions: string[]}>} [props.supportedFormats] - 支持的文件格式配置，
 *   如不提供则使用默认配置（包括图片、文档、音频、视频格式）
 *
 * @example
 * ```tsx
 * <AttachmentButton
 *   fileMap={fileMap}
 *   onFileMapChange={handleFileMapChange}
 *   upload={uploadFileToServer}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的附件按钮组件
 */
export const AttachmentButton: React.FC<
  AttachmentButtonProps & {
    uploadImage(): Promise<void>;
  }
> = (props) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context.getPrefixCls('md-editor-attachment-button');
  const { wrapSSR, hashId } = useStyle(prefix);

  // 默认支持的文件格式
  const supportedFormats = useMemo(() => {
    if (props.supportedFormats) {
      return props.supportedFormats;
    }
    return SupportedFileFormats;
  }, [props.supportedFormats]);

  return wrapSSR(
    <div
      className={classNames(`${prefix}`, hashId, {
        [`${prefix}-disabled`]: props.disabled,
      })}
      onClick={() => {
        if (props.disabled) return;
        props.uploadImage?.();
      }}
    >
      <AttachmentButtonPopover supportedFormats={supportedFormats}>
        <AttachmentIcon />
      </AttachmentButtonPopover>
    </div>,
  );
};
