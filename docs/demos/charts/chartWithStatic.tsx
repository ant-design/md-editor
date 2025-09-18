import React, { useState } from 'react';
import AreaChart, {
  AreaChartDataItem,
} from '../../../src/plugins/chart/AreaChart';

const ChartWithStaticDemo: React.FC = () => {
  const [data, setData] = useState<AreaChartDataItem[]>([
    // 本年营收数据
    {
      type: '本年营收',
      x: 1,
      y: 45000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 2,
      y: 52000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 3,
      y: 48000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 4,
      y: 61000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 5,
      y: 55000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 6,
      y: 67000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 7,
      y: 72000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 8,
      y: 68000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 9,
      y: 75000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 10,
      y: 78000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 11,
      y: 82000,
      xtitle: '月份',
    },
    {
      type: '本年营收',
      x: 12,
      y: 85000,
      xtitle: '月份',
    },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>单个静态数据组件</h3>
      <AreaChart
        data={data}
        width={700}
        height={500}
        static={{
          title: '总营收',
          value: 655350,
          suffix: '元',
        }}
        legendAlign="center"
      />
      <div style={{ padding: '20px' }}>
        <h3>多个静态数据组件</h3>
        <AreaChart
          data={data}
          width={700}
          height={500}
          static={[
            {
              title: '总营收',
              value: 655350,
              suffix: '元',
              tooltip: '总营收tips',
            },
            {
              title: '营业天数',
              value: 365,
              suffix: '天',
              tooltip: '营业天数tips',
            },
          ]}
          legendAlign="center"
        />
      </div>
    </div>
  );
};

export default ChartWithStaticDemo;
