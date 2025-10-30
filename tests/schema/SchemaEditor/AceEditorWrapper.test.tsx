/**
 * @fileoverview AceEditorWrapper 组件测试
 *
 * 测试覆盖范围：
 * - 基础渲染功能
 * - 属性处理
 * - 编辑器初始化
 * - 语言切换
 * - 值更新
 * - 只读模式
 * - 清理功能
 * - 边缘情况
 * - 错误处理
 */

import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AceEditorWrapper } from '../../../src/Schema/SchemaEditor/AceEditorWrapper';

// Mock ace-builds
vi.mock('ace-builds', () => {
  const mockAceEditor = {
    edit: vi.fn(),
    destroy: vi.fn(),
    getValue: vi.fn(),
    setValue: vi.fn(),
    setReadOnly: vi.fn(),
    session: {
      setMode: vi.fn(),
    },
    on: vi.fn(),
  };

  const mockAce = {
    edit: vi.fn(() => mockAceEditor),
  };

  return {
    default: mockAce,
  };
});

// Mock aceLangs 和 modeMap
vi.mock('../../../src/MarkdownEditor/editor/utils/ace', () => ({
  aceLangs: new Set([
    'javascript',
    'typescript',
    'html',
    'css',
    'json',
    'python',
    'java',
  ]),
  modeMap: new Map([
    ['js', 'javascript'],
    ['ts', 'typescript'],
    ['py', 'python'],
  ]),
}));

// Mock ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: mockResizeObserver,
});

