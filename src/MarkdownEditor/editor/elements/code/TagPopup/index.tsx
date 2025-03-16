import { Dropdown, MenuProps } from 'antd';
import React, { ReactNode } from 'react';

type TagPopupProps = {
  children?: React.ReactNode;
  onSelect?: (value: string) => void;
  items?: Array<{
    label: string;
    key: string | number;
    onClick?: (v: string) => void;
  }>;
  prefixCls?: string;
  dropdownRender?: (defaultdom: ReactNode) => React.ReactNode;
  dropdownStyle?: React.CSSProperties;
  menu?: MenuProps;
  notFoundContent?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  className?: string;
};

const TagPopup = (
  props: TagPopupProps & {
    text: {
      text: string;
    };
  },
) => {
  console.log('Tag Props', props);
  const {
    items = [],
    onSelect,
    children,
    dropdownRender,
    dropdownStyle,
    menu,
    prefixCls,
    notFoundContent,
    className,
    text,
  } = props || {};
  console.log('children', children);

  const { text: inputValue } = text;
  console.log('inputValuetext', text);

  const [open, setOpen] = React.useState(true);

  const MergedItem = items.map((item) => {
    const { key } = item || {};
    return {
      ...item,
      onClick: () => {
        onSelect && onSelect(`${key}` || '');
        setOpen(false);
      },
    };
  });

  return (
    <Dropdown
      open={open}
      className={className}
      dropdownRender={(defalutDom) => {
        if (dropdownRender) {
          return dropdownRender(defalutDom);
        } else if (menu! && items!) {
          return notFoundContent || '';
        } else {
          return defalutDom;
        }
      }}
      overlayStyle={dropdownStyle}
      menu={
        menu
          ? menu
          : {
              items: MergedItem,
            }
      }
    >
      <div
        onClick={() => {
          setOpen(true);
        }}
        style={{
          backgroundColor: '#f5f5f5',
          padding: '0 4px',
          borderRadius: 4,
          fontSize: '1em',
          display: 'inline-block',
          lineHeight: '24px',
          color: '#bfbfbf',
        }}
      >
        {children}
      </div>
    </Dropdown>
  );
};

export { TagPopup, TagPopupProps };
