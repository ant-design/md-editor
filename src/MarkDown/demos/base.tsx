import { Card, Space } from 'antd';
import { MdToJSONRender } from './Render';
//@ts-ignore
import pdfjs from 'html2pdf.js';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './air.css';

export default () => {
  const defaultValue =
    '\n# What company or topic would you like to research?\n\n```schema\n[{"valueType":"textarea","title":"","dataIndex":"post_data","width":"l"}]\n```\n\nTry Search [[Click here to visit Google](https://www.google.com),[Click here to visit ABC](https://www.abc.com)]\n';
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 24,
      }}
    >
      <Card
        className="markdown-body"
        style={{
          flex: 1,
          maxWidth: '48%',
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{defaultValue}</Markdown>
      </Card>
      <Card
        style={{
          flex: 1,
          maxWidth: '50%',
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
        extra={
          <Space>
            <a
              onClick={() => {
                pdfjs()
                  .set({
                    dpi: 120,
                    html2canvas: { scale: 3, useCORS: true },
                    pagebreak: { avoid: ['img', '.avoid-break'] },
                  })
                  .from(document.querySelector('#pdf'))
                  .save();
              }}
            >
              导出 PDF
            </a>
          </Space>
        }
      >
        <div
          id="pdf"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 24,
          }}
        >
          <MdToJSONRender
            value={defaultValue}
            itemRender={(defaultDom, node) => {
              if (node.type === 'heading') {
                return <div className="markdown-body">{defaultDom}</div>;
              }
              return (
                <Card bordered title={node.title} className="avoid-break">
                  {defaultDom}
                </Card>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
};
