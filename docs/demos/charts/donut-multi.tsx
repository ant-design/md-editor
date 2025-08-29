import DonutCharts, {
  DonutChartConfig,
  DonutChartDatum,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutMultiDemo: React.FC = () => {
  const data: DonutChartDatum[] = [
    { label: 'A 产品', value: 25 },
    { label: 'B 产品', value: 40 },
    { label: 'C 产品', value: 25 },
    { label: 'D 产品', value: 25 },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>多值饼图：用于展示多个分类的占比结构，如各品类销量占比。</p>
      <DonutCharts
        data={data}
        width={260}
        height={200}
        title="2025年第一季度短视频用户分布分析"
      />
    </div>
  );
};

export default DonutMultiDemo;
