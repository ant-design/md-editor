import React, { type FC, type ReactNode } from 'react';
import './index.less';

export interface FileData {
  content: ReactNode;
}

export const FileList: FC<{ data: ReactNode }> = ({ data }) => {
  return (
    <div className="chat-file-list">
      {data}
    </div>
  );
}; 
