import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { CSSProperties, useContext } from 'react';
import { Editor, Path, Transforms } from 'slate';

import { ReactEditor, RenderLeafProps } from 'slate-react';
import { ArrowUpRight } from '../../../icons';
import { MarkdownEditorProps } from '../../BaseMarkdownEditor';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { CommentView } from './Comment';
import { TagPopup } from './TagPopup';

export type MLeafProps = RenderLeafProps & {
  hashId: string;
  comment: MarkdownEditorProps['comment'];
  fncProps: MarkdownEditorProps['fncProps'];
  tagInputProps: MarkdownEditorProps['tagInputProps'];
  style?: CSSProperties;
  className?: string;
};

// 关键属性列表，用于性能优化比较
const CRITICAL_PROPS = [
  'text',
  'bold',
  'italic',
  'strikethrough',
  'code',
  'tag',
  'url',
  'color',
  'highColor',
  'html',
  'current',
  'fnc',
  'fnd',
  'comment',
  'identifier',
  'placeholder',
  'autoOpen',
  'triggerText',
] as const;

/**
 * 简化的比较函数，用于优化 MLeaf 组件的渲染性能
 */
const areLeafPropsEqual = (prevProps: MLeafProps, nextProps: MLeafProps) => {
  // 快速引用比较
  if (
    prevProps.leaf === nextProps.leaf &&
    prevProps.children === nextProps.children &&
    prevProps.attributes === nextProps.attributes &&
    prevProps.text === nextProps.text &&
    prevProps.hashId === nextProps.hashId &&
    prevProps.comment === nextProps.comment &&
    prevProps.fncProps === nextProps.fncProps &&
    prevProps.tagInputProps === nextProps.tagInputProps
  ) {
    return true;
  }

  // 基本属性比较
  if (
    prevProps.hashId !== nextProps.hashId ||
    prevProps.children !== nextProps.children ||
    prevProps.attributes !== nextProps.attributes ||
    prevProps.text !== nextProps.text ||
    prevProps.comment !== nextProps.comment ||
    prevProps.fncProps !== nextProps.fncProps ||
    prevProps.tagInputProps !== nextProps.tagInputProps
  ) {
    return false;
  }

  // Leaf 对象比较
  if (prevProps.leaf !== nextProps.leaf) {
    const prevLeaf = prevProps.leaf;
    const nextLeaf = nextProps.leaf;

    return CRITICAL_PROPS.every(
      (prop) => (prevLeaf as any)[prop] === (nextLeaf as any)[prop],
    );
  }

  return true;
};

const dragStart = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * 代码和标签组件
 */
const CodeAndTagComponent: React.FC<{
  leaf: any;
  children: React.ReactNode;
  props: MLeafProps;
  mdEditorBaseClass: string;
}> = React.memo(({ leaf, children, props, mdEditorBaseClass }) => {
  const { markdownEditorRef: editorRef } = useEditorStore();

  const handleTagSelect = (v: string, path: Path) => {
    if (!editorRef?.current) return;

    // 延迟选择处理
    setTimeout(() => {
      if (!editorRef.current || !path?.length) return;
      const nextPath = Path.next(path);
      if (!Editor.hasPath(editorRef.current, nextPath)) {
        Transforms.insertNodes(editorRef.current, [{ text: ' ' }], {
          select: true,
        });
      } else {
        Transforms.select(editorRef.current, {
          anchor: Editor.end(editorRef.current, path),
          focus: Editor.end(editorRef.current, path),
        });
      }
    }, 0);
  };

  const { text, tag, placeholder, autoOpen } = leaf as any;
  const { enable } = props.tagInputProps || {};

  if (enable && tag) {
    return (
      <TagPopup
        {...props}
        autoOpen={autoOpen}
        {...props.tagInputProps}
        text={text}
        onSelect={(v, path) => handleTagSelect(v, path as Path)}
        placeholder={placeholder}
      />
    );
  }

  if (leaf.code) {
    return (
      <code
        className={classNames(mdEditorBaseClass, 'code')}
        style={{
          backgroundColor: 'rgb(242, 241, 241)',
          color: 'rgb(27, 27, 27)',
          padding: '0.2em 0.4em',
          borderRadius: '0.3em',
          fontSize: '0.85em',
          fontFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
        }}
      >
        {children}
      </code>
    );
  }

  return <>{children}</>;
});

/**
 * 链接组件
 */
