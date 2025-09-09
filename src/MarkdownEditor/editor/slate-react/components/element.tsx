/* eslint-disable @typescript-eslint/no-use-before-define */
import getDirection from 'direction';
import React, { JSX, useCallback } from 'react';
import {
  DecoratedRange,
  Editor,
  Element,
  Node,
  Range,
  Element as SlateElement,
} from 'slate';
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  isElementDecorationsEqual,
  NODE_TO_ELEMENT,
  NODE_TO_INDEX,
  NODE_TO_PARENT,
} from 'slate-dom';
import { ReactEditor, useReadOnly, useSlateStatic } from '..';
// 移除 useChildren 导入，直接内联逻辑
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from '../types';

import Text from './text';

/**
 * Element.
 */

const Element = (props: {
  decorations: DecoratedRange[];
  element: SlateElement;
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
  renderText?: (props: RenderTextProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  selection: Range | null;
}) => {
  const {
    decorations,
    element,
    renderElement = (p: RenderElementProps) => <DefaultElement {...p} />,
    renderPlaceholder,
    renderLeaf,
    renderText,
    selection,
  } = props;
  const editor = useSlateStatic();
  const readOnly = useReadOnly();
  const isInline = editor.isInline(element);
  const key = ReactEditor.findKey(editor, element);
  const ref = useCallback(
    (ref: HTMLElement | null) => {
      // Update element-related weak maps with the DOM element ref.
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
      if (ref) {
        KEY_TO_ELEMENT?.set(key, ref);
        NODE_TO_ELEMENT.set(element, ref);
        ELEMENT_TO_NODE.set(ref, element);
      } else {
        KEY_TO_ELEMENT?.delete(key);
        NODE_TO_ELEMENT.delete(element);
      }
    },
    [editor, key, element],
  );
  // 内联 useChildren 逻辑，避免循环依赖
  let children: React.ReactNode = React.useMemo(() => {
    const childElements = [];
    const isLeafBlock =
      Element.isElement(element) &&
      !editor.isInline(element) &&
      Editor.hasInlines(editor, element);

    for (let i = 0; i < element.children.length; i++) {
      const path = ReactEditor.findPath(editor, element).concat(i);
      const child = element.children[i];
      const key = ReactEditor.findKey(editor, child);
      const range = Editor.range(editor, path);
      const sel = selection && Range.intersection(range, selection);

      if (Element.isElement(child)) {
        // 递归渲染子元素
        childElements.push(
          <Element
            key={key.id}
            decorations={decorations}
            element={child}
            renderElement={renderElement}
            renderPlaceholder={renderPlaceholder}
            renderLeaf={renderLeaf}
            renderText={renderText}
            selection={sel}
          />,
        );
      } else {
        // 渲染文本节点
        childElements.push(
          <Text
            key={key.id}
            decorations={decorations}
            isLast={isLeafBlock && i === element.children.length - 1}
            parent={element}
            renderPlaceholder={renderPlaceholder}
            renderLeaf={renderLeaf}
            renderText={renderText}
            text={child}
          />,
        );
      }
    }

    return <React.Fragment>{childElements}</React.Fragment>;
  }, [
    decorations,
    element,
    renderElement,
    renderPlaceholder,
    renderLeaf,
    renderText,
    selection,
    editor,
  ]);

  // Attributes that the developer must mix into the element in their
  // custom node renderer component.
  const attributes: {
    'data-slate-node': 'element';
    'data-slate-void'?: true;
    'data-slate-inline'?: true;
    contentEditable?: false;
    dir?: 'rtl';
    ref: any;
  } = {
    'data-slate-node': 'element',
    ref,
  };

  if (isInline) {
    attributes['data-slate-inline'] = true;
  }

  // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.
  if (!isInline && Editor.hasInlines(editor, element)) {
    const text = Node.string(element);
    const dir = getDirection(text);

    if (dir === 'rtl') {
      attributes.dir = dir;
    }
  }

  // If it's a void node, wrap the children in extra void-specific elements.
  if (Editor.isVoid(editor, element)) {
    attributes['data-slate-void'] = true;

    if (!readOnly && isInline) {
      attributes.contentEditable = false;
    }

    const Tag = isInline ? 'span' : 'div';
    const [[text]] = Node.texts(element);

    children = (
      <Tag
        data-slate-spacer
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
          position: 'absolute',
        }}
      >
        <Text
          renderPlaceholder={renderPlaceholder}
          decorations={[]}
          isLast={false}
          parent={element}
          text={text}
        />
      </Tag>
    );

    NODE_TO_INDEX.set(text, 0);
    NODE_TO_PARENT.set(text, element);
  }

  return renderElement({ attributes, children, element });
};

const MemoizedElement = React.memo(Element, (prev, next) => {
  return (
    prev.element === next.element &&
    prev.renderElement === next.renderElement &&
    prev.renderText === next.renderText &&
    prev.renderLeaf === next.renderLeaf &&
    prev.renderPlaceholder === next.renderPlaceholder &&
    isElementDecorationsEqual(prev.decorations, next.decorations) &&
    (prev.selection === next.selection ||
      (!!prev.selection &&
        !!next.selection &&
        Range.equals(prev.selection, next.selection)))
  );
});

/**
 * The default element renderer.
 */

export const DefaultElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();
  const Tag = editor.isInline(element) ? 'span' : 'div';
  return (
    <Tag {...attributes} style={{ position: 'relative' }}>
      {children}
    </Tag>
  );
};

export default MemoizedElement;
