import { LowCodeSchema, SchemaForm } from '@ant-design/md-editor';
import { Card, Space } from 'antd';
import React, { useState } from 'react';

const sampleSchema: LowCodeSchema = {
  version: '1.0.0',
  name: 'Weather Card Component',
  description: 'A beautiful weather display card component',
  author: 'Weather Team',
  createTime: '2024-03-20T10:00:00Z',
  updateTime: '2024-03-20T10:00:00Z',
  pageConfig: {
    layout: 'flex' as const,
    router: {
      mode: 'hash' as const,
      basePath: '/weather',
    },
    globalVariables: {
      colors: {
        sunny: '#FFB300',
        rainy: '#2196F3',
        cloudy: '#90A4AE',
      },
      constants: {
        refreshInterval: 300000,
      },
    },
  },
  dataSources: {
    restAPI: {
      baseURL: 'https://api.weatherapi.com/v1',
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      timeout: 3000,
      interceptors: {
        request: true,
        response: true,
      },
    },
    mock: {
      enable: true,
      responseDelay: 100,
      dataPath: '/mock/weather',
    },
  },
  component: {
    properties: {
      weather: {
        title: '天气',
        type: 'string',
        required: true,
        enum: ['晴', '多云', '阴', '雨', '雪'],
        default: '晴',
      },
      temperature: {
        title: '温度',
        type: 'number',
        required: true,
        minimum: -50,
        maximum: 50,
        step: 0.1,
        default: 25,
      },
      humidity: {
        title: '湿度',
        type: 'number',
        required: true,
        minimum: 0,
        maximum: 100,
        step: 1,
        default: 65,
      },
      windSpeed: {
        title: '风速',
        type: 'number',
        required: true,
        minimum: 0,
        maximum: 200,
        step: 0.1,
        default: 15,
      },
    },
    type: 'html' as const,
    schema: `<div style="
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: linear-gradient(160deg, #2c3e50, #3498db);
">
    <div style="
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        color: white;
        width: 280px;
        position: relative;
        overflow: hidden;
    ">
        <!-- 天气图标 -->
        <div style="
            font-size: 4rem;
            text-align: center;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            animation: float 3s ease-in-out infinite;
        ">⛅</div>

        <!-- 温度显示 -->
        <div style="
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        ">{{温度}}°C</div>

        <!-- 数据网格 -->
        <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 1.5rem">💧</div>
                <div style="font-size: 0.9rem; opacity: 0.8">湿度</div>
                <div style="font-size: 1.2rem; font-weight: bold">{{湿度}}%</div>
            </div>

            <div style="
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 1.5rem">🌪️</div>
                <div style="font-size: 0.9rem; opacity: 0.8">风速</div>
                <div style="font-size: 1.2rem; font-weight: bold">{{风速}}m/s</div>
            </div>

            <div style="
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 1.5rem">🧭</div>
                <div style="font-size: 0.9rem; opacity: 0.8">风向</div>
                <div style="font-size: 1.2rem; font-weight: bold">{{风向}}</div>
            </div>

            <div style="
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 12px;
                text-align: center;
            ">
                <div style="font-size: 1.5rem">📉</div>
                <div style="font-size: 0.9rem; opacity: 0.8">气压</div>
                <div style="font-size: 1.2rem; font-weight: bold">{{气压}}hPa</div>
            </div>
        </div>

        <!-- 装饰元素 -->
        <div style="
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
            top: -50px;
            right: -50px;
        "></div>
        
        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>
    </div>
</div>`,
  },
  theme: {
    colorPalette: {
      primary: '#1890ff',
      secondary: '#722ed1',
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d',
      text: {
        primary: 'rgba(0, 0, 0, 0.85)',
        secondary: 'rgba(0, 0, 0, 0.45)',
      },
    },
    spacing: {
      base: 8,
      multiplier: 2,
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
      fontSizes: [12, 14, 16, 20, 24],
      lineHeights: {
        normal: 1.5,
        heading: 1.2,
      },
    },
    breakpoints: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  previewSettings: {
    viewport: {
      defaultDevice: 'desktop',
      responsive: true,
      customSizes: [
        {
          name: 'Mobile Portrait',
          width: 375,
          height: 667,
        },
        {
          name: 'Mobile Landscape',
          width: 667,
          height: 375,
        },
      ],
    },
    environment: {
      mockData: true,
      networkThrottle: 'fast-3g',
      debugMode: true,
    },
  },
};

const FormDemo: React.FC = () => {
  const [formValues, setFormValues] = useState<Record<string, any>>();

  return (
    <div
      style={{
        padding: 24,
        background: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Card title="天气数据编辑器" style={{ width: '100%' }}>
          <SchemaForm schema={sampleSchema} onValuesChange={setFormValues} />
        </Card>

        {formValues && (
          <Card title="表单数据" style={{ width: '100%' }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default FormDemo;
