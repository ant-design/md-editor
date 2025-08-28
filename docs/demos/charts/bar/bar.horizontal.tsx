import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const HorizontalBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfig, setBaseConfig] = useState<BarChartConfig>({
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
  });

  const transformByQuadrant = (cfg: BarChartConfig, q: 'I'|'II'|'III'|'IV'): BarChartConfig => {
    const xPosition: 'top'|'bottom' = (q === 'II' || q === 'III') ? 'top' : 'bottom';
    const yPosition: 'left'|'right' = (q === 'I' || q === 'II') ? 'left' : 'right';
    return { ...cfg, xPosition, yPosition };
  };

  const config = useMemo(() => transformByQuadrant({ ...baseConfig, theme: currentTheme, legendPosition }, quadrant), [baseConfig, currentTheme, legendPosition, quadrant]);

  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <h3 style={{ margin: '0 0 12px' }}>条形图（横向柱状图）</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button onClick={() => setCurrentTheme(p => (p === 'dark' ? 'light' : 'dark'))}>切换主题（{currentTheme}）</Button>
        <Button onClick={() => setLegendPosition(p => (['top','right','bottom','left'] as const)[((['top','right','bottom','left'] as const).indexOf(p)+1)%4])}>切换图例位置（{legendPosition}）</Button>
        <Button onClick={() => setQuadrant(p => (['I','II','III','IV'] as const)[((['I','II','III','IV'] as const).indexOf(p)+1)%4])}>切换象限（{quadrant}）</Button>
      </div>
      <BarChart config={config} width={700} height={500} />
    </div>
  );
};

export default HorizontalBarChartExample;


