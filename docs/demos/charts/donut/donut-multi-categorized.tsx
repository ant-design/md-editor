import DonutChart, {
  DonutChartDatum,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

const DonutCategorizedDemo: React.FC = () => {
  // 带分类的多值饼图数据
  const data: DonutChartDatum[] = [
    // 按产品类别分类的数据
    { category: '电子产品', label: '智能手机', value: 35, filterLable: '全球' },
    {
      category: '电子产品',
      label: '笔记本电脑',
      value: 25,
      filterLable: '全球',
    },
    { category: '电子产品', label: '平板电脑', value: 15, filterLable: '全球' },
    { category: '电子产品', label: '智能手表', value: 10, filterLable: '全球' },
    { category: '电子产品', label: '耳机', value: 15, filterLable: '全球' },

    // 按产品类别分类的数据 - 中国
    { category: '电子产品', label: '智能手机', value: 30, filterLable: '中国' },
    {
      category: '电子产品',
      label: '笔记本电脑',
      value: 30,
      filterLable: '中国',
    },
    { category: '电子产品', label: '平板电脑', value: 15, filterLable: '中国' },
    { category: '电子产品', label: '智能手表', value: 10, filterLable: '中国' },
    { category: '电子产品', label: '耳机', value: 15, filterLable: '中国' },

    // 按地区分类的数据 - 全球
    { category: '地区分布', label: '华东地区', value: 40, filterLable: '全球' },
    { category: '地区分布', label: '华北地区', value: 25, filterLable: '全球' },
    { category: '地区分布', label: '华南地区', value: 20, filterLable: '全球' },
    { category: '地区分布', label: '西部地区', value: 10, filterLable: '全球' },
    { category: '地区分布', label: '东北地区', value: 5, filterLable: '全球' },

    // 按地区分类的数据 - 中国
    { category: '地区分布', label: '华东地区', value: 35, filterLable: '中国' },
    { category: '地区分布', label: '华北地区', value: 25, filterLable: '中国' },
    { category: '地区分布', label: '华南地区', value: 20, filterLable: '中国' },
    { category: '地区分布', label: '西部地区', value: 15, filterLable: '中国' },
    { category: '地区分布', label: '东北地区', value: 5, filterLable: '中国' },

    // 按年龄段分类的数据 - 全球
    { category: '年龄分布', label: '18-25岁', value: 30, filterLable: '全球' },
    { category: '年龄分布', label: '26-35岁', value: 35, filterLable: '全球' },
    { category: '年龄分布', label: '36-45岁', value: 20, filterLable: '全球' },
    { category: '年龄分布', label: '46-55岁', value: 10, filterLable: '全球' },
    { category: '年龄分布', label: '55岁以上', value: 5, filterLable: '全球' },

    // 按年龄段分类的数据 - 中国
    { category: '年龄分布', label: '18-25岁', value: 28, filterLable: '中国' },
    { category: '年龄分布', label: '26-35岁', value: 33, filterLable: '中国' },
    { category: '年龄分布', label: '36-45岁', value: 22, filterLable: '中国' },
    { category: '年龄分布', label: '46-55岁', value: 12, filterLable: '中国' },
    { category: '年龄分布', label: '55岁以上', value: 5, filterLable: '中国' },
  ];

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>
        带分类的饼图：当包含 filterLable 字段时，自动启用下拉筛选；当包含
        category 字段时，自动启用分类筛选；
      </p>
      <DonutChart
        data={data}
        width={260}
        height={200}
        title="2025年第一季度销售数据分析"
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
        <h4 style={{ marginTop: 0 }}>扁平化数据格式示例：</h4>
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
          {`// 当包含 filterLable 字段时，自动启用下拉筛选；当包含 category 字段时，自动启用分类筛选；
[
  { category: '电子产品', label: '平板电脑', value: 15, filterLable: '全球' },
  { category: '电子产品', label: '智能手表', value: 10, filterLable: '全球' },
  { category: '电子产品', label: '耳机', value: 15, filterLable: '全球' },
  { category: "电子产品", label: "智能手机", value: 30, filterLable: "中国" },
  { category: '年龄分布', label: '18-25岁', value: 28, filterLable: '中国' },
  { category: '年龄分布', label: '26-35岁', value: 33, filterLable: '中国' },
  { category: '年龄分布', label: '36-45岁', value: 22, filterLable: '中国' },
  { category: '年龄分布', label: '46-55岁', value: 12, filterLable: '中国' },
  { category: '年龄分布', label: '55岁以上', value: 5, filterLable: '中国' },
  // ... 其他条目
]`}
        </pre>
      </div>
    </div>
  );
};

export default DonutCategorizedDemo;
