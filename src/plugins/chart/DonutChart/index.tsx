import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Plugin,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartDatum {
  label: string;
  value: number;
}

export interface DonutChartConfig {
  datasets: DonutChartDatum[];
  title?: string;
  lastModified?: string;
  theme?: 'light' | 'dark';
  cutout?: string | number;
  showToolbar?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  onDownload?: () => void;
  backgroundColor?: string[];
  borderColor?: string;
}

export interface DonutChartProps {
  configs: DonutChartConfig[];
  width?: number;
  height?: number;
  className?: string;
}

// 中心文字插件
const createCenterTextPlugin = (
  value: number,
  label: string,
): Plugin<'doughnut'> => ({
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.save();

    const centerX = width / 2;
    const centerY = height / 2;

    // 固定字体大小与字重
    const percentFontSize = 13; // px
    const labelFontSize = 12; // px

    // 百分比（13px，500）
    ctx.font = `500 ${percentFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, centerX, centerY - labelFontSize * 0.8);

    // 标签（12px，正常字重）
    ctx.font = `400 ${labelFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(label, centerX, centerY + labelFontSize * 0.6);

    ctx.restore();
  },
});

const DonutChart: React.FC<DonutChartProps> = ({
  configs,
  width = 200,
  height = 200,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${width}px, 1fr))`,
        gap: '16px',
      }}
    >
      {configs.map((cfg, idx) => {
        const labels = cfg.datasets.map((d) => d.label);
        const values = cfg.datasets.map((d) => d.value);

        const total = values.reduce((sum, v) => sum + v, 0);
        const backgroundColors = cfg.backgroundColor || [
          '#917EF7',
          '#2AD8FC',
          '#388BFF',
          '#718AB6',
          '#FACC15',
        ];

        const data = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors.slice(0, values.length),
              borderColor: cfg.borderColor || '#fff',
              borderWidth: 1,
              spacing: values.length === 2 ? 0 : 6,
              borderRadius: 4,
              hoverOffset: 6,
            },
          ],
        };

        const isSingleValueMode = values.length === 2;
        const firstValue = values[0];
        const cutout = cfg.cutout ?? '75%';

        // 依据主题计算 tooltip 颜色
        const isDarkTheme = cfg.theme === 'dark';
        const tooltipBackgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF'; // gray-800 vs white
        const tooltipBorderColor = isDarkTheme ? '#374151' : '#E5E7EB'; // gray-700 vs gray-200
        const tooltipTitleColor = isDarkTheme ? '#F9FAFB' : '#111827'; // gray-50 vs gray-900
        const tooltipBodyColor = isDarkTheme ? '#D1D5DB' : '#374151'; // gray-300 vs gray-700

        const options: ChartOptions<'doughnut'> = {
          responsive: true,
          maintainAspectRatio: false,
          cutout,
          plugins: {
            legend: {
              display: false, // 我们自己渲染 legend
            },
            tooltip: {
              enabled: true,
              backgroundColor: tooltipBackgroundColor,
              borderColor: tooltipBorderColor,
              borderWidth: 1,
              titleColor: tooltipTitleColor,
              bodyColor: tooltipBodyColor,
              callbacks: {
                label: ({ label, raw }) =>
                  `${label}: ${raw} (${(((raw as number) / total) * 100).toFixed(1)}%)`,
              },
            },
          },
        };

        return (
          <div key={idx}>
            {/* Toolbar */}
            {cfg.showToolbar && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                {/* 头部组件：标题、时间、下载、筛选 */}
                图表头部组件
              </div>
            )}

            {/* Doughnut 图 + legend */}
            {isSingleValueMode ? (
              <div style={{ width: '100%', height }}>
                <Doughnut
                  data={data}
                  options={options}
                  plugins={[createCenterTextPlugin(firstValue, labels[0])]}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width, height }}>
                  <Doughnut data={data} options={options} />
                </div>
                {cfg.showLegend && (
                  <div style={{ marginLeft: 12 }}>
                    {cfg.datasets.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 12,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            borderRadius: 4,
                            background: backgroundColors[i] || '#ccc',
                            marginRight: 6,
                          }}
                        />
                        <span
                          style={{
                            flex: 1,
                            color: '#767E8B',
                            fontSize: 13,
                          }}
                        >
                          {d.label}
                        </span>
                        <span
                          style={{
                            color: '#343A45',
                            fontSize: 13,
                            fontWeight: 500,
                            marginLeft: 15,
                          }}
                        >
                          <span>{d.value}</span>
                          <span
                            style={{
                              marginLeft: 8,
                            }}
                          >
                            {((d.value / total) * 100).toFixed(0)}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default DonutChart;
