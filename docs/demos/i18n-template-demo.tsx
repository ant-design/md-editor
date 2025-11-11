/**
 * title: 模板字符串
 * description: 使用 compileTemplate 进行动态文本替换。
 */
import {
  compileTemplate,
  I18nProvide,
  useLanguage,
} from '@ant-design/agentic-ui';
import { Button, Card, Input, Space } from 'antd';
import React, { useState } from 'react';

function TemplateContent() {
  const { locale } = useLanguage();
  const [taskName, setTaskName] = useState('数据分析');
  const [compiledText, setCompiledText] = useState('');

  const handleCompile = () => {
    const result = compileTemplate(locale.inProgressTask, { taskName });
    setCompiledText(result);
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <strong>模板字符串:</strong>
          <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
            {locale.inProgressTask}
          </pre>
        </div>

        <div>
          <Space>
            <span>任务名称:</span>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              style={{ width: 200 }}
              placeholder="输入任务名称"
            />
            <Button type="primary" onClick={handleCompile}>
              编译模板
            </Button>
          </Space>
        </div>

        {compiledText && (
          <div>
            <strong>编译结果:</strong>
            <div
              style={{
                background: '#e6f7ff',
                padding: 12,
                marginTop: 8,
                borderRadius: 4,
              }}
            >
              {compiledText}
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
}

export default () => {
  return (
    <I18nProvide>
      <TemplateContent />
    </I18nProvide>
  );
};
