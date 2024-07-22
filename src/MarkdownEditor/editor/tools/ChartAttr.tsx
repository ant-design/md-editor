import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef } from 'react';
import { NodeEntry, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ChartNode } from '../../el';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';

/**
 * 图表设置器
 */
export const ChartAttr: React.FC<{
  options?: {
    icon: React.ReactNode;
    title?: string;
    onClick?: () => void;
  }[];
  node: NodeEntry<ChartNode>;
}> = observer((props) => {
  const store = useEditorStore();
  const editor = store.editor;

  const chartNodeRef = useRef<NodeEntry<ChartNode>>();

  const remove = useCallback(() => {
    const chart = props.node || store?.chartNode?.at(0);
    if (!chart) return;

    Transforms.delete(editor, { at: EditorUtils.findPath(editor, chart!) });
    chartNodeRef.current = undefined;
    ReactEditor.focus(editor);
  }, [editor]);

  const baseClassName = 'chart-attr-toolbar';

  return (
    <div
      className={baseClassName}
      style={{
        width: 'auto',
      }}
      contentEditable={false}
    >
      {props?.options?.map((item, index) => {
        if (!item.title) {
          return (
            <div
              key={index}
              className={`${baseClassName}-item`}
              onClick={item.onClick}
            >
              {item.icon}
            </div>
          );
        }
        return (
          <Tooltip key={index} title={item.title}>
            <div className={`${baseClassName}-item`} onClick={item.onClick}>
              {item.icon}
            </div>
          </Tooltip>
        );
      })}
      <Tooltip title="删除">
        <div className={`${baseClassName}-item`}>
          <DeleteOutlined onClick={remove} />
        </div>
      </Tooltip>
    </div>
  );
});
