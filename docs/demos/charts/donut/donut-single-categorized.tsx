import DonutChart from '@ant-design/md-editor/plugins/chart/DonutChart';
import React from 'react';

// 展示单值指标（完成率、进度等）
const data = [
  { label: '任务完成率', value: 75, category: '项目进度' },
  { label: '代码覆盖率', value: 85, category: '项目进度' },
  { label: '测试通过率', value: 92, category: '项目进度' },
  { label: 'CPU使用率', value: 65, category: '系统监控' },
  { label: '内存使用率', value: 78, category: '系统监控' },
  { label: '磁盘使用率', value: 45, category: '系统监控' },
];

const DonutSingleCategorizedDemo: React.FC = () => {
  return (
    <div style={{ padding: 12, color: '#767E8B', fontSize: 12 }}>
      <p>
        单值饼图：用于展示单一指标的占比，如完成率、进度、CPU 使用率等。传入
        singleMode 即可自动生成颜色与多个饼图
      </p>
      <DonutChart
        data={data}
        singleMode
        width={128}
        height={128}
        title="项目进度与系统监控"
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
          扁平化数据格式示例（单值 + 二级筛选）：
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
          {`// 单值饼图：当包含 filterLabel 字段时，自动启用下拉筛选；当包含 category 字段时，自动启用分类筛选；
[
  { "label": "任务完成率", "value": 75, "category": "项目进度" },
  { "label": "代码覆盖率", "value": 85, "category": "项目进度" },
  { "label": "测试通过率", "value": 92, "category": "项目进度" },
  { "label": "CPU 使用率", "value": 65, "category": "系统监控" },
  { "label": "内存使用率", "value": 78, "category": "系统监控" },
  { "label": "磁盘使用率", "value": 45, "category": "系统监控" }
]`}
        </pre>
      </div>
    </div>
  );
};

export default DonutSingleCategorizedDemo;
