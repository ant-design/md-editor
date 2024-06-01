import { Card, Space } from 'antd';
import MessageRender from './Render';
//@ts-ignore
import { NodeToSchemaType } from '@ant-design/md-to-json-schema';
import pdfjs from 'html2pdf.js';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditCard } from './EditCard';
import { InvertTransition } from './Transition';
import './air.css';

export default () => {
  const defaultValue = `<!-- {"MarkdownType": "report", "id": "8", "section_ids": " [15, 16, 17] "} -->

  # 腾讯研究报告
  
  <!-- {"MarkdownType": "section", "id": "15" } -->
  
  ## __  创始人
  
  腾讯，全称深圳市腾讯计算机系统有限公司，是由五位创始人共同创立的，他们是马化腾、张志东、许晨晔、陈一丹和曾李青。 以下是关于这些创始人的详细信息： 马化腾 马化腾，1971 年 10 月 29 日出生于广东省东方县（现海南省东方市）八所港，广东汕头人，汉族，无党派人士。他毕业于深圳大学电子工程系计算机专业。马化腾是腾讯科技（深圳）有限公司的创始人、董事会主席、首席执行官，并曾是中华人民共和国第十二、十三届全国人民代表大会代表 。马化腾在 1998 年 11 月 11 日与合伙人共同注册成立了腾讯，并在 2004 年 6 月 16 日带领腾讯在香港联合交易所有限公司主板上市。 张志东 张志东，马化腾的同学，被称为 QQ 之父。他的计算机技术非常出色，曾是深圳大学最拔尖的学生之一。张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。
  
  <!-- {"MarkdownType": "section", "id": "16" } -->
  
`;

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
          <MessageRender
            value={defaultValue}
            drag
            itemRender={(defaultDom, node, index) => {
              if (node.type === 'heading') {
                return <div className="markdown-body">{defaultDom}</div>;
              }
              return (
                <InvertTransition delay={index * 0.1}>
                  <EditCard
                    node={
                      node as NodeToSchemaType<{
                        report_id?: number;
                        id: number;
                      }>
                    }
                    defaultDom={defaultDom}
                  />
                </InvertTransition>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
};
