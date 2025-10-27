import { Quote } from '@ant-design/agentic-ui';
import { ConfigProvider, message } from 'antd';
import React from 'react';

export default function QuoteDemo() {
  // 处理文件名点击
  const handleFileClick = (fileName: string, lineRange?: string) => {
    console.log('点击文件:', fileName, lineRange ? `行号: ${lineRange}` : '');
    message.success(
      `打开文件: ${fileName}${lineRange ? ` (${lineRange})` : ''}`,
    );
  };

  const handleClose = () => {
    message.success('Quote closed');
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
        <h2>Quote 组件演示</h2>

        <div>
          <h3>基础用法</h3>
          <Quote
            fileName="utils/helper.ts"
            lineRange="12-25"
            quoteDescription="这是一个工具函数的引用，用于处理数据格式化"
            popupDetail="export const formatData = (data: any) => {
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at)
  };
};"
            onFileClick={handleFileClick}
          />
        </div>

        <div>
          <h3>可关闭的引用</h3>
          <Quote
            fileName="components/Button.tsx"
            lineRange="45-60"
            quoteDescription="Button组件的点击事件处理逻辑"
            closable={true}
            onClose={handleClose}
            onFileClick={handleFileClick}
          />
        </div>

        <div>
          <h3>不传文件名</h3>
          <Quote
            quoteDescription="这是一个没有文件来源的引用内容"
            popupDetail="这里是详细的说明文本，可以包含多行内容。
当内容过多时，会出现滚动条。
用户可以通过滚动查看完整内容。"
          />
        </div>

        <div>
          <h3>纯内容引用</h3>
          <Quote
            fileName="README.md"
            quoteDescription="项目使用说明和API文档"
            onFileClick={handleFileClick}
          />
        </div>

        <div>
          <h3>长文件名测试</h3>
          <Quote
            fileName="src/components/ComplexComponent/SubComponent/VeryLongFileName.tsxsrc/components/ComplexComponent/SubComponent/VeryLongFileName.tsx"
            lineRange="100-150"
            quoteDescription="这是一个很长的文件路径，用来测试文件名的省略效果"
            popupDetail="interface VeryLongInterfaceName {
  propertyWithVeryLongName: string;
  anotherPropertyWithEvenLongerName: number;
  yetAnotherPropertyThatIsEvenLonger: boolean;
}"
            onFileClick={handleFileClick}
          />
        </div>

        <div>
          <h3>弹出方向示例</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>左侧弹出（默认）</h4>
              <Quote
                fileName="src/utils/leftAlign.ts"
                lineRange="1-20"
                quoteDescription="左侧对齐的工具函数"
                popupDirection="left"
                popupDetail="export const leftAlign = (text: string, width: number) => {
  return text.padEnd(width, ' ');
};

// 使用示例
const aligned = leftAlign('Hello', 10);
// 'Hello     '"
                onFileClick={handleFileClick}
              />
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h4>右侧弹出</h4>
              <Quote
                fileName="src/utils/rightAlign.ts"
                lineRange="1-20"
                quoteDescription="右侧对齐的工具函数"
                popupDirection="right"
                popupDetail="export const rightAlign = (text: string, width: number) => {
  return text.padStart(width, ' ');
};

// 使用示例
const aligned = rightAlign('Hello', 10);
// '     Hello'"
                onFileClick={handleFileClick}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
