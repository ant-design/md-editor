import { runFunction } from '@ant-design/pro-components';
import { MenuProps } from 'antd';
import classNames from 'classnames';
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { SuggestionConnext } from '../../../../../MarkdownInputField/Suggestion';
import { useSlate } from '../../../slate-react';

export type TagPopupProps = {
  children?: React.ReactNode;
  items?: Array<{
    label: string;
    key: string | number;
    onClick?: (v: string) => void;
  }>;
  prefixCls?: string | string[] | false;
  dropdownRender?: (
    defaultNode: ReactNode,
    props: TagPopupProps & {
      text?: string;
      placeholder?: string;
      onSelect?: (value: string, path?: number[]) => void;
    },
  ) => React.ReactNode;
  dropdownStyle?: React.CSSProperties;
  menu?: MenuProps;
  notFoundContent?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * 在弹出框打开之前的回调函数
   * 可以用于控制弹出框是否打开
   * @param open
   * @param props
   * @returns
   */
  beforeOpenChange?: (
    open: boolean,
    props: TagPopupProps & {
      text: string;
      placeholder?: string;
    },
  ) => boolean;
  tagRender?: (
    props: TagPopupProps & {
      text: string;
      onSelect?: (value: string, path?: number[]) => void;
      placeholder?: string;
    },
    defaultDom: ReactNode,
  ) => React.ReactNode;
  tagTextRender?: (
    props: TagPopupProps & {
      text: string;
      placeholder?: string;
    },
    text: string,
  ) => string;
  tagTextStyle?:
    | ((
        props: TagPopupProps & {
          text: string;
          placeholder?: string;
        },
      ) => React.CSSProperties)
    | React.CSSProperties;
  tagTextClassName?: string;
  /**
   * 输入值改变时触发的回调函数
   * @param value
   * @param props
   * @returns
   */
  onChange?: (
    value: string,
    props: TagPopupProps & {
      text: string;
      onSelect?: (value: string, path?: number[]) => void;
      placeholder?: string;
    },
  ) => void;
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
export const TagPopup = (
  props: TagPopupProps & {
    text: string;
    focus?: boolean;
    placeholder?: string;
    onSelect?: (value: string, path: number[]) => void;
  },
) => {
  const { onSelect, children } = props || {};
  const editor = useSlate();

  const domRef = useRef<HTMLDivElement>(null);

  const suggestionConnext = useContext(SuggestionConnext);

  const currentNodePath = useRef<number[]>();

  useEffect(() => {
    const path = editor.selection?.anchor.path;
    if (path) {
      currentNodePath.current = path;
      suggestionConnext?.setOpen?.(true);
      if (suggestionConnext?.triggerNodeContext) {
        suggestionConnext.triggerNodeContext.current = {
          ...props,
          text: props.text,
        };
      }
      if (suggestionConnext?.onSelectRef) {
        suggestionConnext.onSelectRef.current = (newValue) => {
          onSelect?.(newValue, path || []);
          suggestionConnext?.setOpen?.(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (suggestionConnext?.triggerNodeContext) {
      suggestionConnext.triggerNodeContext.current = {
        ...props,
        text: props.text,
      };
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

  const placeholder = props.placeholder;

  const defaultDom = (
    <div
      ref={domRef}
      className={classNames('tag-popup-input', {
        empty: !props.text.trim(),
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
          onSelect: (value: string) => {
            onSelect?.(value, currentNodePath.current || []);
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
        const path = editor.selection?.anchor.path;
        if (path) {
          currentNodePath.current = path;
        }
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
        e.preventDefault();
        e.stopPropagation();
        if (suggestionConnext?.triggerNodeContext) {
          suggestionConnext.triggerNodeContext.current = {
            ...props,
            text: props.text,
          };
        }

        if (suggestionConnext?.onSelectRef) {
          suggestionConnext.onSelectRef.current = (newValue) => {
            onSelect?.(newValue, path || []);
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
