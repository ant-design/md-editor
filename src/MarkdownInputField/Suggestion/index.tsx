import { Dropdown } from 'antd';
import { useMergedState } from 'rc-util';
import React, { useRef } from 'react';
import { MarkdownEditorProps } from '../../MarkdownEditor';
import { TagPopupProps } from '../../MarkdownEditor/editor/elements/code/TagPopup';

/**
 * 建议面板状态的 React 上下文
 *
 * 该上下文用于管理建议面板（Suggestion）的显示状态，允许组件树中的任何组件访问或修改面板的开关状态。
 *
 * @interface
 * @property {boolean} [open] - 控制建议面板是否打开的状态
 * @property {function} [setOpen] - 设置建议面板开关状态的函数
 * @example
 * // 在消费组件中使用此上下文
 * const { open, setOpen } = useContext(SuggestionConnext);
 * // 打开建议面板
 * setOpen?.(true);
 */
export const SuggestionConnext = React.createContext<{
  open?: boolean;
  setOpen?: (open: boolean) => void;
  isRender: true;
  onSelectRef?: React.MutableRefObject<
    ((value: string) => void | undefined) | undefined
  >;
  triggerNodeContext?: React.MutableRefObject<
    | (TagPopupProps & {
        text: string;
      })
    | undefined
  >;
}>({
  isRender: true,
});

export const Suggestion: React.FC<{
  children: React.ReactNode;
  tagInputProps?: MarkdownEditorProps['tagInputProps'];
}> = (props) => {
  const [open, setOpen] = useMergedState(false, {
    value: props?.tagInputProps?.open,
    onChange: props?.tagInputProps?.onOpenChange,
  });
  const onSelectRef =
    useRef<(value: string, path?: number[]) => void | undefined>(undefined);

  const triggerNodeContext = useRef<TagPopupProps & { text: string }>(
    undefined,
  );
  const {
    items = [],
    dropdownRender,
    menu,
    dropdownStyle,
    notFoundContent,
  } = props.tagInputProps || {};

  const selectedItems = items.map((item) => {
    const { key } = item || {};

    return {
      ...item,
      onClick: () => {
        setOpen(false);
        onSelectRef.current?.(`${key}` || '');
      },
    };
  });

  return (
    <SuggestionConnext.Provider
      value={{
        open,
        setOpen,
        isRender: true,
        onSelectRef,
        triggerNodeContext,
      }}
    >
      <Dropdown
        open={open}
        autoFocus={true}
        trigger={['click']}
        overlayStyle={dropdownStyle}
        menu={
          menu
            ? menu
            : {
                items: selectedItems,
              }
        }
        placement="top"
        onOpenChange={(isOpenChanged) => {
          if (isOpenChanged) return;
          setOpen(isOpenChanged);
        }}
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
                  ...triggerNodeContext.current,
                  onSelect: (value: string, path?: number[]) => {
                    onSelectRef.current?.(`${value}` || '', path);
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
      >
        {props.children}
      </Dropdown>
    </SuggestionConnext.Provider>
  );
};
