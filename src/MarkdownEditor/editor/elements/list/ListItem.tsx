import { Checkbox, ConfigProvider } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ElementProps, ListItemNode } from '../../../el';
import { useMEditor } from '../../../hooks/editor';
import { useEditorStore } from '../../store';
import { ListContext } from './List';

/**
 * 列表项组件，使用 `observer` 包装以响应 MobX 状态变化。
 *
 * @param {ElementProps<ListItemNode>} props - 组件的属性。
 * @param {ListItemNode} props.element - 列表项节点元素。
 * @param {React.ReactNode} props.children - 列表项的子元素。
 * @param {object} props.attributes - 传递给列表项的其他属性。
 *
 * @returns {JSX.Element} 返回一个列表项的 JSX 元素。
 *
 * @remarks
 * - 如果 `element.checked` 是布尔值，则表示这是一个任务列表项。
 * - 使用 `useMemo` 优化渲染性能。
 * - 列表项支持拖拽操作。
 * - 如果是任务列表项，会渲染一个不可编辑的复选框。
 */
export const ListItem = observer(
  ({ element, children, attributes }: ElementProps<ListItemNode>) => {
    const [, update] = useMEditor(element);
    const store = useEditorStore();
    const isTask = typeof element.checked === 'boolean';
    const context = useContext(ConfigProvider.ConfigContext);
    const { hashId } = useContext(ListContext) || {};
    const baseCls = context.getPrefixCls('md-editor-list');
    return React.useMemo(
      () => (
        <li
          className={classNames(`${baseCls}-item`, hashId, {
            [`${baseCls}-task`]: isTask,
          })}
          data-be={'list-item'}
          onDragStart={(e) => store.dragStart(e)}
          {...attributes}
        >
          {isTask && (
            <span
              contentEditable={false}
              className={classNames(`${baseCls}-check-item`, hashId)}
            >
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
