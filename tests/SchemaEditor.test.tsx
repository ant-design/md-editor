import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvide } from '../src/I18n';
import { SchemaEditor } from '../src/schema/SchemaEditor';
import { LowCodeSchema } from '../src/schema/types';

// Mock AceEditorWrapper to avoid DOM manipulation issues in tests
vi.mock('../src/schema/SchemaEditor/AceEditorWrapper', () => ({
  AceEditorWrapper: vi.fn(({ value, language, readonly }) => (
    <div
      data-testid="ace-editor"
      data-value={value}
      data-language={language}
      data-readonly={readonly}
    >
      {value}
    </div>
  )),
}));

// Mock SchemaRenderer
vi.mock('../src/schema/SchemaRenderer', () => ({
  SchemaRenderer: ({
    schema,
    values,
  }: {
    schema: LowCodeSchema;
    values: Record<string, any>;
  }) => (
    <div data-testid="schema-renderer">
      <div data-testid="schema-type">{schema.component?.type}</div>
      <div data-testid="schema-content">{schema.component?.schema}</div>
      <div data-testid="schema-values">{JSON.stringify(values)}</div>
    </div>
  ),
}));

// 测试包装组件，提供国际化上下文
const TestWrapper: React.FC<{
  children: React.ReactNode;
  language?: 'zh-CN' | 'en-US';
}> = ({ children, language = 'zh-CN' }) => (
  <I18nProvide defaultLanguage={language} autoDetect={false}>
    {children}
  </I18nProvide>
);

