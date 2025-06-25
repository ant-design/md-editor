import { runFunction } from '@ant-design/pro-components';
import { MenuProps } from 'antd';
import classNames from 'classnames';
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { SuggestionConnext } from '../../../../MarkdownInputField/Suggestion';
import { ReactEditor, useSlate } from '../../slate-react';

type TagPopupItem = Array<{
  label: string;
  key: string | number;
  onClick?: (v: string) => void;
}>;

type RenderProps = TagPopupProps & {
  text?: string;
  placeholder?: string;
  autoOpen?: boolean;
  onSelect?: (
    value: string,
    path?: number[],
    tagNode?: Record<string, any>,
  ) => void;
};

export type TagPopupProps = {
  /**
   * 子元素内容
   */
  children?: React.ReactNode;
  /**
   * 下拉菜单项列表或返回下拉菜单项列表的函数
   */
  items?: TagPopupItem | ((props: RenderProps) => Promise<TagPopupItem>);
  /**
   * 组件CSS前缀类名
   */
  prefixCls?: string | string[] | false;
  /**
   * 自定义下拉菜单渲染函数
   * @param defaultNode 默认渲染的节点
   * @param props 组件属性
   */
  dropdownRender?: (
    defaultNode: ReactNode,
    props: RenderProps,
  ) => React.ReactNode;
  /**
   * 下拉菜单的自定义样式
   */
  dropdownStyle?: React.CSSProperties;
  /**
   * 菜单属性配置
   */
  menu?: MenuProps;
  /**
   * 当没有数据时显示的内容
   */
  notFoundContent?: React.ReactNode;
  /**
   * 下拉菜单主体的样式
   */
  bodyStyle?: React.CSSProperties;
  /**
   * 组件自定义类名
   */
  className?: string;
  /**
   * 控制下拉菜单是否展开
   */
  open?: boolean;
  /**
   * 下拉菜单展开状态变化的回调函数
   * @param open 是否展开
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 在弹出框打开之前的回调函数
   * 可以用于控制弹出框是否打开
   * @param open 是否打开
   * @param props 组件属性
   * @returns 是否允许打开
   */
  beforeOpenChange?: (open: boolean, props: RenderProps) => boolean;
  /**
   * 自定义标签渲染函数
   * @param props 组件属性
   * @param defaultDom 默认渲染的DOM
   * @returns 自定义渲染的React节点
   */
  tagRender?: (
    props: Omit<RenderProps, 'onSelect'> & {
      onSelect: (value: string, tagNode?: Record<string, any>) => void;
    },
    defaultDom: ReactNode,
  ) => React.ReactNode;
  /**
   * 自定义标签文本渲染函数
   * @param props 组件属性
   * @param text 文本内容
   * @returns 处理后的文本
   */
  tagTextRender?: (props: RenderProps, text: string) => string;
  /**
   * 标签文本的样式，可以是样式对象或返回样式对象的函数
   */
  tagTextStyle?:
    | ((props: RenderProps) => React.CSSProperties)
    | React.CSSProperties;
  /**
   * 标签文本的类名
   */
  tagTextClassName?: string;
  /**
   * 输入值改变时触发的回调函数
   * @param value 输入的值
   * @param props 组件属性
   * @returns
   */
  onChange?: (value: string, props: RenderProps) => void;
};

/**
 * TagPopup 组件 - 在编辑器中显示一个标签弹出选择框
 *
 * 该组件在编辑器中创建一个交互式标签选择弹出框，允许用户从预定义列表中选择标签。
 * 当选择一个标签时，会调用提供的回调函数并关闭弹出框。该组件与 Slate 编辑器集成，
 * 可以感知当前的节点路径。
 *
 * @param props - 组件属性
 * @param props.items - 可选的下拉菜单项列表
 * @param props.onSelect - 当选择一个项时的回调函数，接收所选项的键和路径
 * @param props.children - 触发器元素内容
 * @param props.dropdownRender - 自定义下拉菜单渲染函数
 * @param props.dropdownStyle - 下拉菜单的样式
 * @param props.menu - 自定义菜单配置
 * @param props.notFoundContent - 未找到内容时显示的内容
 * @param props.className - 组件的额外 CSS 类名
 * @param props.open - 控制下拉菜单是否打开
 * @param props.onOpenChange - 下拉菜单打开状态变化时的回调
 * @param props.text - 包含文本内容
 *
 * @returns 一个带有下拉菜单的标签弹出组件
 */
