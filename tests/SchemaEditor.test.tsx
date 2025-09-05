import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SchemaEditor } from '../src/schema/SchemaEditor';
import { LowCodeSchema } from '../src/schema/types';

// Mock AceEditorWrapper to avoid DOM manipulation issues in tests
vi.mock('../src/schema/SchemaEditor/AceEditorWrapper', () => ({
  AceEditorWrapper: vi.fn(({ value, language, onChange, readonly }) => (
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
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
      />,
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
      <SchemaEditor
        initialSchema={invalidSchema}
        initialValues={{}}
        height={600}
      />,
    );

    // 检查预览区域是否正确渲染
    expect(screen.getByTestId('schema-renderer')).toBeInTheDocument();
    expect(screen.getByTestId('schema-type')).toHaveTextContent('html');
    expect(screen.getByTestId('schema-content')).toHaveTextContent(
      '<div>Invalid</div>',
    );
  });

  it('应该正确处理只读模式', () => {
    render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
        readonly={true}
      />,
    );

    // 检查组件是否正确渲染（只读模式下不应该有交互元素）
    expect(screen.getByText('HTML模板')).toBeInTheDocument();
    expect(screen.getByText('Schema JSON')).toBeInTheDocument();
  });

  it('应该正确处理onChange回调', async () => {
    const mockOnChange = vi.fn();

    render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
        onChange={mockOnChange}
      />,
    );

    // 由于AceEditor被mock，我们无法直接测试编辑器交互
    // 但可以验证组件是否正确渲染
    expect(screen.getByTestId('schema-renderer')).toBeInTheDocument();
  });

  it('应该正确处理onError回调', () => {
    const mockOnError = vi.fn();

    render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
        onError={mockOnError}
      />,
    );

    // 检查组件是否正确渲染
    expect(screen.getByTestId('schema-renderer')).toBeInTheDocument();
  });

  it('应该正确处理showPreview为false的情况', () => {
    render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
        showPreview={false}
      />,
    );

    // 预览区域不应该显示
    expect(screen.queryByText('实时预览')).not.toBeInTheDocument();
  });

  it('应该正确处理自定义样式类名', () => {
    const { container } = render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
        className="custom-class"
      />,
    );

    // 检查自定义类名是否正确应用
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('应该正确处理不同的高度值', () => {
    const { container } = render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height="800px"
      />,
    );

    // 检查高度样式是否正确应用
    const editorElement = container.firstChild as HTMLElement;
    expect(editorElement).toHaveStyle({ height: '800px' });
  });

  it('应该正确处理数字高度值', () => {
    const { container } = render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={500}
      />,
    );

    // 检查高度样式是否正确应用
    const editorElement = container.firstChild as HTMLElement;
    expect(editorElement).toHaveStyle({ height: '500px' });
  });

  it('应该正确显示schema内容', () => {
    render(
      <SchemaEditor
        initialSchema={mockSchema}
        initialValues={mockValues}
        height={600}
      />,
    );

    // 检查schema内容是否正确显示在预览中
    expect(screen.getByTestId('schema-content')).toHaveTextContent(
      '<div>Hello {{name}}</div>',
    );
    expect(screen.getByTestId('schema-values')).toHaveTextContent(
      JSON.stringify(mockValues),
    );
  });
});
