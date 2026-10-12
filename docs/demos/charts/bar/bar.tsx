import BarChart, {
  BarChartDataItem,
} from '@ant-design/agentic-ui/Plugins/chart/BarChart';
import { Button } from 'antd';
import React, { useState } from 'react';

const DynamicBarChartExample: React.FC = () => {
  // 扁平化数据结构
  const [data, setData] = useState<BarChartDataItem[]>(() => [
    // 全球数据（带filterLabel）
    {
      category: '访客数据',
      type: '本周访客',
      x: 1,
      y: 120,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 2,
      y: 132,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 3,
      y: 101,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 4,
      y: 134,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 5,
      y: 90,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 6,
      y: 230,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 7,
      y: 210,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },

    {
      category: '访客数据',
      type: '上周访客',
      x: 1,
      y: 220,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 2,
      y: 182,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 3,
      y: 191,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 4,
      y: 234,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 5,
      y: 290,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 6,
      y: 330,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 7,
      y: 310,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '全球',
    },

    // 销售数据类别 - 全球
    {
      category: '销售数据',
      type: '本年销售额',
      x: 1,
      y: 85000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 2,
      y: 92000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 3,
      y: 88000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 4,
      y: 105000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },

    {
      category: '销售数据',
      type: '去年销售额',
      x: 1,
      y: 72000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 2,
      y: 78000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 3,
      y: 81000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 4,
      y: 89000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '全球',
    },

    // 美国数据（带filterLabel）
    {
      category: '访客数据',
      type: '本周访客',
      x: 1,
      y: 180,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 2,
      y: 195,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 3,
      y: 160,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 4,
      y: 210,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 5,
      y: 140,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 6,
      y: 280,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 7,
      y: 260,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },

    {
      category: '访客数据',
      type: '上周访客',
      x: 1,
      y: 280,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 2,
      y: 240,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 3,
      y: 220,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 4,
      y: 290,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 5,
      y: 350,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 6,
      y: 390,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },
    {
      category: '访客数据',
      type: '上周访客',
      x: 7,
      y: 370,
      xtitle: '日期',
      ytitle: '访客数',
      filterLabel: '美国',
    },

    {
      category: '销售数据',
      type: '本年销售额',
      x: 1,
      y: 95000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 2,
      y: 102000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 3,
      y: 98000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '本年销售额',
      x: 4,
      y: 115000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },

    {
      category: '销售数据',
      type: '去年销售额',
      x: 1,
      y: 82000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 2,
      y: 88000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 3,
      y: 91000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
    {
      category: '销售数据',
      type: '去年销售额',
      x: 4,
      y: 99000,
      xtitle: '季度',
      ytitle: '销售额',
      filterLabel: '美国',
    },
  ]);

  const handleRandomize = () => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        y:
          item.category === '销售数据'
            ? Math.floor(Math.random() * 100000) + 50000 // 销售数据范围 50000-150000
            : Math.floor(Math.random() * 400), // 访客数据范围 0-400
      })),
    );
  };

  return (
    <div style={{ padding: '12px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        动态柱状图使用示例
      </h2>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
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

      <div style={{ marginBottom: '20px' }}>
        <BarChart
          title="动态柱状图使用示例"
          data={data}
          width="100%"
          height={500}
        />
      </div>

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
    category: "访客数据",
    type: "本周访客",
    x: 1,
    y: 120,
    xtitle: "日期",
    ytitle: "访客数"
  },
  {
    category: "销售数据",
    type: "本年销售额",
    x: 1,
    y: 85000,
    xtitle: "季度",
    ytitle: "销售额"
  },
  // ... 更多数据
]`}
        </pre>
      </div>
    </div>
  );
};

export default DynamicBarChartExample;
