import React from 'react';
import ExtensionPanel from '../../src/ExtensionPanel';

export default () => {
  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: 400 }}>
      <ExtensionPanel
        title="扩展面板 Demo"
        realtimeData={{
          type: 'html',
          customSubTitle: '创建 HTML 文件',
          content: `<!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>示例页面</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #f0f0f0;
              }
              .container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>欢迎使用 Markdown Editor</h1>
              <p>这是一个示例 HTML 文件。</p>
          </div>
      </body>
      </html>`,
        }}
        browserData={{
          title: '创建文件 mdir',
          content: `\`\`\`shell
          `,
        }}
        fileData={<div>文件</div>}
        onTabChange={(tabKey) => {
          // eslint-disable-next-line no-console
          console.log('切换到 tab:', tabKey);
        }}
        onClose={() => {
          // eslint-disable-next-line no-console
          console.log('关闭面板');
        }}
        style={{ maxWidth: 480, margin: '0 auto' }}
      />
    </div>
  );
};
