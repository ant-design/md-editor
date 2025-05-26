import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  DeleteRowOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Editor, Path, Transforms } from 'slate';
import { TableNode } from '../../../../el';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
} from '../../slate-react';
import { Table } from '../index';

// 简化的表格操作类型
export type TableOperation =
  | 'insertRowAbove'
  | 'insertRowBelow'
  | 'insertColumnLeft'
  | 'insertColumnRight'
  | 'deleteRow'
  | 'deleteColumn'
  | 'deleteTable'
  | 'mergeCell'
  | 'splitCell';

interface EnhancedTableProps extends RenderElementProps<TableNode> {
  enableAdvancedOperations?: boolean;
}

// 简化的表格操作函数
const tableOperations = {
  insertRowAbove: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if ((tableNode as any).type !== 'table') return;

    // 简单的插入行实现
    const newRow = {
      type: 'table-row',
      children:
        (tableNode as any).children[0]?.children.map(() => ({
          type: 'table-cell',
          children: [{ type: 'paragraph', children: [{ text: '' }] }],
        })) || [],
    };

    Transforms.insertNodes(editor, newRow, { at: [...path, 0] });
  },

  insertRowBelow: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if ((tableNode as any).type !== 'table') return;

    const newRow = {
      type: 'table-row',
      children:
        (tableNode as any).children[0]?.children.map(() => ({
          type: 'table-cell',
          children: [{ type: 'paragraph', children: [{ text: '' }] }],
        })) || [],
    };

    Transforms.insertNodes(editor, newRow, {
      at: [...path, (tableNode as any).children.length],
    });
  },

  insertColumnLeft: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if ((tableNode as any).type !== 'table') return;

    // 为每一行插入新的单元格
    (tableNode as any).children.forEach((_: any, rowIndex: number) => {
      const newCell = {
        type: 'table-cell',
        children: [{ type: 'paragraph', children: [{ text: '' }] }],
      };
      Transforms.insertNodes(editor, newCell, { at: [...path, rowIndex, 0] });
    });
  },

  insertColumnRight: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if ((tableNode as any).type !== 'table') return;

    // 为每一行在末尾插入新的单元格
    (tableNode as any).children.forEach((row: any, rowIndex: number) => {
      const newCell = {
        type: 'table-cell',
        children: [{ type: 'paragraph', children: [{ text: '' }] }],
      };
      Transforms.insertNodes(editor, newCell, {
        at: [...path, rowIndex, row.children.length],
      });
    });
  },

  deleteRow: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if (
      (tableNode as any).type !== 'table' ||
      (tableNode as any).children.length <= 1
    )
      return;

    // 删除第一行
    Transforms.removeNodes(editor, { at: [...path, 0] });
  },

  deleteColumn: (editor: Editor, path: Path) => {
    const [tableNode] = Editor.node(editor, path);
    if ((tableNode as any).type !== 'table') return;

    const firstRow = (tableNode as any).children[0];
    if (!firstRow || firstRow.children.length <= 1) return;

    // 删除每一行的第一列
    (tableNode as any).children.forEach((_: any, rowIndex: number) => {
      Transforms.removeNodes(editor, { at: [...path, rowIndex, 0] });
    });
  },

  deleteTable: (editor: Editor, path: Path) => {
    Transforms.removeNodes(editor, { at: path });
  },
};

export const EnhancedTable: React.FC<EnhancedTableProps> = ({
  enableAdvancedOperations = true,
  ...props
}) => {
  const selected = useSelected();
  const focused = useFocused();
  const [showToolbar, setShowToolbar] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowToolbar(selected && focused);
  }, [selected, focused]);

  const handleOperation = (operation: TableOperation) => {
    const editor = ReactEditor.findEditor(props.element);
    const path = ReactEditor.findPath(editor, props.element);

    if (tableOperations[operation]) {
      tableOperations[operation](editor, path);
    }
  };

  const menuItems = [
    {
      key: 'insertRowAbove',
      icon: <InsertRowAboveOutlined />,
      label: '在上方插入行',
      onClick: () => handleOperation('insertRowAbove'),
    },
    {
      key: 'insertRowBelow',
      icon: <InsertRowBelowOutlined />,
      label: '在下方插入行',
      onClick: () => handleOperation('insertRowBelow'),
    },
    {
      key: 'insertColumnLeft',
      icon: <ColumnWidthOutlined />,
      label: '在左侧插入列',
      onClick: () => handleOperation('insertColumnLeft'),
    },
    {
      key: 'insertColumnRight',
      icon: <ColumnHeightOutlined />,
      label: '在右侧插入列',
      onClick: () => handleOperation('insertColumnRight'),
    },
    { type: 'divider' },
    {
      key: 'deleteRow',
      icon: <DeleteRowOutlined />,
      label: '删除行',
      onClick: () => handleOperation('deleteRow'),
    },
    {
      key: 'deleteColumn',
      icon: <DeleteOutlined />,
      label: '删除列',
      onClick: () => handleOperation('deleteColumn'),
    },
    { type: 'divider' },
    {
      key: 'deleteTable',
      icon: <DeleteOutlined />,
      label: '删除表格',
      onClick: () => handleOperation('deleteTable'),
      danger: true,
    },
  ];

  return (
    <div ref={tableRef} style={{ position: 'relative' }}>
      {/* 表格工具栏 */}
      {enableAdvancedOperations && showToolbar && (
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
      )}

      {/* 原有的表格组件 */}
      <Table {...props} />
    </div>
  );
};
