import { Paperclip } from '@sofa-design/icons';
import { ConfigProvider, message } from 'antd';
import classNames from 'classnames';
import { default as React, useContext } from 'react';
import { compileTemplate } from '../../i18n';
import AttachmentButtonPopover, {
  AttachmentButtonPopoverProps,
  SupportedFileFormats,
} from './AttachmentButtonPopover';
import { useStyle } from './style';
import { AttachmentFile, UploadResponse } from './types';
import { isImageFile } from './utils';

export * from './AttachmentButtonPopover';
export type { AttachmentFile, UploadResponse } from './types';

export type AttachmentButtonProps = {
  upload?: (file: AttachmentFile, index: number) => Promise<string>;
  uploadWithResponse?: (
    file: AttachmentFile,
    index: number,
  ) => Promise<UploadResponse>;
  fileMap?: Map<string, AttachmentFile>;
  onFileMapChange?: (files?: Map<string, AttachmentFile>) => void;
  supportedFormat?: AttachmentButtonPopoverProps['supportedFormat'];
  disabled?: boolean;
  render?: (props: {
    children: React.ReactNode;
    supportedFormat?: AttachmentButtonPopoverProps['supportedFormat'];
  }) => React.ReactElement;
  onDelete?: (file: AttachmentFile) => Promise<void>;
  onPreview?: (file: AttachmentFile) => Promise<void>;
  onDownload?: (file: AttachmentFile) => Promise<void>;
  maxFileSize?: number;
  maxFileCount?: number;
  minFileCount?: number;
};

type UploadProps = {
  fileMap?: Map<string, AttachmentFile>;
  onFileMapChange?: (files?: Map<string, AttachmentFile>) => void;
  upload?: (file: AttachmentFile, index: number) => Promise<string>;
  uploadWithResponse?: (
    file: AttachmentFile,
    index: number,
  ) => Promise<UploadResponse>;
  maxFileSize?: number;
  maxFileCount?: number;
  minFileCount?: number;
  locale?: any;
};

const WAIT_TIME_MS = 16;
const KB_SIZE = 1024;
const DEFAULT_MESSAGES = {
  uploading: 'Uploading...',
  uploadSuccess: 'Upload success',
  uploadFailed: 'Upload failed',
  maxFileCountExceeded: (count: number) => `最多只能上传 ${count} 个文件`,
  minFileCountRequired: (count: number) => `至少需要上传 ${count} 个文件`,
  fileSizeExceeded: (size: number) => `文件大小超过 ${size} KB`,
};

const waitTime = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateFileUUID = (fileName: string) => {
  return Date.now() + Math.random() * 1000 + fileName;
};

const prepareFile = (file: AttachmentFile) => {
  file.status = 'uploading';
  file.uuid = generateFileUUID(file.name);
  if (isImageFile(file)) {
    file.previewUrl = URL.createObjectURL(file);
  }
};

const getLocaleMessage = (locale: any, key: string, defaultMsg: string) => {
  return locale?.[key] || defaultMsg;
};

const validateFileCount = (fileCount: number, props: UploadProps): boolean => {
  if (props.maxFileCount && fileCount > props.maxFileCount) {
    const msg = props.locale?.['markdownInput.maxFileCountExceeded']
      ? compileTemplate(props.locale['markdownInput.maxFileCountExceeded'], {
          maxFileCount: String(props.maxFileCount),
        })
      : DEFAULT_MESSAGES.maxFileCountExceeded(props.maxFileCount);
    message.error(msg);
    return false;
  }

  if (props.minFileCount && fileCount < props.minFileCount) {
    const msg = props.locale?.['markdownInput.minFileCountRequired']
      ? compileTemplate(props.locale['markdownInput.minFileCountRequired'], {
          minFileCount: String(props.minFileCount),
        })
      : DEFAULT_MESSAGES.minFileCountRequired(props.minFileCount);
    message.error(msg);
    return false;
  }

  return true;
};

const validateFileSize = (file: AttachmentFile, props: UploadProps): boolean => {
  if (!props.maxFileSize || file.size <= props.maxFileSize) return true;

  const maxSizeKB = props.maxFileSize / KB_SIZE;
  const msg =
    props.locale?.['markdownInput.fileSizeExceeded']?.replace('${maxSize}', `${maxSizeKB}`) ||
    DEFAULT_MESSAGES.fileSizeExceeded(maxSizeKB);
  message.error(msg);
  return false;
};

const updateFileMap = (
  map: Map<string, AttachmentFile>,
  file: AttachmentFile,
  onFileMapChange?: (files?: Map<string, AttachmentFile>) => void,
) => {
  if (file.uuid) {
    map.set(file.uuid, file);
    onFileMapChange?.(map);
  }
};

