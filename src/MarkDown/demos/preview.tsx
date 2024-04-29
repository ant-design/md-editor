import { MarkDownEditor } from '@chenshuai2144/md-to-json-schema';
import { Card, Space } from 'antd';
import { MdToJSONRender } from './Render';

//@ts-ignore
import pdfjs from 'html2pdf.js';
import React, { useState } from 'react';
import './air.css';

const defaultValue = `# 财务数据分析报告

## 蚂蚁科技集团股份有限公司财务指标概览

以下是**蚂蚁科技集团股份有限公司**在**2017年12月31日**的一些关键财务指标：

<!-- {"chartType": "bar", "x":"描述", "y":"值"} -->
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

以上数据仅供参考，具体分析可能需要更深入细化的财经知识和背景信息。`;

export default () => {
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: 24,
        }}
      >
        <Card
          style={{
            flex: 1,
            maxWidth: '48%',
            height: '100%',
          }}
          styles={{
            body: {
              padding: 0,
              position: 'relative',
              height: '100%',
              minHeight: '100vh',
            },
          }}
        >
          <MarkDownEditor
            preview="preview"
            height="100vh"
            value={value}
            onChange={(e) => setValue(e || '')}
          />
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
              value={value}
              itemRender={(defaultDom, node) => {
                if (node.type === 'heading') {
                  return <div className="markdown-body">{defaultDom}</div>;
                }
                return (
                  <Card
                    bordered
                    title={node.title}
                    className="avoid-break"
                    styles={{
                      body: {
                        padding: 16,
                      },
                    }}
                  >
                    {defaultDom}
                  </Card>
                );
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};
