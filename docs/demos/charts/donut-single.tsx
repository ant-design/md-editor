import DonutCharts, {
  DonutChartConfig,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutSingleDemo: React.FC = () => {
  const singleValueConfigs: DonutChartConfig[] = [
    {
      title: '完成率',
      datasets: [
        { label: '完成率', value: 15 },
        { label: '剩余', value: 75 },
      ],
      backgroundColor: ['#917EF7', '#F7F8F9'],
      cutout: '75%',
      showLegend: false,
      showToolbar: false,
    },
    {
      title: '任务进度',
      datasets: [
        { label: '已完成', value: 47 },
        { label: '剩余', value: 53 },
      ],
      backgroundColor: ['#2AD8FC', '#F7F8F9'],
      cutout: '75%',
      showLegend: false,
      showToolbar: false,
    },
    {
      title: 'CPU 使用率',
      datasets: [
        { label: '使用率', value: 33 },
        { label: '空闲', value: 67 },
      ],
      backgroundColor: ['#388BFF', '#F7F8F9'],
      cutout: '75%',
      showLegend: false,
      showToolbar: false,
    },
    {
      title: 'CPU 使用率',
      datasets: [
        { label: '使用率', value: 38 },
        { label: '空闲', value: 62 },
      ],
      backgroundColor: ['#718AB6', '#F7F8F9'],
      cutout: '75%',
      showLegend: false,
      showToolbar: false,
    },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B' }}>
      <p>用于展示单一指标的占比，如完成率、进度、CPU 使用率等。</p>
      <DonutCharts configs={singleValueConfigs} width={128} height={128} />
    </div>
  );
};

export default DonutSingleDemo;
