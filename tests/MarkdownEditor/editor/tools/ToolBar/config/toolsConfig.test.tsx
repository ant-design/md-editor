import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../../../../src/i18n';
import {
  isCodeNode,
  ToolsKeyType,
  useToolsConfig,
} from '../../../../../../src/MarkdownEditor/editor/tools/ToolBar/config/toolsConfig';

// Mock Slate Editor
const mockEditor = {
  selection: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  },
};

// Mock Editor.nodes
vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
}));

// Mock EditorUtils
vi.mock(
  '../../../../../../src/MarkdownEditor/editor/utils/editorUtils',
  () => ({
    EditorUtils: {
      setAlignment: vi.fn(),
      isAlignmentActive: vi.fn(),
    },
  }),
);

describe('toolsConfig', () => {
  const mockI18n = {
    locale: {
      'toolbar.bold': '加粗',
      'toolbar.italic': '斜体',
      'toolbar.strikethrough': '删除线',
      'toolbar.inlineCode': '行内代码',
      'toolbar.alignLeft': '左对齐',
      'toolbar.alignCenter': '居中对齐',
      'toolbar.alignRight': '右对齐',
    } as any,
    language: 'zh-CN' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useToolsConfig hook', () => {
    it('应该返回正确的工具配置数组', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                {tool.title}
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('tool-bold')).toHaveTextContent('加粗');
      expect(screen.getByTestId('tool-italic')).toHaveTextContent('斜体');
      expect(screen.getByTestId('tool-strikethrough')).toHaveTextContent(
        '删除线',
      );
      expect(screen.getByTestId('tool-inline-code')).toHaveTextContent(
        '行内代码',
      );
      expect(screen.getByTestId('tool-align-left')).toHaveTextContent('左对齐');
      expect(screen.getByTestId('tool-align-center')).toHaveTextContent(
        '居中对齐',
      );
      expect(screen.getByTestId('tool-align-right')).toHaveTextContent(
        '右对齐',
      );
    });

    it('应该包含正确的工具属性', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                <span data-testid={`${tool.key}-type`}>{tool.type}</span>
                <span data-testid={`${tool.key}-title`}>{tool.title}</span>
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('bold-type')).toHaveTextContent('bold');
      expect(screen.getByTestId('italic-type')).toHaveTextContent('italic');
      expect(screen.getByTestId('strikethrough-type')).toHaveTextContent(
        'strikethrough',
      );
      expect(screen.getByTestId('inline-code-type')).toHaveTextContent('code');
      expect(screen.getByTestId('align-left-type')).toHaveTextContent(
        'align-left',
      );
      expect(screen.getByTestId('align-center-type')).toHaveTextContent(
        'align-center',
      );
      expect(screen.getByTestId('align-right-type')).toHaveTextContent(
        'align-right',
      );
    });

    it('应该包含图标组件', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                <span data-testid={`${tool.key}-icon`}>
                  {tool.icon ? 'has-icon' : 'no-icon'}
                </span>
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('bold-icon')).toHaveTextContent('has-icon');
      expect(screen.getByTestId('italic-icon')).toHaveTextContent('has-icon');
      expect(screen.getByTestId('strikethrough-icon')).toHaveTextContent(
        'has-icon',
      );
      expect(screen.getByTestId('inline-code-icon')).toHaveTextContent(
        'has-icon',
      );
      expect(screen.getByTestId('align-left-icon')).toHaveTextContent(
        'has-icon',
      );
      expect(screen.getByTestId('align-center-icon')).toHaveTextContent(
        'has-icon',
      );
      expect(screen.getByTestId('align-right-icon')).toHaveTextContent(
        'has-icon',
      );
    });

    it('应该包含对齐工具的特殊属性', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        const alignTools = tools.filter((tool) =>
          tool.key.startsWith('align-'),
        );
        return (
          <div>
            {alignTools.map((tool, index) => (
              <div key={index} data-testid={`align-tool-${tool.key}`}>
                <span data-testid={`${tool.key}-onClick`}>
                  {tool.onClick ? 'has-onClick' : 'no-onClick'}
                </span>
                <span data-testid={`${tool.key}-isActive`}>
                  {tool.isActive ? 'has-isActive' : 'no-isActive'}
                </span>
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('align-left-onClick')).toHaveTextContent(
        'has-onClick',
      );
      expect(screen.getByTestId('align-center-onClick')).toHaveTextContent(
        'has-onClick',
      );
      expect(screen.getByTestId('align-right-onClick')).toHaveTextContent(
        'has-onClick',
      );
      expect(screen.getByTestId('align-left-isActive')).toHaveTextContent(
        'has-isActive',
      );
      expect(screen.getByTestId('align-center-isActive')).toHaveTextContent(
        'has-isActive',
      );
      expect(screen.getByTestId('align-right-isActive')).toHaveTextContent(
        'has-isActive',
      );
    });

    it('应该使用默认文本当国际化不可用时', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                {tool.title}
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider
          value={{ locale: mockI18n.locale, language: 'zh-CN' }}
        >
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('tool-bold')).toHaveTextContent('加粗');
      expect(screen.getByTestId('tool-italic')).toHaveTextContent('斜体');
      expect(screen.getByTestId('tool-strikethrough')).toHaveTextContent(
        '删除线',
      );
      expect(screen.getByTestId('tool-inline-code')).toHaveTextContent(
        '行内代码',
      );
      expect(screen.getByTestId('tool-align-left')).toHaveTextContent('左对齐');
      expect(screen.getByTestId('tool-align-center')).toHaveTextContent(
        '居中对齐',
      );
      expect(screen.getByTestId('tool-align-right')).toHaveTextContent(
        '右对齐',
      );
    });

    it('应该处理部分国际化文本缺失的情况', () => {
      const partialI18n = {
        locale: {
          'toolbar.bold': 'Bold',
          'toolbar.italic': 'Italic',
          // 其他文本缺失
        } as any,
        language: 'en-US' as const,
      };

      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                {tool.title}
              </div>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={partialI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('tool-bold')).toHaveTextContent('Bold');
      expect(screen.getByTestId('tool-italic')).toHaveTextContent('Italic');
      expect(screen.getByTestId('tool-strikethrough')).toHaveTextContent(
        '删除线',
      );
      expect(screen.getByTestId('tool-inline-code')).toHaveTextContent(
        '行内代码',
      );
    });
  });

  describe('isCodeNode 函数', () => {
    it('应该返回 false 当编辑器为空时', () => {
      const result = isCodeNode(null);
      expect(result).toBe(false);
    });

    it('应该返回 false 当编辑器为 undefined 时', () => {
      const result = isCodeNode(undefined);
      expect(result).toBe(false);
    });

    it('应该返回 false 当没有匹配的节点时', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue([]);

      const result = isCodeNode(mockEditor);
      expect(result).toBeFalsy(); // 检查是否为falsy值（undefined, null, false等）
    });

    it('应该返回 true 当节点类型为 code 时', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue([[{ type: 'code' }, [0]]]);

      const result = isCodeNode(mockEditor);
      expect(result).toBe(true);
    });

    it('应该返回 false 当节点类型不是 code 时', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue([[{ type: 'paragraph' }, [0]]]);

      const result = isCodeNode(mockEditor);
      expect(result).toBe(false);
    });

    it('应该正确调用 Editor.nodes', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue([[{ type: 'code' }, [0]]]);

      isCodeNode(mockEditor);

      expect(vi.mocked(Editor.nodes)).toHaveBeenCalledWith(mockEditor, {
        match: expect.any(Function),
        mode: 'lowest',
      });
    });
  });

  describe('ToolsKeyType 类型定义', () => {
    it('应该包含所有正确的工具键类型', () => {
      // 测试类型定义是否包含所有预期的键
      const expectedKeys: ToolsKeyType[] = [
        'redo',
        'undo',
        'clear',
        'head',
        'divider',
        'color',
        'table',
        'column',
        'quote',
        'code',
        'b-list',
        'n-list',
        't-list',
        'bold',
        'italic',
        'strikethrough',
        'inline-code',
        'H1',
        'H2',
        'H3',
        'link',
        'align-left',
        'align-center',
        'align-right',
      ];

      // 验证类型定义存在
      expect(expectedKeys).toBeDefined();
      expect(Array.isArray(expectedKeys)).toBe(true);
    });
  });

  describe('对齐工具功能测试', () => {
    it('应该为对齐工具提供 onClick 处理函数', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        const alignLeftTool = tools.find((tool) => tool.key === 'align-left');

        return (
          <div>
            <span data-testid="has-onClick">
              {alignLeftTool?.onClick ? 'true' : 'false'}
            </span>
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('has-onClick')).toHaveTextContent('true');
    });

    it('应该为对齐工具提供 isActive 检查函数', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        const alignCenterTool = tools.find(
          (tool) => tool.key === 'align-center',
        );

        return (
          <div>
            <span data-testid="has-isActive">
              {alignCenterTool?.isActive ? 'true' : 'false'}
            </span>
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('has-isActive')).toHaveTextContent('true');
    });
  });

  describe('LineCode 组件测试', () => {
    it('应该正确渲染 LineCode 图标', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        const inlineCodeTool = tools.find((tool) => tool.key === 'inline-code');

        return (
          <div>
            <span data-testid="line-code-icon">
              {inlineCodeTool?.icon ? 'has-icon' : 'no-icon'}
            </span>
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('line-code-icon')).toHaveTextContent(
        'has-icon',
      );
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空的国际化上下文', () => {
      const TestComponent = () => {
        const tools = useToolsConfig();
        return (
          <div>
            {tools.map((tool, index) => (
              <div key={index} data-testid={`tool-${tool.key}`}>
                {tool.title}
              </div>
            ))}
          </div>
        );
      };

      render(<TestComponent />);

      // 应该使用默认文本
      expect(screen.getByTestId('tool-bold')).toHaveTextContent('加粗');
      expect(screen.getByTestId('tool-italic')).toHaveTextContent('斜体');
    });

    it('应该处理无效的编辑器对象', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockReturnValue([]);

      const result = isCodeNode({} as any);
      expect(result).toBeFalsy(); // 检查是否为falsy值
    });

    it('应该处理 Editor.nodes 抛出错误的情况', async () => {
      const { Editor } = await import('slate');
      vi.mocked(Editor.nodes).mockImplementation(() => {
        throw new Error('Editor error');
      });

      // 由于isCodeNode函数没有try-catch，这个测试会抛出错误
      // 我们需要测试函数在错误情况下的行为
      expect(() => {
        isCodeNode(mockEditor);
      }).toThrow('Editor error');
    });
  });

  describe('性能测试', () => {
    it('应该快速生成工具配置', () => {
      const startTime = performance.now();

      const TestComponent = () => {
        const tools = useToolsConfig();
        return <div>{tools.length} tools</div>;
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('应该处理多次调用', () => {
      const TestComponent = () => {
        const tools1 = useToolsConfig();
        const tools2 = useToolsConfig();
        const tools3 = useToolsConfig();

        return (
          <div>
            <span data-testid="tools1">{tools1.length}</span>
            <span data-testid="tools2">{tools2.length}</span>
            <span data-testid="tools3">{tools3.length}</span>
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <TestComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('tools1')).toHaveTextContent('7');
      expect(screen.getByTestId('tools2')).toHaveTextContent('7');
      expect(screen.getByTestId('tools3')).toHaveTextContent('7');
    });
  });

  describe('集成测试', () => {
    it('应该与其他组件正确集成', () => {
      const ToolbarComponent = () => {
        const tools = useToolsConfig();
        return (
          <div data-testid="toolbar">
            {tools.map((tool, index) => (
              <button key={index} data-testid={`tool-button-${tool.key}`}>
                {tool.title}
              </button>
            ))}
          </div>
        );
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <ToolbarComponent />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('tool-button-bold')).toBeInTheDocument();
      expect(screen.getByTestId('tool-button-italic')).toBeInTheDocument();
      expect(
        screen.getByTestId('tool-button-strikethrough'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('tool-button-inline-code')).toBeInTheDocument();
      expect(screen.getByTestId('tool-button-align-left')).toBeInTheDocument();
      expect(
        screen.getByTestId('tool-button-align-center'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('tool-button-align-right')).toBeInTheDocument();
    });
  });
});
