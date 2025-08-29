import DonutCharts, {
  DonutChartConfig,
  DonutChartDatum,
} from '@ant-design/md-editor/plugins/chart/DonutChart';
import React, { useMemo, useState } from 'react';

// 重新定义数据结构，展示真正的单值指标（完成率、进度等）
const originData = {
  完成率: [
    { label: '任务完成率', value: 75, category: '项目进度' },
    { label: '代码覆盖率', value: 85, category: '项目进度' },
    { label: '测试通过率', value: 92, category: '项目进度' },
  ],
  使用率: [
    { label: 'CPU使用率', value: 65, category: '系统监控' },
    { label: '内存使用率', value: 78, category: '系统监控' },
    { label: '磁盘使用率', value: 45, category: '系统监控' },
  ],
};

const DonutSingleDemo: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('完成率');
  const filterList: string[] = ['完成率', '使用率'];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  // 根据筛选条件动态生成数据
  const chartData = useMemo((): DonutChartDatum[] => {
    type FilterKey = keyof typeof originData;
    return originData[selectedFilter as FilterKey] ?? [];
  }, [selectedFilter]);

  // 根据筛选条件动态生成配置数据
  const configs = useMemo((): DonutChartConfig[] => {
    type FilterKey = keyof typeof originData;
    const data = originData[selectedFilter as FilterKey] ?? [];
    
    // 为每个数据项创建一个独立的配置，实现多个单值饼图
    return data.map((item, index) => ({
      backgroundColor: [
        ['#917EF7', '#2AD8FC', '#388BFF', '#718AB6'][index % 3], // 循环使用颜色
        '#F7F8F9' // 剩余部分使用浅灰色
      ],
      showLegend: false, // 单值模式不显示图例
    }));
  }, [selectedFilter]);

  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>单值饼图：用于展示单一指标的占比，如完成率、进度、CPU 使用率等。</p>
      <p>完成率筛选下：展示任务完成率75%、代码覆盖率85%、测试通过率92%。</p>
      <p>使用率筛选下：展示CPU使用率65%、内存使用率78%、磁盘使用率45%。</p>
      <DonutCharts
        key={selectedFilter}
        data={chartData}
        configs={configs}
        width={128}
        height={128}
        title="项目进度与系统监控"
        filterList={filterList}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        enableAutoCategory={false} // 禁用自动分类，因为我们手动控制
      />
    </div>
  );
};

export default DonutSingleDemo;
