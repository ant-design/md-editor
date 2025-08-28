import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const DynamicBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfigs, setBaseConfigs] = useState<BarChartConfig[]>([
    {
      type: 'visitor',
      typeName: '访客数据',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: '本周访客',
          data: [120, 132, 101, 134, 90, 230, 210],
          borderColor: '#388BFF',
          backgroundColor: '#388BFF',
        },
        {
          label: '上周访客',
          data: [220, 182, 191, 234, 290, 330, 310],
          borderColor: '#917EF7',
          backgroundColor: '#917EF7',
        },
      ],
      yMin: 0,
      yMax: 400,
      yStepSize: 50,
      theme: currentTheme,
      legendPosition,
      xTitle: '日期',
      yTitle: '访客数',
      showGrid: true,
      categoryPercentage: 0.7,
      barPercentage: 0.8,
    },
    {
      type: 'sales',
      typeName: '销售数据',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: '本年销售额',
          data: [85000, 92000, 88000, 105000],
          borderColor: '#33E59B',
          backgroundColor: '#33E59B',
        },
        {
          label: '去年销售额',
          data: [72000, 78000, 81000, 89000],
          borderColor: '#F45BB5',
          backgroundColor: '#F45BB5',
        },
      ],
      yMin: 60000,
      yMax: 110000,
      yStepSize: 10000,
      theme: currentTheme,
      legendPosition,
      xTitle: '季度',
      yTitle: '销售额',
      showGrid: true,
      categoryPercentage: 0.7,
      barPercentage: 0.8,
    },
  ]);

  const transformConfigByQuadrant = (cfg: BarChartConfig, q: 'I'|'II'|'III'|'IV'): BarChartConfig => {
    const xPosition: 'top'|'bottom' = (q === 'II' || q === 'III') ? 'top' : 'bottom';
    const yPosition: 'left'|'right' = (q === 'I' || q === 'II') ? 'left' : 'right';
    return { ...cfg, xPosition, yPosition };
  };

  const configs = useMemo(() => baseConfigs.map(config =>
    transformConfigByQuadrant({ ...config, theme: currentTheme, legendPosition }, quadrant)
  ), [baseConfigs, currentTheme, legendPosition, quadrant]);

  const handleThemeChange = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(next);
    setBaseConfigs(prev => prev.map(config => ({ ...config, theme: next })));
  };

  const handleLegendPositionChange = () => {
    const positions: Array<'top' | 'left' | 'bottom' | 'right'> = ['top', 'right', 'bottom', 'left'];
    const idx = positions.indexOf(legendPosition);
    const next = positions[(idx + 1) % positions.length];
    setLegendPosition(next);
    setBaseConfigs(prev => prev.map(config => ({ ...config, legendPosition: next })));
  };

  const handleRandomize = () => {
    setBaseConfigs(prev => prev.map(config => ({
      ...config,
      datasets: config.datasets.map(ds => ({
        ...ds,
        data: ds.data.map(() => Math.floor(Math.random() * (config.yMax || 400))),
      })),
    })));
  };

  const handleQuadrantToggle = () => {
    const order: Array<'I'|'II'|'III'|'IV'> = ['I','II','III','IV'];
    const next = order[(order.indexOf(quadrant) + 1) % order.length];
    setQuadrant(next);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>动态柱状图使用示例</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button
          type="primary"
          onClick={handleThemeChange}
        >
          切换主题 ({currentTheme === 'dark' ? '深色' : '浅色'})
        </Button>

        <Button
          type="primary"
          onClick={handleLegendPositionChange}
        >
          切换图例位置 ({legendPosition})
        </Button>

        <Button
          type="primary"
          onClick={handleRandomize}
        >
          随机更新数据
        </Button>

        <Button
          type="primary"
          onClick={handleQuadrantToggle}
        >
          切换象限（当前：{quadrant}）
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <BarChart
          configs={configs}
          title="动态柱状图使用示例"
          width={700}
          height={500}
        />
      </div>

      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>当前配置信息：</h4>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px',
        }}>
          {JSON.stringify(configs, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DynamicBarChartExample;


