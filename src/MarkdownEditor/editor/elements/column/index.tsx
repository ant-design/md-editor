import { DeleteFilled } from '@ant-design/icons';
import { ConfigProvider, Modal, Popover } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Node, Transforms } from 'slate';
import { useSelStatus } from '../../../hooks/editor';
import { ActionIconBox } from '../../components/ActionIconBox';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { ColumnIcon, ColumnThreeIcon } from '../../tools/InsertAutocomplete';
import { useStyle } from './style';

export function ColumnCell(props: RenderElementProps) {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-column-group-cell');
  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'column-group-cell'}
        className={baseCls}
      >
        {props.children}
      </div>
    );
  }, [props.element, props.element.children]);
}
const genChildren = (children: any, num: number) => {
  return [
    ...new Array(num).fill(null).map((_, index) => {
      return (
        children?.at(index) || {
          type: 'column-cell',
          children: [
            {
              text: '',
            },
          ],
        }
      );
    }),
  ];
};
export const ColumnGroup = (props: RenderElementProps) => {
  const { store, markdownEditorRef } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-column-group');
  const { wrapSSR, hashId } = useStyle(baseCls);
  const [, path] = useSelStatus(props.element);

  return useMemo(() => {
    return wrapSSR(
      <div
        className={'ant-md-editor-drag-el'}
        {...props.attributes}
        data-be={'column-group'}
        onDragStart={store.dragStart}
        style={{
          ...(props.element.style || {}),
          maxWidth: '100%',
        }}
      >
        <Popover
          arrow={false}
          styles={{
            body: {
              padding: 8,
            },
          }}
          content={
            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <ActionIconBox
                title="调整为两列"
                onClick={() => {
                  const thisNode = Node.get(markdownEditorRef.current, path);
                  Transforms.delete(markdownEditorRef.current, {
                    at: path,
                  });
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      ...thisNode,
                      children: genChildren(thisNode.children, 2),
                    },
                    {
                      at: path,
                    },
                  );
                }}
              >
                <ColumnIcon
                  style={{
                    fontSize: 16,
                  }}
                />
              </ActionIconBox>
              <ActionIconBox
                title="调整为三列"
                onClick={() => {
                  const thisNode = Node.get(markdownEditorRef.current, path);
                  Transforms.delete(markdownEditorRef.current, {
                    at: path,
                  });
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      ...thisNode,
                      children: genChildren(thisNode.children, 3),
                    },
                    {
                      at: path,
                    },
                  );
                }}
              >
                <ColumnThreeIcon
                  style={{
                    fontSize: 16,
                  }}
                />
              </ActionIconBox>
              <ActionIconBox
                title="删除"
                type="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: '删除媒体',
                    content: '确定删除该媒体吗？',
                    onOk: () => {
                      Transforms.removeNodes(markdownEditorRef.current, {
                        at: path,
                      });
                    },
                  });
                }}
              >
                <DeleteFilled
                  style={{
                    fontSize: 16,
                  }}
                />
              </ActionIconBox>
            </div>
          }
          trigger="click"
        >
          <PanelGroup
            direction="horizontal"
            className={classNames(hashId, baseCls)}
          >
            {props.children?.map((child: any, index: number) => {
              if (index !== props.children?.length - 1) {
                return (
                  <React.Fragment key={index}>
                    <Panel key={index}>{child}</Panel>
                    <PanelResizeHandle
                      className={classNames(`${baseCls}-resize-handle`, hashId)}
                    />
                  </React.Fragment>
                );
              }
              return <Panel key={index}>{child}</Panel>;
            })}
          </PanelGroup>
        </Popover>
      </div>,
    );
  }, [props.element.children]);
};
