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
  
  ## 创始人
  
  腾讯，全称深圳市腾讯计算机系统有限公司，是由五位创始人共同创立的，他们是马化腾、张志东、许晨晔、陈一丹和曾李青。 以下是关于这些创始人的详细信息： 马化腾 马化腾，1971 年 10 月 29 日出生于广东省东方县（现海南省东方市）八所港，广东汕头人，汉族，无党派人士。他毕业于深圳大学电子工程系计算机专业。马化腾是腾讯科技（深圳）有限公司的创始人、董事会主席、首席执行官，并曾是中华人民共和国第十二、十三届全国人民代表大会代表 。马化腾在 1998 年 11 月 11 日与合伙人共同注册成立了腾讯，并在 2004 年 6 月 16 日带领腾讯在香港联合交易所有限公司主板上市。 张志东 张志东，马化腾的同学，被称为 QQ 之父。他的计算机技术非常出色，曾是深圳大学最拔尖的学生之一。张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。
  
  <!-- {"MarkdownType": "section", "id": "16" } -->
  
  ## 主要业务
  
  腾讯的主要业务可以分为以下几个核心领域： 增值服务：这一部分主要包括游戏和会员服务。腾讯是全球最大的游戏公司之一，提供多款流行的电子游戏。 网络广告：腾讯通过其广泛的社交平台和媒体资源，提供多样化的广告服务。这包括微信、QQ、腾讯视频等平台上的广告。 金融科技及企业服务：这包括微信支付、QQ 钱包等支付解决方案，以及腾讯云等企业服务。这些服务支持商业支付、财富管理、信贷服务等。 社交和通信平台：腾讯提供包括 QQ、微信在内的多个社交和通信平台，这些平台连接了全球超过 10 亿的用户。 数字内容：包括腾讯视频、腾讯音乐、腾讯新闻等，腾讯在内容领域提供丰富的视频、音乐、新闻等数字内容服务。 这些业务领域共同构成了腾讯的主要收入来源，并且相互支持，共同推动了腾讯的持续增长和业务创新。
  
  <!-- {"MarkdownType": "section", "id": "17" } -->
  
  ## 竞争对手
  
  腾讯的竞争对手主要包括以下几家公司：  
  阿里巴巴：阿里巴巴是中国最大的电商公司，也是全球最大的电商公司之一。阿里巴巴通过其多个平台，包括淘宝、天猫、支付宝等，提供广泛的电商和金融服务。 百度：百度是中国最大的搜索引擎公司，也是中国最大的人工智能公司之一。百度通过其搜索引擎、百度地图、百度翻译等产品，提供搜索、地图、翻译等服务。 美团：美团是中国最大的外卖和本地生活服务公司，也是全球最大的外卖公司之一。美团通过其美团外卖、美团点评等平台，提供外卖、酒店、旅游等服务。 京东：京东是中国最大的综合电商公司之一，也是全球最大的综合电商公司之一。京东通过其京东商城、京东金融等平台，提供电商、金融、物流等服务。 腾讯的竞争对手主要集中在电商、搜索、外卖等领域，这些公司与腾讯在多个领域有竞争关系，但也有合作关系。腾讯通过不断创新和合作，保持了在中国互联网行业的领先地位。
  
  
  ## 数据

  <!-- {"MarkdownType": "section", "id": "17","submitText":"下一步",  "initialValues":{"stepName":"选底层文件"} } -->
\`\`\`schema
  [
    {
      "title": "分析逻辑1",
      "dataIndex": "post_data",
      "valueType": "checkCard",
      "extra": "查看代码",
      "fieldProps": { "options": ["🍎 Apple", "🍐 Pear", "🍊 Orange"] },
      "width": "l"
    },
    {
      "title": "分析模块2",
      "dataIndex": "post_data",
      "valueType": "checkCard",
      "extra": "查看代码",
      "fieldProps": {
        "options": [
          {
            "title": "Fruit",
            "value": "Fruit",
            "children": [
              { "title": "🍎 Apple", "value": "apple" },
              { "title": "🍐 Pear", "value": "pear" },
              { "title": "🍊 Orange", "value": "orange" }
            ]
          }
        ]
      },
      "width": "l"
    }
  ]
\`\`\`


## 表格

| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 2022Q2  | 2022Q3  | 2022Q4  | 2023Q1  | 2023Q2  | 2023Q3  | 2023Q4  |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 | 134,034 | 140,093 | 144,954 | 149,986 | 149,208 | 154,625 | 155,200 |
| 增值服务      | 72,443  | 72,013  | 75,203  | 71,913  | 72,738  | 71,683  | 72,727  | 70,417  | 79,337  | 74,211  | 75,748  | 69,100  |
| -网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  | 43,600  | 42,500  | na      | na      | na      | 44,500  | 46,000  | 40,900  |
| -社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  | 29,100  | 29,200  | na      | na      | na      | 29,700  | 29,700  | 28,200  |
| 网络广告      | 21,820  | 22,833  | 22,495  | 21,518  | 17,988  | 18,638  | 21,443  | 24,660  | 20,964  | 25,003  | 25,721  | 29,794  |
| 其他          | 41,040  | 43,413  | 44,670  | 50,757  | 44,745  | 43,713  | 45,923  | 49,877  | 49,685  | 49,994  | 53,156  | 54,379  |
| -金融科技     | 39,028  | 41,892  | 43,317  | 47,958  | 42,768  | 42,208  | 44,844  | 47,244  | 48,701  | 48,635  | 52,048  | 52,435  |
| -云           | 2,012   | 1,521   | 1,353   | 2,799   | 1,977   | 1,505   | 1,079   | 2,633   | 984     | 1,359   | 1,108   | 1,944   |
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
