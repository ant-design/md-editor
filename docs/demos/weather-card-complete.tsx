import { SchemaForm, SchemaRenderer, validator } from '@ant-design/agentic-ui';
import React, { useState } from 'react';

const WeatherCardComplete: React.FC = () => {
  const [formValues, setFormValues] = useState({});

  const schema: Record<string, any> = {
    version: '1.2.0',
    name: '七日天气预报',
    description: '七日天气预报组件',
    author: 'Forecast Team',
    createTime: '2024-03-22T08:00:00Z',
    updateTime: '2024-03-22T08:00:00Z',
    pageConfig: {
      layout: 'flex',
      router: { mode: 'hash', basePath: '/7days-weather' },
      globalVariables: {
        colors: {
          sunny: '#FFD700',
          cloudy: '#A9A9A9',
          rainy: '#4682B4',
          snow: '#87CEEB',
        },
        constants: { refreshInterval: 3600000 },
      },
    },
    dataSources: {
      restAPI: {
        baseURL: 'https://api.7days-weather.com/v3',
        defaultHeaders: { 'Content-Type': 'application/json' },
        timeout: 5000,
        interceptors: { request: true, response: true },
      },
      mock: {
        enable: true,
        responseDelay: 150,
        dataPath: '/mock/7days-weather',
      },
    },
    component: {
      properties: {
        sevenDaysWeather: {
          title: '七日天气',
          type: 'array',
          required: true,
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                format: 'date',
                description: '日期（格式：YYYY-MM-DD）',
              },
              weather: {
                type: 'string',
                enum: ['☀️ 晴', '⛅ 晴间多云', '🌧️ 雨', '❄️ 雪', '🌩️ 雷暴'],
              },
              temperatureRange: {
                type: 'object',
                required: ['min', 'max'],
                properties: {
                  min: { type: 'number', description: '最低温度 (°C)' },
                  max: { type: 'number', description: '最高温度 (°C)' },
                },
              },
              precipitation: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: '降水概率 (%)',
              },
            },
            required: ['date', 'weather', 'temperatureRange'],
          },
          default: [
            {
              date: '2024-03-22',
              weather: '☀️ 晴',
              temperatureRange: { min: 12, max: 24 },
              precipitation: 5,
            },
            {
              date: '2024-03-23',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 10, max: 22 },
              precipitation: 15,
            },
            {
              date: '2024-03-24',
              weather: '🌧️ 雨',
              temperatureRange: { min: 8, max: 18 },
              precipitation: 90,
            },
            {
              date: '2024-03-25',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 9, max: 20 },
              precipitation: 20,
            },
            {
              date: '2024-03-26',
              weather: '☀️ 晴',
              temperatureRange: { min: 11, max: 25 },
              precipitation: 0,
            },
            {
              date: '2024-03-27',
              weather: '❄️ 雪',
              temperatureRange: { min: -3, max: 2 },
              precipitation: 80,
            },
            {
              date: '2024-03-28',
              weather: '🌩️ 雷暴',
              temperatureRange: { min: 15, max: 28 },
              precipitation: 70,
            },
          ],
        },
      },
      type: 'mustache',
      schema:
        '<div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 2rem; border-radius: 16px; color: white;"><h2 style="text-align: center; margin-bottom: 1.5rem;">七日天气预报</h2><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">{{#sevenDaysWeather}}<div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: center;"><div style="font-size: 1.2rem;">{{date}}</div><div style="font-size: 2rem; margin: 0.5rem 0;">{{weather}}</div><div style="opacity: 0.8;">{{temperatureRange.min}}°C ~ {{temperatureRange.max}}°C</div><div style="margin-top: 0.5rem;">💧 {{precipitation}}%</div></div>{{/sevenDaysWeather}}</div></div>',
    },
    theme: {
      colorPalette: {
        primary: '#1e3c72',
        secondary: '#2a5298',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        text: { primary: '#FFFFFF', secondary: '#CCCCCC' },
      },
      spacing: { base: 8, multiplier: 2 },
      typography: {
        fontFamily: 'Arial',
        fontSizes: [12, 14, 16, 20],
        lineHeights: { normal: 1.5, heading: 1.2 },
      },
    },
    previewSettings: {
      viewport: {
        defaultDevice: 'desktop',
        responsive: true,
        customSizes: [{ name: 'Desktop Wide', width: 1440, height: 900 }],
      },
      environment: {
        mockData: true,
        networkThrottle: 'fast-3g',
        debugMode: false,
      },
    },
  };
  const handleValuesChange = (_: any, values: Record<string, any>) => {
    // 验证数据
    const validationResult = validator.validate(schema);
    if (validationResult?.valid) {
      setFormValues(values);
    } else {
      console.error('Schema 验证失败：', validationResult?.errors);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>编辑表单</h2>
        <SchemaForm schema={schema} onValuesChange={handleValuesChange} />
      </div>
      <div style={{ flex: 1 }}>
        <div>
          <h2>预览效果</h2>
          <SchemaRenderer schema={schema} values={formValues} />
        </div>
      </div>
    </div>
  );
};

export default WeatherCardComplete;
