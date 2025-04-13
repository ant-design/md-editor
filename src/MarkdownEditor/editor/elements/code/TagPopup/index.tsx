import { Dropdown, MenuProps } from 'antd';
import { useMergedState } from 'rc-util';
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { SuggestionConnext } from '../../../../../MarkdownInputField/Suggestion';
import { useRefFunction } from '../../../../../hooks/useRefFunction';
import { useSlate } from '../../../slate-react';

export type TagPopupProps = {
  children?: React.ReactNode;
  items?: Array<{
    label: string;
    key: string | number;
    onClick?: (v: string) => void;
  }>;
  prefixCls?: string | string[];
  dropdownRender?: (
    defaultNode: ReactNode,
    props: TagPopupProps & {
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
 * @param props.text - 包含文本内容的对象
 * @param props.text.text - 文本内容
 *
 * @returns 一个带有下拉菜单的标签弹出组件
 */
export const TagPopup = (
  props: TagPopupProps & {
    text: {
      text: string;
    };
    onSelect?: (value: string, path: number[]) => void;
  },
) => {
  const {
    items = [],
    onSelect,
    children,
    dropdownRender,
    dropdownStyle,
    menu,
    notFoundContent,
    className,
  } = props || {};
  const editor = useSlate();

  const suggestionConnext = useContext(SuggestionConnext);

  const currentNodePath = useRef<number[]>();

  const [open, setOpen] = useMergedState(true, {
    value: props.open,
    onChange: props.onOpenChange,
  });

  useEffect(() => {
    const path = editor.selection?.anchor.path;
    if (path) {
      currentNodePath.current = path;
    }
    suggestionConnext?.setOpen?.(true);
  }, []);

  const selectRef = useRefFunction((value: string, path?: number[]) => {
    onSelect?.(value, path || currentNodePath.current || []);
    suggestionConnext?.setOpen?.(false);
  });

  if (suggestionConnext?.isRender) {
    if (suggestionConnext?.triggerNodeContext) {
      suggestionConnext.triggerNodeContext.current = {
        ...props,
        text: props.text.text,
      };
    }
    if (suggestionConnext?.onSelectRef) {
      suggestionConnext.onSelectRef.current = selectRef;
    }
    return (
      <span
        onKeyDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={(e) => {
          const path = editor.selection?.anchor.path;
          if (path) {
            currentNodePath.current = path;
          }
          e.preventDefault();
          e.stopPropagation();
          if (!suggestionConnext.open) {
            suggestionConnext?.setOpen?.(true);
          } else {
            suggestionConnext?.setOpen?.(false);
          }
        }}
      >
        <div
          onClick={() => {
            setOpen(true);
          }}
          style={{
            backgroundColor: '#e6f4ff',
            padding: '0 4px',
            borderRadius: 4,
            fontSize: '0.9em',
            display: 'inline-block',
            lineHeight: 1.5,
            color: '#1677ff',
            border: '1px solid #91caff',
          }}
        >
          {children}
        </div>
      </span>
    );
  }

  const selectedItems = items.map((item) => {
    const { key } = item || {};

    return {
      ...item,
      onClick: () => {
        onSelect?.(`${key}` || '', currentNodePath.current || []);
        setOpen(false);
      },
    };
  });

  return (
    <span
      onKeyDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Dropdown
        open={open}
        className={className}
        onOpenChange={(changeOpen) => {
          const path = editor.selection?.anchor.path;
          if (path) {
            currentNodePath.current = path;
          }
          setOpen(changeOpen);
        }}
        autoFocus={true}
        trigger={['click']}
        dropdownRender={(defaultDropdownContent) => {
          if (dropdownRender) {
            return (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {dropdownRender(defaultDropdownContent, {
                  ...props,
                  onSelect: (value: string, path?: number[]) => {
                    onSelect?.(value, path || currentNodePath.current || []);
                    setOpen(false);
                  },
                })}
              </div>
            );
          } else if (menu! && items!) {
            return notFoundContent || '';
          } else {
            return defaultDropdownContent;
          }
        }}
        overlayStyle={dropdownStyle}
        menu={
          menu
            ? menu
            : {
                items: selectedItems,
              }
        }
      >
        <div
          onClick={() => {
            setOpen(true);
          }}
          style={{
            backgroundColor: '#e6f4ff',
            padding: '0 4px',
            borderRadius: 4,
            fontSize: '0.9em',
            display: 'inline-block',
            lineHeight: 1.5,
            color: '#1677ff',
            border: '1px solid #91caff',
          }}
        >
          {children}
        </div>
      </Dropdown>
    </span>
  );
};
