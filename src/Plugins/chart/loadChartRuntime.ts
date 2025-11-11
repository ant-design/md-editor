type AreaChartComponent = typeof import('./AreaChart').default;
type BarChartComponent = typeof import('./BarChart').default;
type DonutChartComponent = typeof import('./DonutChart').default;
type FunnelChartComponent = typeof import('./FunnelChart').default;
type LineChartComponent = typeof import('./LineChart').default;
type RadarChartComponent = typeof import('./RadarChart').default;
type ScatterChartComponent = typeof import('./ScatterChart').default;

export interface ChartRuntime {
  AreaChart: AreaChartComponent;
  BarChart: BarChartComponent;
  DonutChart: DonutChartComponent;
  FunnelChart: FunnelChartComponent;
  LineChart: LineChartComponent;
  RadarChart: RadarChartComponent;
  ScatterChart: ScatterChartComponent;
}

let runtimeLoader: Promise<ChartRuntime> | null = null;

export const loadChartRuntime = async (): Promise<ChartRuntime> => {
  if (typeof window === 'undefined') {
    throw new Error('图表运行时仅在浏览器环境中可用');
  }

  if (!runtimeLoader) {
    runtimeLoader = Promise.all([
      import('./AreaChart'),
      import('./BarChart'),
      import('./DonutChart'),
      import('./FunnelChart'),
      import('./LineChart'),
      import('./RadarChart'),
      import('./ScatterChart'),
    ])
      .then(([
        areaModule,
        barModule,
        donutModule,
        funnelModule,
        lineModule,
        radarModule,
        scatterModule,
      ]) => ({
        AreaChart: areaModule.default,
        BarChart: barModule.default,
        DonutChart: donutModule.default,
        FunnelChart: funnelModule.default,
        LineChart: lineModule.default,
        RadarChart: radarModule.default,
        ScatterChart: scatterModule.default,
      }))
      .catch((error) => {
        runtimeLoader = null;
        throw error;
      });
  }

  return runtimeLoader;
};


