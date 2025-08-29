import React from 'react';
import ScatterChart, { ScatterChartConfigItem, ScatterChartDataset } from '../../../src/plugins/chart/ScatterChart';

// 生成示例数据
const generateSampleData = (): ScatterChartDataset[] => {
  const groupAData = [];
  const groupBData = [];

  // 生成 1-12 月的数据，模拟上升趋势
  for (let month = 1; month <= 12; month++) {
    // A组数据：从低值开始，逐渐上升
    const baseValueA = 10 + Math.random() * 10;
    const trendA = month * 7 + Math.random() * 5;
    groupAData.push({
      x: month,
      y: Math.min(100, baseValueA + trendA)
    });

    // B组数据：从低值开始，逐渐上升，通常比A组高
    const baseValueB = 15 + Math.random() * 10;
    const trendB = month * 7.5 + Math.random() * 5;
    groupBData.push({
      x: month,
      y: Math.min(100, baseValueB + trendB)
    });
  }

  return [
    {
      label: 'A组',
      data: groupAData,
    },
    {
      label: 'B组',  
      data: groupBData,
    }
  ];
};

const ScatterChartDemo: React.FC = () => {
  const configs: Record<string, ScatterChartConfigItem> = {
    '年龄': {
      datasets: generateSampleData(),
      xAxisLabel: '月份',
      yAxisLabel: '资金流向',
      xAxisMin: 1,
      xAxisMax: 12,
      yAxisMin: 0,
      yAxisMax: 100,
      xAxisStep: 1,
      yAxisStep: 10
    },
    "性别": {
      datasets: generateSampleData(),
      xAxisLabel: '月份',
      yAxisLabel: '资金流向',
      xAxisMin: 1,
      xAxisMax: 12,
      yAxisMin: 0,
      yAxisMax: 100,
      xAxisStep: 1,
      yAxisStep: 10
    }
  };





  return (
    <div style={{ padding: '20px' }}>
      <h2>散点图组件示例</h2>
      
      <div style={{
        marginBottom: '20px',
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        display: 'inline-block'
      }}>
        💡 简化配置：只需要 datasets 数据，backgroundColor 和 borderColor 会自动应用默认颜色序列（#388BFF, #917EF7, #2AD8FC）。点击右上角下载按钮可保存图表。
      </div>

      {/* 散点图组件 */}
      <div style={{ marginBottom: '20px' }}>
        <ScatterChart
          title="2025年第一季度短视频用户分布分析"
          configs={configs}
          width={700}
          height={500}
          className="scatter-demo"
        />
      </div>

      {/* 数据信息 */}
      <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
        <h3>当前配置信息：</h3>
        <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(configs, null, 2)}
        </pre>
      </div>

      {/* 默认颜色说明 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        border: '1px solid #e8e8e8', 
        borderRadius: '8px',
        backgroundColor: '#fafafa'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>默认颜色序列：</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#388BFF', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第一个：#388BFF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#917EF7', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第二个：#917EF7</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#2AD8FC', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第三个：#2AD8FC</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ScatterChartDemo;
