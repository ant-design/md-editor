import {
  FileTextOutlined,
  HeartOutlined,
  MessageOutlined,
  PictureOutlined,
  SettingOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  AttachmentFile,
  Bubble,
  BubbleList,
  MessageBubbleData,
} from '@ant-design/md-editor';
import {
  Badge,
  Button,
  Card,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  message,
} from 'antd';
import React, { useCallback, useRef, useState } from 'react';

const { TabPane } = Tabs;
const { Option } = Select;

// 创建模拟文件
const createMockFile = (
  name: string,
  type: string,
  size: number,
  url: string,
): AttachmentFile => ({
  name,
  type,
  size,
  url,
  lastModified: Date.now(),
  webkitRelativePath: '',
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  bytes: () => Promise.resolve(new Uint8Array(0)),
  text: () => Promise.resolve(''),
  stream: () => new ReadableStream(),
  slice: () => new Blob(),
});

// 高级功能演示数据
const advancedMessages: MessageBubbleData[] = [
  {
    id: 'adv-1',
    role: 'assistant',
    content: `# 🚀 Bubble 高级功能演示

欢迎来到 Bubble 组件的高级功能展示！这里包含了：

## 📋 功能清单
- ✅ 自定义渲染配置
- ✅ 文件附件支持  
- ✅ 交互回调处理
- ✅ 样式主题切换
- ✅ 动态内容更新
- ✅ 状态管理

让我们开始探索这些强大的功能！`,
    createAt: Date.now() - 300000,
    updateAt: Date.now() - 300000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Advanced Assistant',
      description: '高级功能演示',
    },
    extra: {
      tags: ['NORMAL'],
      features: ['自定义渲染', '文件支持'],
      version: '2.0',
    },
  },
  {
    id: 'adv-2',
    role: 'user',
    content: '这些功能看起来很强大！能详细演示一下每个功能吗？',
    createAt: Date.now() - 240000,
    updateAt: Date.now() - 240000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: '产品体验师',
      description: 'UX 研究员',
    },
  },
  {
    id: 'adv-3',
    role: 'assistant',
    content: `## 📎 文件附件功能

这条消息包含了多种类型的文件附件，展示了 Bubble 组件强大的文件处理能力：

### 支持的文件类型：
- 📄 **文档类型**：PDF, DOC, TXT 等
- 🖼️ **图片类型**：PNG, JPG, GIF, SVG 等  
- 📊 **数据类型**：JSON, CSV, XML 等
- 🎵 **媒体类型**：MP3, MP4, WebM 等

文件会自动识别类型并显示相应的图标和预览。`,
    createAt: Date.now() - 180000,
    updateAt: Date.now() - 180000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Advanced Assistant',
      description: '高级功能演示',
    },
    fileMap: new Map([
      [
        '设计规范.pdf',
        createMockFile(
          '设计规范.pdf',
          'application/pdf',
          2048576,
          'https://example.com/design-spec.pdf',
        ),
      ],
      [
        '界面截图.png',
        createMockFile(
          '界面截图.png',
          'image/png',
          1024576,
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        ),
      ],
      [
        '配置数据.json',
        createMockFile(
          '配置数据.json',
          'application/json',
          512000,
          'https://example.com/config.json',
        ),
      ],
      [
        '演示视频.mp4',
        createMockFile(
          '演示视频.mp4',
          'video/mp4',
          10485760,
          'https://example.com/demo.mp4',
        ),
      ],
    ]),
    extra: {
      tags: ['NORMAL'],
      features: ['文件附件', '类型识别'],
    },
  },
];

