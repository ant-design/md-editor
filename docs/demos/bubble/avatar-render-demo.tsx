import type { BubbleProps, MessageBubbleData } from '@ant-design/agentic-ui';
import { Bubble } from '@ant-design/agentic-ui';
import { CrownOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Space, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { BubbleDemoCard } from './BubbleDemoCard';

export default () => {
  const bubbleRef = useRef<any>();
  const [avatarStyle, setAvatarStyle] = useState<
    'default' | 'status' | 'role' | 'enhanced'
  >('default');

  // Mock message data
  const mockMessages: MessageBubbleData[] = [
    {
      id: '1',
      role: 'assistant',
      content: `# avatarRender 自定义头像渲染演示

avatarRender 允许你完全自定义消息气泡的头像区域，可以：

## 功能特点
- 🎨 **样式定制**：自定义头像的样式和布局
- 🟢 **在线状态**：显示用户的在线/离线状态
- 👤 **角色标识**：区分用户和AI助手的角色
- 🏆 **等级标识**：显示用户等级和权限
- ⭐ **特殊标记**：添加VIP、专家等特殊标识

通过下方的按钮可以切换不同的头像渲染样式。`,
      createAt: Date.now() - 120000,
      updateAt: Date.now() - 120000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'AI Assistant',
        description: '智能助手 v2.1',
      },
      extra: {
        status: 'success',
        priority: 'high',
        customTags: ['代码优化', '性能'],
        model: 'GPT-4',
        duration: 2300,
        confidence: 0.95,
        isOnline: true,
        userLevel: 'expert',
        isVip: true,
      },
    },
    {
      id: '2',
      role: 'user',
      content: '请帮我分析这段代码的性能问题，并提供优化建议。',
      createAt: Date.now() - 60000,
      updateAt: Date.now() - 60000,
      isFinished: true,
      meta: {
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        title: '前端开发者',
        description: '高级工程师',
      },
      extra: {
        location: '上海',
        device: 'Desktop',
        browser: 'Chrome 120',
        isOnline: true,
        userLevel: 'senior',
        isVip: false,
        lastActive: Date.now() - 30000,
      },
    },
    {
      id: '3',
      role: 'assistant',
      content: `## 性能分析报告

### 问题识别
1. **内存泄漏**：事件监听器未正确清理
2. **重复渲染**：组件缺少 memo 优化
3. **大列表渲染**：未使用虚拟滚动

### 优化建议
\`\`\`typescript
// 使用 React.memo 优化
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});

// 使用 useCallback 优化回调
const handleClick = useCallback(() => {
  // 处理点击事件
}, [dependency]);
\`\`\`

### 预期效果
- 性能提升 40%
- 内存使用减少 30%
- 渲染时间缩短 50%`,
      createAt: Date.now() - 10000,
      updateAt: Date.now() - 10000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'AI Assistant',
        description: '智能助手 v2.1',
      },
      extra: {
        status: 'in_progress',
        priority: 'medium',
        customTags: ['性能分析', 'React'],
        model: 'GPT-4',
        duration: 1800,
        confidence: 0.88,
        progress: 75,
        isOnline: true,
        userLevel: 'expert',
        isVip: true,
      },
    },
  ];

  // 默认头像渲染
  const defaultAvatarRender = (props: BubbleProps) => {
    const { originData } = props;
    return (
      <Avatar
        size={40}
        src={originData?.meta?.avatar}
        icon={
          originData?.role === 'assistant' ? (
            <RobotOutlined />
          ) : (
            <UserOutlined />
          )
        }
      />
    );
  };

  // 带在线状态的头像渲染
  const statusAvatarRender = (props: BubbleProps) => {
    const { originData } = props;
    const isOnline = originData?.extra?.isOnline ?? true;

    return (
      <div style={{ position: 'relative' }}>
        <Badge dot color={isOnline ? '#52c41a' : '#d9d9d9'} offset={[-8, 8]}>
          <Avatar
            size={40}
            src={originData?.meta?.avatar}
            icon={
              originData?.role === 'assistant' ? (
                <RobotOutlined />
              ) : (
                <UserOutlined />
              )
            }
            style={{
              border: `2px solid ${isOnline ? '#52c41a' : '#d9d9d9'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Badge>

        {/* 在线状态文字 */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: isOnline ? '#52c41a' : '#999',
            whiteSpace: 'nowrap',
          }}
        >
          {isOnline ? '在线' : '离线'}
        </div>
      </div>
    );
  };

  // 带角色标识的头像渲染
  const roleAvatarRender = (props: BubbleProps) => {
    const { originData } = props;
    const isAssistant = originData?.role === 'assistant';

    return (
      <div style={{ position: 'relative' }}>
        <Avatar
          size={40}
          src={originData?.meta?.avatar}
          icon={isAssistant ? <RobotOutlined /> : <UserOutlined />}
          style={{
            border: `2px solid ${isAssistant ? '#1890ff' : '#52c41a'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />

        {/* 角色标识 */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isAssistant ? '#1890ff' : '#52c41a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            color: 'white',
            border: '2px solid white',
          }}
        >
          {isAssistant ? '🤖' : '👤'}
        </div>

        {/* 角色文字 */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: isAssistant ? '#1890ff' : '#52c41a',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          {isAssistant ? 'AI助手' : '用户'}
        </div>
      </div>
    );
  };

  // 增强版头像渲染
  const enhancedAvatarRender = (props: BubbleProps) => {
    const { originData } = props;
    const isAssistant = originData?.role === 'assistant';
    const isOnline = originData?.extra?.isOnline ?? true;
    const userLevel = originData?.extra?.userLevel;
    const isVip = originData?.extra?.isVip;

    const getLevelColor = (level: string) => {
      switch (level) {
        case 'expert':
          return '#ff4d4f';
        case 'senior':
          return '#fa8c16';
        case 'intermediate':
          return '#52c41a';
        case 'beginner':
          return '#1890ff';
        default:
          return '#d9d9d9';
      }
    };

    const getLevelIcon = (level: string) => {
      switch (level) {
        case 'expert':
          return '👑';
        case 'senior':
          return '⭐';
        case 'intermediate':
          return '🔰';
        case 'beginner':
          return '🌱';
        default:
          return '👤';
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        {/* 主头像 */}
        <Badge dot color={isOnline ? '#52c41a' : '#d9d9d9'} offset={[-8, 8]}>
          <Avatar
            size={40}
            src={originData?.meta?.avatar}
            icon={isAssistant ? <RobotOutlined /> : <UserOutlined />}
            style={{
              border: `2px solid ${isAssistant ? '#1890ff' : '#52c41a'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Badge>

        {/* 角色标识 */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: isAssistant ? '#1890ff' : '#52c41a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            color: 'white',
            border: '2px solid white',
          }}
        >
          {isAssistant ? '🤖' : '👤'}
        </div>

        {/* VIP标识 */}
        {isVip && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              color: '#d48806',
              border: '2px solid white',
            }}
          >
            <CrownOutlined />
          </div>
        )}

        {/* 等级标识 */}
        {userLevel && !isAssistant && (
          <Tooltip title={`等级: ${userLevel}`}>
            <div
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: getLevelColor(userLevel),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                color: 'white',
                border: '2px solid white',
              }}
            >
              {getLevelIcon(userLevel)}
            </div>
          </Tooltip>
        )}

        {/* 状态信息 */}
        <div
          style={{
            position: 'absolute',
            bottom: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: isOnline ? '#52c41a' : '#999',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          {isAssistant ? 'AI助手' : isOnline ? '在线' : '离线'}
        </div>

        {/* 等级信息 */}
        {userLevel && !isAssistant && (
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 9,
              color: getLevelColor(userLevel),
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {userLevel === 'expert'
              ? '专家'
              : userLevel === 'senior'
                ? '高级'
                : userLevel === 'intermediate'
                  ? '中级'
                  : userLevel === 'beginner'
                    ? '初级'
                    : userLevel}
          </div>
        )}
      </div>
    );
  };

  // 获取当前头像渲染函数
  const getAvatarRender = () => {
    switch (avatarStyle) {
      case 'status':
        return statusAvatarRender;
      case 'role':
        return roleAvatarRender;
      case 'enhanced':
        return enhancedAvatarRender;
      default:
        return defaultAvatarRender;
    }
  };

  return (
    <BubbleDemoCard
      title="🎨 avatarRender 自定义头像渲染"
      description="展示如何使用 avatarRender 自定义消息气泡的头像区域"
    >
      {/* 控制面板 */}
      <div style={{ padding: 24, paddingBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 12, fontWeight: 500 }}>头像样式：</span>
          <Space>
            <Button
              type={avatarStyle === 'default' ? 'primary' : 'default'}
              onClick={() => setAvatarStyle('default')}
            >
              默认样式
            </Button>
            <Button
              type={avatarStyle === 'status' ? 'primary' : 'default'}
              onClick={() => setAvatarStyle('status')}
            >
              在线状态
            </Button>
            <Button
              type={avatarStyle === 'role' ? 'primary' : 'default'}
              onClick={() => setAvatarStyle('role')}
            >
              角色标识
            </Button>
            <Button
              type={avatarStyle === 'enhanced' ? 'primary' : 'default'}
              onClick={() => setAvatarStyle('enhanced')}
            >
              增强样式
            </Button>
          </Space>
        </div>

        <div
          style={{
            padding: 12,
            background: '#f8f9fa',
            borderRadius: 6,
            fontSize: 14,
            color: '#666',
          }}
        >
          <strong>当前样式：</strong>
          {avatarStyle === 'default' && '使用默认头像渲染'}
          {avatarStyle === 'status' && '显示在线/离线状态指示器'}
          {avatarStyle === 'role' && '显示用户和AI助手的角色标识'}
          {avatarStyle === 'enhanced' &&
            '显示完整信息（状态、角色、等级、VIP标识）'}
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockMessages.map((message) => (
          <Bubble
            key={message.id}
            avatar={message.meta!}
            placement={message.role === 'user' ? 'right' : 'left'}
            bubbleRef={bubbleRef}
            originData={message}
            bubbleRenderConfig={{
              avatarRender: getAvatarRender(),
            }}
          />
        ))}
      </div>

      {/* 功能说明 */}
      <div
        style={{
          padding: 16,
          background: '#e6f7ff',
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        <strong>🔧 avatarRender API 说明：</strong>
        <div style={{ marginTop: 8 }}>
          <strong>函数签名：</strong>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 8,
              borderRadius: 4,
              fontSize: 12,
              margin: '4px 0',
            }}
          >
            {`avatarRender: (props: BubbleProps) => React.ReactNode`}
          </pre>
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>参数说明：</strong>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              <strong>props:</strong> 包含 originData 等消息数据的属性对象
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>使用场景：</strong>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, lineHeight: 1.6 }}>
            <li>显示用户在线/离线状态</li>
            <li>区分用户和AI助手的角色</li>
            <li>显示用户等级和权限标识</li>
            <li>添加VIP、专家等特殊标记</li>
            <li>自定义头像的样式和边框</li>
            <li>添加头像周围的装饰元素</li>
          </ul>
        </div>
      </div>
    </BubbleDemoCard>
  );
};
