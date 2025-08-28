import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const NegativeBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfig, setBaseConfig] = useState<BarChartConfig>({
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
  });

  const transformByQuadrant = (cfg: BarChartConfig, q: 'I'|'II'|'III'|'IV'): BarChartConfig => {
    const xPosition: 'top'|'bottom' = (q === 'II' || q === 'III') ? 'top' : 'bottom';
    const yPosition: 'left'|'right' = (q === 'I' || q === 'II') ? 'left' : 'right';
    return { ...cfg, xPosition, yPosition };
  };

  const config = useMemo(() => transformByQuadrant({ ...baseConfig, theme: currentTheme, legendPosition }, quadrant), [baseConfig, currentTheme, legendPosition, quadrant]);

  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <h3 style={{ margin: '0 0 12px' }}>正负柱状图</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button onClick={() => setCurrentTheme(p => (p === 'dark' ? 'light' : 'dark'))}>切换主题（{currentTheme}）</Button>
        <Button onClick={() => setLegendPosition(p => (['top','right','bottom','left'] as const)[((['top','right','bottom','left'] as const).indexOf(p)+1)%4])}>切换图例位置（{legendPosition}）</Button>
        <Button onClick={() => setQuadrant(p => (['I','II','III','IV'] as const)[((['I','II','III','IV'] as const).indexOf(p)+1)%4])}>切换象限（{quadrant}）</Button>
      </div>
      <BarChart config={config} width={700} height={500} />
    </div>
  );
};

export default NegativeBarChartExample;


