import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { useStyle } from '../style';

// 测试组件来验证样式hook
const TestComponent: React.FC<{ prefix?: string }> = ({
  prefix = 'task-running-test',
}) => {
  const { wrapSSR, hashId } = useStyle(prefix);

  return wrapSSR(
    <div className={classNames(prefix, hashId)} data-testid="test-container">
      <div data-testid="test-content">
        <div data-testid="test-title">Title</div>
        <div data-testid="test-time">Time</div>
        <div data-testid="test-status">Status</div>
        <div data-testid="test-actions">Actions</div>
      </div>
    </div>,
  );
};

describe('AgentRunBar Style Hook', () => {
  it('should generate wrapSSR and hashId correctly', () => {
    const { container } = render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );

    // 检查是否生成了相应的元素
    const testContainer = container.querySelector(
      '[data-testid="test-container"]',
    );
    const testContent = container.querySelector('[data-testid="test-content"]');
    const testTitle = container.querySelector('[data-testid="test-title"]');
    const testTime = container.querySelector('[data-testid="test-time"]');
    const testStatus = container.querySelector('[data-testid="test-status"]');
    const testActions = container.querySelector('[data-testid="test-actions"]');

    expect(testContainer).toBeInTheDocument();
    expect(testContent).toBeInTheDocument();
    expect(testTitle).toBeInTheDocument();
    expect(testTime).toBeInTheDocument();
    expect(testStatus).toBeInTheDocument();
    expect(testActions).toBeInTheDocument();

    // 检查是否有CSS类名被应用
    expect(testContainer?.className).toContain('task-running-test');
  });

  it('should return wrapSSR function and hashId string', () => {
    let result: any;

    const TestStyleComponent = () => {
      result = useStyle('test-prefix');
      return <div />;
    };

    render(
      <ConfigProvider>
        <TestStyleComponent />
      </ConfigProvider>,
    );

    // 验证返回值类型
    expect(result).toHaveProperty('wrapSSR');
    expect(result).toHaveProperty('hashId');
    expect(typeof result.wrapSSR).toBe('function');
    expect(typeof result.hashId).toBe('string');
  });

  it('should work with different prefixes', () => {
    const TestPrefix1Component = () => {
      const { wrapSSR, hashId } = useStyle('prefix1');
      return wrapSSR(<div data-testid="prefix1">{hashId}</div>);
    };

    const TestPrefix2Component = () => {
      const { wrapSSR, hashId } = useStyle('prefix2');
      return wrapSSR(<div data-testid="prefix2">{hashId}</div>);
    };

    const { container } = render(
      <ConfigProvider>
        <TestPrefix1Component />
        <TestPrefix2Component />
      </ConfigProvider>,
    );

    const prefix1Element = container.querySelector('[data-testid="prefix1"]');
    const prefix2Element = container.querySelector('[data-testid="prefix2"]');

    expect(prefix1Element).toBeInTheDocument();
    expect(prefix2Element).toBeInTheDocument();
    expect(prefix1Element?.textContent).toBeTruthy();
    expect(prefix2Element?.textContent).toBeTruthy();
  });

  it('should work without prefix', () => {
    const TestNoPrefix = () => {
      const { wrapSSR, hashId } = useStyle();
      return wrapSSR(<div data-testid="no-prefix">{hashId}</div>);
    };

    const { container } = render(
      <ConfigProvider>
        <TestNoPrefix />
      </ConfigProvider>,
    );

    const noPrefixElement = container.querySelector(
      '[data-testid="no-prefix"]',
    );
    expect(noPrefixElement).toBeInTheDocument();
    expect(noPrefixElement?.textContent).toBeTruthy();
  });

  it('should render wrapped component correctly', () => {
    const TestWrapComponent = () => {
      const { wrapSSR } = useStyle('wrap-test');

      return wrapSSR(<div data-testid="wrapped-content">Wrapped Content</div>);
    };

    const { container } = render(
      <ConfigProvider>
        <TestWrapComponent />
      </ConfigProvider>,
    );

    const wrappedContent = container.querySelector(
      '[data-testid="wrapped-content"]',
    );
    expect(wrappedContent).toBeInTheDocument();
    expect(wrappedContent).toHaveTextContent('Wrapped Content');
  });

  it('should work with ConfigProvider context', () => {
    const customConfig = {
      prefixCls: 'custom-antd',
    };

    const TestConfigComponent = () => {
      const { wrapSSR, hashId } = useStyle('config-test');
      return wrapSSR(<div data-testid="config-test">{hashId}</div>);
    };

    const { container } = render(
      <ConfigProvider {...customConfig}>
        <TestConfigComponent />
      </ConfigProvider>,
    );

    const configElement = container.querySelector(
      '[data-testid="config-test"]',
    );
    expect(configElement).toBeInTheDocument();
    expect(configElement?.textContent).toBeTruthy();
  });

  // 测试CSS样式注入
  it('should inject CSS styles correctly', () => {
    const TestStylesComponent = () => {
      const { wrapSSR, hashId } = useStyle('styled-component');
      return wrapSSR(
        <div data-testid="styled-component" className={hashId}>
          Styled Component
        </div>,
      );
    };

    const { container } = render(
      <ConfigProvider>
        <TestStylesComponent />
      </ConfigProvider>,
    );

    const styledElement = container.querySelector(
      '[data-testid="styled-component"]',
    );
    expect(styledElement).toBeInTheDocument();
    expect(styledElement?.className).toContain('css-');
  });

  // 测试多个组件使用相同prefix的情况
  it('should handle multiple components with same prefix', () => {
    const TestComponent1 = () => {
      const { wrapSSR, hashId } = useStyle('same-prefix');
      return wrapSSR(<div data-testid="component1">{hashId}</div>);
    };

    const TestComponent2 = () => {
      const { wrapSSR, hashId } = useStyle('same-prefix');
      return wrapSSR(<div data-testid="component2">{hashId}</div>);
    };

    const { container } = render(
      <ConfigProvider>
        <TestComponent1 />
        <TestComponent2 />
      </ConfigProvider>,
    );

    const component1 = container.querySelector('[data-testid="component1"]');
    const component2 = container.querySelector('[data-testid="component2"]');

    expect(component1).toBeInTheDocument();
    expect(component2).toBeInTheDocument();
    // 相同prefix应该生成相同的hashId
    expect(component1?.textContent).toBe(component2?.textContent);
  });

  // 测试嵌套组件
  it('should work with nested components', () => {
    const NestedComponent = () => {
      const { wrapSSR, hashId } = useStyle('nested');
      return wrapSSR(
        <div data-testid="parent" className={hashId}>
          <div data-testid="child">Child Content</div>
        </div>,
      );
    };

    const { container } = render(
      <ConfigProvider>
        <NestedComponent />
      </ConfigProvider>,
    );

    const parent = container.querySelector('[data-testid="parent"]');
    const child = container.querySelector('[data-testid="child"]');

    expect(parent).toBeInTheDocument();
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Child Content');
  });

  // 测试动态prefix
  it('should handle dynamic prefix changes', () => {
    let currentPrefix = 'dynamic-1';

    const DynamicComponent = () => {
      const { wrapSSR, hashId } = useStyle(currentPrefix);
      return wrapSSR(<div data-testid="dynamic">{hashId}</div>);
    };

    const { container, rerender } = render(
      <ConfigProvider>
        <DynamicComponent />
      </ConfigProvider>,
    );

    const dynamicElement1 = container.querySelector('[data-testid="dynamic"]');
    const hashId1 = dynamicElement1?.textContent;

    // 改变prefix
    currentPrefix = 'dynamic-2';
    rerender(
      <ConfigProvider>
        <DynamicComponent />
      </ConfigProvider>,
    );

    const dynamicElement2 = container.querySelector('[data-testid="dynamic"]');
    const hashId2 = dynamicElement2?.textContent;

    expect(hashId1).toBeTruthy();
    expect(hashId2).toBeTruthy();
  });

  // 测试空wrapSSR调用
  it('should handle empty wrapSSR call', () => {
    const EmptyWrapComponent = () => {
      const { wrapSSR } = useStyle('empty-test');
      return wrapSSR(<div data-testid="empty-wrap"></div>);
    };

    const { container } = render(
      <ConfigProvider>
        <EmptyWrapComponent />
      </ConfigProvider>,
    );

    const emptyElement = container.querySelector('[data-testid="empty-wrap"]');
    expect(emptyElement).toBeInTheDocument();
  });

  // 测试复杂内容的wrapSSR
  it('should handle complex content in wrapSSR', () => {
    const ComplexChildComponent = () => {
      const { wrapSSR, hashId } = useStyle('complex-child');
      return wrapSSR(
        <div data-testid="complex-child">
          <span>Complex Child: {hashId}</span>
        </div>,
      );
    };

    const { container } = render(
      <ConfigProvider>
        <ComplexChildComponent />
      </ConfigProvider>,
    );

    const complexChildElement = container.querySelector(
      '[data-testid="complex-child"]',
    );
    expect(complexChildElement).toBeInTheDocument();
    expect(complexChildElement).toHaveTextContent(/Complex Child:/);
  });
});
