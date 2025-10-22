import { MarkdownInputField, Quote } from '@ant-design/md-editor';
import { ConfigProvider } from 'antd';
import React, { useState } from 'react';

export default function QuoteWithInputDemo() {
  const [skillModeOpen, setSkillModeOpen] = useState(true);

  const handleSend = async (value: string) => {
    console.log('发送内容:', value);
  };

  return (
    <ConfigProvider prefixCls="ant">
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h2>MarkdownInputField 中使用 Quote 组件</h2>

        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          <MarkdownInputField
            placeholder="在这里输入你的问题..."
            onSend={handleSend}
            skillMode={{
              open: skillModeOpen,
              title: (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Quote
                    fileName="src/components/UserProfile.tsx"
                    lineRange="45-60"
                    quoteDescription="用户资料组件的状态管理逻辑，包含用户信息的加载和更新"
                    popupDetail={`const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await fetchUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadUserProfile();
}, [userId]);`}
                    popupDirection="left"
                  />

                  <Quote
                    fileName="src/utils/api.ts"
                    lineRange="12-25"
                    quoteDescription="API请求工具函数，包含错误处理和重试逻辑"
                    popupDetail={`export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(\`/api/users/\${userId}\`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${getAuthToken()}\`,
    },
  });
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch user profile: \${response.statusText}\`);
  }
  
  return response.json();
};`}
                    popupDirection="left"
                    closable
                    onClose={() => console.log('关闭第二个引用')}
                  />

                  <Quote
                    fileName="src/types/user.ts"
                    lineRange="5-15"
                    quoteDescription="用户资料的类型定义"
                    popupDetail={`export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
}`}
                    popupDirection="left"
                  />

                  <Quote
                    quoteDescription="这是一个关于用户认证流程的补充说明，没有具体的代码文件引用"
                    popupDetail={`用户认证流程说明：

1. 用户输入邮箱和密码
2. 前端验证输入格式
3. 发送登录请求到后端
4. 后端验证凭据
5. 返回 JWT token
6. 前端存储 token 到 localStorage
7. 后续请求携带 token 进行身份验证

注意事项：
- Token 有效期为 24 小时
- 需要处理 token 过期的情况
- 实现自动刷新机制`}
                    popupDirection="left"
                  />
                </div>
              ),
              closable: true,
            }}
            onSkillModeOpenChange={(open) => {
              setSkillModeOpen(open);
            }}
          />

          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666',
            }}
          >
            <p style={{ margin: 0, marginBottom: '8px' }}>
              <strong>使用说明：</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Quote 组件通过 skillMode.title 属性渲染，替换默认标题</li>
              <li>使用 skillMode.open 控制是否显示技能模式和引用区域</li>
              <li>点击 skillMode 标题栏的关闭按钮可以隐藏整个引用区域</li>
              <li>鼠标悬停在引用卡片上可查看详细代码</li>
              <li>点击引用中的文件名可跳转到对应文件</li>
              <li>支持关闭单个引用（第二个引用有关闭按钮）</li>
            </ul>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