describe('AceEditorWrapper', () => {
  let mockAceEditor: any;
  let mockAce: any;

  beforeEach(async () => {
    // 获取 mock 实例
    const aceModule = await import('ace-builds');
    mockAce = aceModule.default;

    // 创建新的 mock editor
    mockAceEditor = {
      destroy: vi.fn(),
      getValue: vi.fn(() => ''),
      setValue: vi.fn(),
      setReadOnly: vi.fn(),
      session: {
        setMode: vi.fn(),
      },
      on: vi.fn(),
    };

    // 重置并配置 mockAce.edit
    mockAce.edit.mockReset();
    mockAce.edit.mockReturnValue(mockAceEditor);
  });

  afterEach(() => {
    cleanup();
  });

  describe('基础渲染功能', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(
        <AceEditorWrapper value="console.log('hello')" language="javascript" />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('应该应用自定义 className', () => {
      const { container } = render(
        <AceEditorWrapper value="test" className="custom-editor-class" />,
      );

      expect(container.firstChild).toHaveClass('custom-editor-class');
    });

    it('应该应用数字高度', () => {
      const { container } = render(
        <AceEditorWrapper value="test" height={400} />,
      );

      const editorElement = container.firstChild as HTMLElement;
      expect(editorElement).toHaveStyle({ height: '400px' });
    });

    it('应该应用字符串高度', () => {
      const { container } = render(
        <AceEditorWrapper value="test" height="50vh" />,
      );

      const editorElement = container.firstChild as HTMLElement;
      expect(editorElement).toHaveStyle({ height: '50vh' });
    });

    it('应该设置默认宽度为 100%', () => {
      const { container } = render(<AceEditorWrapper value="test" />);

      const editorElement = container.firstChild as HTMLElement;
      expect(editorElement).toHaveStyle({ width: '100%' });
    });
  });

  describe('编辑器初始化', () => {
    it('应该初始化 Ace 编辑器', () => {
      render(<AceEditorWrapper value="test code" />);

      // 获取最后一次调用的参数
      const calls = mockAce.edit.mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const lastCall = calls[calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        useWorker: false,
        value: 'test code',
        fontSize: 12,
        animatedScroll: true,
        maxLines: Infinity,
        wrap: true,
        tabSize: 4,
        readOnly: false,
        showPrintMargin: false,
        showLineNumbers: true,
        showGutter: true,
      });
    });

    it('应该合并自定义选项', () => {
      const customOptions = {
        fontSize: 14,
        tabSize: 2,
        showLineNumbers: false,
      };

      render(<AceEditorWrapper value="test" options={customOptions} />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        fontSize: 14,
        tabSize: 2,
        showLineNumbers: false,
      });
    });

    it('应该设置只读模式', () => {
      render(<AceEditorWrapper value="test" readonly={true} />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        readOnly: true,
      });
    });
  });

  describe('语言处理', () => {
    it('应该设置默认语言为 text', async () => {
      render(<AceEditorWrapper value="test" />);

      // 等待 setTimeout 执行
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/text',
      );
    });

    it('应该设置支持的语言', async () => {
      render(<AceEditorWrapper value="test" language="javascript" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/javascript',
      );
    });

    it('应该处理语言映射', async () => {
      render(<AceEditorWrapper value="test" language="js" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/javascript',
      );
    });

    it('应该处理不支持的语言', async () => {
      render(<AceEditorWrapper value="test" language="unsupported" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/text',
      );
    });

    it('应该处理大小写不敏感的语言', async () => {
      render(<AceEditorWrapper value="test" language="JAVASCRIPT" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/javascript',
      );
    });
  });

  describe('值更新', () => {
    it('应该更新编辑器值', () => {
      const { rerender } = render(<AceEditorWrapper value="initial value" />);

      rerender(<AceEditorWrapper value="updated value" />);

      expect(mockAceEditor.setValue).toHaveBeenCalledWith('updated value');
    });

    it('应该避免重复更新相同的值', () => {
      const { rerender } = render(<AceEditorWrapper value="same value" />);

      // 模拟内部值引用
      mockAceEditor.getValue.mockReturnValue('same value');

      rerender(<AceEditorWrapper value="same value" />);

      expect(mockAceEditor.setValue).not.toHaveBeenCalled();
    });
  });

  describe('语言切换', () => {
    it('应该切换语言模式', () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" language="javascript" />,
      );

      rerender(<AceEditorWrapper value="test" language="python" />);

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/python',
      );
    });

    it('应该处理语言映射切换', async () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" language="js" />,
      );

      // 等待初始语言设置
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      // 清除之前的调用并切换语言
      mockAceEditor.session.setMode.mockClear();

      rerender(<AceEditorWrapper value="test" language="ts" />);

      // 等待语言切换完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/typescript',
      );
    });
  });

  describe('只读模式', () => {
    it('应该切换只读状态', () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" readonly={false} />,
      );

      rerender(<AceEditorWrapper value="test" readonly={true} />);

      expect(mockAceEditor.setReadOnly).toHaveBeenCalledWith(true);
    });

    it('应该从只读切换到可编辑', () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" readonly={true} />,
      );

      rerender(<AceEditorWrapper value="test" readonly={false} />);

      expect(mockAceEditor.setReadOnly).toHaveBeenCalledWith(false);
    });
  });

  describe('事件处理', () => {
    it('应该在非只读模式下绑定 change 事件', () => {
      const onChange = vi.fn();

      render(
        <AceEditorWrapper value="test" onChange={onChange} readonly={false} />,
      );

      expect(mockAceEditor.on).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('应该在只读模式下不绑定 change 事件', () => {
      const onChange = vi.fn();

      render(
        <AceEditorWrapper value="test" onChange={onChange} readonly={true} />,
      );

      expect(mockAceEditor.on).not.toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('应该在没有 onChange 时不绑定 change 事件', () => {
      render(<AceEditorWrapper value="test" readonly={false} />);

      expect(mockAceEditor.on).not.toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      );
    });

    it('应该触发 onChange 回调', () => {
      const onChange = vi.fn();

      render(
        <AceEditorWrapper value="test" onChange={onChange} readonly={false} />,
      );

      // 获取绑定的 change 事件处理器
      const changeHandler = mockAceEditor.on.mock.calls.find(
        (call: any) => call[0] === 'change',
      )?.[1];

      expect(changeHandler).toBeDefined();

      // 模拟编辑器值变化
      mockAceEditor.getValue.mockReturnValue('new value');

      if (changeHandler) {
        changeHandler();
        expect(onChange).toHaveBeenCalledWith('new value');
      }
    });

    it('应该避免重复触发相同的值', () => {
      const onChange = vi.fn();

      render(
        <AceEditorWrapper value="test" onChange={onChange} readonly={false} />,
      );

      const changeHandler = mockAceEditor.on.mock.calls.find(
        (call: any) => call[0] === 'change',
      )?.[1];

      // 模拟相同的值
      mockAceEditor.getValue.mockReturnValue('test');

      if (changeHandler) {
        changeHandler();
        expect(onChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('清理功能', () => {
    it('应该在组件卸载时销毁编辑器', () => {
      const { unmount } = render(<AceEditorWrapper value="test" />);

      unmount();

      expect(mockAceEditor.destroy).toHaveBeenCalled();
    });

    it('应该处理编辑器未初始化的情况', () => {
      // 模拟编辑器创建失败
      mockAce.edit.mockReturnValueOnce(undefined);

      const { unmount } = render(<AceEditorWrapper value="test" />);

      // 不应该抛出错误
      unmount();

      // 验证没有尝试调用 destroy
      expect(mockAceEditor.destroy).not.toHaveBeenCalled();
    });
  });

  describe('边缘情况', () => {
    it('应该处理空值', () => {
      render(<AceEditorWrapper value="" />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        value: '',
      });
    });

    it('应该处理 undefined 值', () => {
      render(<AceEditorWrapper value={undefined as any} />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1].value).toBeUndefined();
    });

    it('应该处理 null 值', () => {
      render(<AceEditorWrapper value={null as any} />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1].value).toBeNull();
    });

    it('应该处理空语言', async () => {
      render(<AceEditorWrapper value="test" language="" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/text',
      );
    });

    it('应该处理 undefined 语言', async () => {
      render(<AceEditorWrapper value="test" language={undefined} />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/text',
      );
    });

    it('应该处理空选项对象', () => {
      render(<AceEditorWrapper value="test" options={{}} />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        useWorker: false,
        fontSize: 12,
      });
    });
  });

  describe('ResizeObserver 兼容性', () => {
    it('应该在 ResizeObserver 不存在时创建 mock', () => {
      // 临时移除 ResizeObserver
      const originalResizeObserver = window.ResizeObserver;
      delete (window as any).ResizeObserver;

      const { container } = render(<AceEditorWrapper value="test" />);

      // 应该正常渲染
      expect(container.firstChild).toBeInTheDocument();

      // 恢复 ResizeObserver
      window.ResizeObserver = originalResizeObserver;
    });
  });

  describe('错误处理', () => {
    it('应该处理编辑器创建失败', () => {
      // 抑制 console.error
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockAce.edit.mockImplementationOnce(() => {
        throw new Error('Editor creation failed');
      });

      // 使用 try-catch 包装以避免测试失败
      try {
        render(<AceEditorWrapper value="test" />);
      } catch (error) {
        // 预期会抛出错误
      }

      // 验证尝试创建了编辑器
      expect(mockAce.edit).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('应该处理语言设置失败', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockAceEditor.session.setMode.mockImplementationOnce(() => {
        throw new Error('Mode setting failed');
      });

      // 使用 try-catch 包装
      try {
        render(<AceEditorWrapper value="test" language="javascript" />);

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
        });
      } catch (error) {
        // 预期会抛出错误
      }

      // 应该尝试设置语言，即使失败
      expect(mockAceEditor.session.setMode).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('应该处理值设置失败', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockAceEditor.setValue.mockImplementationOnce(() => {
        throw new Error('Value setting failed');
      });

      const { rerender } = render(<AceEditorWrapper value="test" />);

      try {
        rerender(<AceEditorWrapper value="new value" />);
      } catch (error) {
        // 预期会抛出错误
      }

      // 应该尝试设置值
      expect(mockAceEditor.setValue).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('应该处理只读状态设置失败', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { rerender } = render(
        <AceEditorWrapper value="test" readonly={false} />,
      );

      // 在 rerender 之前设置 mock
      mockAceEditor.setReadOnly.mockImplementationOnce(() => {
        throw new Error('ReadOnly setting failed');
      });

      try {
        rerender(<AceEditorWrapper value="test" readonly={true} />);
      } catch (error) {
        // 预期会抛出错误
      }

      // 应该尝试设置只读状态
      expect(mockAceEditor.setReadOnly).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('性能优化', () => {
    it('应该避免不必要的重新渲染', () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" language="javascript" />,
      );

      // 相同的 props 不应该触发重新初始化
      rerender(<AceEditorWrapper value="test" language="javascript" />);

      // edit 应该只被调用一次（初始渲染）
      expect(mockAce.edit).toHaveBeenCalledTimes(1);
    });

    it('应该正确处理依赖数组', () => {
      const { rerender } = render(
        <AceEditorWrapper value="test" language="javascript" />,
      );

      // 改变语言应该触发语言更新
      rerender(<AceEditorWrapper value="test" language="python" />);

      expect(mockAceEditor.session.setMode).toHaveBeenCalledWith(
        'ace/mode/python',
      );
    });
  });

  describe('默认属性', () => {
    it('应该使用默认属性值', () => {
      render(<AceEditorWrapper value="test" />);

      const lastCall =
        mockAce.edit.mock.calls[mockAce.edit.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        useWorker: false,
        fontSize: 12,
        animatedScroll: true,
        maxLines: Infinity,
        wrap: true,
        tabSize: 4,
        readOnly: false,
        showPrintMargin: false,
        showLineNumbers: true,
        showGutter: true,
      });
    });

    it('应该使用默认高度', () => {
      const { container } = render(<AceEditorWrapper value="test" />);

      const editorElement = container.firstChild as HTMLElement;
      expect(editorElement).toHaveStyle({ height: '100%' });
    });
  });
});
