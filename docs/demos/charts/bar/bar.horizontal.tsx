import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const HorizontalBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfigs, setBaseConfigs] = useState<BarChartConfig[]>([
    {
      type: 'product',
      typeName: '产品销量',
      labels: ['产品A', '产品B', '产品C', '产品D', '产品E'],
      datasets: [
        { label: '销量', data: [320, 452, 301, 334, 390], borderColor: '#1677ff', backgroundColor: '#1677ff' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '销量',
      yTitle: '产品',
      showGrid: true,
      indexAxis: 'y',
    },
    {
      type: 'region',
      typeName: '地区销售额',
      labels: ['华北', '华东', '华南', '西南', '西北'],
      datasets: [
        { label: '销售额', data: [125000, 168000, 142000, 89000, 76000], borderColor: '#33E59B', backgroundColor: '#33E59B' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '销售额',
      yTitle: '地区',
      showGrid: true,
      indexAxis: 'y',
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
    <div style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <h3 style={{ margin: '0 0 12px' }}>条形图（横向柱状图）</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button type="primary" onClick={() => setCurrentTheme(p => (p === 'dark' ? 'light' : 'dark'))}>切换主题（{currentTheme}）</Button>
        <Button type="primary" onClick={() => setLegendPosition(p => (['top','right','bottom','left'] as const)[((['top','right','bottom','left'] as const).indexOf(p)+1)%4])}>切换图例位置（{legendPosition}）</Button>
        <Button type="primary" onClick={() => setQuadrant(p => (['I','II','III','IV'] as const)[((['I','II','III','IV'] as const).indexOf(p)+1)%4])}>切换象限（{quadrant}）</Button>
      </div>
      <BarChart configs={configs} title="条形图（横向柱状图）" width={700} height={500} />

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

export default HorizontalBarChartExample;


