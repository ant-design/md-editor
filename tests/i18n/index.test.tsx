import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { 
  detectUserLanguage, 
  getLocaleByLanguage, 
  saveUserLanguage,
  I18nProvide,
  I18nContext,
  enLabels
} from '../../src/I18n';
import React from 'react';

// 创建测试组件
const TestConsumer: React.FC = () => {
  const context = React.useContext(I18nContext);
  return (
    <div>
      <span data-testid="language">{context.language}</span>
      <span data-testid="locale-key-count">{Object.keys(context.locale).length}</span>
    </div>
  );
};

describe('I18n Functions', () => {
  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();
  });

  describe('detectUserLanguage', () => {
    it('应该从 localStorage 检测语言（第29-31行）', () => {
      // 设置 localStorage
      localStorage.setItem('md-editor-language', 'en-US');
      
      const language = detectUserLanguage();
      expect(language).toBe('en-US');
    });

    it('应该处理无效的 localStorage 语言设置', () => {
      // 设置无效的语言
      localStorage.setItem('md-editor-language', 'invalid-lang');
      
      // 模拟浏览器语言为中文
      Object.defineProperty(navigator, 'language', {
        writable: true,
        configurable: true,
        value: 'zh-CN',
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('zh-CN');
    });

    // 添加测试用例来覆盖第40行和第41行
    it('应该通过 data-antd-locale 检测中文语言（第40, 41行）', () => {
      // 创建带有 data-antd-locale 属性的元素
      const div = document.createElement('div');
      div.setAttribute('data-antd-locale', 'zh-CN');
      document.body.appendChild(div);

      const language = detectUserLanguage();
      expect(language).toBe('zh-CN');

      document.body.removeChild(div);
    });

    // 添加测试用例来覆盖第43行和第44行
    it('应该通过 data-antd-locale 检测英文语言（第43, 44行）', () => {
      // 创建带有 data-antd-locale 属性的元素
      const div = document.createElement('div');
      div.setAttribute('data-antd-locale', 'en-US');
      document.body.appendChild(div);

      const language = detectUserLanguage();
      expect(language).toBe('en-US');

      document.body.removeChild(div);
    });

    it('应该处理 data-antd-locale 中的非标准语言代码', () => {
      // 创建带有非标准语言代码的元素
      const div = document.createElement('div');
      div.setAttribute('data-antd-locale', 'zh');
      document.body.appendChild(div);

      const language = detectUserLanguage();
      expect(language).toBe('zh-CN');

      document.body.removeChild(div);
    });

    it('应该通过浏览器语言检测中文（第57-59行）', () => {
      // 模拟浏览器语言为中文
      Object.defineProperty(navigator, 'language', {
        writable: true,
        configurable: true,
        value: 'zh-CN',
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('zh-CN');
    });

    // 添加测试用例来覆盖第60行和第61行
    it('应该通过浏览器语言检测英文（第60, 61行）', () => {
      // 模拟浏览器语言为英文
      Object.defineProperty(navigator, 'language', {
        writable: true,
        configurable: true,
        value: 'en-US',
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('en-US');
    });

    it('应该处理浏览器的 languages 数组', () => {
      // 模拟浏览器支持多种语言，第一种为英文
      Object.defineProperty(navigator, 'languages', {
        writable: true,
        configurable: true,
        value: ['en-US', 'zh-CN'],
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('en-US');
    });

    // 添加测试用例来覆盖第67行和第68行
    it('应该在测试环境中默认返回英文（第67, 68行）', () => {
      // 保存原始的 NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      
      // 设置为测试环境
      process.env.NODE_ENV = 'test';
      
      // 清除浏览器语言设置
      Object.defineProperty(navigator, 'language', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('en-US');
      
      // 恢复原始的 NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });

    // 添加测试用例来覆盖第71行
    it('应该在非测试环境中默认返回中文（第71行）', () => {
      // 保存原始的 NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      
      // 设置为非测试环境
      process.env.NODE_ENV = 'development';
      
      // 清除浏览器语言设置，并确保没有其他语言检测方式生效
      localStorage.clear();
      document.body.innerHTML = '';
      
      Object.defineProperty(navigator, 'language', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      
      Object.defineProperty(navigator, 'languages', {
        writable: true,
        configurable: true,
        value: [],
      });
      
      const language = detectUserLanguage();
      expect(language).toBe('zh-CN');
      
      // 恢复原始的 NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('getLocaleByLanguage', () => {
    it('应该为中文返回 cnLabels', () => {
      const locale = getLocaleByLanguage('zh-CN');
      expect(locale).toBeDefined();
      expect(typeof locale).toBe('object');
    });

    it('应该为英文返回 enLabels', () => {
      const locale = getLocaleByLanguage('en-US');
      expect(locale).toBeDefined();
      expect(typeof locale).toBe('object');
    });
  });

  describe('saveUserLanguage', () => {
    it('应该保存用户语言到 localStorage', () => {
      saveUserLanguage('zh-CN');
      expect(localStorage.getItem('md-editor-language')).toBe('zh-CN');
    });
  });
});

describe('I18nProvide Component', () => {
  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();
  });

  it('应该正确渲染并提供默认语言', () => {
    const { getByTestId } = render(
      <I18nProvide autoDetect={false} defaultLanguage="zh-CN">
        <TestConsumer />
      </I18nProvide>
    );

    expect(getByTestId('language')).toHaveTextContent('zh-CN');
  });

  // 添加测试用例来覆盖第191行、第193行和第194行
  it('应该通过 setLocale 方法切换语言（第191, 193, 194行）', async () => {
    let capturedSetLocale: ((locale: any) => void) | undefined;
    
    const TestComponent: React.FC = () => {
      const context = React.useContext(I18nContext);
      capturedSetLocale = context.setLocale;
      return <TestConsumer />;
    };

    const { getByTestId } = render(
      <I18nProvide autoDetect={false} defaultLanguage="zh-CN">
        <TestComponent />
      </I18nProvide>
    );

    expect(getByTestId('language')).toHaveTextContent('zh-CN');
    
    // 调用 setLocale 方法切换语言
    if (capturedSetLocale) {
      // 传入 enLabels 来切换到英文（与 cnLabels 不同的对象）
      capturedSetLocale(enLabels);
    }
    
    // 等待状态更新
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // 验证语言已切换
    expect(getByTestId('language')).toHaveTextContent('en-US');
  });
});