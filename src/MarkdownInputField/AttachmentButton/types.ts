export type AttachmentFile = File & {
  url?: string;
  status?: 'error' | 'uploading' | 'done';
  uuid?: string;
  previewUrl?: string;
};
