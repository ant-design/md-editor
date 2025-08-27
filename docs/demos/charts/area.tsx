import React, { useMemo, useState } from 'react';
import AreaChart, { AreaChartConfig } from '@ant-design/md-editor/plugins/chart/AreaChart';

const DynamicAreaChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('bottom');
  const [quadrant, setQuadrant] = useState<'I' | 'II' | 'III' | 'IV'>('I');

  const [baseConfig, setBaseConfig] = useState<AreaChartConfig>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: '本周访客',
        data: [120, 132, 101, 134, 90, 230, 210],
        borderColor: '#388BFF',
      },
      {
        label: '上周访客',
        data: [220, 182, 191, 234, 290, 330, 310],
        borderColor: '#917EF7',
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
  });

  const transformConfigByQuadrant = (cfg: AreaChartConfig, q: 'I'|'II'|'III'|'IV'): AreaChartConfig => {
    const xPosition: 'top'|'bottom' = (q === 'II' || q === 'III') ? 'top' : 'bottom';
    const yPosition: 'left'|'right' = (q === 'I' || q === 'II') ? 'left' : 'right';
    return { ...cfg, xPosition, yPosition };
  };

  const config = useMemo(() => transformConfigByQuadrant({ ...baseConfig, theme: currentTheme, legendPosition }, quadrant), [baseConfig, currentTheme, legendPosition, quadrant]);

  const handleThemeChange = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(next);
    setBaseConfig(prev => ({ ...prev, theme: next }));
  };

  const handleLegendPositionChange = () => {
    const positions: Array<'top' | 'left' | 'bottom' | 'right'> = ['top', 'right', 'bottom', 'left'];
    const idx = positions.indexOf(legendPosition);
    const next = positions[(idx + 1) % positions.length];
    setLegendPosition(next);
    setBaseConfig(prev => ({ ...prev, legendPosition: next }));
  };

  const handleRandomize = () => {
    setBaseConfig(prev => ({
      ...prev,
      datasets: prev.datasets.map(ds => ({
        ...ds,
        data: ds.data.map(() => Math.floor(Math.random() * 360)),
      })),
    }));
  };

  const handleQuadrantToggle = () => {
    const order: Array<'I'|'II'|'III'|'IV'> = ['I','II','III','IV'];
    const next = order[(order.indexOf(quadrant) + 1) % order.length];
    setQuadrant(next);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>动态面积图使用示例</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleThemeChange}
          style={{
            padding: '8px 16px',
            backgroundColor: currentTheme === 'dark' ? '#1677ff' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          切换主题 ({currentTheme === 'dark' ? '深色' : '浅色'})
        </button>

        <button
          type="button"
          onClick={handleLegendPositionChange}
          style={{
            padding: '8px 16px',
            backgroundColor: '#8954FC',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          切换图例位置 ({legendPosition})
        </button>

        <button
          type="button"
          onClick={handleRandomize}
          style={{
            padding: '8px 16px',
            backgroundColor: '#F45BB5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          随机更新数据
        </button>

        <button
          type="button"
          onClick={handleQuadrantToggle}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          切换象限（当前：{quadrant}）
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <AreaChart
          config={config}
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
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DynamicAreaChartExample;


