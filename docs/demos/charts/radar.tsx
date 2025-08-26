import React, { useState } from 'react';
import RadarChart, { RadarChartConfig } from '@ant-design/md-editor/plugins/chart/RadarChart';

// 实际使用示例：动态数据雷达图
const DynamicRadarChartExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [legendPosition, setLegendPosition] = useState<'top' | 'left' | 'bottom' | 'right'>('right');

  // 动态配置示例
  const [config, setConfig] = useState<RadarChartConfig>({
    labels: ['技术', '设计', '产品', '运营', '市场', '销售'],
    datasets: [
      {
        label: '当前能力',
        data: [75, 60, 80, 65, 70, 55],
        borderColor: '#388BFF',
      },
      {
        label: '目标能力',
        data: [90, 85, 95, 80, 85, 75],
        borderColor: '#917EF7',
      },
    ],
    maxValue: 100,
    theme: currentTheme,
    legendPosition: legendPosition,
  });

  // 切换主题
  const handleThemeChange = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    setConfig(prev => ({ ...prev, theme: newTheme }));
  };

  // 切换图例位置
  const handleLegendPositionChange = () => {
    const positions: Array<'top' | 'left' | 'bottom' | 'right'> = ['top', 'right', 'bottom', 'left'];
    const currentIndex = positions.indexOf(legendPosition);
    const nextPosition = positions[(currentIndex + 1) % positions.length];
    setLegendPosition(nextPosition);
    setConfig(prev => ({ ...prev, legendPosition: nextPosition }));
  };

  // 更新数据
  const handleDataUpdate = () => {
    const newData = config.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(() => Math.floor(Math.random() * 100)),
    }));
    setConfig(prev => ({ ...prev, datasets: newData }));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>动态雷达图使用示例</h2>
      
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
          onClick={handleDataUpdate}
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
      </div>

      <div style={{ marginBottom: '20px' }}>
        <RadarChart 
          config={config}
          width={700} 
          height={500} 
        />
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #e8e8e8'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>当前配置信息：</h4>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// export { DynamicRadarChartExample, TeamSkillsAssessmentExample }; 
export default DynamicRadarChartExample;
