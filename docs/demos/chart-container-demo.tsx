import { ChartContainer } from '@ant-design/md-editor';
import React, { useState } from 'react';

const ChartContainerDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobile, setIsMobile] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDevice = () => {
    setIsMobile((prev) => !prev);
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      }}
    >
      <h2>ChartContainer 边框演示</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={toggleTheme} type="button">
          切换主题: {theme === 'light' ? '浅色' : '深色'}
        </button>
        <button onClick={toggleDevice} type="button">
          切换设备: {isMobile ? '移动端' : '桌面端'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* 基础容器 */}
        <div>
          <h3>基础容器</h3>
          <ChartContainer
            baseClassName="demo-chart-container"
            theme={theme}
            isMobile={isMobile}
          >
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
                color: theme === 'light' ? '#333' : '#fff',
              }}
            >
              基础图表容器
            </div>
          </ChartContainer>
        </div>

        {/* 带自定义样式的容器 */}
        <div>
          <h3>自定义样式容器</h3>
          <ChartContainer
            baseClassName="demo-chart-container"
            theme={theme}
            isMobile={isMobile}
            style={{ width: '100%', minHeight: '200px' }}
          >
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
                color: theme === 'light' ? '#333' : '#fff',
              }}
            >
              自定义样式容器
            </div>
          </ChartContainer>
        </div>

        {/* 带自定义类名的容器 */}
        <div>
          <h3>自定义类名容器</h3>
          <ChartContainer
            baseClassName="demo-chart-container"
            theme={theme}
            isMobile={isMobile}
            className="custom-border-demo"
          >
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
                color: theme === 'light' ? '#333' : '#fff',
              }}
            >
              自定义类名容器
            </div>
          </ChartContainer>
        </div>

        {/* 模拟图表内容 */}
        <div>
          <h3>模拟图表内容</h3>
          <ChartContainer
            baseClassName="demo-chart-container"
            theme={theme}
            isMobile={isMobile}
          >
            <div
              style={{
                padding: '20px',
                backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
                color: theme === 'light' ? '#333' : '#fff',
              }}
            >
              <div
                style={{
                  height: '150px',
                  background: `linear-gradient(45deg, ${theme === 'light' ? '#1890ff' : '#40a9ff'}, ${theme === 'light' ? '#52c41a' : '#73d13d'})`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                模拟图表
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h4>当前配置:</h4>
        <ul style={{ color: theme === 'light' ? '#333' : '#fff' }}>
          <li>
            主题:{' '}
            {theme === 'light' ? '浅色主题 (有边框)' : '深色主题 (无边框)'}
          </li>
          <li>
            设备:{' '}
            {isMobile
              ? '移动端 (小圆角, 小内边距)'
              : '桌面端 (大圆角, 大内边距)'}
          </li>
          <li>边框: {theme === 'light' ? '1px solid #e8e8e8' : 'none'}</li>
          <li>背景色: {theme === 'light' ? '#fff' : '#1a1a1a'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ChartContainerDemo;
