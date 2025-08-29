import DonutChart, {
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
      <DonutChart
        data={data}
        width={260}
        height={200}
        title="2025年第一季度短视频用户分布分析"
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
        <h4 style={{ marginTop: 0 }}>扁平化数据格式示例（多值）：</h4>
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
          {`// 多值饼图：每一项为一个分类的占比
[
  { label: "A 产品", value: 25 },
  { label: "B 产品", value: 40 },
  { label: "C 产品", value: 25 },
  { label: "D 产品", value: 25 }
]`}
        </pre>
      </div>
    </div>
  );
};

export default DonutMultiDemo;
