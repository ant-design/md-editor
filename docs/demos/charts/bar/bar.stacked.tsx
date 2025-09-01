import React, { useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartDataItem } from '@ant-design/md-editor/plugins/chart/BarChart';

const StackedBarChartExample: React.FC = () => {
  // 扁平化数据结构 - 堆叠柱状图
  const [data, setData] = useState<BarChartDataItem[]>([
    // 流量来源数据
    { category: '流量来源', type: '直接访问', x: 1, y: 120, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 2, y: 132, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 3, y: 101, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 4, y: 134, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 5, y: 90, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 6, y: 230, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '直接访问', x: 7, y: 210, xtitle: '日期', ytitle: 'PV' },

    { category: '流量来源', type: '搜索引擎', x: 1, y: 220, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 2, y: 182, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 3, y: 191, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 4, y: 234, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 5, y: 290, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 6, y: 330, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '搜索引擎', x: 7, y: 310, xtitle: '日期', ytitle: 'PV' },

    { category: '流量来源', type: '外链引荐', x: 1, y: 150, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 2, y: 232, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 3, y: 201, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 4, y: 154, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 5, y: 190, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 6, y: 330, xtitle: '日期', ytitle: 'PV' },
    { category: '流量来源', type: '外链引荐', x: 7, y: 410, xtitle: '日期', ytitle: 'PV' },

    // 部门预算数据
    { category: '部门预算', type: '人力成本', x: 1, y: 45000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '人力成本', x: 2, y: 52000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '人力成本', x: 3, y: 68000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '人力成本', x: 4, y: 28000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '人力成本', x: 5, y: 35000, xtitle: '部门', ytitle: '预算金额' },

    { category: '部门预算', type: '运营成本', x: 1, y: 28000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '运营成本', x: 2, y: 35000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '运营成本', x: 3, y: 42000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '运营成本', x: 4, y: 18000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '运营成本', x: 5, y: 22000, xtitle: '部门', ytitle: '预算金额' },

    { category: '部门预算', type: '设备成本', x: 1, y: 18000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '设备成本', x: 2, y: 25000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '设备成本', x: 3, y: 55000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '设备成本', x: 4, y: 12000, xtitle: '部门', ytitle: '预算金额' },
    { category: '部门预算', type: '设备成本', x: 5, y: 15000, xtitle: '部门', ytitle: '预算金额' },
  ]);

  const handleRandomize = () => {
    setData(prev => prev.map(item => ({
      ...item,
      y: item.category === '流量来源'
        ? Math.floor(Math.random() * 500)  // 流量来源数据范围 0-500
        : Math.floor(Math.random() * 80000) + 10000  // 预算数据范围 10000-90000
    })));
  };

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ margin: '0 0 12px' }}>堆叠柱状图</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button
          type="primary"
          onClick={handleRandomize}
        >
          随机更新数据
        </Button>

        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          💡 使用扁平化数据结构，包含 xtitle 和 ytitle 字段，支持二级筛选。
        </div>
      </div>

      <BarChart
        title="堆叠柱状图"
        data={data}
        width={700}
        height={500}
        stacked={true}
      />

      {/* 数据格式说明 */}
      <div style={{
        marginTop: '20px',
        backgroundColor: '#f0f8ff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #e8e8e8'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>扁平化数据格式示例：</h4>
        <pre style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '11px',
          margin: 0,
          overflow: 'auto'
        }}>
{`// 扁平化数据格式：包含 xtitle 和 ytitle 字段
[
  {
    category: "流量来源",
    type: "直接访问",
    x: 1,
    y: 120,
    xtitle: "日期",
    ytitle: "PV"
  },
  {
    category: "部门预算",
    type: "人力成本",
    x: 1,
    y: 45000,
    xtitle: "部门",
    ytitle: "预算金额"
  },
  // ... 更多数据
]`}
        </pre>
      </div>
    </div>
  );
};

export default StackedBarChartExample;


