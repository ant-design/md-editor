import { AreaChart, AreaChartDataItem } from '@ant-design/agentic-ui';
import { Button } from 'antd';
import React, { useState } from 'react';

const DynamicAreaChartExample: React.FC = () => {
  // 扁平化数据结构
  const [data, setData] = useState<AreaChartDataItem[]>([
    // 营收数据类别
    {
      category: '营收数据',
      type: '本年营收',
      x: 1,
      y: 45000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 2,
      y: 52000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 3,
      y: 48000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 4,
      y: 61000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 5,
      y: 55000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 6,
      y: 67000,
      xtitle: '月份',
      ytitle: '营收金额',
    },

    {
      category: '营收数据',
      type: '去年营收',
      x: 1,
      y: 38000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 2,
      y: 41000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 3,
      y: 42000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 4,
      y: 48000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 5,
      y: 45000,
      xtitle: '月份',
      ytitle: '营收金额',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 6,
      y: 52000,
      xtitle: '月份',
      ytitle: '营收金额',
    },

    // 全球数据（带filterLabel）
    {
      category: '访客数据',
      type: '本周访客',
      x: 1,
      y: 120,
      xtitle: '日期',
      ytitle: '访客数',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 2,
      y: 132,
      xtitle: '日期',
      ytitle: '访客数',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 3,
      y: 101,
      xtitle: '日期',
      ytitle: '访客数',
    },
    {
      category: '访客数据',
      type: '本周访客',
      x: 4,
      y: 134,
      xtitle: '日期',
      ytitle: '访客数',
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

    // 营收数据类别 - 全球
    {
      category: '营收数据',
      type: '本年营收',
      x: 1,
      y: 45000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 2,
      y: 52000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 3,
      y: 48000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 4,
      y: 61000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 5,
      y: 55000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 6,
      y: 67000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },

    {
      category: '营收数据',
      type: '去年营收',
      x: 1,
      y: 38000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 2,
      y: 41000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 3,
      y: 42000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 4,
      y: 48000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 5,
      y: 45000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '全球',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 6,
      y: 52000,
      xtitle: '月份',
      ytitle: '营收金额',
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
      category: '营收数据',
      type: '本年营收',
      x: 1,
      y: 55000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 2,
      y: 62000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 3,
      y: 58000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 4,
      y: 71000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 5,
      y: 65000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '本年营收',
      x: 6,
      y: 77000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },

    {
      category: '营收数据',
      type: '去年营收',
      x: 1,
      y: 48000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 2,
      y: 51000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 3,
      y: 52000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 4,
      y: 58000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 5,
      y: 55000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
    {
      category: '营收数据',
      type: '去年营收',
      x: 6,
      y: 62000,
      xtitle: '月份',
      ytitle: '营收金额',
      filterLabel: '美国',
    },
  ]);

  const handleRandomize = () => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        y:
          item.category === '营收数据'
            ? Math.floor(Math.random() * 70000) + 30000 // 营收数据范围 30000-100000
            : Math.floor(Math.random() * 400), // 访客数据范围 0-400
      })),
    );
  };

  return (
    <div style={{ padding: '12px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        动态面积图使用示例
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
        <AreaChart
          title="动态面积图使用示例"
          data={data}
          width={700}
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
    category: "营收数据",
    type: "本年营收",
    x: 1,
    y: 45000,
    xtitle: "月份",
    ytitle: "营收金额"
  },
  // ... 更多数据
]`}
        </pre>
      </div>
    </div>
  );
};

export default DynamicAreaChartExample;
