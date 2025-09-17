import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BaseRange } from 'slate';
import { CommentDataType, MarkdownEditorProps } from '../../../types';
import { useEditorStore } from '../../store';

export const CommentView = (props: {
  children: React.ReactNode;
  comment: MarkdownEditorProps['comment'];
  commentItem: CommentDataType[];
  id: string;
  selection?: BaseRange;
  hashId: string;
  setShowComment?: (comments: CommentDataType[]) => void;
}) => {
  const { setShowComment } = props;
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context?.getPrefixCls('md-editor-content');
  const { markdownEditorRef } = useEditorStore();
  const commentRef = useRef<HTMLSpanElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'start' | 'end' | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragEndPos, setDragEndPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const thisComment = useMemo(() => {
    return props.commentItem?.find?.(
      (c) => `${c.id}` === props.id.split('-').at(-1),
    );
  }, [props.id]);

  // 评论范围拖拽功能
  useEffect(() => {
    if (
      !props.comment?.dragRange?.enable ||
      !thisComment ||
      !commentRef.current
    ) {
      return;
    }

    const commentElement = commentRef.current;
    const dragRangeConfig = props.comment.dragRange;
    const onRangeChange = dragRangeConfig.onRangeChange;

    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button !== 0) return; // 只处理左键

      const rect = commentElement.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const elementWidth = rect.width;

      // 判断点击位置：前1/3为开始拖拽，后1/3为结束拖拽
      let dragType: 'start' | 'end' | null = null;
      if (clickX < elementWidth / 3) {
        dragType = 'start';
      } else if (clickX > (elementWidth * 2) / 3) {
        dragType = 'end';
      }

      if (dragType) {
        setIsDragging(true);
        setDragType(dragType);
        setDragStartPos({ x: e.clientX, y: e.clientY });
        setDragEndPos({ x: e.clientX, y: e.clientY });

        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setDragEndPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (!isDragging || !dragStartPos || !dragEndPos || !dragType) return;

      // 使用 Slate.js 来计算准确的文本内容
      const textElement =
        commentElement.querySelector('span') || commentElement;
      const elementRect = textElement.getBoundingClientRect();

      // 获取 Slate.js 编辑器实例
      const editor = markdownEditorRef.current;
      if (!editor) {
        console.warn('无法获取 Slate.js 编辑器实例');
        return;
      }

      // 使用 Slate.js 的 API 来获取准确的文本内容
      try {
        // 获取当前选中的范围
        const currentSelection = props.selection || thisComment.selection;
        if (!currentSelection) {
          console.warn('当前没有选中范围', thisComment);
          return;
        }

        // 计算拖拽距离
        const dragDistance = dragEndPos.x - dragStartPos.x;
        const dragDistanceInChars = Math.round(
          (Math.abs(dragDistance) / elementRect.width) *
            Math.max(
              currentSelection.focus.offset - currentSelection.anchor.offset,
              1,
            ),
        );

        let newAnchorOffset = currentSelection.anchor.offset;
        let newFocusOffset = currentSelection.focus.offset;

        // 根据拖拽类型调整范围
        if (dragType === 'start') {
          // 拖拽开始位置
          if (dragDistance < 0) {
            // 向左拖拽，扩大范围
            newAnchorOffset = Math.max(
              0,
              newAnchorOffset - dragDistanceInChars,
            );
          } else {
            // 向右拖拽，缩小范围
            newAnchorOffset = Math.min(
              newFocusOffset - 1,
              newAnchorOffset + dragDistanceInChars,
            );
          }
        } else if (dragType === 'end') {
          // 拖拽结束位置
          if (dragDistance > 0) {
            // 向右拖拽，扩大范围
            newFocusOffset = newFocusOffset + dragDistanceInChars;
          } else {
            // 向左拖拽，缩小范围
            newFocusOffset = Math.max(
              newAnchorOffset + 1,
              newFocusOffset - dragDistanceInChars,
            );
          }
        }

        // 确保范围有效
        if (newAnchorOffset >= newFocusOffset) {
          return;
        }

        // 使用 Slate.js 的 API 获取文本内容
        const newRange = {
          anchor: {
            ...currentSelection.anchor,
            offset: newAnchorOffset,
          },
          focus: {
            ...currentSelection.focus,
            offset: newFocusOffset,
          },
        };

        // 获取选中范围内的文本内容
        const newContent = editor.string(newRange);

        if (onRangeChange && newContent) {
          onRangeChange(
            thisComment.id,
            {
              anchorOffset: newAnchorOffset,
              focusOffset: newFocusOffset,
              refContent: newContent,
            },
            newContent,
          );
        }
      } catch (error) {
        console.error('使用 Slate.js 计算文本内容时出错:', error);
        // 降级到简单的字符串切片
        const textContent = textElement.textContent || '';
        const currentSelection = thisComment.selection;
        if (!currentSelection) return;

        const dragDistance = dragEndPos.x - dragStartPos.x;
        const dragDistanceInChars = Math.round(
          (Math.abs(dragDistance) / elementRect.width) * textContent.length,
        );

        let newAnchorOffset = currentSelection.anchor.offset;
        let newFocusOffset = currentSelection.focus.offset;

        if (dragType === 'start') {
          if (dragDistance < 0) {
            newAnchorOffset = Math.max(
              0,
              newAnchorOffset - dragDistanceInChars,
            );
          } else {
            newAnchorOffset = Math.min(
              newFocusOffset - 1,
              newAnchorOffset + dragDistanceInChars,
            );
          }
        } else if (dragType === 'end') {
          if (dragDistance > 0) {
            newFocusOffset = newFocusOffset + dragDistanceInChars;
          } else {
            newFocusOffset = Math.max(
              newAnchorOffset + 1,
              newFocusOffset - dragDistanceInChars,
            );
          }
        }

        if (newAnchorOffset >= newFocusOffset) {
          return;
        }

        const newContent = textContent.slice(newAnchorOffset, newFocusOffset);

        if (onRangeChange && newContent) {
          onRangeChange(
            thisComment.id,
            {
              anchorOffset: newAnchorOffset,
              focusOffset: newFocusOffset,
              refContent: newContent,
            },
            newContent,
          );
        }
      }

      setIsDragging(false);
      setDragType(null);
      setDragStartPos(null);
      setDragEndPos(null);
    };

    // 添加事件监听器
    commentElement.addEventListener('mousedown', handleMouseDown as any);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      commentElement.removeEventListener('mousedown', handleMouseDown as any);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    props.comment?.dragRange,
    thisComment,
    isDragging,
    dragStartPos,
    dragEndPos,
  ]);

  if (!props.commentItem?.length) {
    return <>{props.children}</>;
  }

  const type = thisComment?.commentType || 'comment';
  const dragRangeConfig = props.comment?.dragRange;

  return (
    <span
      ref={commentRef}
      data-be="comment-text"
      data-testid="comment-view"
      id={props.id}
      className={classNames(props.hashId, {
        [`${mdEditorBaseClass}-comment-${type}`]: type,
        [`${mdEditorBaseClass}-comment-dragging`]: isDragging,
      })}
      style={{
        position: 'relative',
        cursor: dragRangeConfig?.enable ? 'text' : 'pointer',
        userSelect: dragRangeConfig?.enable ? 'text' : 'none',
      }}
      onClick={(e) => {
        if (dragRangeConfig?.enable) {
          // 如果启用了拖拽功能，不阻止默认行为
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        setShowComment?.(
          props.commentItem?.filter((item: any) => Boolean(item.content)),
        );
      }}
    >
      {props.children}

      {/* 拖拽过程中的高亮显示 */}
      {isDragging &&
        dragStartPos &&
        dragEndPos &&
        dragRangeConfig?.highlightStyle && (
          <div
            className={classNames(
              'comment-drag-highlight',
              `comment-drag-highlight-${dragType}`,
              dragRangeConfig.highlightStyle.className,
            )}
            style={{
              position: 'absolute',
              left:
                dragType === 'start'
                  ? Math.min(dragStartPos.x, dragEndPos.x) -
                    (commentRef.current?.getBoundingClientRect().left || 0)
                  : 0,
              top: 0,
              width:
                dragType === 'start'
                  ? Math.abs(dragEndPos.x - dragStartPos.x)
                  : Math.max(dragStartPos.x, dragEndPos.x) -
                    (commentRef.current?.getBoundingClientRect().left || 0),
              height: '100%',
              backgroundColor:
                dragRangeConfig.highlightStyle.backgroundColor ||
                'rgba(24, 144, 255, 0.2)',
              border:
                dragRangeConfig.highlightStyle.border ||
                '1px solid rgba(24, 144, 255, 0.5)',
              borderRadius:
                dragRangeConfig.highlightStyle.borderRadius || '2px',
              opacity: dragRangeConfig.highlightStyle.opacity || 0.8,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          />
        )}

      {/* 拖拽手柄 */}
      {dragRangeConfig?.enable && !isDragging && (
        <>
          {/* 开始拖拽手柄 */}
          <div
            className={classNames(
              'comment-drag-handle',
              'comment-drag-handle-start',
              dragRangeConfig.handleStyle?.className,
            )}
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: dragRangeConfig.handleStyle?.size || '6px',
              height: dragRangeConfig.handleStyle?.size || '6px',
              backgroundColor:
                dragRangeConfig.handleStyle?.backgroundColor || '#1890ff',
              borderRadius: dragRangeConfig.handleStyle?.borderRadius || '50%',
              opacity: dragRangeConfig.handleStyle?.opacity || 0.6,
              cursor: 'grab',
              zIndex: 1001,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
              setDragType('start');
              setDragStartPos({ x: e.clientX, y: e.clientY });
              setDragEndPos({ x: e.clientX, y: e.clientY });
            }}
          />
          {/* 结束拖拽手柄 */}
          <div
            className={classNames(
              'comment-drag-handle',
              'comment-drag-handle-end',
              dragRangeConfig.handleStyle?.className,
            )}
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: dragRangeConfig.handleStyle?.size || '6px',
              height: dragRangeConfig.handleStyle?.size || '6px',
              backgroundColor:
                dragRangeConfig.handleStyle?.backgroundColor || '#1890ff',
              borderRadius: dragRangeConfig.handleStyle?.borderRadius || '50%',
              opacity: dragRangeConfig.handleStyle?.opacity || 0.6,
              cursor: 'grab',
              zIndex: 1001,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
              setDragType('end');
              setDragStartPos({ x: e.clientX, y: e.clientY });
              setDragEndPos({ x: e.clientX, y: e.clientY });
            }}
          />
        </>
      )}
    </span>
  );
};

export const CommentCreate = (props: {
  comment: MarkdownEditorProps['comment'];
}) => {
  const dom = <div data-testid="comment-create-default"></div>;
  if (props.comment?.editorRender) {
    return props.comment.editorRender(dom);
  }
  return <div data-testid="comment-create-default"></div>;
};
