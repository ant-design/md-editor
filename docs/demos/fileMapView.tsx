import { AttachmentFile, FileMapView } from '@ant-design/md-editor';
import React from 'react';

const fileMap = new Map<string, AttachmentFile>();
Array.from({ length: 2 }).forEach((_, index) => {
  fileMap.set(`file-${index}`, {
    name: `file-${index}.jpg`,
    url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
    type: 'image/jpeg',
    status: 'done',
    previewUrl:
      'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
    size: 1024,
    uuid: `uuid-${index}`,
    lastModified: 1703123456789, // 2023-12-21 10:30:56
  } as unknown as AttachmentFile);
});

fileMap.set(`file-${2}`, {
  name: `file-${2}.jpg`,
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
  type: 'image/jpeg',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
  size: 1024,
  uuid: `uuid-${2}`,
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set(`file-${3}`, {
  name: `file-${3}.pdf`,
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/pdf',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: `uuid-${3}`,
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set('file-5', {
  name: 'file-5.docx',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-5',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);
fileMap.set('file-6', {
  name: 'file-6.doc',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/msword',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-6',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);
fileMap.set('file-7', {
  name: 'file-7.pptx',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-7',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);
fileMap.set('file-8', {
  name: 'file-8.ppt',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/vnd.ms-powerpoint',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-8',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set('file-9', {
  name: 'file-9.yml',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/x-yaml',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-9',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set('file-10', {
  name: 'file-10.json',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/json',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-10',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set('file-11', {
  name: 'file-11.yaml',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/x-yaml',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-11',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

fileMap.set('file-12', {
  name: 'file-12.txt',
  url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  type: 'application/x-yaml',
  status: 'done',
  previewUrl:
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*IsRPRJJps0cAAAAAAAAAAAAADkN6AQ/original',
  size: 1024,
  uuid: 'uuid-11',
  lastModified: 1703123456789, // 2023-12-21 10:30:56
} as unknown as AttachmentFile);

export default () => {
  return (
    <div
      style={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h2>基本</h2>
      <FileMapView fileMap={fileMap} />

      <h2>文件少于等于四个</h2>
      <FileMapView
        fileMap={
          new Map<string, AttachmentFile>([...Array.from(fileMap).slice(0, 4)])
        }
      />
      <h2>都是图片</h2>
      <FileMapView
        fileMap={
          new Map<string, AttachmentFile>([
            [
              'file-1.jpg',
              {
                name: `file-${1}.jpg`,
                url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                type: 'image/jpeg',
                status: 'done',
                previewUrl:
                  'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                size: 1024,
                uuid: `uuid-${1}`,
                lastModified: 1703123456789, // 2023-12-21 10:30:56
              } as AttachmentFile,
            ],
            [
              'file-2.jpg',
              {
                name: `file-${2}.jpg`,
                url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                type: 'image/jpeg',
                status: 'done',
                previewUrl:
                  'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                size: 1024,
                uuid: `uuid-${2}`,
                lastModified: 1703123456789, // 2023-12-21 10:30:56
              } as AttachmentFile,
            ],
            [
              'file-3.jpg',
              {
                name: `file-${3}.jpg`,
                url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                type: 'image/jpeg',
                status: 'done',
                previewUrl:
                  'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                size: 1024,
                uuid: `uuid-${3}`,
                lastModified: 1703123456789, // 2023-12-21 10:30:56
              } as AttachmentFile,
            ],
            [
              'file-4.jpg',
              {
                name: `file-${4}.jpg`,
                url: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                type: 'image/jpeg',
                status: 'done',
                previewUrl:
                  'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*jThjRaPDP3kAAAAAAAAAAAAAekN6AQ/original',
                size: 1024,
                uuid: `uuid-${4}`,
                lastModified: 1703123456789, // 2023-12-21 10:30:56
              } as AttachmentFile,
            ],
          ])
        }
      />
    </div>
  );
};
