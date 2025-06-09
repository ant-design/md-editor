import React from 'react';
import { Transforms } from 'slate';
import { useSelStatus } from '../../../../MarkdownEditor/hooks/editor';
import { RenderElementProps, useSlate } from '../../slate-react';

export const WarpCard = (props: RenderElementProps) => {
  const [selected, path] = useSelStatus(props.element);
  const editor = useSlate();
  const [isHovered, setIsHovered] = React.useState(false);

  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'card'}
        role="button"
        tabIndex={0}
        aria-selected={selected}
        aria-label="可选择的卡片元素"
        onClick={(e) => {
          e.stopPropagation();
          // 直接选中卡片节点，避免默认选中card-before
          // 我们的normalizeCardSelection会自动将其重定向到card-after
          Transforms.select(editor, path);
          e.preventDefault();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            Transforms.select(editor, path);
          }
        }}
        style={{
          ...props.element.style,
          padding: 12,
          borderRadius: 6,
          display: props.element.block === false ? 'inline-flex' : 'flex',
          gap: 4,
          maxWidth: '100%',
          alignItems: 'flex-end',
          position: 'relative',
          width: 'max-content',
          cursor: 'pointer',
          backgroundColor: selected
            ? 'rgba(24, 144, 255, 0.05)'
            : isHovered
              ? 'rgba(64, 169, 255, 0.03)'
              : 'transparent',
          transition: 'all 0.2s ease-in-out',
          outline: selected ? '2px solid #1890ff' : 'none',
        }}
      >
        {props.children}
      </div>
    );
  }, [
    props.element.children,
    selected,
    path,
    props.element.block,
    editor,
    isHovered,
  ]);
};
