import { DazingLottie, Robot, ThinkingLottie } from '@ant-design/md-editor';
import React, { useState } from 'react';

export default () => {
  const [robotStatus, setRobotStatus] = useState<'default' | 'running'>(
    'default',
  );

  const statusOptions = [
    { value: 'default', label: '默认状态' },
    { value: 'running', label: '运行中状态' },
  ];

  return (
    <div style={{ padding: '0 24px 24px', maxWidth: 1200 }}>
      <h2>机器人形象组件</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        提供多种动画状态的机器人图标，支持自定义大小、状态和图标。
      </p>

      <h3>Robot 组件</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        基础机器人组件，支持不同状态切换
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Robot status={robotStatus} size={60} />
        <div>
          <p style={{ marginBottom: 8 }}>
            当前状态:{' '}
            {statusOptions.find((opt) => opt.value === robotStatus)?.label}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRobotStatus(option.value as any)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background: robotStatus === option.value ? '#1890ff' : '#fff',
                  color: robotStatus === option.value ? '#fff' : '#000',
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2>Lottie 动画组件</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        动画文件较大，建议按需加载
      </p>

      <h3>DazingLottie - 呼吸+眨眼睛动画</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        使用Lottie动画库提供的呼吸+眨眼睛动画效果
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <DazingLottie size={32} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            小尺寸 (32px)
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <DazingLottie size={48} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            默认尺寸 (48px)
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <DazingLottie size={64} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            大尺寸 (64px)
          </p>
        </div>
      </div>

      <h3>ThinkingLottie - 眨眼跑+追星星动画</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        使用Lottie动画库提供的眨眼跑+追星星动画效果
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <ThinkingLottie size={32} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            小尺寸 (32px)
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ThinkingLottie size={48} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            默认尺寸 (48px)
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ThinkingLottie size={64} />
          <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            大尺寸 (64px)
          </p>
        </div>
      </div>

      <h3>组合使用示例</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        在实际应用中，通常将Robot组件与Lottie动画结合使用
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          padding: 16,
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          background: '#fafafa',
        }}
      >
        <Robot status="running" size={80} />
        <span>AI正在思考中...</span>
      </div>
    </div>
  );
};
