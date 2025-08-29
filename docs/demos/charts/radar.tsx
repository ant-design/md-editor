import React, { useState } from 'react';
import RadarChart, { RadarChartConfigItem } from '@ant-design/md-editor/plugins/chart/RadarChart';

// 实际使用示例：动态数据雷达图
const DynamicRadarChartExample: React.FC = () => {
  // 雷达图配置对象 - 使用 Record<string, RadarChartConfigItem> 格式
  const [configs, setConfigs] = useState<Record<string, RadarChartConfigItem>>({
    '年龄': {
      labels: ['技术', '设计', '产品', '运营', '市场', '销售'],
      datasets: [
        {
          label: '当前能力',
          data: [75, 60, 80, 65, 70, 55],
        },
        {
          label: '目标能力',
          data: [90, 85, 95, 80, 85, 75],
        },
      ],
      maxValue: 100,
    },
    '性别': {
      labels: ['创新', '执行', '沟通', '学习', '团队', '领导'],
      datasets: [
        {
          label: '现状评估',
          data: [65, 80, 70, 85, 75, 60],
        },
        {
          label: '期望水平',
          data: [85, 90, 80, 95, 85, 80],
        },
        {
          label: '测试能力',
          data: [90, 85, 95, 80, 85, 75],
        }
      ],
      maxValue: 100,
    },
  });

  // 更新数据
  const handleDataUpdate = () => {
    setConfigs(prev => 
      Object.fromEntries(
        Object.entries(prev).map(([key, config]) => [
          key,
          {
            ...config,
            datasets: config.datasets.map(dataset => ({
              ...dataset,
              data: dataset.data.map(() => Math.floor(Math.random() * 100)),
            })),
          }
        ])
      )
    );
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
        
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          💡 简化配置：只需要 labels 和 datasets，borderColor 会自动应用默认颜色序列（#388BFF, #917EF7, #2AD8FC）。点击右上角下载按钮可保存图表。
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <RadarChart 
          title="2025年第一季度短视频用户分布分析"
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

      {/* 默认颜色说明 */}
      <div style={{ 
        marginTop: '20px',
        backgroundColor: '#fafafa', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #e8e8e8'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>默认颜色序列：</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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

// export { DynamicRadarChartExample, TeamSkillsAssessmentExample }; 
export default DynamicRadarChartExample;
