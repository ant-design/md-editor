/**
 * title: 语言选择器
 * description: 使用 Select 组件创建语言选择器。
 */
import { I18nProvide, useLanguage } from '@ant-design/agentic-ui';
import { Card, Descriptions, Select, Space } from 'antd';
import React from 'react';

function LanguageSelectorContent() {
  const { language, setLanguage, locale, isChinese, isEnglish } = useLanguage();

  const languages = [
    { value: 'zh-CN', label: '简体中文 🇨🇳' },
    { value: 'en-US', label: 'English 🇺🇸' },
  ];

  return (
    <Card variant="borderless" style={{ boxShadow: 'none' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Space>
            <span>选择语言:</span>
            <Select
              value={language}
              onChange={setLanguage}
              options={languages}
              style={{ width: 180 }}
            />
          </Space>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="当前语言">{language}</Descriptions.Item>
          <Descriptions.Item label="是否中文">
            {isChinese ? '是 ✓' : '否 ✗'}
          </Descriptions.Item>
          <Descriptions.Item label="是否英文">
            {isEnglish ? '是 ✓' : '否 ✗'}
          </Descriptions.Item>
        </Descriptions>

        <Card
          variant="borderless"
          size="small"
          title={locale.preview}
          style={{ background: '#fafafa', boxShadow: 'none' }}
        >
          <Space direction="vertical">
            <div>
              {locale.bold} / {locale.italic}
            </div>
            <div>
              {locale.copy} / {locale.edit} / {locale.delete}
            </div>
            <div>
              {locale.undo} / {locale.redo}
            </div>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default () => {
  return (
    <I18nProvide>
      <LanguageSelectorContent />
    </I18nProvide>
  );
};
