import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CommentDataType, MarkdownEditorProps } from '../../../types';
import { useEditorStore } from '../../store';

export const CommentView = (props: {
  children: React.ReactNode;
  comment: MarkdownEditorProps['comment'];
  commentItem: CommentDataType[];
  id: string;
  hashId: string;
  setShowComment?: (comments: CommentDataType[]) => void;
}) => {
  const { setShowComment } = props;
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context?.getPrefixCls('md-editor-content');
  const { markdownEditorRef } = useEditorStore();
  const commentRef = useRef<HTMLSpanElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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

      setIsDragging(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setDragEndPos({ x: e.clientX, y: e.clientY });

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setDragEndPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (!isDragging || !dragStartPos || !dragEndPos) return;

      // 计算新的选中范围
      const startOffset = Math.min(dragStartPos.x, dragEndPos.x);
      const endOffset = Math.max(dragStartPos.x, dragEndPos.x);

      // 使用 Slate.js 来计算准确的文本内容
      const textElement =
        commentElement.querySelector('span') || commentElement;
      const elementRect = textElement.getBoundingClientRect();

      const relativeStart = Math.max(0, startOffset - elementRect.left);
      const relativeEnd = Math.min(
        elementRect.width,
        endOffset - elementRect.left,
      );

      // 获取 Slate.js 编辑器实例
      const editor = markdownEditorRef.current;
      if (!editor) {
        console.warn('无法获取 Slate.js 编辑器实例');
        return;
      }

      // 使用 Slate.js 的 API 来获取准确的文本内容
      try {
        // 获取当前选中的范围
        const currentSelection = thisComment.selection;
        if (!currentSelection) {
          console.warn('当前没有选中范围');
          return;
        }

        // 计算新的选中范围
        const startCharIndex = Math.round(
          (relativeStart / elementRect.width) *
            Math.max(
              currentSelection.focus.offset - currentSelection.anchor.offset,
              1,
            ),
        );
        const endCharIndex = Math.round(
          (relativeEnd / elementRect.width) *
            Math.max(
              currentSelection.focus.offset - currentSelection.anchor.offset,
              1,
            ),
        );

        // 使用 Slate.js 的 API 获取文本内容
        const newRange = {
          anchor: currentSelection.anchor,
          focus: {
            ...currentSelection.focus,
            offset: currentSelection.focus.offset + endCharIndex,
          },
        };
        // 获取选中范围内的文本内容
        const newContent = editor.string(newRange);

        if (onRangeChange && newContent) {
          onRangeChange(
            thisComment.id,
            {
              anchorOffset: currentSelection.anchor.offset + startCharIndex,
              focusOffset: currentSelection.focus.offset + endCharIndex,
              refContent: newContent,
            },
            newContent,
          );
        }
      } catch (error) {
        console.error('使用 Slate.js 计算文本内容时出错:', error);
        // 降级到简单的字符串切片
        const textContent = textElement.textContent || '';
        const startCharIndex = Math.round(
          (relativeStart / elementRect.width) * textContent.length,
        );
        const endCharIndex = Math.round(
          (relativeEnd / elementRect.width) * textContent.length,
        );
        const newContent = textContent.slice(startCharIndex, endCharIndex);

        if (onRangeChange && newContent) {
          onRangeChange(
            thisComment.id,
            {
              anchorOffset: startCharIndex,
              focusOffset: endCharIndex,
              refContent: newContent,
            },
            newContent,
          );
        }
      }

      setIsDragging(false);
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
              dragRangeConfig.highlightStyle.className,
            )}
            style={{
              position: 'absolute',
              left:
                Math.min(dragStartPos.x, dragEndPos.x) -
                (commentRef.current?.getBoundingClientRect().left || 0),
              top: 0,
              width: Math.abs(dragEndPos.x - dragStartPos.x),
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
        <div
          className={classNames(
            'comment-drag-handle',
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
            setDragStartPos({ x: e.clientX, y: e.clientY });
            setDragEndPos({ x: e.clientX, y: e.clientY });
          }}
        />
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
