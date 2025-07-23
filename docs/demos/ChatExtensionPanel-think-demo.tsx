import React from 'react';
import ChatExtensionPanel from '../../src/ChatExtensionPanel';

export default () => {
  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: 400 }}>
      <ChatExtensionPanel
        title="扩展面板 Demo"
        realtime={{
          type: 'think',
          title: '创建文件 mdir',
          content: `
1. 当前系统存在的问题
2. 用户需求分析
3. 技术可行性评估

解决方案
- 方案A: 渐进式重构
- 方案B: 完全重写
- 方案C: 混合方案

风险评估
- 技术风险: 中等
- 时间风险: 高
- 成本风险: 低`,
        }}
        browser={{
          title: '创建文件 mdir',
          content: `\`\`\`shell
          `,
        }}
        file={<div>文件</div>}
        onTabChange={(key) => {
          // eslint-disable-next-line no-console
          console.log('切换到 tab:', key);
        }}
        onClose={() => {
          // eslint-disable-next-line no-console
          console.log('关闭面板');
        }}
        style={{ maxWidth: 480, margin: '0 auto' }}
      />
    </div>
  );
};