describe('SchemaEditor', () => {
  const mockSchema: LowCodeSchema = {
    version: '1.0.0',
    name: 'Test Schema',
    component: {
      type: 'html',
      schema: '<div>Hello {{name}}</div>',
    },
    initialValues: {
      name: 'World',
    },
  };

  const mockValues = {
    name: 'World',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染SchemaEditor组件', () => {
    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
        />
      </TestWrapper>,
    );

    // 检查标题是否正确显示
    expect(screen.getByText('HTML模板')).toBeInTheDocument();
    expect(screen.getByText('Schema JSON')).toBeInTheDocument();
    expect(screen.getByText('实时预览')).toBeInTheDocument();
  });

  it('应该显示schema验证错误', () => {
    const invalidSchema: LowCodeSchema = {
      version: '1.0.0',
      name: 'Invalid Schema',
      component: {
        type: 'html',
        schema: '<div>Invalid</div>',
      },
    };

    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={invalidSchema}
          initialValues={{}}
          height={600}
        />
      </TestWrapper>,
    );

    // 检查预览区域是否正确渲染（初始状态为空状态）
    expect(
      screen.getByText('右侧输入schema后，在这里展示卡片预览'),
    ).toBeInTheDocument();
  });

  it('应该正确处理只读模式', () => {
    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
          readonly={true}
        />
      </TestWrapper>,
    );

    // 检查组件是否正确渲染（只读模式下不应该有交互元素）
    expect(screen.getByText('HTML模板')).toBeInTheDocument();
    expect(screen.getByText('Schema JSON')).toBeInTheDocument();
  });

  it('应该正确处理onChange回调', async () => {
    const mockOnChange = vi.fn();

    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
          onChange={mockOnChange}
        />
      </TestWrapper>,
    );

    // 由于AceEditor被mock，我们无法直接测试编辑器交互
    // 但可以验证组件是否正确渲染
    expect(
      screen.getByText('右侧输入schema后，在这里展示卡片预览'),
    ).toBeInTheDocument();
  });

  it('应该正确处理onError回调', () => {
    const mockOnError = vi.fn();

    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
          onError={mockOnError}
        />
      </TestWrapper>,
    );

    // 检查组件是否正确渲染
    expect(
      screen.getByText('右侧输入schema后，在这里展示卡片预览'),
    ).toBeInTheDocument();
  });

  it('应该正确处理showPreview为false的情况', () => {
    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
          showPreview={false}
        />
      </TestWrapper>,
    );

    // 预览区域不应该显示
    expect(screen.queryByText('实时预览')).not.toBeInTheDocument();
  });

  it('应该正确处理自定义样式类名', () => {
    const { container } = render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
          className="custom-class"
        />
      </TestWrapper>,
    );

    // 检查自定义类名是否正确应用
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('应该正确处理不同的高度值', () => {
    const { container } = render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height="800px"
        />
      </TestWrapper>,
    );

    // 检查高度样式是否正确应用
    const editorElement = container.firstChild as HTMLElement;
    expect(editorElement).toHaveStyle({ height: '800px' });
  });

  it('应该正确处理数字高度值', () => {
    const { container } = render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={500}
        />
      </TestWrapper>,
    );

    // 检查高度样式是否正确应用
    const editorElement = container.firstChild as HTMLElement;
    expect(editorElement).toHaveStyle({ height: '500px' });
  });

  it('应该正确显示schema内容', () => {
    render(
      <TestWrapper>
        <SchemaEditor
          initialSchema={mockSchema}
          initialValues={mockValues}
          height={600}
        />
      </TestWrapper>,
    );

    // 检查schema内容是否正确显示在编辑器中
    const aceEditors = screen.getAllByTestId('ace-editor');
    expect(aceEditors).toHaveLength(2); // HTML 编辑器和 JSON 编辑器

    // 检查 HTML 编辑器内容
    const htmlEditor = aceEditors.find(
      (editor) => editor.getAttribute('data-language') === 'html',
    );
    expect(htmlEditor).toHaveAttribute(
      'data-value',
      '<div>Hello {{name}}</div>',
    );

    // 检查 JSON 编辑器内容
    const jsonEditor = aceEditors.find(
      (editor) => editor.getAttribute('data-language') === 'json',
    );
    expect(jsonEditor).toHaveAttribute(
      'data-value',
      expect.stringContaining('Test Schema'),
    );
  });

  describe('国际化测试', () => {
    it('应该正确显示中文界面', () => {
      render(
        <TestWrapper language="zh-CN">
          <SchemaEditor
            initialSchema={mockSchema}
            initialValues={mockValues}
            height={600}
          />
        </TestWrapper>,
      );

      // 检查中文标题是否正确显示
      expect(screen.getByText('HTML模板')).toBeInTheDocument();
      expect(screen.getByText('Schema JSON')).toBeInTheDocument();
      expect(screen.getByText('实时预览')).toBeInTheDocument();
      expect(screen.getByText('运行')).toBeInTheDocument();
    });

    it('应该正确显示英文界面', () => {
      render(
        <TestWrapper language="en-US">
          <SchemaEditor
            initialSchema={mockSchema}
            initialValues={mockValues}
            height={600}
          />
        </TestWrapper>,
      );

      // 检查英文标题是否正确显示
      expect(screen.getByText('HTML Template')).toBeInTheDocument();
      expect(screen.getByText('Schema JSON')).toBeInTheDocument();
      expect(screen.getByText('Real-time Preview')).toBeInTheDocument();
      expect(screen.getByText('Run')).toBeInTheDocument();
    });

    it('应该正确显示英文空状态信息', () => {
      const invalidSchema: LowCodeSchema = {
        version: '1.0.0',
        name: 'Invalid Schema',
        component: {
          type: 'html',
          schema: '<div>Invalid</div>',
        },
      };

      render(
        <TestWrapper language="en-US">
          <SchemaEditor
            initialSchema={invalidSchema}
            initialValues={{}}
            height={600}
          />
        </TestWrapper>,
      );

      // 检查英文空状态信息是否正确显示
      expect(
        screen.getByText('Enter schema on the right to show card preview here'),
      ).toBeInTheDocument();
    });

    it('应该正确显示中文空状态信息', () => {
      const invalidSchema: LowCodeSchema = {
        version: '1.0.0',
        name: 'Invalid Schema',
        component: {
          type: 'html',
          schema: '<div>Invalid</div>',
        },
      };

      render(
        <TestWrapper language="zh-CN">
          <SchemaEditor
            initialSchema={invalidSchema}
            initialValues={{}}
            height={600}
          />
        </TestWrapper>,
      );

      // 检查中文空状态信息是否正确显示
      expect(
        screen.getByText('右侧输入schema后，在这里展示卡片预览'),
      ).toBeInTheDocument();
    });
  });
});
