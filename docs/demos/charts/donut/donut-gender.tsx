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
    <div style={{ padding: 12, fontSize: 12 }}>
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
      {/* 数据格式说明 */}
      <div
        style={{
          marginTop: 12,
          backgroundColor: '#f0f8ff',
          padding: 12,
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          color: '#333',
        }}
      >
        <h4 style={{ marginTop: 0 }}>
          扁平化数据格式示例（单值 + 自定义配置）：
        </h4>
        <pre
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 4,
            fontSize: 11,
            margin: 0,
            overflow: 'auto',
          }}
        >
          {`// 数据：两个单值项
[
  { label: "男性", value: 30 },
  { label: "女性", value: 70 }
]

// 配置：与数据长度对应的配置数组
[
  { backgroundColor: ["#388BFF", "#F7F8F9"], showTooltip: false, showLegend: false },
  { backgroundColor: ["#FF6B9D", "#F7F8F9"], showTooltip: false, showLegend: false }
]`}
        </pre>
      </div>
    </div>
  );
};

export default DonutGenderDemo;
