import { MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { Editor, Transforms } from 'slate';
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlate,
} from '../../../slate-react';

interface TableToolbarProps {
  element: any;
  onOperation?: (operation: string) => void;
}

// 简化的表格操作
const executeTableOperation = (
  editor: Editor,
  element: any,
  operation: string,
) => {
  const path = ReactEditor.findPath(editor, element);

  switch (operation) {
    case 'insertRowAbove':
      // 在表格开头插入新行
      const newRowAbove = {
        type: 'table-row',
        children:
          element.children[0]?.children.map(() => ({
            type: 'table-cell',
            children: [{ type: 'paragraph', children: [{ text: '' }] }],
          })) || [],
      };
      Transforms.insertNodes(editor, newRowAbove, { at: [...path, 0] });
      break;

    case 'insertRowBelow':
      // 在表格末尾插入新行
      const newRowBelow = {
        type: 'table-row',
        children:
          element.children[0]?.children.map(() => ({
            type: 'table-cell',
            children: [{ type: 'paragraph', children: [{ text: '' }] }],
          })) || [],
      };
      Transforms.insertNodes(editor, newRowBelow, {
        at: [...path, element.children.length],
      });
      break;

    case 'deleteRow':
      if (element.children.length > 1) {
        Transforms.removeNodes(editor, { at: [...path, 0] });
      }
      break;

    case 'deleteTable':
      Transforms.removeNodes(editor, { at: path });
      break;
  }
};

export const TableToolbar: React.FC<TableToolbarProps> = ({
  element,
  onOperation,
}) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    setShowToolbar(selected && focused);
  }, [selected, focused]);

  const handleOperation = (operation: string) => {
    executeTableOperation(editor, element, operation);
    onOperation?.(operation);
  };

  const menuItems = [
    {
      key: 'insertRowAbove',
      label: '在上方插入行',
      onClick: () => handleOperation('insertRowAbove'),
    },
    {
      key: 'insertRowBelow',
      label: '在下方插入行',
      onClick: () => handleOperation('insertRowBelow'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'deleteRow',
      label: '删除行',
      onClick: () => handleOperation('deleteRow'),
    },
    {
      key: 'deleteTable',
      label: '删除表格',
      onClick: () => handleOperation('deleteTable'),
      danger: true,
    },
  ];

  if (!showToolbar) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: -40,
        right: 0,
        zIndex: 1000,
        background: 'white',
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        padding: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button size="small" icon={<MenuOutlined />}>
          表格操作
        </Button>
      </Dropdown>
    </div>
  );
};
