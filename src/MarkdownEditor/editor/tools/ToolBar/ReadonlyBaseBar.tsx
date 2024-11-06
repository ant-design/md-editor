import { CommentOutlined, CopyFilled } from '@ant-design/icons';
import { Input, message, Modal } from 'antd';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { Editor, Element, Node, Point, Transforms } from 'slate';
import { CommentDataType } from '../../../index';
import { useEditorStore } from '../../store';
import {
  getPointStrOffset,
  getSelectionFromDomSelection,
} from '../../utils/editorUtils';

/**
 * 复制基础栏
 * @param props
 * @returns
 */
export const ReadonlyBaseBar = observer(
  (props: { prefix?: string; hashId?: string }) => {
    const baseClassName = props.prefix || `toolbar-action`;
    const { hashId } = props;

    const { store } = useEditorStore();

    const [, setRefresh] = React.useState(false);

    useEffect(() => {
      setRefresh((r) => !r);
    }, [store.refreshFloatBar]);

    /**
     * 获取当前节点
     */
    const [node] = Editor.nodes<any>(store?.editor, {
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    });

    const listDom = useMemo(() => {
      let list = [];

      if (store?.editorProps?.comment?.onSubmit) {
        list.push(
          <div
            role="button"
            key="comment"
            className={classnames(`${baseClassName}-item`, hashId)}
            onClick={() => {
              const domSelection = window.getSelection();
              const editor = store?.editor;
              let selection = editor.selection;
              if (!selection) {
                if (domSelection) {
                  selection = getSelectionFromDomSelection(
                    store?.editor,
                    domSelection!,
                  );
                }

                if (!selection) {
                  return;
                }
              }

              let texts: string[] = [];
              let title = '';
              const fragments = Node.fragment(editor, selection);
              for (let i = 0; i < fragments.length; i++) {
                texts.push(Node.string(fragments[i]));
              }
              for (const str of texts) {
                title += str;
              }
              const { focus, anchor } = selection;
              const [start, end] = Point.isAfter(focus, anchor)
                ? [anchor, focus]
                : [focus, anchor];
              const anchorOffset = getPointStrOffset(editor, start);
              const focusOffset = getPointStrOffset(editor, end);

              const comment: CommentDataType = {
                selection: { anchor: start, focus: end },
                path: start.path,
                time: Date.now(),
                id: Date.now(),
                content: '',
                anchorOffset: anchorOffset,
                focusOffset: focusOffset,
                refContent: title,
                commentType: 'comment',
              };
              Modal.confirm({
                title: '添加评论',
                content: (
                  <Input.TextArea
                    style={{
                      width: '100%',
                      height: 100,
                      resize: 'none',
                    }}
                    onChange={(e) => {
                      comment.content = e.target.value;
                    }}
                  />
                ),
                icon: null,
                onOk: async () => {
                  if (comment.content.trim() === '') {
                    return;
                  }
                  try {
                    await store?.editorProps?.comment?.onSubmit?.(
                      comment.id + '',
                      comment,
                    );
                    // 更新时间戳,触发一下dom的rerender，不然不给我更新
                    Transforms.setNodes(
                      editor,
                      {
                        updateTimestamp: Date.now(),
                      },
                      {
                        at: comment.path,
                      },
                    );
                  } catch (error) {}
                },
              });
            }}
          >
            <CommentOutlined />
          </div>,
        );
      }

      list.push(
        <div
          role="button"
          key="insert"
          className={classnames(`${baseClassName}-item`, hashId)}
          onClick={() => {
            const domSelection = window.getSelection();
            const editor = store?.editor;
            let selection = editor.selection;
            if (!selection) {
              if (domSelection) {
                selection = getSelectionFromDomSelection(
                  store?.editor,
                  domSelection!,
                );
              }

              if (!selection) {
                return;
              }
            }

            let texts: string[] = [];
            let title = '';
            const fragments = Node.fragment(editor, selection);
            for (let i = 0; i < fragments.length; i++) {
              texts.push(Node.string(fragments[i]));
            }

            for (const str of texts) {
              title += str;
            }
            navigator.clipboard.writeText(title);
            message.success('Copy Success');
          }}
        >
          <span>
            <CopyFilled />
          </span>
        </div>,
      );

      return list;
    }, [node]);

    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '1px',
          alignItems: 'center',
        }}
      >
        {listDom}
      </div>
    );
  },
);
