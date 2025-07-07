import React from 'react';
import { useSelStatus } from '../../../../MarkdownEditor/hooks/editor';
import { RenderElementProps, useSlate } from '../../slate-react';
import { useEditorStore } from '../../store';

export const WarpCard = (props: RenderElementProps) => {
  const [selected, path] = useSelStatus(props.element);
  const editor = useSlate();
  const { readonly } = useEditorStore();
  const [isHovered, setIsHovered] = React.useState(false);

  return React.useMemo(() => {
    if (readonly) {
      return (
        <div {...props.attributes} data-be={'card'} role="button">
          {props.children}
        </div>
      );
    }
    return (
      <div
        {...props.attributes}
        data-be={'card'}
        role="button"
        tabIndex={0}
        aria-selected={selected}
        aria-label="可选择的卡片元素"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...props.element.style,
          padding: '12px 2px',
          borderRadius: 8,
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
