import BarChart, {
  BarChartDataItem,
} from '@ant-design/agentic-ui/Plugins/chart/BarChart';
import { Button } from 'antd';
import React, { useState } from 'react';

const NegativeBarChartExample: React.FC = () => {
  // 扁平化数据结构 - 正负柱状图
  const [data, setData] = useState<BarChartDataItem[]>(() => [
    // 财务数据 - 全球
    {
      category: '财务数据',
      type: '利润',
      x: 1,
      y: 120,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 2,
      y: -60,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 3,
      y: 80,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 4,
      y: -30,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },

    {
      category: '财务数据',
      type: '成本',
      x: 1,
      y: -90,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 2,
      y: -40,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 3,
      y: -50,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 4,
      y: -20,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '全球',
    },

    // 温度变化数据 - 全球
    {
      category: '温度变化',
      type: '最高温',
      x: 1,
      y: 15,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 2,
      y: 22,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 3,
      y: 28,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 4,
      y: 32,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },

    {
      category: '温度变化',
      type: '最低温',
      x: 1,
      y: -5,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 2,
      y: -2,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 3,
      y: 5,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 4,
      y: 12,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '全球',
    },

    // 美国数据（带filterLabel）
    {
      category: '财务数据',
      type: '利润',
      x: 1,
      y: 180,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 2,
      y: -80,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 3,
      y: 120,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '利润',
      x: 4,
      y: -50,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },

    {
      category: '财务数据',
      type: '成本',
      x: 1,
      y: -120,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 2,
      y: -60,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 3,
      y: -70,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },
    {
      category: '财务数据',
      type: '成本',
      x: 4,
      y: -30,
      xtitle: '季度',
      ytitle: '金额',
      filterLabel: '美国',
    },

    {
      category: '温度变化',
      type: '最高温',
      x: 1,
      y: 25,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 2,
      y: 30,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 3,
      y: 35,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最高温',
      x: 4,
      y: 38,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },

    {
      category: '温度变化',
      type: '最低温',
      x: 1,
      y: 5,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 2,
      y: 8,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 3,
      y: 12,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
    {
      category: '温度变化',
      type: '最低温',
      x: 4,
      y: 16,
      xtitle: '月份',
      ytitle: '温度(°C)',
      filterLabel: '美国',
    },
  ]);

  const handleRandomize = () => {
    setData((prev) =>
      prev.map((item) => {
        if (item.category === '财务数据') {
          // 财务数据：利润范围 -100 到 200，成本范围 -100 到 -10
          return {
            ...item,
            y:
              item.type === '利润'
                ? Math.floor(Math.random() * 300) - 100 // -100 到 200
                : -(Math.floor(Math.random() * 90) + 10), // -100 到 -10
          };
        } else {
          // 温度数据：最高温 0-40，最低温 -10 到 15
          return {
            ...item,
            y:
              item.type === '最高温'
                ? Math.floor(Math.random() * 40) // 0 到 40
                : Math.floor(Math.random() * 25) - 10, // -10 到 15
          };
        }
      }),
    );
  };

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ margin: '0 0 12px' }}>正负柱状图</h3>
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}
      >
        <Button type="primary" onClick={handleRandomize}>
          随机更新数据
        </Button>

        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          💡 使用扁平化数据结构，包含 xtitle 和 ytitle 字段，支持二级筛选。
        </div>
      </div>

      <BarChart title="正负柱状图" data={data} width="100%" height={500} />

      {/* 数据格式说明 */}
      <div
        style={{
          marginTop: '20px',
          backgroundColor: '#f0f8ff',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ marginTop: 0, color: '#333' }}>扁平化数据格式示例：</h4>
        <pre
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '11px',
            margin: 0,
            overflow: 'auto',
          }}
        >
          {`// 扁平化数据格式：包含 xtitle 和 ytitle 字段
[
  {
    category: "财务数据",
    type: "利润",
    x: 1,
    y: 120,
    xtitle: "季度",
    ytitle: "金额"
  },
  {
    category: "财务数据",
    type: "成本",
    x: 1,
    y: -90,
    xtitle: "季度",
    ytitle: "金额"
  },
  {
    category: "温度变化",
    type: "最高温",
    x: 1,
    y: 15,
    xtitle: "月份",
    ytitle: "温度(°C)"
  },
  // ... 更多数据
]`}
        </pre>
      </div>
    </div>
  );
};

export default NegativeBarChartExample;
