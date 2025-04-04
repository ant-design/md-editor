import React, { useMemo } from 'react';
import { AttachmentFile } from '../AttachmentButton/AttachmentFileList';
import { getFileIconByFileName } from '../AttachmentButton/AttachmentFileList/AttachmentFileIcon';

export type FileMapViewProps = {
  fileMap?: Map<string, AttachmentFile>;
  onPreview?: (file: AttachmentFile) => void;
};

export const FileMapView: React.FC<FileMapViewProps> = (props) => {
  const fileList = useMemo(() => {
    return Array.from(props.fileMap?.values() || []);
  }, []);
  return (
    <div>
      {fileList.map((file, index) => {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            {getFileIconByFileName(file)}
            <span>{file.name}</span>
          </div>
        );
      })}
    </div>
  );
};