const uploadSingleFile = async (
  file: AttachmentFile,
  index: number,
  props: UploadProps,
): Promise<{ url?: string; isSuccess: boolean; errorMsg: string | null }> => {
  if (props.uploadWithResponse) {
    const result = await props.uploadWithResponse(file, index);
    file.uploadResponse = result;
    return {
      url: result.fileUrl,
      isSuccess: result.uploadStatus === 'SUCCESS',
      errorMsg: result.errorMessage || null,
    };
  }

  if (props.upload) {
    const url = await props.upload(file, index);
    return { url, isSuccess: !!url, errorMsg: null };
  }

  return { url: file.previewUrl, isSuccess: !!file.previewUrl, errorMsg: null };
};

const handleUploadSuccess = (
  file: AttachmentFile,
  url: string,
  map: Map<string, AttachmentFile>,
  props: UploadProps,
) => {
  file.status = 'done';
  file.url = url;
  updateFileMap(map, file, props.onFileMapChange);
  message.success(getLocaleMessage(props.locale, 'uploadSuccess', DEFAULT_MESSAGES.uploadSuccess));
};

const handleUploadError = (
  file: AttachmentFile,
  errorMsg: string | null,
  map: Map<string, AttachmentFile>,
  props: UploadProps,
) => {
  file.status = 'error';
  updateFileMap(map, file, props.onFileMapChange);
  const msg = errorMsg || getLocaleMessage(props.locale, 'uploadFailed', DEFAULT_MESSAGES.uploadFailed);
  message.error(msg);
};

const processFile = async (
  file: AttachmentFile,
  index: number,
  map: Map<string, AttachmentFile>,
  props: UploadProps,
) => {
  await waitTime(WAIT_TIME_MS);

  if (!validateFileSize(file, props)) {
    file.status = 'error';
    updateFileMap(map, file, props.onFileMapChange);
    return;
  }

  try {
    const { url, isSuccess, errorMsg } = await uploadSingleFile(file, index, props);

    if (isSuccess && url) {
      handleUploadSuccess(file, url, map, props);
    } else {
      handleUploadError(file, errorMsg, map, props);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : getLocaleMessage(props.locale, 'uploadFailed', DEFAULT_MESSAGES.uploadFailed);
    handleUploadError(file, errorMessage, map, props);
  }
};

export const upLoadFileToServer = async (files: ArrayLike<File>, props: UploadProps) => {
  const map = props.fileMap || new Map<string, AttachmentFile>();
  const hideLoading = message.loading(
    getLocaleMessage(props.locale, 'uploading', DEFAULT_MESSAGES.uploading),
  );

  const fileList = Array.from(files) as AttachmentFile[];
  fileList.forEach(prepareFile);
  fileList.forEach((file) => updateFileMap(map, file, props.onFileMapChange));

  if (!validateFileCount(fileList.length, props)) {
    hideLoading();
    return;
  }

  try {
    for (let i = 0; i < fileList.length; i++) {
      await processFile(fileList[i], i, map, props);
    }
  } catch (error) {
    fileList.forEach((file) => {
      file.status = 'error';
      updateFileMap(map, file, props.onFileMapChange);
    });
    message.error(getLocaleMessage(props.locale, 'uploadFailed', DEFAULT_MESSAGES.uploadFailed));
  } finally {
    hideLoading();
  }
};

const BUTTON_WITH_TITLE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const BUTTON_TITLE_STYLE: React.CSSProperties = {
  font: 'var(--font-text-body-base)',
  letterSpacing: 'var(--letter-spacing-body-base, normal)',
  color: 'var(--color-gray-text-default)',
};

const ButtonContent: React.FC<{ title?: React.ReactNode }> = ({ title }) => {
  if (!title) return <Paperclip />;

  return (
    <div style={BUTTON_WITH_TITLE_STYLE}>
      <Paperclip />
      <div style={BUTTON_TITLE_STYLE}>{title}</div>
    </div>
  );
};

export const AttachmentButton: React.FC<
  AttachmentButtonProps & {
    uploadImage(): Promise<void>;
    title?: React.ReactNode;
  }
> = ({ disabled, uploadImage, title, supportedFormat, render }) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const prefix = context?.getPrefixCls('md-editor-attachment-button');
  const { wrapSSR, hashId } = useStyle(prefix);

  const format = supportedFormat || SupportedFileFormats.image;
  const content = <ButtonContent title={title} />;

  const handleClick = () => {
    if (disabled) return;
    uploadImage?.();
  };

  const wrapper = render
    ? render({ children: content, supportedFormat: format })
    : <AttachmentButtonPopover supportedFormat={format}>{content}</AttachmentButtonPopover>;

  return wrapSSR(
    <div
      className={classNames(`${prefix}`, hashId, {
        [`${prefix}-disabled`]: disabled,
      })}
      onClick={handleClick}
      data-testid="attachment-button"
    >
      {wrapper}
    </div>,
  );
};
