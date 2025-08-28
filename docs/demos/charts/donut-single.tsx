import DonutCharts, {
  DonutChartConfig,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React, { useMemo, useState } from 'react';
const originData = {
  性别: [
    {
      title: '男性用户',
      datasets: [
        { label: '男性', value: 45 },
        { label: '其他', value: 55 },
      ],
      backgroundColor: ['#917EF7', '#F7F8F9'],
      showTooltip: false,
    },
    {
      title: '女性用户',
      datasets: [
        { label: '女性', value: 55 },
        { label: '其他', value: 45 },
      ],
      backgroundColor: ['#2AD8FC', '#F7F8F9'],
      showTooltip: false,
    },
  ],
  年龄: [
    {
      title: '18-25岁',
      datasets: [
        { label: '18岁以下', value: 15 },
        { label: '其他年龄', value: 75 },
      ],
      backgroundColor: ['#917EF7', '#F7F8F9'],
      showTooltip: false,
    },
    {
      title: '18-30岁',
      datasets: [
        { label: '18-30岁', value: 47 },
        { label: '其他年龄', value: 53 },
      ],
      backgroundColor: ['#2AD8FC', '#F7F8F9'],
      showTooltip: false,
    },
    {
      title: '31-40岁',
      datasets: [
        { label: '31-40岁', value: 33 },
        { label: '其他年龄', value: 67 },
      ],
      backgroundColor: ['#388BFF', '#F7F8F9'],
      showTooltip: false,
    },
    {
      title: '40岁以上',
      datasets: [
        { label: '40岁以上', value: 38 },
        { label: '其他年龄', value: 62 },
      ],
      backgroundColor: ['#718AB6', '#F7F8F9'],
      showTooltip: false,
    },
  ],
};
const DonutSingleDemo: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('年龄');
  const filterList: string[] = ['年龄', '性别', '年龄'];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  // 根据筛选条件动态生成配置数据
  const singleValueConfigs = useMemo((): DonutChartConfig[] => {
    type FilterKey = keyof typeof originData;
    return originData[selectedFilter as FilterKey] ?? [];
  }, [selectedFilter]);

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>单值饼图：用于展示单一指标的占比，如完成率、进度、CPU 使用率等。</p>
      <DonutCharts
        key={selectedFilter}
        configs={singleValueConfigs}
        width={128}
        height={128}
        title="2025年第一季度短视频用户分布分析"
        filterList={filterList}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default DonutSingleDemo;
