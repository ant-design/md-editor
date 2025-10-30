import DonutChart, {
  DonutChartData,
} from '@ant-design/agentic-ui/Plugins/chart/DonutChart';
import React from 'react';

const DonutSingleDemo: React.FC = () => {
  // 性别数据：男性30%，女性70%
  const data: DonutChartData[] = [
    { label: '男性', value: 30 },
    { label: '女性', value: 70 },
  ];

  return (
    <div style={{ padding: 12, fontSize: 12 }}>
      <p>单值饼图-性别分布：展示男性30%和女性70%的两个独立单值饼图</p>
      <DonutChart
        data={data}
        width={120}
        height={120}
        singleMode
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
]`}
        </pre>
      </div>
    </div>
  );
};

export default DonutSingleDemo;
