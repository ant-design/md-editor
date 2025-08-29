import DonutChart, {
  DonutChartConfig,
  DonutChartDatum,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutGenderDemo: React.FC = () => {
  // 性别数据：男性30%，女性70%
  const genderData: DonutChartDatum[] = [
    { label: '男性', value: 30 },
    { label: '女性', value: 70 },
  ];

  // 配置：每个性别一个独立的单值饼图
  const genderConfigs: DonutChartConfig[] = [
    {
      backgroundColor: ['#388BFF', '#F7F8F9'], // 男性蓝色
      showTooltip: false,
      showLegend: false, // 单值模式不显示图例
    },
    {
      backgroundColor: ['#FF6B9D', '#F7F8F9'], // 女性粉色
      showTooltip: false,
      showLegend: false, // 单值模式不显示图例
    },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>性别分布饼图：展示男性30%和女性70%的两个独立单值饼图</p>
      <p>每个饼图中心显示对应的百分比和标签</p>
      <DonutChart
        data={genderData}
        configs={genderConfigs}
        width={120}
        height={120}
        title="用户性别分布"
        showToolbar={true}
      />
    </div>
  );
};

export default DonutGenderDemo;
