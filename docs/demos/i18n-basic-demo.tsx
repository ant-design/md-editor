/**
 * title: 基础用法
 * description: 展示国际化的基本使用方法，支持中英文切换。
 */
import { I18nProvide, useLanguage } from '@ant-design/agentic-ui';
import { Button, Space, Card } from 'antd';
import React from 'react';

function I18nContent() {
  const { locale, language, toggleLanguage } = useLanguage();

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <strong>当前语言 / Current Language:</strong> {language}
        </div>

        <div>
          <h3>{locale.welcome}</h3>
          <p>{locale.copy}: {locale.copySuccess}</p>
          <p>{locale.edit} / {locale.delete} / {locale.cancel}</p>
        </div>

        <Button type="primary" onClick={toggleLanguage}>
          {locale.switchLanguage}
        </Button>
      </Space>
    </Card>
  );
}

export default () => {
  return (
    <I18nProvide>
      <I18nContent />
    </I18nProvide>
  );
};

