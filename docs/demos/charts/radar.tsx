import React, { useState } from 'react';
import RadarChart, { RadarChartConfigItem } from '@ant-design/md-editor/plugins/chart/RadarChart';

// 实际使用示例：动态数据雷达图
const DynamicRadarChartExample: React.FC = () => {
  // 雷达图配置数组
  const [configs, setConfigs] = useState<RadarChartConfigItem[]>([
    {
      type: 'age',
      typeName: '年龄',
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
      theme: 'light',
      legendPosition: 'right',
    },
    {
      type: 'gender',
      typeName: '性别',
      labels: ['创新', '执行', '沟通', '学习', '团队', '领导'],
      datasets: [
        {
          label: '现状评估',
          data: [65, 80, 70, 85, 75, 60],
          borderColor: '#15e7e4',
        },
        {
          label: '期望水平',
          data: [85, 90, 80, 95, 85, 80],
          borderColor: '#F45BB5',
        },
      ],
      maxValue: 100,
      theme: 'light',
      legendPosition: 'right',
    },
  ]);

  // 更新数据
  const handleDataUpdate = () => {
    setConfigs(prev => prev.map(config => ({
      ...config,
      datasets: config.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.map(() => Math.floor(Math.random() * 100)),
      })),
    })));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>动态雷达图使用示例</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
          configs={configs}
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
          {JSON.stringify(configs, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// export { DynamicRadarChartExample, TeamSkillsAssessmentExample }; 
export default DynamicRadarChartExample;
