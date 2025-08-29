import React from 'react';
import ScatterChart, { ScatterChartDataItem } from '../../../src/plugins/chart/ScatterChart';

const ScatterChartDemo: React.FC = () => {
  // 固定的散点图数据
  const data: ScatterChartDataItem[] = [
    // 年龄分类 - A组数据
    { category: '年龄', type: 'A组', x: 1, y: 25 },
    { category: '年龄', type: 'A组', x: 2, y: 35 },
    { category: '年龄', type: 'A组', x: 3, y: 42 },
    { category: '年龄', type: 'A组', x: 4, y: 48 },
    { category: '年龄', type: 'A组', x: 5, y: 55 },
    { category: '年龄', type: 'A组', x: 6, y: 62 },
    { category: '年龄', type: 'A组', x: 7, y: 68 },
    { category: '年龄', type: 'A组', x: 8, y: 75 },
    { category: '年龄', type: 'A组', x: 9, y: 82 },
    { category: '年龄', type: 'A组', x: 10, y: 88 },
    { category: '年龄', type: 'A组', x: 11, y: 95 },
    { category: '年龄', type: 'A组', x: 12, y: 100 },

    // 年龄分类 - B组数据
    { category: '年龄', type: 'B组', x: 1, y: 30 },
    { category: '年龄', type: 'B组', x: 2, y: 38 },
    { category: '年龄', type: 'B组', x: 3, y: 45 },
    { category: '年龄', type: 'B组', x: 4, y: 52 },
    { category: '年龄', type: 'B组', x: 5, y: 60 },
    { category: '年龄', type: 'B组', x: 6, y: 67 },
    { category: '年龄', type: 'B组', x: 7, y: 74 },
    { category: '年龄', type: 'B组', x: 8, y: 81 },
    { category: '年龄', type: 'B组', x: 9, y: 87 },
    { category: '年龄', type: 'B组', x: 10, y: 92 },
    { category: '年龄', type: 'B组', x: 11, y: 98 },
    { category: '年龄', type: 'B组', x: 12, y: 100 },

    // 性别分类 - C组数据
    { category: '性别', type: 'C组', x: 1, y: 20 },
    { category: '性别', type: 'C组', x: 2, y: 32 },
    { category: '性别', type: 'C组', x: 3, y: 38 },
    { category: '性别', type: 'C组', x: 4, y: 46 },
    { category: '性别', type: 'C组', x: 5, y: 52 },
    { category: '性别', type: 'C组', x: 6, y: 58 },
    { category: '性别', type: 'C组', x: 7, y: 65 },
    { category: '性别', type: 'C组', x: 8, y: 71 },
    { category: '性别', type: 'C组', x: 9, y: 78 },
    { category: '性别', type: 'C组', x: 10, y: 84 },
    { category: '性别', type: 'C组', x: 11, y: 91 },
    { category: '性别', type: 'C组', x: 12, y: 97 },

    // 性别分类 - D组数据
    { category: '性别', type: 'D组', x: 1, y: 28 },
    { category: '性别', type: 'D组', x: 2, y: 36 },
    { category: '性别', type: 'D组', x: 3, y: 43 },
    { category: '性别', type: 'D组', x: 4, y: 49 },
    { category: '性别', type: 'D组', x: 5, y: 56 },
    { category: '性别', type: 'D组', x: 6, y: 63 },
    { category: '性别', type: 'D组', x: 7, y: 69 },
    { category: '性别', type: 'D组', x: 8, y: 76 },
    { category: '性别', type: 'D组', x: 9, y: 82 },
    { category: '性别', type: 'D组', x: 10, y: 89 },
    { category: '性别', type: 'D组', x: 11, y: 94 },
    { category: '性别', type: 'D组', x: 12, y: 100 },


    // 年龄分类 - A组数据（美国 - 随机坐标）
    { category: '年龄', type: 'A组', x: 1, y: 32, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 2, y: 18, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 3, y: 65, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 4, y: 23, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 5, y: 78, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 6, y: 41, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 7, y: 56, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 8, y: 89, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 9, y: 34, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 10, y: 67, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 11, y: 45, customCategory: '美国' },
    { category: '年龄', type: 'A组', x: 12, y: 72, customCategory: '美国' },

    // 年龄分类 - B组数据（美国 - 随机坐标）
    { category: '年龄', type: 'B组', x: 1, y: 47, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 2, y: 83, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 3, y: 26, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 4, y: 91, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 5, y: 39, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 6, y: 54, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 7, y: 73, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 8, y: 19, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 9, y: 62, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 10, y: 86, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 11, y: 31, customCategory: '美国' },
    { category: '年龄', type: 'B组', x: 12, y: 68, customCategory: '美国' },

    // 性别分类 - C组数据（美国 - 随机坐标）
    { category: '性别', type: 'C组', x: 1, y: 58, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 2, y: 24, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 3, y: 79, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 4, y: 35, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 5, y: 92, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 6, y: 48, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 7, y: 16, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 8, y: 85, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 9, y: 61, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 10, y: 29, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 11, y: 74, customCategory: '美国' },
    { category: '性别', type: 'C组', x: 12, y: 43, customCategory: '美国' },

    // 性别分类 - D组数据（美国 - 随机坐标）
    { category: '性别', type: 'D组', x: 1, y: 71, customCategory: '美国'  },
    { category: '性别', type: 'D组', x: 2, y: 37, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 3, y: 88, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 4, y: 22, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 5, y: 66, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 6, y: 53, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 7, y: 95, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 8, y: 14, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 9, y: 49, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 10, y: 81, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 11, y: 36, customCategory: '美国' },
    { category: '性别', type: 'D组', x: 12, y: 77, customCategory: '美国' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>散点图组件示例</h2>
      
      <div style={{
        marginBottom: '20px',
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        display: 'inline-block'
      }}>
        💡 固定数据：使用预设的扁平化数据，包含 customCategory 字段支持二级筛选。自动应用默认颜色序列。
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

      {/* 数据信息 */}
      <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
        <h3>当前数据信息：</h3>
        <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(data.slice(0, 8), null, 2)} {/* 显示前8条数据 */}
        </pre>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          总共 {data.length} 条数据，包含 {Array.from(new Set(data.map(d => d.category))).length} 个分类，
          {Array.from(new Set(data.map(d => d.type))).length} 个数据组
        </p>
      </div>

      {/* 默认颜色说明 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        border: '1px solid #e8e8e8', 
        borderRadius: '8px',
        backgroundColor: '#fafafa'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>默认颜色序列：</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#388BFF', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第一个：#388BFF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#917EF7', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第二个：#917EF7</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#2AD8FC', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', color: '#666' }}>第三个：#2AD8FC</span>
          </div>
        </div>
      </div>

      {/* 数据格式说明 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        border: '1px solid #e8e8e8', 
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>扁平化数据格式示例（含二级筛选）：</h4>
        <pre style={{ 
          background: '#fff', 
          padding: '12px', 
          borderRadius: '4px', 
          fontSize: '11px',
          margin: 0,
          overflow: 'auto'
        }}>
{`// 扁平化数据格式：包含 customCategory 字段
[
  { 
    category: "年龄", 
    type: "A组", 
    x: 1, 
    y: 25, 
    customCategory: "全球" 
  },
  { 
    category: "年龄", 
    type: "A组", 
    x: 2, 
    y: 35, 
    customCategory: "全球" 
  },
  { 
    category: "年龄", 
    type: "A组", 
    x: 1, 
    y: 25, 
    customCategory: "美国" 
  }
  // ... 更多数据
]`}
        </pre>
      </div>

      {/* 固定数据特性说明 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        border: '1px solid #e8e8e8', 
        borderRadius: '8px',
        backgroundColor: '#fff8f0'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>固定数据的优势：</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', lineHeight: '1.6', color: '#666' }}>
          <li>✅ <strong>数据一致性</strong>：每次查看都显示相同的数据，便于对比和分析</li>
          <li>✅ <strong>性能稳定</strong>：无随机计算，加载速度更快</li>
          <li>✅ <strong>调试友好</strong>：固定数据便于排查问题和验证功能</li>
          <li>✅ <strong>演示效果</strong>：展示时不会因为随机数据影响演示效果</li>
          <li>✅ <strong>测试可靠</strong>：自动化测试时有固定的预期结果</li>
        </ul>
      </div>


    </div>
  );
};

export default ScatterChartDemo;