export const TagPopup = (props: RenderProps) => {
  const { onSelect, children } = props || {};
  const editor = useSlate();

  const domRef = useRef<HTMLDivElement>(null);

  const suggestionConnext = useContext(SuggestionConnext);

  const currentNodePath = useRef<number[]>();

  useEffect(() => {
    if (!domRef.current) return;
    const slateNode = ReactEditor.toSlateNode(editor, domRef.current);
    // 获取路径
    const path = ReactEditor.findPath(editor, slateNode);
    if (path) {
      currentNodePath.current = path;
    }
  }, [editor.children, props.text]); // 添加依赖项

  useEffect(() => {
    if (!domRef.current) return;
    const slateNode = ReactEditor.toSlateNode(editor, domRef.current);
    const path = ReactEditor.findPath(editor, slateNode);
    if (path) {
      currentNodePath.current = path;
      if (suggestionConnext?.triggerNodeContext) {
        suggestionConnext.triggerNodeContext.current = {
          ...props,
          text: props.text,
        };
      }
      if (suggestionConnext?.onSelectRef) {
        suggestionConnext.onSelectRef.current = (newValue) => {
          // 获取最新路径
          const currentPath = ReactEditor.findPath(editor, slateNode);
          onSelect?.(newValue, currentPath || path || []);
          suggestionConnext?.setOpen?.(false);
        };
      }
    }
  }, [props.text]);

  useEffect(() => {
    // 默认选中一下
    props.onChange?.(props.text || '', {
      ...props,
      text: props.text,
      onSelect: (value: string) => {
        onSelect?.(value, currentNodePath.current || []);
      },
    });
  }, [props.text, suggestionConnext.open]);

  useEffect(() => {
    if (props.autoOpen && suggestionConnext?.setOpen) {
      suggestionConnext.setOpen(true);
    }
  }, []);

  const placeholder = props.placeholder;

  const defaultDom = (
    <div
      ref={domRef}
      className={classNames('tag-popup-input', {
        empty: !props.text?.trim(),
      })}
      onMouseEnter={() => {
        const target = domRef.current;
        if (!target) return;
        target?.classList.add('tag-popup-input-focus');
      }}
      onMouseLeave={() => {
        const target = domRef.current;
        if (!target) return;
        target?.classList.remove('tag-popup-input-focus');
      }}
      title={placeholder}
    >
      {children}
    </div>
  );

  let renderDom = props.tagRender
    ? props.tagRender(
        {
          ...props,
          text: props.text,
          onSelect: (value: string, tagNode?: Record<string, any>) => {
            onSelect?.(value, currentNodePath.current || [], tagNode);
          },
        },
        defaultDom,
      )
    : defaultDom;

  return (
    <div
      className={classNames(
        'tag-popup-input-warp',
        props.className,
        props.prefixCls,
        props.tagTextClassName,
      )}
      style={{
        ...runFunction(props.tagTextStyle, {
          ...props,
          text: props.text,
          placeholder,
        }),
        display: 'inline-flex',
        position: 'relative',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.beforeOpenChange) {
          const canOpen = props.beforeOpenChange(true, {
            ...props,
            text: props.text,
            placeholder,
          });
          if (!canOpen) {
            return;
          }
        }

        if (suggestionConnext?.triggerNodeContext) {
          suggestionConnext.triggerNodeContext.current = {
            ...props,
            text: props.text,
          };
        }

        if (suggestionConnext?.onSelectRef) {
          suggestionConnext.onSelectRef.current = (newValue) => {
            onSelect?.(newValue, currentNodePath.current || []);
            suggestionConnext?.setOpen?.(false);
          };
        }
        suggestionConnext?.setOpen?.(true);
      }}
    >
      {renderDom}
    </div>
  );
};
