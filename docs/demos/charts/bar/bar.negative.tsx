import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const NegativeBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfigs, setBaseConfigs] = useState<BarChartConfig[]>([
    {
      type: 'finance',
      typeName: '财务数据',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { label: '利润', data: [120, -60, 80, -30], borderColor: '#33E59B', backgroundColor: '#33E59B' },
        { label: '成本', data: [-90, -40, -50, -20], borderColor: '#F45BB5', backgroundColor: '#F45BB5' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '季度',
      yTitle: '金额',
      yMin: -200,
      yMax: 200,
      yStepSize: 50,
      showGrid: true,
    },
    {
      type: 'temperature',
      typeName: '温度变化',
      labels: ['1月', '2月', '3月', '4月'],
      datasets: [
        { label: '最高温', data: [15, 22, 28, 32], borderColor: '#FF6B6B', backgroundColor: '#FF6B6B' },
        { label: '最低温', data: [-5, -2, 5, 12], borderColor: '#4ECDC4', backgroundColor: '#4ECDC4' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '月份',
      yTitle: '温度(°C)',
      yMin: -10,
      yMax: 35,
      yStepSize: 5,
      showGrid: true,
    },
  ]);

  const transformByQuadrant = (cfg: BarChartConfig, q: 'I'|'II'|'III'|'IV'): BarChartConfig => {
    const xPosition: 'top'|'bottom' = (q === 'II' || q === 'III') ? 'top' : 'bottom';
    const yPosition: 'left'|'right' = (q === 'I' || q === 'II') ? 'left' : 'right';
    return { ...cfg, xPosition, yPosition };
  };

  const configs = useMemo(() => baseConfigs.map(config =>
    transformByQuadrant({ ...config, theme: currentTheme, legendPosition }, quadrant)
  ), [baseConfigs, currentTheme, legendPosition, quadrant]);

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ margin: '0 0 12px' }}>正负柱状图</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button type="primary" onClick={() => setCurrentTheme(p => (p === 'dark' ? 'light' : 'dark'))}>切换主题 ({currentTheme === 'dark' ? '深色' : '浅色'})</Button>
        <Button type="primary" onClick={() => setLegendPosition(p => (['top','right','bottom','left'] as const)[((['top','right','bottom','left'] as const).indexOf(p)+1)%4])}>切换图例位置（{legendPosition}）</Button>
        <Button type="primary" onClick={() => setQuadrant(p => (['I','II','III','IV'] as const)[((['I','II','III','IV'] as const).indexOf(p)+1)%4])}>切换象限（{quadrant}）</Button>
      </div>
      <BarChart configs={configs} title="正负柱状图" width={700} height={500} />

      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        marginTop: '20px'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>当前配置信息：</h4>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(configs, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default NegativeBarChartExample;


