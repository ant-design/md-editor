import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { BaseRange } from 'slate';
import { ReactEditor } from 'slate-react';
import { CommentDataType, MarkdownEditorProps } from '../../../types';
import { useEditorStore } from '../../store';

/**
 * 评论视图组件的属性接口
 */
interface CommentViewProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 评论配置对象 */
  comment: MarkdownEditorProps['comment'];
  /** 评论数据列表 */
  commentItem: CommentDataType[];
  /** 评论的唯一标识符 */
  id: string;
  /** Slate.js 选择范围 */
  selection?: BaseRange;
  /** 哈希标识符用于样式类名 */
  hashId: string;
  /** 设置显示评论的回调函数 */
  setShowComment?: (comments: CommentDataType[]) => void;
}

/**
 * 评论视图组件 - 显示和管理 Markdown 编辑器中的评论
 *
 * 功能特性：
 * - 支持评论范围的拖拽调整
 * - 提供可视化的拖拽手柄
 * - 支持实时范围高亮显示
 * - 集成 Slate.js 进行精确的文本范围计算
 *
 * @param props - 组件属性
 * @returns 渲染的评论视图组件
 */
export const CommentView = (props: CommentViewProps) => {
  const { setShowComment } = props;
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context?.getPrefixCls('md-editor-content');
  const { markdownEditorRef } = useEditorStore();
  const commentRef = useRef<HTMLSpanElement>(null);

  // 原生 JavaScript 拖拽状态管理 - 避免 React 重新渲染
  const dragStateRef = useRef({
    isDragging: false,
    dragStartPos: null as { x: number; y: number } | null,
    dragEndPos: null as { x: number; y: number } | null,
  });

  // CSS Custom Highlight 相关状态 - 使用原生 JS 优化性能
  const highlightRef = useRef<Highlight | null>(null);
  const highlightRangesRef = useRef<Range[]>([]);

  /**
   * 查找当前评论数据
   * 通过解析 props.id 来匹配对应的评论项
   */
  const thisComment = useMemo(() => {
    return props.commentItem?.find?.(
      (c) => `${c.id}` === props.id.split('-').at(-1),
    );
  }, [props.id]);

  /**
   * 清除原生 CSS Custom Highlight
   */
  const clearNativeHighlight = () => {
    try {
      if (highlightRef.current && CSS.highlights.has('comment-drag-preview')) {
        CSS.highlights.get('comment-drag-preview')?.clear();
        highlightRef.current = null;
        highlightRangesRef.current = [];
      }
    } catch (error) {
      console.error('清除原生 CSS Custom Highlight 时出错:', error);
    }
  };

  /**
   * 获取编辑器的当前选择，包含 comment 的 Selection
   */
  const getEditorSelection = () => {
    const editor = markdownEditorRef.current;
    if (!editor) return null;

    try {
      // 获取编辑器的当前选择
      let selection = null;

      // 如果仍然没有选择，返回 null
      if (!selection) {
        const range = window.getSelection();
        if (!range) return null;
        const slateRange = ReactEditor.toSlateRange(editor, range, {
          exactMatch: true,
          suppressThrow: false,
        });

        selection = slateRange;
      }

      if (!selection) return null;

      // 转换为 DOM Range
      const domRange = ReactEditor.toDOMRange(editor, selection);
      if (!domRange) return null;

      return {
        slateSelection: selection,
        domRange,
        startOffset: selection.anchor.offset,
        endOffset: selection.focus.offset,
      };
    } catch (error) {
      console.warn('获取编辑器选择失败:', error);
      return null;
    }
  };

  /**
   * 原生 JavaScript 拖拽开始处理
   * 避免 React 状态更新导致的卡顿
   */
  const handleNativeMouseDown = (e: React.MouseEvent) => {
    const dragRangeConfig = props.comment?.dragRange;
    if (!dragRangeConfig?.enable) return;
    const dragState = dragStateRef.current;
    dragState.dragStartPos = {
      x: e.clientX,
      y: e.clientY,
    };
    dragState.isDragging = true;

    e.stopPropagation();
    // 添加拖拽样式类
    const commentElement = commentRef.current;
    if (commentElement) {
      commentElement.classList.add('comment-dragging');
    }
  };

  /**
   * 原生 JavaScript 拖拽移动处理
   */
  const handleNativeMouseMove = (e: MouseEvent) => {
    const dragState = dragStateRef.current;

    // 更新拖拽位置
    dragState.dragEndPos = { x: e.clientX, y: e.clientY };
  };

  /**
   * 原生 JavaScript 拖拽结束处理
   */
  const handleNativeMouseUp = () => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) {
      return;
    }

    const commentElement = commentRef.current;

    try {
      if (!dragState.dragStartPos || !dragState.dragEndPos) {
        return;
      }
      // 直接获取编辑器的选择
      const editorSelection = getEditorSelection();
      if (!editorSelection) return;

      const { slateSelection, domRange, startOffset, endOffset } =
        editorSelection;

      // 获取选中范围内的文本内容
      const newContent = domRange.toString();

      const dragRangeConfig = props.comment?.dragRange;
      const onRangeChange = dragRangeConfig?.onRangeChange;
      if (onRangeChange && newContent && thisComment) {
        onRangeChange(
          thisComment.id,
          {
            anchorOffset: startOffset,
            focusOffset: endOffset,
            refContent: newContent,
            selection: slateSelection,
          },
          newContent,
        );
      }
    } finally {
      // 清除原生 CSS Custom Highlight
      clearNativeHighlight();

      // 重置拖拽状态
      dragStateRef.current = {
        isDragging: false,
        dragStartPos: null,
        dragEndPos: null,
      };

      // 移除拖拽样式类
      if (commentElement) {
        commentElement.classList.remove('comment-dragging');
      }
    }
  };

  /**
   * 评论范围拖拽功能的核心逻辑
   *
   * 实现功能：
   * - 监听鼠标事件以处理拖拽操作
   * - 区分开始和结束拖拽点
   * - 使用 Slate.js API 进行精确的文本范围计算
   * - 支持拖拽过程中的实时反馈
   * - 提供降级处理机制
   */
  // 原生 JavaScript 拖拽功能 - 避免 React 重新渲染
  useEffect(() => {
    if (
      !props.comment?.dragRange?.enable ||
      !thisComment ||
      !commentRef.current
    ) {
      return;
    }

    // 使用原生 JavaScript 事件监听器，避免 React 重新渲染
    document.addEventListener('mousemove', handleNativeMouseMove);
    document.addEventListener('mouseup', handleNativeMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleNativeMouseMove);
      document.removeEventListener('mouseup', handleNativeMouseUp);
    };
  }, [props.comment?.dragRange, thisComment]);

  // 添加 CSS Custom Highlight 样式

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
        [`${mdEditorBaseClass}-comment-dragging`]:
          dragStateRef.current.isDragging,
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
        e.stopPropagation();
        setShowComment?.(
          props.commentItem?.filter((item: any) => Boolean(item.content)),
        );
      }}
    >
      {props.children}

      {/* 拖拽手柄 */}
      {dragRangeConfig?.enable && !dragStateRef.current.isDragging && (
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
              top: '0',
              width: '12px',
              maxHeight: '24px',
              height: '100%',
              cursor: 'grab',
              zIndex: 1001,
              opacity: dragRangeConfig.handleStyle?.opacity || 0.8,
              transition: 'all 0.1s ease-out', // 添加过渡效果提高跟手性
            }}
            onMouseDown={(e) => handleNativeMouseDown(e)}
          >
            {/* 浏览器原生选择手柄样式 */}
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#1890ff',
                borderRadius: '1px',
                position: 'absolute',
                top: '2px',
                left: '3px',
                border: '1px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            {/* 垂直线 - 更细更自然 */}
            <div
              style={{
                width: '1px',
                height: 'calc(100% - 8px)',
                backgroundColor: '#1890ff',
                position: 'absolute',
                top: '4px',
                left: '5px',
                opacity: 0.8,
              }}
            />
            {/* 底部指示器 */}
            <div
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#1890ff',
                borderRadius: '1px',
                position: 'absolute',
                bottom: '2px',
                left: '3px',
                border: '1px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          </div>
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
              bottom: '0',
              maxHeight: '24px',
              width: '12px',
              height: '100%',
              cursor: 'grab',
              zIndex: 1001,
              opacity: dragRangeConfig.handleStyle?.opacity || 0.8,
            }}
            onMouseDown={(e) => handleNativeMouseDown(e)}
          >
            {/* 浏览器原生选择手柄样式 */}
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#1890ff',
                borderRadius: '1px',
                position: 'absolute',
                top: '2px',
                left: '3px',
                border: '1px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            {/* 垂直线 - 更细更自然 */}
            <div
              style={{
                width: '1px',
                height: 'calc(100% - 8px)',
                backgroundColor: '#1890ff',
                position: 'absolute',
                top: '4px',
                left: '5px',
                opacity: 0.8,
              }}
            />
            {/* 底部指示器 */}
            <div
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#1890ff',
                borderRadius: '1px',
                position: 'absolute',
                bottom: '2px',
                left: '3px',
                border: '1px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </>
      )}
    </span>
  );
};

/**
 * 评论创建组件的属性接口
 */
interface CommentCreateProps {
  /** 评论配置对象 */
  comment: MarkdownEditorProps['comment'];
}

/**
 * 评论创建组件 - 提供创建新评论的界面
 *
 * 功能说明：
 * - 如果提供了自定义的编辑器渲染器，则使用自定义渲染
 * - 否则渲染默认的空白创建界面
 * - 支持测试标识符以便于测试
 *
 * @param props - 组件属性
 * @returns 渲染的评论创建组件
 */
export const CommentCreate = (props: CommentCreateProps) => {
  const dom = <div data-testid="comment-create-default"></div>;
  if (props.comment?.editorRender) {
    return props.comment.editorRender(dom);
  }
  return <div data-testid="comment-create-default"></div>;
};
