import React, { useMemo, useState } from 'react';
import { Button } from 'antd';
import BarChart, { BarChartConfig } from '@ant-design/md-editor/plugins/chart/BarChart';

const StackedBarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfigs, setBaseConfigs] = useState<BarChartConfig[]>([
    {
      type: 'traffic',
      typeName: '流量来源',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: '直接访问', data: [120, 132, 101, 134, 90, 230, 210], borderColor: '#1677ff', backgroundColor: '#1677ff' },
        { label: '搜索引擎', data: [220, 182, 191, 234, 290, 330, 310], borderColor: '#8954FC', backgroundColor: '#8954FC' },
        { label: '外链引荐', data: [150, 232, 201, 154, 190, 330, 410], borderColor: '#15e7e4', backgroundColor: '#15e7e4' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '日期',
      yTitle: 'PV',
      yMin: 0,
      showGrid: true,
      stacked: true,
    },
    {
      type: 'department',
      typeName: '部门预算',
      labels: ['市场部', '销售部', '技术部', '人事部', '财务部'],
      datasets: [
        { label: '人力成本', data: [45000, 52000, 68000, 28000, 35000], borderColor: '#FF6B6B', backgroundColor: '#FF6B6B' },
        { label: '运营成本', data: [28000, 35000, 42000, 18000, 22000], borderColor: '#4ECDC4', backgroundColor: '#4ECDC4' },
        { label: '设备成本', data: [18000, 25000, 55000, 12000, 15000], borderColor: '#45B7D1', backgroundColor: '#45B7D1' },
      ],
      theme: currentTheme,
      legendPosition,
      xTitle: '部门',
      yTitle: '预算金额',
      yMin: 0,
      showGrid: true,
      stacked: true,
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
      <h3 style={{ margin: '0 0 12px' }}>堆叠柱状图</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Button type="primary" onClick={() => setCurrentTheme(p => (p === 'dark' ? 'light' : 'dark'))}>切换主题（{currentTheme}）</Button>
        <Button type="primary" onClick={() => setLegendPosition(p => (['top','right','bottom','left'] as const)[((['top','right','bottom','left'] as const).indexOf(p)+1)%4])}>切换图例位置（{legendPosition}）</Button>
        <Button type="primary" onClick={() => setQuadrant(p => (['I','II','III','IV'] as const)[((['I','II','III','IV'] as const).indexOf(p)+1)%4])}>切换象限（{quadrant}）</Button>
      </div>
      <BarChart configs={configs} title="堆叠柱状图" width={700} height={500} />

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

export default StackedBarChartExample;


