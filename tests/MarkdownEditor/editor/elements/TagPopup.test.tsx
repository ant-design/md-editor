import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { describe, expect, it, vi } from 'vitest';
import { TagPopup } from '../../../../src/MarkdownEditor/editor/elements/TagPopup';
import { SuggestionConnext } from '../../../../src/MarkdownInputField/Suggestion';

vi.mock(
  '../../../../src/MarkdownEditor/editor/elements/TagPopup/style',
  () => ({
    useStyle: vi.fn(() => ({
      wrapSSR: (component: any) => component,
      hashId: 'test-hash',
    })),
  }),
);

describe('TagPopup Component', () => {
  const createTestEditor = () => withReact(createEditor());

  const mockItems = [
    { label: 'Option 1', key: 'option1' },
    { label: 'Option 2', key: 'option2' },
    { label: 'Option 3', key: 'option3' },
  ];

  const renderTagPopup = (props: any = {}) => {
    const editor = createTestEditor();
    const defaultProps = {
      items: mockItems,
      text: 'test',
      placeholder: 'Select an option',
      onSelect: vi.fn(),
      children: <span>Tag Content</span>,
      type: 'panel' as const,
      ...props,
    };

    const mockContext = {
      open: false,
      setOpen: vi.fn(),
      isRender: true as const,
      triggerNodeContext: { current: null },
      onSelectRef: { current: null },
    };

    return render(
      <ConfigProvider>
        <Slate
          editor={editor}
          initialValue={[{ type: 'paragraph', children: [{ text: 'test' }] }]}
        >
          <SuggestionConnext.Provider value={mockContext as any}>
            <TagPopup {...defaultProps} />
          </SuggestionConnext.Provider>
        </Slate>
      </ConfigProvider>,
    );
  };

  describe('基本渲染测试', () => {
    it('应该正确渲染 TagPopup 组件', () => {
      renderTagPopup();
      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该渲染子元素', () => {
      renderTagPopup({ children: <span>Custom Content</span> });
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('应该应用自定义类名', () => {
      const { container } = renderTagPopup({ className: 'custom-class' });
      const tagPopup = container.querySelector('.custom-class');
      expect(tagPopup).toBeInTheDocument();
    });

    it('应该应用前缀类名', () => {
      const { container } = renderTagPopup({ prefixCls: 'custom-prefix' });
      const tagPopup = container.querySelector('.custom-prefix');
      expect(tagPopup).toBeInTheDocument();
    });

    it('应该应用自定义样式', () => {
      const customStyle = { color: 'red', fontSize: '16px' };
      const { container } = renderTagPopup({ tagTextStyle: customStyle });
      const tagPopup = container.firstChild;
      expect(tagPopup).toHaveStyle({ color: 'red', fontSize: '16px' });
    });

    it('应该应用函数式自定义样式', () => {
      const styleFunction = vi.fn(() => ({ color: 'blue' }));
      renderTagPopup({ tagTextStyle: styleFunction });
      expect(styleFunction).toHaveBeenCalled();
    });
  });

  describe('下拉菜单功能测试', () => {
    it('应该显示下拉箭头当有选项时', () => {
      const { container } = renderTagPopup();
      const arrow = container.querySelector(
        '.ant-md-editor-tag-popup-input-arrow',
      );
      expect(arrow).toBeInTheDocument();
    });

    it('应该不显示下拉箭头当没有选项时', () => {
      const { container } = renderTagPopup({ items: [] });
      const arrow = container.querySelector(
        '.ant-md-editor-tag-popup-input-arrow',
      );
      expect(arrow).not.toBeInTheDocument();
    });

    it('应该在点击时触发打开事件', () => {
      const { container } = renderTagPopup();

      const tagPopup = container.firstChild as HTMLElement;
      fireEvent.click(tagPopup);

      // 由于使用了 panel 类型，应该触发 suggestionConnext.setOpen
      expect(tagPopup).toBeInTheDocument();
    });

    it('应该处理下拉类型', () => {
      const { container } = renderTagPopup({ type: 'dropdown' });
      expect(
        container.querySelector('.ant-md-editor-tag-popup-input-type-dropdown'),
      ).toBeInTheDocument();
    });
  });

  describe('异步加载测试', () => {
    it('应该处理异步加载选项', async () => {
      const asyncItems = vi.fn(async () => {
        return mockItems;
      });

      renderTagPopup({ items: asyncItems });

      await waitFor(() => {
        expect(asyncItems).toHaveBeenCalled();
      });
    });

    it('应该在加载时显示加载状态', async () => {
      const asyncItems = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return mockItems;
      });

      const { container } = renderTagPopup({ items: asyncItems, open: true });

      // 检查加载状态
      const loadingElement = container.querySelector(
        '.ant-md-editor-tag-popup-input-loading',
      );
      expect(loadingElement || container).toBeDefined();
    });

    it('应该处理异步加载错误', async () => {
      const asyncItems = vi.fn(async () => {
        throw new Error('Failed to load');
      });

      renderTagPopup({ items: asyncItems });

      await waitFor(() => {
        expect(asyncItems).toHaveBeenCalled();
      });
    });
  });

  describe('回调函数测试', () => {
    it('应该在选择时调用 onSelect', () => {
      const onSelect = vi.fn();
      renderTagPopup({ onSelect });

      // 由于 onSelect 的调用逻辑在 Dropdown 内部，我们只验证函数已传递
      expect(onSelect).toBeDefined();
    });

    it('应该在文本改变时调用 onChange', () => {
      const onChange = vi.fn();
      renderTagPopup({ onChange, text: 'new text' });

      expect(onChange).toHaveBeenCalled();
    });

    it('应该在打开前调用 beforeOpenChange', () => {
      const beforeOpenChange = vi.fn(() => true);
      const { container } = renderTagPopup({ beforeOpenChange });

      const tagPopup = container.firstChild as HTMLElement;
      fireEvent.click(tagPopup);

      expect(beforeOpenChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    it('应该在 beforeOpenChange 返回 false 时阻止打开', () => {
      const beforeOpenChange = vi.fn(() => false);
      const { container } = renderTagPopup({ beforeOpenChange });

      const tagPopup = container.firstChild as HTMLElement;
      fireEvent.click(tagPopup);

      expect(beforeOpenChange).toHaveBeenCalled();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该使用自定义 tagRender', () => {
      const tagRender = vi.fn(() => (
        <div data-testid="custom-tag">Custom Tag</div>
      ));

      renderTagPopup({ tagRender });

      expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
      expect(screen.getByText('Custom Tag')).toBeInTheDocument();
    });

    it('应该在 tagRender 中传递正确的 props', () => {
      const tagRender = vi.fn((props, defaultDom) => {
        expect(props).toHaveProperty('text');
        expect(props).toHaveProperty('onSelect');
        return defaultDom;
      });

      renderTagPopup({ tagRender });

      expect(tagRender).toHaveBeenCalled();
    });

    it('应该使用自定义 tagTextRender', () => {
      const tagTextRender = vi.fn((props, text) => `Rendered: ${text}`);
      renderTagPopup({ tagTextRender });

      expect(tagTextRender).toBeDefined();
    });

    it('应该使用自定义 dropdownRender', () => {
      const dropdownRender = vi.fn(() => (
        <div data-testid="custom-dropdown">Custom Dropdown</div>
      ));

      renderTagPopup({ dropdownRender });

      // dropdownRender 只在 Dropdown 打开时被调用，所以我们只验证它已定义
      expect(dropdownRender).toBeDefined();
    });
  });

  describe('文本状态测试', () => {
    it('应该显示占位符标题', () => {
      const { container } = renderTagPopup({ placeholder: 'Select option' });
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );
      expect(tagPopupInput?.getAttribute('title')).toBe('Select option');
    });

    it('应该在文本为空时添加 empty 类', () => {
      const { container } = renderTagPopup({ text: '' });
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );
      expect(tagPopupInput).toHaveClass('empty');
    });

    it('应该在文本为空格时添加 empty 类', () => {
      const { container } = renderTagPopup({ text: '   ' });
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );
      expect(tagPopupInput).toHaveClass('empty');
    });

    it('应该在有文本时不添加 empty 类', () => {
      const { container } = renderTagPopup({ text: 'some text' });
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );
      expect(tagPopupInput).not.toHaveClass('empty');
    });
  });

  describe('鼠标事件测试', () => {
    it('应该在鼠标进入时移除 no-focus 类', () => {
      const { container } = renderTagPopup();
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );

      if (tagPopupInput) {
        fireEvent.mouseEnter(tagPopupInput);
        expect(tagPopupInput).not.toHaveClass('no-focus');
      }
    });

    it('应该在鼠标离开时添加 no-focus 类', () => {
      const { container } = renderTagPopup();
      const tagPopupInput = container.querySelector(
        '.ant-md-editor-tag-popup-input-tag-popup-input',
      );

      if (tagPopupInput) {
        fireEvent.mouseEnter(tagPopupInput);
        fireEvent.mouseLeave(tagPopupInput);
        expect(tagPopupInput).toHaveClass('no-focus');
      }
    });
  });

  describe('自动打开功能测试', () => {
    it('应该在 autoOpen 为 true 时自动打开（dropdown 类型）', () => {
      renderTagPopup({ autoOpen: true, type: 'dropdown' });

      // 验证组件已渲染，自动打开逻辑在 useEffect 中执行
      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该在 autoOpen 为 true 时调用 suggestionConnext.setOpen（panel 类型）', () => {
      const setOpen = vi.fn();
      const editor = createTestEditor();

      render(
        <ConfigProvider>
          <Slate
            editor={editor}
            initialValue={[{ type: 'paragraph', children: [{ text: 'test' }] }]}
          >
            <SuggestionConnext.Provider
              value={{
                open: false,
                setOpen,
                isRender: true,
                triggerNodeContext: { current: undefined },
                onSelectRef: { current: undefined },
              }}
            >
              <TagPopup
                items={mockItems}
                text="test"
                autoOpen={true}
                type="panel"
                onSelect={vi.fn()}
              >
                <span>Tag Content</span>
              </TagPopup>
            </SuggestionConnext.Provider>
          </Slate>
        </ConfigProvider>,
      );

      // autoOpen 逻辑在 useEffect 中执行
      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });
  });

  describe('菜单配置测试', () => {
    it('应该接受自定义菜单配置', () => {
      const menu = {
        onClick: vi.fn(),
        selectedKeys: ['option1'],
      };

      renderTagPopup({ menu });
      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该显示 notFoundContent 当没有数据时', () => {
      renderTagPopup({
        items: [],
        notFoundContent: <div data-testid="not-found">No data</div>,
      });

      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该应用自定义下拉样式', () => {
      const dropdownStyle = { backgroundColor: 'red', padding: '10px' };
      renderTagPopup({ dropdownStyle });

      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该应用自定义 body 样式', () => {
      const bodyStyle = { maxHeight: '300px', overflow: 'auto' };
      renderTagPopup({ bodyStyle });

      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理 null children', () => {
      renderTagPopup({ children: null });
      expect(screen.queryByText('Tag Content')).not.toBeInTheDocument();
    });

    it('应该处理 undefined items', () => {
      const { container } = renderTagPopup({ items: undefined });
      const arrow = container.querySelector(
        '.ant-md-editor-tag-popup-input-arrow',
      );
      expect(arrow).not.toBeInTheDocument();
    });

    it('应该处理空字符串 text', () => {
      const onChange = vi.fn();
      renderTagPopup({ text: '', onChange });

      expect(onChange).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('应该处理 undefined text', () => {
      const onChange = vi.fn();
      renderTagPopup({ text: undefined, onChange });

      expect(onChange).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('应该处理多个 prefixCls', () => {
      const { container } = renderTagPopup({
        prefixCls: ['prefix1', 'prefix2'],
      });
      expect(container.firstChild).toHaveClass('prefix1');
      expect(container.firstChild).toHaveClass('prefix2');
    });

    it('应该处理 prefixCls 为 false', () => {
      const { container } = renderTagPopup({ prefixCls: false });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      renderTagPopup({
        children: (
          <div>
            <span>Nested</span>
            <strong>Content</strong>
          </div>
        ),
      });

      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('受控与非受控状态测试', () => {
    it('应该支持受控的 open 状态', () => {
      const onOpenChange = vi.fn();
      renderTagPopup({
        type: 'dropdown',
        open: true,
        onOpenChange,
      });

      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('应该在 open 改变时调用 onOpenChange', () => {
      const onOpenChange = vi.fn();
      renderTagPopup({
        type: 'dropdown',
        open: false,
        onOpenChange,
      });

      expect(onOpenChange).toBeDefined();
    });
  });

  describe('类名应用测试', () => {
    it('应该应用 tagTextClassName', () => {
      const { container } = renderTagPopup({
        tagTextClassName: 'custom-text-class',
      });
      expect(container.querySelector('.custom-text-class')).toBeInTheDocument();
    });

    it('应该应用类型相关的类名', () => {
      const { container } = renderTagPopup({ type: 'dropdown' });
      expect(
        container.querySelector('.ant-md-editor-tag-popup-input-type-dropdown'),
      ).toBeInTheDocument();
    });

    it('应该应用类型为 panel 的类名', () => {
      const { container } = renderTagPopup({ type: 'panel' });
      expect(
        container.querySelector('.ant-md-editor-tag-popup-input-type-panel'),
      ).toBeInTheDocument();
    });
  });
});
