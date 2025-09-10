import React from 'react';
import ScatterChart, {
  ScatterChartDataItem,
} from '../../../src/plugins/chart/ScatterChart';

const ScatterChartDemo: React.FC = () => {
  // 固定的散点图数据
  const data: ScatterChartDataItem[] = [
    // 年龄分类 - A组数据
    { category: '年龄', type: 'A组', x: 1, y: 25, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 2, y: 35, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 3, y: 42, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 4, y: 48, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 5, y: 55, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 6, y: 62, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 7, y: 68, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 8, y: 75, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 9, y: 82, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 10, y: 88, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 11, y: 95, filterLable: '中国' },
    { category: '年龄', type: 'A组', x: 12, y: 100, filterLable: '中国' },

    // 年龄分类 - B组数据
      { category: '年龄', type: 'B组', x: 1, y: 30, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 2, y: 38, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 3, y: 45, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 4, y: 52, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 5, y: 60, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 6, y: 67, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 7, y: 74, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 8, y: 81, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 9, y: 87, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 10, y: 92, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 11, y: 98, filterLable: '中国' },
    { category: '年龄', type: 'B组', x: 12, y: 100, filterLable: '中国' },

    // 性别分类 - C组数据
    { category: '性别', type: 'C组', x: 1, y: 20 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 2, y: 32 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 3, y: 38, filterLable: '中国' },
    { category: '性别', type: 'C组', x: 4, y: 46, filterLable: '中国' },
    { category: '性别', type: 'C组', x: 5, y: 52, filterLable: '中国' },
    { category: '性别', type: 'C组', x: 6, y: 58 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 7, y: 65 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 8, y: 71 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 9, y: 78 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 10, y: 84 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 11, y: 91 ,filterLable: '中国'},
    { category: '性别', type: 'C组', x: 12, y: 97 ,filterLable: '中国'},

    // 性别分类 - D组数据
    { category: '性别', type: 'D组', x: 1, y: 28 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 2, y: 36 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 3, y: 43 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 4, y: 49 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 5, y: 56 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 6, y: 63 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 7, y: 69 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 8, y: 76 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 9, y: 82 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 10, y: 89 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 11, y: 94 ,filterLable: '中国'},
    { category: '性别', type: 'D组', x: 12, y: 100 ,filterLable: '中国'},

    // 年龄分类 - A组数据（美国 - 随机坐标）
    { category: '年龄', type: 'A组', x: 1, y: 32, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 2, y: 18, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 3, y: 65, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 4, y: 23, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 5, y: 78, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 6, y: 41, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 7, y: 56, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 8, y: 89, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 9, y: 34, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 10, y: 67, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 11, y: 45, filterLable: '美国' },
    { category: '年龄', type: 'A组', x: 12, y: 72, filterLable: '美国' },

    // 年龄分类 - B组数据（美国 - 随机坐标）
    { category: '年龄', type: 'B组', x: 1, y: 47, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 2, y: 83, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 3, y: 26, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 4, y: 91, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 5, y: 39, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 6, y: 54, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 7, y: 73, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 8, y: 19, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 9, y: 62, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 10, y: 86, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 11, y: 31, filterLable: '美国' },
    { category: '年龄', type: 'B组', x: 12, y: 68, filterLable: '美国' },

    // 性别分类 - C组数据（美国 - 随机坐标）
    { category: '性别', type: 'C组', x: 1, y: 58, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 2, y: 24, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 3, y: 79, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 4, y: 35, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 5, y: 92, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 6, y: 48, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 7, y: 16, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 8, y: 85, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 9, y: 61, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 10, y: 29, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 11, y: 74, filterLable: '美国' },
    { category: '性别', type: 'C组', x: 12, y: 43, filterLable: '美国' },

    // 性别分类 - D组数据（美国 - 随机坐标）
    { category: '性别', type: 'D组', x: 1, y: 71, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 2, y: 37, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 3, y: 88, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 4, y: 22, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 5, y: 66, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 6, y: 53, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 7, y: 95, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 8, y: 14, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 9, y: 49, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 10, y: 81, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 11, y: 36, filterLable: '美国' },
    { category: '性别', type: 'D组', x: 12, y: 77, filterLable: '美国' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>散点图组件示例</h2>

      <div
        style={{
          marginBottom: '20px',
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666',
          display: 'inline-block',
        }}
      >
        💡 固定数据：使用预设的扁平化数据，包含 filterLable
        字段支持二级筛选。自动应用默认颜色序列。
      </div>

      {/* 散点图组件 */}
      <div style={{ marginBottom: '20px' }}>
        <ScatterChart
          title="2025年第一季度短视频用户分布分析"
          data={data}
          width={700}
          height={500}
          className="scatter-demo"
        />
      </div>

      {/* 默认颜色说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>默认颜色序列：</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#388BFF',
                borderRadius: '50%',
              }}
            ></div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              第一个：#388BFF
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#917EF7',
                borderRadius: '50%',
              }}
            ></div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              第二个：#917EF7
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#2AD8FC',
                borderRadius: '50%',
              }}
            ></div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              第三个：#2AD8FC
            </span>
          </div>
        </div>
      </div>

      {/* 数据格式说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          backgroundColor: '#f0f8ff',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>
          扁平化数据格式示例（含二级筛选）：
        </h4>
        <pre
          style={{
            background: '#fff',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '11px',
            margin: 0,
            overflow: 'auto',
          }}
        >
          {`// 扁平化数据格式：包含 filterLable 字段
[
  { 
    category: "年龄", 
    type: "A组", 
    x: 1, 
    y: 25, 
    filterLable: "中国" 
  },
  { 
    category: "年龄", 
    type: "A组", 
    x: 2, 
    y: 35, 
    filterLable: "中国" 
  },
  { 
    category: "年龄", 
    type: "A组", 
    x: 1, 
    y: 25, 
    filterLable: "美国" 
  }
  // ... 更多数据
]`}
        </pre>
      </div>
    </div>
  );
};

export default ScatterChartDemo;
