import { Dropdown, Spin } from 'antd';
import { useMergedState } from 'rc-util';
import React, { useEffect, useRef, useState } from 'react';
import { useRefFunction } from '../../hooks/useRefFunction';
import { MarkdownEditorProps } from '../../MarkdownEditor';
import { TagPopupProps } from '../../MarkdownEditor/editor/elements/TagPopup';

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
        text?: string;
        placeholder?: string;
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
  const onSelectRef =
    useRef<(value: string, path?: number[]) => void | undefined>(undefined);

  const triggerNodeContext = useRef<
    TagPopupProps & { text?: string; placeholder?: string }
  >(undefined);
  const {
    items = [],
    dropdownRender,
    menu,
    dropdownStyle,
    notFoundContent,
  } = props.tagInputProps || {};

  const [open, setOpen] = useMergedState(false, {
    value: props?.tagInputProps?.open,
    onChange: props?.tagInputProps?.onOpenChange,
  });

  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(() => {
    if (typeof items === 'function') {
      return [];
    }
    return items.map((item) => {
      const { key } = item || {};

      return {
        ...item,
        onClick: () => {
          setOpen(false);
          onSelectRef.current?.(`${key}` || '');
        },
      };
    });
  });

  useEffect(() => {
    const loadingData = async () => {
      if (typeof items === 'function') {
        setLoading(true);
        const result = await items(triggerNodeContext.current!);
        if (Array.isArray(result)) {
          setSelectedItems(
            result.map((item) => {
              const { key } = item || {};
              return {
                ...item,
                onClick: () => {
                  setOpen(false);
                  onSelectRef.current?.(`${key}` || '');
                },
              };
            }),
          );
        }
        setLoading(false);
      }
    };
    loadingData();
  }, [open]);

  const dropdownRenderRender = useRefFunction(
    (defaultDropdownContent: React.ReactNode) => {
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
            {loading ? (
              <Spin />
            ) : (
              dropdownRender(defaultDropdownContent, {
                ...props,
                ...triggerNodeContext.current,
                onSelect: (value: string, path?: number[]) => {
                  onSelectRef.current?.(`${value}` || '', path);
                  setOpen(false);
                },
              })
            )}
          </div>
        );
      } else if (menu! && items!) {
        return notFoundContent || '';
      } else {
        return defaultDropdownContent;
      }
    },
  );

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
                onKeyDown: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
              }
        }
        forceRender
        destroyOnHidden={false}
        placement="top"
        onOpenChange={(isOpenChanged) => {
          if (isOpenChanged) return;
          setOpen(isOpenChanged);
        }}
        popupRender={dropdownRenderRender}
      >
        {props.children}
      </Dropdown>
    </SuggestionConnext.Provider>
  );
};
