import { Dropdown, MenuProps } from 'antd';
import React, { ReactNode } from 'react';

export type TagPopupProps = {
  children?: React.ReactNode;
  onSelect?: (value: string) => void;
  items?: Array<{
    label: string;
    key: string | number;
    onClick?: (v: string) => void;
  }>;
  prefixCls?: string;
  dropdownRender?: (
    defaultNode: ReactNode,
    props: TagPopupProps,
  ) => React.ReactNode;
  dropdownStyle?: React.CSSProperties;
  menu?: MenuProps;
  notFoundContent?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  className?: string;
};

export const TagPopup = (
  props: TagPopupProps & {
    text: {
      text: string;
    };
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

  const [open, setOpen] = React.useState(true);

  const selectedItems = items.map((item) => {
    const { key } = item || {};
    return {
      ...item,
      onClick: () => {
        onSelect?.(`${key}` || '');
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
        onOpenChange={setOpen}
        autoFocus={true}
        dropdownRender={(defaultDropdownContent) => {
          if (dropdownRender) {
            return dropdownRender(defaultDropdownContent, props);
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
