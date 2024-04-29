import { Card, Space } from 'antd';
import { MdToJSONRender } from './Render';
//@ts-ignore
import pdfjs from 'html2pdf.js';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './air.css';

export default () => {
<<<<<<< Updated upstream
  const defaultValue = `# 数据分析师和风险评估报告

## 财务数据分析师报告
  
### 基础数据
  
<!-- {"chartType": "bar", "x":"指标", "y":"值"} -->
| 指标       | 值    |
|----------|------|
| 所有者权益  | 100000 |
| 被告案件数量 | 100  |
| 被告案件总金额 | 2000 |
  
### 统计数据
  
在对比前后统计数据时，我们发现：
  
- **被告案件总金额距离上一次的同比**为_50%_，这个指标显著说明了企业在处理司法案件方面的财务支出较上一次统计有显著增长，这可能影响企业的财务健康度。
  
## 电力数据分析师报告
  
对于电力数据分析师，当前没有提供具体的基础数据和统计数据。这可能表明在电力领域，我们目前没有显著的数据变动或者需要关注的数据点。
  
## 风险评估师报告
  
对于企业的整体风险评估，**风险评估师**明确表示：**本企业风险较高**。这个评估结果提示我们需要紧急关注企业运营和财务状况，特别是对潜在风险进行深入分析和制定出相应的风险控制措施。
  
---
本报告基于当前提供的数据进行编写，旨在为企业提供一个大概的数据分析和风险评估概况。对于具体的数据分析需要，建议进行更深入的研究与分析。

## 渲染表单

\`\`\`schema
[
  {
    "title": "标题",
    "dataIndex": "title",
    "formItemProps": {
      "rules": [{ "required": true, "message": "此项为必填项" }]
    },
    "width": "m"
  },
  {
    "title": "状态",
    "dataIndex": "state",
    "valueType": "select",
    "valueEnum": {},
    "width": "m"
  }
]
\`\`\`

### 图表
<!-- {"chartType": "pie"} -->
| type | value |
|------|-------|
| 分类一  | 27    |
| 分类二  | 25    |
| 分类三  | 18    |
| 分类四  | 15    |
| 分类五  | 10    |
| 其他   | 5     |

=======
  const defaultValue = `# 财务数据分析报告

## 蚂蚁科技集团股份有限公司财务指标概览

以下是**蚂蚁科技集团股份有限公司**在**2017年12月31日**的一些关键财务指标：

<!-- {"chartType": "bar", "x":"财务指标", "y":"值"} -->
| 财务指标 | 描述 | 值 | 是否展示 | 数据时间 | 季报时间 |
| --- | --- | --- | --- | --- | --- |
| accountreceivable | 应收账款/总资产 | 0.03059 | 是 | 2017-12-31 | 201712 |
| administrationexpense_rate | 管理费用率 | 0.12105 | 是 | 2017-12-31 | 201712 |
| basiceps | 基本每股收益 | 0.46 | 是 | 2017-12-31 | 201712 |
| dividendps | 每股股利 | - | 是 | 2017-12-31 | 201712 |
| financialexpense_rate | 财务费用率 | 0.00276 | 是 | 2017-12-31 | 201712 |
| fix_cons_rate | （固定资产+在建工程）/总资产 | 0.02958 | 是 | 2017-12-31 | 201712 |
| goodwill_rate | 商誉/总资产 | 0.01217 | 是 | 2017-12-31 | 201712 |
| growth_accountspayable_growth_rate | 应付款增长率 | - | 是 | 2017-12-31 | 201712 |
| growth_asset_retention_rate | 资产留存率 | 0.07259 | 是 | 2017-12-31 | 201712 |
| growth_gross_profit_margin_growth_rate | 毛利率增长 | - | 是 | 2017-12-31 | 201712 |

通过上述表格，我们可以对蚂蚁科技集团股份有限公司的一些核心财务指标做初步了解。本报告主要展示出这些指标在特定财务周期的快照，并过滤只展示了公司认为有必要显示的指标。

**注释**：
- "-" 表示该项财务指标的数据未提供。
- 所有的数值都是根据公司提交的财务数据进行统计的结果。

以上数据仅供参考，具体分析可能需要更深入细化的财经知识和背景信息。
>>>>>>> Stashed changes
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
