import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { I18nProvide } from '../../../src/I18n';
import { useSiteI18n } from '../../i18n';

/** Demo-only providers stay inside deferred sections, away from the first-screen bundle. */
const LocaleBridge: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { locale } = useSiteI18n();
  return (
    <ConfigProvider prefixCls="ant" locale={locale === 'zh-CN' ? zhCN : enUS}>
      <I18nProvide key={locale} defaultLanguage={locale} autoDetect={false}>
        {children}
      </I18nProvide>
    </ConfigProvider>
  );
};

export default LocaleBridge;
