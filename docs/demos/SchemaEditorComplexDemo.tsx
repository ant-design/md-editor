import { SchemaEditor } from '@ant-design/md-editor';
import React, { useState } from 'react';
import { LowCodeSchema } from '../../src/schema/types';

const ComplexSchemaDemo = () => {
  const [schema, setSchema] = useState<LowCodeSchema>({
    version: '1.2.0',
    name: '7-Day Weather Forecast Component',
    description: 'A component displaying 7-day weather forecast data',
    author: 'Forecast Team',
    createTime: '2024-03-22T08:00:00Z',
    updateTime: '2024-03-22T08:00:00Z',
    pageConfig: {
      layout: 'flex',
      router: { mode: 'hash' as const, basePath: '/7days-weather' },
      globalVariables: {
        colors: {
          sunny: '#FFD700',
          cloudy: '#A9A9A9',
          rainy: '#4682B4',
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
        title: {
          title: '标题',
          type: 'string',
          default: '天气预报',
        },
        days: {
          title: '天数',
          type: 'number',
          default: 7,
          minimum: 1,
          maximum: 14,
        },
        forecastData: {
          title: '预报数据',
          type: 'array',
          default: [
            { date: '2024-03-22', temperature: 25, condition: '晴天' },
            { date: '2024-03-23', temperature: 22, condition: '多云' },
            { date: '2024-03-24', temperature: 18, condition: '雨天' },
          ],
        },
      },
      type: 'html',
      schema: `
        <div class="weather-forecast">
          <h1>{{title}}</h1>
          <div class="forecast-days">
            {{#each forecastData}}
            <div class="day-card">
              <h3>{{date}}</h3>
              <p>{{temperature}}°C</p>
              <p>{{condition}}</p>
            </div>
            {{/each}}
          </div>
        </div>
      `,
    },
  });

  const [values, setValues] = useState<Record<string, any>>({
    title: '7天天气预报',
    days: 7,
    forecastData: [
      { date: '2024-03-22', temperature: 25, condition: '晴天' },
      { date: '2024-03-23', temperature: 22, condition: '多云' },
      { date: '2024-03-24', temperature: 18, condition: '雨天' },
      { date: '2024-03-25', temperature: 20, condition: '阴天' },
      { date: '2024-03-26', temperature: 23, condition: '晴天' },
      { date: '2024-03-27', temperature: 19, condition: '小雨' },
      { date: '2024-03-28', temperature: 21, condition: '多云' },
    ],
  });

  const handleChange = (
    newSchema: LowCodeSchema,
    newValues: Record<string, any>,
  ) => {
    setSchema(newSchema);
    setValues(newValues);
  };

  return (
    <SchemaEditor
      initialSchema={schema}
      initialValues={values}
      height={700}
      onChange={handleChange}
      showPreview={true}
      previewConfig={{
        ALLOWED_TAGS: [
          'div',
          'h1',
          'h2',
          'h3',
          'p',
          'span',
          'button',
          'ul',
          'li',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td',
        ],
        ALLOWED_ATTR: ['class', 'style', 'onclick'],
      }}
    />
  );
};

export default ComplexSchemaDemo;
