import { Descriptions } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export function TableCell(props: RenderElementProps) {
  const store = useEditorStore();
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);
  return React.useMemo(() => {
    return props.element.title ? (
      <th
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'th'}
        onContextMenu={(e) => context(e, true)}
      >
        {props.children}
      </th>
    ) : (
      <td
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'td'}
        className={'group'}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        {props.children}
      </td>
    );
  }, [props.element, props.element.children, store.refreshHighlight]);
}

export const Table = observer((props: RenderElementProps) => {
  const { element: node } = props;
  let chartData = useMemo(() => {
    return (
      node.otherProps?.dataSource?.map((item: any) => {
        return {
          ...item,
          column_list: Object.keys(item),
        };
      }) || []
    );
  }, [node.otherProps?.dataSource]);

  const columns = node.otherProps?.columns || [];

  const store = useEditorStore();
  return useMemo(() => {
    return (
      <div
        className={'drag-el'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        style={{
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        <DragHandle />

        {chartData?.length < 2 && columns?.length > 8 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {chartData.map((row: Record<string, any>, index: number) => {
              return (
                <Descriptions
                  bordered
                  key={index}
                  column={{
                    xxl: 2,
                    xl: 2,
                    lg: 2,
                    md: 2,
                    sm: 1,
                    xs: 1,
                  }}
                  items={columns
                    .map((column: { title: string; dataIndex: string }) => {
                      console.log(column.title);
                      if (!column.title || !column.dataIndex) return null;
                      return {
                        label: column.title,
                        children: row[column.dataIndex],
                      };
                    })
                    .filter((item: any) => !!item)}
                />
              );
            })}
          </div>
        ) : (
          <table>
            <tbody>{props.children}</tbody>
          </table>
        )}
      </div>
    );
  }, [props.element.children]);
});
