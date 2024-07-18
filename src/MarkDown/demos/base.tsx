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
  const defaultValue = `<!-- {"MarkdownType": "report", "id": "100", "section_ids": " [192, 193, 194, 195] "} -->
# nike
<!-- {"MarkdownType": "section", "id": "192", "section_id": "192", "report_id": "100", "order": "1" } -->
## Q4 COMP

| Metric                                                 | FY23          | FY24          | Change        |
| ------------------------------------------------------ | ------------- | ------------- | ------------- |
| Full Year Reported Revenues                            | $51.2 billion | $51.4 billion | +$0.2 billion |
| Fourth Quarter Reported Revenues                       | $12.8 billion | $12.6 billion | -$0.2 billion |
| NIKE Direct Q4 Revenues                                | $5.5 billion  | $5.1 billion  | -$0.4 billion |
| Wholesale Q4 Revenues                                  | $6.7 billion  | $7.1 billion  | +$0.4 billion |
| Gross Margin Q4                                        | 43.6%         | 44.7%         | +1.1%         |
| Diluted Earnings Per Share Q4                          | $0.66         | $0.99         | +$0.33        |
| Net Income FY                                          | $5.1 billion  | $5.7 billion  | +$0.6 billion |
| Diluted Earnings Per Share FY                          | $3.23         | $3.73         | +$0.50        |
| Inventories                                            | $8.5 billion  | $7.5 billion  | -$1.0 billion |
| Cash and Equivalents + Short-term Investments          | $10.7 billion | $11.6 billion | +$0.9 billion |
| Shareholder Returns (Dividends + Share Repurchases) Q4 | $1.9 billion  | $1.6 billion  | -$0.3 billion |
| Shareholder Returns FY                                 | $7.5 billion  | $6.4 billion  | -$1.1 billion |
<!-- {"MarkdownType": "section", "id": "193", "section_id": "193", "report_id": "100", "order": "2" } -->
## Nike's Q4 Performance Highlights

* The Lifestyle segment, including Men’s, Women’s, and Jordan brands, experienced a decline in Q4, overshadowing the strong performance in the Sport Performance business.


### Digital Sales Downturn


* Nike Digital sales fell by 10% during the quarter, attributed to decreased traffic, increased promotions, and lower sales in some classic footwear lines.


### Anticipated Challenges in Fiscal 25


* The company is bracing for several headwinds that are expected to significantly impact its performance in Fiscal 25, suggesting difficult quarters ahead.


### Regional Performance Setbacks


* **North America:** Q4 revenue saw a 1% decline, with Nike Direct down by 9%, Nike Digital by 11%, and Nike Stores by 5%.
* **EMEA (Europe, Middle East, and Africa):** Nike Direct dropped by 8%, with a 14% fall in Nike Digital sales.
* **Greater China:** Excluding benefits from TMall’s 6.18 shopping holiday, performance fell short of expectations due to continued traffic softness. Nike Direct and Nike Stores saw declines of 2% and 6%, respectively, while Nike Digital grew by only 8%.
* **APLA (Asia Pacific and Latin America):** Nike Direct and Nike Digital declined by 3% and 12%, respectively.


### Market and Inventory Challenges


* The market remains highly promotional, prompting Nike to carefully manage its own and partner inventory levels.


### Long-term Confidence vs. Near-term Outlook


* Despite a softened near-term outlook, Nike remains confident in its competitive position in China over the long term.


### Financial Forecasts and Investments


* Fiscal 25's reported revenue is expected to decline by mid-single-digits, with the first half anticipated to be down by high single-digits.
* Foreign exchange challenges have intensified, adding an additional one-point headwind to revenue in the quarter.
* Nike plans to reinvest nearly one billion dollars in consumer-facing activities in Fiscal 25, aiming to accelerate a return to strong growth.

This comprehensive analysis underscores the hurdles Nike faces, highlighting the need for strategic adjustments to navigate the anticipated challenges effectively.
<!-- {"MarkdownType": "section", "id": "194", "section_id": "194", "report_id": "100", "order": "3" } -->
## 安踏品牌2024年第一季度零售表现

在2024年第一季度，安踏品牌的产品零售金额（按零售价值计算）与2023年同期相比，实现了中单位数的正增长。


同一时期，FILA品牌的产品零售金额（按零售价值计算）与2023年同期相比，实现了高单位数的正增长。


2024年第一季度，所有其他品牌的产品（不包括2023年1月1日之后新加入本集团的品牌）零售金额（按零售价值计算）与2023年同期相比，录得了25-30%的正增长。
<!-- {"MarkdownType": "section", "id": "195", "section_id": "195", "report_id": "100", "order": "4" } -->
## 网上摘要

<https://www.163.com/dy/article/ITOQ80K905198CJN.html>
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
              if (
                node.nodeType !== 'heading' &&
                node.otherProps &&
                node.type !== 'config'
              ) {
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
              }
              return <div className="markdown-body">{defaultDom}</div>;
            }}
          />
        </div>
      </Card>
    </div>
  );
};