export default () => {
  const bubbleRef = useRef<any>();
  const bubbleListRef = useRef<HTMLDivElement>(null);

  // 状态管理
  const [activeTab, setActiveTab] = useState('single');
  const [theme, setTheme] = useState<'light' | 'dark' | 'colorful'>('light');
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [placement, setPlacement] = useState<'left' | 'right'>('left');
  const [customRender, setCustomRender] = useState(false);
  const [messages, setMessages] = useState(advancedMessages);

  // 自定义渲染配置
  const getCustomRenderConfig = () => {
    if (!customRender) return {};

    return {
      titleRender: (props: any, defaultDom: React.ReactNode) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge
            dot
            color={
              props.originData?.role === 'assistant' ? '#52c41a' : '#1890ff'
            }
          />
          {defaultDom}
          {props.originData?.extra?.version && (
            <Tag color="purple">v{props.originData.extra.version}</Tag>
          )}
        </div>
      ),

      contentRender: (props: any, defaultDom: React.ReactNode) => (
        <div
          style={{
            border: `2px solid ${theme === 'colorful' ? '#ff7875' : '#d9d9d9'}`,
            borderRadius: 12,
            padding: 16,
            background:
              theme === 'dark'
                ? '#262626'
                : theme === 'colorful'
                  ? '#fff7e6'
                  : '#ffffff',
          }}
        >
          {defaultDom}
          {props.originData?.extra?.features && (
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                gap: 4,
                flexWrap: 'wrap',
              }}
            >
              {props.originData.extra.features.map((feature: string) => (
                <Tag key={feature} color="blue">
                  {feature}
                </Tag>
              ))}
            </div>
          )}
        </div>
      ),

      extraRender: (props: any, defaultDom: React.ReactNode) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<HeartOutlined />}
            onClick={() => message.success('已收藏消息')}
          >
            收藏
          </Button>
          <Button
            type="text"
            size="small"
            icon={<ShareAltOutlined />}
            onClick={() => message.success('已分享消息')}
          >
            分享
          </Button>
          {defaultDom}
        </div>
      ),
    };
  };

  // 获取主题样式
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          background: '#141414',
          color: '#ffffff',
          border: '1px solid #434343',
        };
      case 'colorful':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          border: 'none',
        };
      default:
        return {
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #d9d9d9',
        };
    }
  };

  // 添加新消息
  const addMessage = useCallback(() => {
    const newMessage: MessageBubbleData = {
      id: `msg-${Date.now()}`,
      role: Math.random() > 0.5 ? 'user' : 'assistant',
      content: `这是一条动态添加的消息，时间：${new Date().toLocaleTimeString()}`,
      createAt: Date.now(),
      updateAt: Date.now(),
      isFinished: true,
      meta: {
        avatar:
          Math.random() > 0.5
            ? 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
            : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        title: '动态消息',
        description: '实时生成',
      },
    };
    setMessages((prev) => [...prev, newMessage]);
    message.success('消息已添加');
  }, []);

  // 单个气泡演示
  const SingleBubbleDemo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="🎛️ 控制面板" size="small">
        <Space wrap>
          <div>
            <span>主题: </span>
            <Select value={theme} onChange={setTheme} style={{ width: 100 }}>
              <Option value="light">明亮</Option>
              <Option value="dark">深色</Option>
              <Option value="colorful">彩色</Option>
            </Select>
          </div>

          <div>
            <span>位置: </span>
            <Select
              value={placement}
              onChange={setPlacement}
              style={{ width: 80 }}
            >
              <Option value="left">左侧</Option>
              <Option value="right">右侧</Option>
            </Select>
          </div>

          <div>
            <span>自定义渲染: </span>
            <Switch checked={customRender} onChange={setCustomRender} />
          </div>

          <div>
            <span>动画效果: </span>
            <Switch checked={enableAnimation} onChange={setEnableAnimation} />
          </div>
        </Space>
      </Card>

      <div
        style={{
          ...getThemeStyles(),
          padding: 20,
          borderRadius: 12,
          transition: enableAnimation ? 'all 0.3s ease' : 'none',
        }}
      >
        {advancedMessages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 16 }}>
            <Bubble
              originData={msg}
              avatar={msg.meta!}
              placement={placement}
              bubbleRef={bubbleRef}
              bubbleRenderConfig={getCustomRenderConfig()}
              style={{
                transition: enableAnimation ? 'all 0.3s ease' : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // 列表演示
  const ListDemo = () => (
    <div>
      <Card title="📋 消息列表控制" size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Button onClick={addMessage} icon={<MessageOutlined />}>
            添加消息
          </Button>
          <Button
            onClick={() => setMessages(advancedMessages)}
            icon={<ThunderboltOutlined />}
          >
            重置消息
          </Button>
          <span>
            消息总数: <Badge count={messages.length} />
          </span>
        </Space>
      </Card>

      <div
        style={{
          ...getThemeStyles(),
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <BubbleList
          bubbleList={messages}
          bubbleListRef={bubbleListRef}
          bubbleRef={bubbleRef}
          style={{ height: 500, overflow: 'auto' }}
          bubbleRenderConfig={getCustomRenderConfig()}
          assistantMeta={{
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            title: 'Advanced Assistant',
          }}
          userMeta={{
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            title: 'User',
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined />
            <span>Bubble 高级功能演示</span>
          </div>
        }
        extra={
          <Space>
            <Tag color="blue">v2.0</Tag>
            <Tag color="green">高级功能</Tag>
          </Space>
        }
      >
        <p style={{ marginBottom: 24, color: '#666' }}>
          探索 Bubble
          组件的高级功能，包括自定义渲染、主题切换、文件支持、动态交互等特性。
        </p>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <MessageOutlined />
                单个气泡
              </span>
            }
            key="single"
          >
            <SingleBubbleDemo />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                消息列表
              </span>
            }
            key="list"
          >
            <ListDemo />
          </TabPane>

          <TabPane
            tab={
              <span>
                <PictureOutlined />
                文件展示
              </span>
            }
            key="files"
          >
            <Card title="📎 文件附件演示" size="small">
              <p>展示带有多种文件类型的消息气泡：</p>
              <Bubble
                originData={advancedMessages[2]}
                avatar={advancedMessages[2].meta!}
                placement="left"
                bubbleRef={bubbleRef}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 功能特性说明 */}
      <Card title="✨ 功能特性" style={{ marginTop: 24 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          <div>
            <h4>🎨 主题定制</h4>
            <ul>
              <li>多种内置主题（明亮、深色、彩色）</li>
              <li>自定义主题色彩</li>
              <li>动态主题切换</li>
              <li>CSS-in-JS 样式支持</li>
            </ul>
          </div>

          <div>
            <h4>🔧 自定义渲染</h4>
            <ul>
              <li>标题自定义渲染</li>
              <li>内容自定义渲染</li>
              <li>头像自定义渲染</li>
              <li>额外操作区域渲染</li>
            </ul>
          </div>

          <div>
            <h4>📎 文件支持</h4>
            <ul>
              <li>多种文件类型识别</li>
              <li>文件预览功能</li>
              <li>文件下载支持</li>
              <li>自定义文件处理</li>
            </ul>
          </div>

          <div>
            <h4>🚀 交互功能</h4>
            <ul>
              <li>点赞/点踩反馈</li>
              <li>消息回复功能</li>
              <li>内容复制分享</li>
              <li>自定义操作按钮</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
