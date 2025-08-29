import DonutCharts, {
  DonutChartDatum,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutCategorizedDemo: React.FC = () => {
  // 带分类的多值饼图数据
  const data: DonutChartDatum[] = [
    // 按产品类别分类的数据
    { category: '电子产品', label: '智能手机', value: 35 },
    { category: '电子产品', label: '笔记本电脑', value: 25 },
    { category: '电子产品', label: '平板电脑', value: 15 },
    { category: '电子产品', label: '智能手表', value: 10 },
    { category: '电子产品', label: '耳机', value: 15 },

    // 按地区分类的数据
    { category: '地区分布', label: '华东地区', value: 40 },
    { category: '地区分布', label: '华北地区', value: 25 },
    { category: '地区分布', label: '华南地区', value: 20 },
    { category: '地区分布', label: '西部地区', value: 10 },
    { category: '地区分布', label: '东北地区', value: 5 },

    // 按年龄段分类的数据
    { category: '年龄分布', label: '18-25岁', value: 30 },
    { category: '年龄分布', label: '26-35岁', value: 35 },
    { category: '年龄分布', label: '36-45岁', value: 20 },
    { category: '年龄分布', label: '46-55岁', value: 10 },
    { category: '年龄分布', label: '55岁以上', value: 5 },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>
        带分类的饼图：数据按 category
        字段进行分类，可以通过筛选器切换不同分类视图。
      </p>
      <p>支持自动分类功能，当数据包含 category 字段时会自动启用分类筛选。</p>
      <DonutCharts
        data={data}
        width={260}
        height={200}
        title="2025年第一季度销售数据分析"
      />
    </div>
  );
};

export default DonutCategorizedDemo;
