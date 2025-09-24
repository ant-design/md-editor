import { ConfigProvider, message } from 'antd';
import React from 'react';
// 开发环境使用相对路径导入
import Quote from '../../src/Quote/index';

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
      </div>
    </ConfigProvider>
  );
}