const LinkComponent: React.FC<{
  leaf: any;
  children: React.ReactNode;
  style: CSSProperties;
  readonly: boolean;
  text: string;
  attributes: any;
}> = React.memo(({ leaf, children, text, style, attributes }) => {
  const { markdownEditorRef } = useEditorStore();

  const selectFormat = () => {
    try {
      if (EditorUtils.isDirtLeaf(leaf)) {
        const path = ReactEditor.findPath(markdownEditorRef.current, text);
        if (path) {
          Transforms.select(markdownEditorRef.current, {
            anchor: Editor.start(markdownEditorRef.current, path),
            focus: Editor.end(markdownEditorRef.current, path),
          });
        }
      }
    } catch (e) {}
  };

  const content = (
    <span
      {...attributes}
      style={style}
      onMouseDown={selectFormat}
      onDragStart={dragStart}
      data-be="url"
    >
      {children} <ArrowUpRight />
    </span>
  );
  return content;
});

/**
 * 合并的样式和主要内容组件
 */
const StyledMainContentComponent: React.FC<{
  props: MLeafProps;
  children: React.ReactNode;
}> = React.memo(({ props, children }) => {
  const { leaf, attributes, style } = props;
  const { markdownEditorRef } = useEditorStore();

  const selectFormat = () => {
    try {
      if (EditorUtils.isDirtLeaf(props.leaf)) {
        const path = ReactEditor.findPath(
          markdownEditorRef.current,
          props.text,
        );
        if (path) {
          Transforms.select(markdownEditorRef.current, {
            anchor: Editor.start(markdownEditorRef.current, path),
            focus: Editor.end(markdownEditorRef.current, path),
          });
        }
      }
    } catch (e) {}
  };

  const {
    bold,
    italic,
    strikethrough,
    color,
    highColor,
    current,
    fnc,
    fnd,
    identifier,
  } = leaf as any;

  // 合并样式
  const finalStyle: CSSProperties = {
    ...style,
    fontWeight: bold ? 'bold' : undefined,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: strikethrough ? 'line-through' : undefined,
    color: color || undefined,
    backgroundColor: highColor || undefined,
  };

  // 数据属性
  const dataAttributes: Record<string, any> = {};
  if (current) dataAttributes['data-current'] = current;
  if (fnc) dataAttributes['data-fnc'] = fnc;
  if (fnd) dataAttributes['data-fnd'] = fnd;
  if (identifier) dataAttributes['data-identifier'] = identifier;
  return (
    <span
      data-be="text"
      {...attributes}
      {...dataAttributes}
      style={finalStyle}
      onMouseDown={selectFormat}
      onDragStart={dragStart}
    >
      {children}
    </span>
  );
});

/**
 * 评论视图组件
 */
const CommentViewComponent: React.FC<{
  props: MLeafProps;
  children: React.ReactElement;
}> = React.memo(({ props, children }) => {
  const { comment } = props;
  const { leaf } = props;

  if (!comment || !leaf.comment) {
    return children;
  }

  return (
    <CommentView
      hashId={props.hashId}
      id={`comment-${props.leaf?.id}`}
      comment={comment}
      commentItem={leaf?.comment ? (leaf.data as any) : null}
    >
      {children}
    </CommentView>
  );
});

/**
 * 主 MLeaf 组件
 */
const MLeafComponent = (props: MLeafProps) => {
  const { leaf, children, attributes, style } = props;
  const { readonly } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context?.getPrefixCls('md-editor-content');

  if (leaf.code || leaf.tag) {
    return (
      <CodeAndTagComponent
        leaf={leaf}
        props={props}
        mdEditorBaseClass={mdEditorBaseClass}
      >
        {children}
      </CodeAndTagComponent>
    );
  }

  // 渲染合并后的样式和主要内容
  const styledMainContent = (
    <StyledMainContentComponent props={props}>
      {children}
    </StyledMainContentComponent>
  );

  if (!leaf?.url && !props.comment && !leaf.comment) return styledMainContent;

  // 处理链接
  const linkContent = (
    <LinkComponent
      leaf={leaf}
      style={style || {}}
      readonly={readonly}
      attributes={attributes}
      text={props.text as any as string}
    >
      {styledMainContent}
    </LinkComponent>
  );

  if (!props.comment || !leaf.comment) return linkContent;

  // 处理评论视图
  return (
    <CommentViewComponent props={props}>{linkContent}</CommentViewComponent>
  );
};

// 使用 React.memo 优化 MLeaf 组件的性能
export const MLeaf = React.memo(MLeafComponent, areLeafPropsEqual);
