import DonutCharts, {
  DonutChartConfig,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutMultiDemo: React.FC = () => {
  const multiValueConfigs: DonutChartConfig[] = [
    {
      title: '各品类销量占比',
      datasets: [
        { label: 'A 产品', value: 25 },
        { label: 'B 产品', value: 40 },
        { label: 'C 产品', value: 25 },
        { label: 'D 产品', value: 25 },
      ],
      theme: 'light',
      cutout: '70%',
      showLegend: true,
      showToolbar: false,
    },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B' }}>
      <p>用于展示多个分类的占比结构，如各品类销量占比。</p>
      <DonutCharts configs={multiValueConfigs} width={260} height={200} />
    </div>
  );
};

export default DonutMultiDemo;
