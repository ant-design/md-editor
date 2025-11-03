import { History } from '@ant-design/agentic-ui';
import { Button, Empty } from 'antd';
import React, { useState } from 'react';

/**
 * 展示 emptyRender 和 searchOptions.trigger 配置的示例
 */
const HistoryEmptyRenderDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');
  const [hasData, setHasData] = useState(false);

  const mockDataRequest = async () => {
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '这是一个有数据的示例',
        agentId: 'demo-agent',
        gmtCreate: Date.now(),
        gmtLastConverse: Date.now(),
      },
    ];
  };

  // 模拟空数据请求
  const mockEmptyRequest = async () => {
    return [];
  };

  // 自定义空状态渲染
  const renderEmpty = () => (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <Empty
        description={
          <div>
            <p style={{ color: 'var(--color-gray-text-secondary)' }}>
              暂无历史记录
            </p>
            <p
              style={{ color: 'var(--color-gray-text-tertiary)', fontSize: 12 }}
            >
              开始一段新的对话吧
            </p>
          </div>
        }
      >
        <Button
          type="primary"
          onClick={() => {
            console.log('创建新对话');
          }}
        >
          创建新对话
        </Button>
      </Empty>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h3>History 组件 - emptyRender 空状态渲染</h3>
        <p style={{ color: 'var(--color-gray-text-secondary)' }}>
          当历史记录为空时，显示自定义空状态内容
        </p>
        <Button
          onClick={() => setHasData(!hasData)}
          style={{ marginBottom: 16 }}
        >
          切换数据状态（当前：{hasData ? '有数据' : '空数据'}）
        </Button>
      </div>

      <div
        style={{
          maxWidth: 320,
          padding: 16,
          border: '1px solid var(--color-gray-border-light)',
          borderRadius: 8,
          backgroundColor: 'var(--color-gray-bg-container)',
        }}
      >
        <History
          agentId="demo-agent"
          sessionId={currentSessionId}
          request={hasData ? mockDataRequest : mockEmptyRequest}
          standalone
          emptyRender={renderEmpty}
          agent={{
            enabled: true,
            onSearch: (keyword) => {
              console.log('搜索关键词:', keyword);
            },
            onNewChat: () => {
              console.log('创建新对话');
            },
            searchOptions: {
              placeholder: '搜索历史记录',
              text: '历史对话',
              trigger: 'enter', // 回车触发搜索
            },
          }}
          onClick={(sessionId, item) => {
            console.log('点击会话:', sessionId, item);
            setCurrentSessionId(sessionId);
          }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>功能说明：</h4>
        <ul style={{ color: 'var(--color-gray-text-secondary)', fontSize: 14 }}>
          <li>
            <strong>emptyRender</strong>: 当历史记录为空时，显示自定义空状态组件
          </li>
          <li>
            <strong>searchOptions.trigger</strong>: 配置搜索触发方式
            <ul>
              <li>'change' (默认): 输入时实时搜索（防抖 360ms）</li>
              <li>'enter': 按回车键时触发搜索</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HistoryEmptyRenderDemo;
