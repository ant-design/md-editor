import { message } from 'antd';
import { useContext } from 'react';
import { useRefFunction } from '../../hooks/useRefFunction';
import { I18nContext } from '../../i18n';
import type { AttachmentButtonProps } from '../AttachmentButton';
import { upLoadFileToServer } from '../AttachmentButton';
import type { SupportedFileFormats as SupportedFileFormatsType } from '../AttachmentButton/AttachmentButtonPopover';
import { SupportedFileFormats } from '../AttachmentButton/AttachmentButtonPopover';
import type { AttachmentFile } from '../AttachmentButton/types';

export interface FileUploadManagerProps {
  /** 附件配置 */
  attachment?: {
    enable?: boolean;
    supportedFormat?: SupportedFileFormatsType;
  } & AttachmentButtonProps;

  /** 文件映射表 */
  fileMap?: Map<string, AttachmentFile>;

  /** 文件映射表变化回调 */
  onFileMapChange?: (fileMap?: Map<string, AttachmentFile>) => void;
}

export interface FileUploadManagerReturn {
  /** 文件映射表 */
  fileMap?: Map<string, AttachmentFile>;

  /** 文件上传是否完成 */
  fileUploadDone: boolean;

  /** 支持的文件格式 */
  supportedFormat: SupportedFileFormatsType;

  /** 上传图片 */
  uploadImage: () => Promise<void>;

  /** 更新附件文件列表 */
  updateAttachmentFiles: (newFileMap?: Map<string, AttachmentFile>) => void;

  /** 处理文件删除 */
  handleFileRemoval: (file: AttachmentFile) => Promise<void>;

  /** 处理文件重试 */
  handleFileRetry: (file: AttachmentFile) => Promise<void>;
}

/**
 * 文件上传管理器
 *
 * @description 封装文件上传相关的逻辑，包括上传、删除、重试等操作
 */
export const useFileUploadManager = ({
  attachment,
  fileMap,
  onFileMapChange,
}: FileUploadManagerProps): FileUploadManagerReturn => {
  const { locale } = useContext(I18nContext);

  // 判断是否所有文件上传完成
  const fileUploadDone = fileMap?.size
    ? Array.from(fileMap?.values() || []).every(
        (file) => file.status === 'done',
      )
    : true;

  // 默认支持的文件格式
  const supportedFormat =
    attachment?.supportedFormat || SupportedFileFormats.image;

  /**
   * 更新附件文件列表
   */
  const updateAttachmentFiles = useRefFunction(
    (newFileMap?: Map<string, AttachmentFile>) => {
      onFileMapChange?.(new Map(newFileMap));
    },
  );

  /**
   * 上传图片
   */
  const uploadImage = useRefFunction(async () => {
    const input = document.createElement('input');
    input.id = 'uploadImage' + '_' + Math.random();
    input.type = 'file';
    input.accept = supportedFormat?.extensions?.join(',') || 'image/*';
    input.multiple = true;
    input.style.display = 'none';

    input.onchange = async (e: any) => {
      if (input.dataset.readonly) {
        return;
      }
      input.dataset.readonly = 'true';
      try {
        await upLoadFileToServer(e.target.files, {
          ...attachment,
          fileMap,
          onFileMapChange: (newFileMap) => {
            updateAttachmentFiles(newFileMap);
          },
          locale,
        });
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        input.value = '';
        delete input.dataset.readonly;
      }
    };

    if (input.dataset.readonly) {
      return;
    }
    input.click();
    input.remove();
  });

  /**
   * 处理文件删除
   */
  const handleFileRemoval = useRefFunction(async (file: AttachmentFile) => {
    try {
      await attachment?.onDelete?.(file);
      const map = new Map(fileMap);
      map.delete(file.uuid!);
      updateAttachmentFiles(map);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  });

  /**
   * 处理文件重试
   */
  const handleFileRetry = useRefFunction(async (file: AttachmentFile) => {
    try {
      file.status = 'uploading';
      const map = new Map(fileMap);
      map.set(file.uuid || '', file);
      updateAttachmentFiles(map);

      const url = await attachment?.upload?.(file);
      if (url) {
        file.status = 'done';
        file.url = url;
        map.set(file.uuid || '', file);
        updateAttachmentFiles(map);
        message.success(locale?.uploadSuccess || 'Upload success');
      } else {
        file.status = 'error';
        map.set(file.uuid || '', file);
        updateAttachmentFiles(map);
        message.error(locale?.uploadFailed || 'Upload failed');
      }
    } catch (error) {
      console.error('Error retrying file upload:', error);
      file.status = 'error';
      const map = new Map(fileMap);
      map.set(file.uuid || '', file);
      updateAttachmentFiles(map);
      message.error(locale?.uploadFailed || 'Upload failed');
    }
  });

  return {
    fileMap,
    fileUploadDone,
    supportedFormat,
    uploadImage,
    updateAttachmentFiles,
    handleFileRemoval,
    handleFileRetry,
  };
};
