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

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>fileMap</strong>: 文件映射对象，Map&lt;string,
            AttachmentFile&gt; 类型
          </li>
          <li>
            <strong>AttachmentFile</strong>: 附件文件对象，包含以下属性：
          </li>
          <li>
            <strong>name</strong>: 文件名
          </li>
          <li>
            <strong>url</strong>: 文件下载链接
          </li>
          <li>
            <strong>type</strong>: 文件 MIME 类型
          </li>
          <li>
            <strong>status</strong>: 文件状态，如 &apos;done&apos;
          </li>
          <li>
            <strong>previewUrl</strong>: 文件预览链接
          </li>
          <li>
            <strong>size</strong>: 文件大小（字节）
          </li>
          <li>
            <strong>uuid</strong>: 文件唯一标识符
          </li>
          <li>
            <strong>lastModified</strong>: 最后修改时间戳
          </li>
        </ul>
      </div>
    </div>
  );
};
