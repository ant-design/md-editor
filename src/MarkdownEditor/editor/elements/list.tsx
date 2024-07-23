import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { createElement, useMemo } from 'react';
import { ElementProps, ListItemNode, ListNode } from '../../el';
import { useMEditor } from '../../hooks/editor';
import { useEditorStore } from '../store';

export const List = observer(
  ({ element, attributes, children }: ElementProps<ListNode>) => {
    const store = useEditorStore();
    return React.useMemo(() => {
      const tag = element.order ? 'ol' : 'ul';
      return (
        <div
          className={'relative'}
          data-be={'list'}
          {...attributes}
          onDragStart={store.dragStart}
        >
          {createElement(
            tag,
            {
              className: 'm-list',
              start: element.start,
              ['data-task']: element.task ? 'true' : undefined,
            },
            children,
          )}
        </div>
      );
    }, [element.task, element.order, element.start, element.children]);
  },
);

export const ListItem = observer(
  ({ element, children, attributes }: ElementProps<ListItemNode>) => {
    const [, update] = useMEditor(element);
    const store = useEditorStore();
    const isTask = typeof element.checked === 'boolean';
    return useMemo(
      () => (
        <li
          className={`m-list-item ${isTask ? 'task' : ''}`}
          data-be={'list-item'}
          onDragStart={(e) => store.dragStart(e)}
          {...attributes}
        >
          {isTask && (
            <span contentEditable={false} className={'check-item'}>
              <Checkbox
                checked={element.checked}
                onChange={(e) => update({ checked: e.target.checked })}
              />
            </span>
          )}
          {children}
        </li>
      ),
      [element, element.children, store.refreshHighlight],
    );
  },
);
