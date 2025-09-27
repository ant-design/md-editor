import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { BaseRange } from 'slate';
import { ReactEditor } from 'slate-react';
import { CommentDataType, MarkdownEditorProps } from '../../../types';
import { getSelectionFromDomSelection } from '../../utils/editorUtils';

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
  /** 编辑器实例引用 */
  editorRef?: React.MutableRefObject<ReactEditor | null>;
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
  const commentRef = useRef<HTMLSpanElement>(null);

  // 原生 JavaScript 拖拽状态管理 - 避免 React 重新渲染
  const dragStateRef = useRef({
    isDragging: false,
    dragStartPos: null as { x: number; y: number } | null,
    dragEndPos: null as { x: number; y: number } | null,
    dragHandleType: null as 'start' | 'end' | null,
    originalSelection: null as Range | null,
    commentElement: null as HTMLSpanElement | null,
  });

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
   * 合并选择区域并触发 onRangeChange 回调
   */
  const mergeSelectionsAndNotify = useCallback(() => {
    if (!props.editorRef?.current || !thisComment) {
      return;
    }

    const editor = props.editorRef.current;
    const domSelection = window.getSelection();

    if (!domSelection || domSelection.rangeCount === 0) {
      return;
    }

    try {
      // 获取当前的 DOM 选择范围
      const domRange = domSelection.getRangeAt(0);
      const newSlateSelection = getSelectionFromDomSelection(
        editor,
        domSelection,
      );

      if (!newSlateSelection) {
        return;
      }

      // 获取新的选择内容
      const newContent = domRange.toString();

      // 计算新的偏移量
      const newAnchorOffset = newSlateSelection.anchor.offset;
      const newFocusOffset = newSlateSelection.focus.offset;

      // 调用 onRangeChange 回调
      const dragRangeConfig = props.comment?.dragRange;
      if (dragRangeConfig?.onRangeChange && thisComment.id) {
        dragRangeConfig.onRangeChange(
          thisComment.id,
          {
            anchorOffset: newAnchorOffset,
            focusOffset: newFocusOffset,
            refContent: newContent,
            selection: newSlateSelection,
          },
          newContent,
        );
      }
    } catch (error) {
      console.error('合并选择区域时出错:', error);
    }
  }, [props.editorRef, props.comment, thisComment]);

  /**
   * 拖拽移动处理
   */
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (
      !dragStateRef.current.isDragging ||
      !dragStateRef.current.commentElement
    ) {
      return;
    }

    e.preventDefault();
    dragStateRef.current.dragEndPos = { x: e.clientX, y: e.clientY };
  }, []);

  /**
   * 结束拖拽处理
   */
  const handleDragEnd = useCallback(() => {
    if (!dragStateRef.current.isDragging) {
      return;
    }

    dragStateRef.current.isDragging = false;

    // 移除全局事件监听器
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

    // 合并选择区域并通知
    setTimeout(() => {
      mergeSelectionsAndNotify();
    }, 100);

    // 重置拖拽状态
    dragStateRef.current.dragStartPos = null;
    dragStateRef.current.dragEndPos = null;
    dragStateRef.current.dragHandleType = null;
    dragStateRef.current.originalSelection = null;
    dragStateRef.current.commentElement = null;
  }, [handleDragMove, mergeSelectionsAndNotify]);

  /**
   * 开始拖拽处理
   */
  const handleDragStart = useCallback(
    (handleType: 'start' | 'end', e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!commentRef.current || !props.editorRef?.current) {
        return;
      }

      dragStateRef.current.isDragging = true;
      dragStateRef.current.dragHandleType = handleType;
      dragStateRef.current.dragStartPos = { x: e.clientX, y: e.clientY };
      dragStateRef.current.commentElement = commentRef.current;

      // 保存原始选择状态
      const domSelection = window.getSelection();
      dragStateRef.current.originalSelection =
        domSelection && domSelection.rangeCount > 0
          ? domSelection.getRangeAt(0)
          : null;

      // 添加全局事件监听器
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    },
    [props.editorRef, handleDragMove, handleDragEnd],
  );

  // 清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

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
      {dragRangeConfig?.enable && (
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
            onMouseDown={(e) => handleDragStart('start', e)}
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
            onMouseDown={(e) => handleDragStart('end', e)}
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
