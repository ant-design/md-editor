/**
 * Schema 组件扩展测试文件
 * 测试新增的 BubbleConfigContext 使用和 apaasify.render 中 bubble 参数传递功能
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleConfigContext } from '../../../../src/Bubble/BubbleConfigProvide';
import { Schema } from '../../../../src/MarkdownEditor/editor/elements/Schema';
import { EditorStoreContext } from '../../../../src/MarkdownEditor/editor/store';
import { CodeNode } from '../../../../src/MarkdownEditor/el';

// Mock SchemaRenderer
vi.mock('../../../../src/schema', () => ({
  SchemaRenderer: ({
    schema,
    values,
    debug,
    fallbackContent,
    useDefaultValues,
  }: any) => (
    <div
      data-testid="schema-renderer"
      data-schema={JSON.stringify(schema)}
      data-values={JSON.stringify(values)}
      data-debug={String(debug)}
      data-fallback={String(fallbackContent)}
      data-default={String(useDefaultValues)}
    >
      Schema Renderer Content
    </div>
  ),
}));

describe('Schema - BubbleConfigContext 功能', () => {
  const mockElement: CodeNode = {
    type: 'code',
    language: 'json',
    children: [{ text: '' }],
    value: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    },
  };

  const mockAttributes = {
    'data-slate-node': 'element' as const,
    ref: vi.fn(),
  };

  const mockBubbleData = {
    placement: 'left' as const,
    originData: {
      content: 'Test bubble content',
      uuid: 12345,
      id: 'test-bubble',
      role: 'user' as const,
      createAt: Date.now(),
      updateAt: Date.now(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该在 apaasify.render 中传递 bubble 参数', () => {
    const mockApaasifyRender = vi.fn().mockReturnValue(
      <div data-testid="apaasify-rendered">
        <span data-testid="bubble-id">Bubble ID</span>
        <span data-testid="bubble-content">Bubble Content</span>
      </div>,
    );

    const mockEditorStore = {
      editorProps: {
        apaasify: {
          enable: true,
          render: mockApaasifyRender,
        },
      },
    };

    render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: mockBubbleData,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证 apaasify.render 被调用
    expect(mockApaasifyRender).toHaveBeenCalled();

    // 验证 render 函数接收到正确的参数
    const [propsArg, bubbleArg] = mockApaasifyRender.mock.calls[0];
    expect(propsArg).toBeDefined();
    expect(propsArg.element).toEqual(mockElement);
    expect(bubbleArg).toEqual(mockBubbleData);

    // 验证渲染结果
    expect(screen.getByTestId('apaasify-rendered')).toBeInTheDocument();
    expect(screen.getByTestId('bubble-id')).toBeInTheDocument();
    expect(screen.getByTestId('bubble-content')).toBeInTheDocument();
  });

  it('应该在没有 bubble context 时正常工作', () => {
    const mockApaasifyRender = vi
      .fn()
      .mockReturnValue(<div data-testid="apaasify-no-bubble">No Bubble</div>);

    const mockEditorStore = {
      editorProps: {
        apaasify: {
          enable: true,
          render: mockApaasifyRender,
        },
      },
    };

    render(
      <ConfigProvider>
        <EditorStoreContext.Provider value={mockEditorStore as any}>
          <Schema element={mockElement} attributes={mockAttributes}>
            {null}
          </Schema>
        </EditorStoreContext.Provider>
      </ConfigProvider>,
    );

    // 验证 render 函数被调用，bubble 参数为 undefined
    expect(mockApaasifyRender).toHaveBeenCalled();
    const [propsArg, bubbleArg] = mockApaasifyRender.mock.calls[0];
    expect(propsArg).toBeDefined();
    expect(bubbleArg).toBeUndefined();

    expect(screen.getByTestId('apaasify-no-bubble')).toBeInTheDocument();
  });

  it('应该支持 agentar-card 语言类型的特殊处理', () => {
    const cardElement: CodeNode = {
      ...mockElement,
      language: 'agentar-card',
      value: {
        type: 'form',
        properties: {
          title: { type: 'string', default: 'Test Card' },
        },
        initialValues: { title: 'Initial Title' },
      },
    };

    const mockEditorStore = {
      editorProps: {},
    };

    render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: mockBubbleData,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={cardElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证 agentar-card 的特殊容器
    expect(screen.getByTestId('agentar-card-container')).toBeInTheDocument();
    expect(screen.getByTestId('schema-renderer')).toBeInTheDocument();

    // 验证 SchemaRenderer 接收到正确的 props
    const schemaRenderer = screen.getByTestId('schema-renderer');
    expect(schemaRenderer).toHaveAttribute(
      'data-schema',
      JSON.stringify(cardElement.value),
    );
    expect(schemaRenderer).toHaveAttribute(
      'data-values',
      JSON.stringify(cardElement.value.initialValues),
    );
    expect(schemaRenderer).toHaveAttribute('data-debug', 'false');
    expect(schemaRenderer).toHaveAttribute('data-default', 'false');
  });

  it('应该在 bubble 数据变化时正确更新 apaasify.render', () => {
    const mockApaasifyRender = vi
      .fn()
      .mockReturnValue(
        <div data-testid="dynamic-apaasify">Dynamic Content</div>,
      );

    const mockEditorStore = {
      editorProps: {
        apaasify: {
          enable: true,
          render: mockApaasifyRender,
        },
      },
    };

    const initialBubble = {
      ...mockBubbleData,
      originData: {
        ...mockBubbleData.originData,
        content: 'Initial content',
        uuid: 111,
      },
    };

    const updatedBubble = {
      ...mockBubbleData,
      originData: {
        ...mockBubbleData.originData,
        content: 'Updated content',
        uuid: 222,
      },
    };

    const { rerender } = render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: initialBubble,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 初始调用
    expect(mockApaasifyRender).toHaveBeenCalledTimes(1);
    const [, initialBubbleArg] = mockApaasifyRender.mock.calls[0];
    expect(initialBubbleArg.originData.uuid).toBe(111);

    // 更新 bubble context
    rerender(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: updatedBubble,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证 render 函数被再次调用，且接收到更新的 bubble 数据
    expect(mockApaasifyRender).toHaveBeenCalledTimes(2);
    const [, updatedBubbleArg] = mockApaasifyRender.mock.calls[1];
    expect(updatedBubbleArg.originData.uuid).toBe(222);
  });

  it('应该兼容旧的 apassify 配置', () => {
    const mockApassifyRender = vi
      .fn()
      .mockReturnValue(<div data-testid="apassify-legacy">Legacy Content</div>);

    const mockEditorStore = {
      editorProps: {
        apassify: {
          enable: true,
          render: mockApassifyRender,
        },
      },
    };

    render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: mockBubbleData,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证 apassify (旧配置) 仍然工作
    expect(mockApassifyRender).toHaveBeenCalled();
    const [propsArg, bubbleArg] = mockApassifyRender.mock.calls[0];
    expect(propsArg).toBeDefined();
    expect(bubbleArg).toEqual(mockBubbleData);

    expect(screen.getByTestId('apassify-legacy')).toBeInTheDocument();
  });

  it('应该在 apaasify 未启用时使用默认渲染', () => {
    const mockEditorStore = {
      editorProps: {
        apaasify: {
          enable: false,
        },
      },
    };

    render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: false,
            locale: {} as any,
            bubble: mockBubbleData,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证使用默认的 schema 容器
    expect(screen.getByTestId('schema-container')).toBeInTheDocument();
    expect(screen.getByTestId('schema-clickable')).toBeInTheDocument();
    expect(screen.getByTestId('schema-hidden-children')).toBeInTheDocument();

    // 验证显示的是原始的 JSON 数据
    const schemaClickable = screen.getByTestId('schema-clickable');
    const actualContent = schemaClickable.textContent;
    const expectedContent = JSON.stringify(mockElement.value, null, 2);

    // 比较 JSON 内容，忽略格式差异
    expect(JSON.parse(actualContent || '{}')).toEqual(
      JSON.parse(expectedContent),
    );
  });

  it('应该正确处理复杂的 bubble 数据结构', () => {
    const complexBubbleData = {
      placement: 'right' as const,
      originData: {
        content: 'Complex content with **markdown**',
        uuid: 99999,
        id: 'complex-bubble',
        role: 'assistant' as const,
        createAt: Date.now(),
        updateAt: Date.now(),
        meta: {
          source: 'test',
          confidence: 0.95,
        },
        extra: {
          attachments: ['file1.pdf', 'file2.png'],
        },
      },
      avatar: {
        title: 'AI Assistant',
        name: 'Assistant',
        avatar: 'assistant-avatar.png',
      },
    };

    const mockApaasifyRender = vi.fn().mockReturnValue(
      <div data-testid="complex-apaasify">
        <span data-testid="bubble-meta">
          {JSON.stringify(complexBubbleData.originData.meta)}
        </span>
      </div>,
    );

    const mockEditorStore = {
      editorProps: {
        apaasify: {
          enable: true,
          render: mockApaasifyRender,
        },
      },
    };

    render(
      <ConfigProvider>
        <BubbleConfigContext.Provider
          value={{
            standalone: true,
            locale: {} as any,
            bubble: complexBubbleData,
          }}
        >
          <EditorStoreContext.Provider value={mockEditorStore as any}>
            <Schema element={mockElement} attributes={mockAttributes}>
              {null}
            </Schema>
          </EditorStoreContext.Provider>
        </BubbleConfigContext.Provider>
      </ConfigProvider>,
    );

    // 验证复杂数据结构被正确传递
    expect(mockApaasifyRender).toHaveBeenCalled();
    const [, bubbleArg] = mockApaasifyRender.mock.calls[0];
    expect(bubbleArg).toEqual(complexBubbleData);
    expect(bubbleArg.originData.meta).toEqual({
      source: 'test',
      confidence: 0.95,
    });

    expect(screen.getByTestId('complex-apaasify')).toBeInTheDocument();
  });
});
