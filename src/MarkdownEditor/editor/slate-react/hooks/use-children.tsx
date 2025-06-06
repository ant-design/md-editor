import React from 'react';
import {
  Ancestor,
  DecoratedRange,
  Descendant,
  Editor,
  Element,
  Range,
} from 'slate';
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from '../components/editable';

import { IS_NODE_MAP_DIRTY, NODE_TO_INDEX, NODE_TO_PARENT } from 'slate-dom';
import ElementComponent from '../components/element';
import TextComponent from '../components/text';
import { ReactEditor } from '../plugin/react-editor';
import { useDecorate } from './use-decorate';
import { SelectedContext } from './use-selected';
import { useSlateStatic } from './use-slate-static';

/**
 * Children.
 */

const useChildren = (props: {
  decorations: DecoratedRange[];
  node: Ancestor;
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
  renderText?: (props: RenderTextProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  selection: Range | null;
}) => {
  const {
    decorations,
    node,
    renderElement,
    renderPlaceholder,
    renderText,
    renderLeaf,
    selection,
  } = props;
  const decorate = useDecorate();
  const editor = useSlateStatic();
  //@ts-ignore
  IS_NODE_MAP_DIRTY.set(editor as ReactEditor, false);
  const path = ReactEditor.findPath(editor, node);
  const children = [];
  const isLeafBlock =
    Element.isElement(node) &&
    !editor.isInline(node) &&
    Editor.hasInlines(editor, node);

  for (let i = 0; i < node.children.length; i++) {
    const p = path.concat(i);
    const n = node.children[i] as Descendant;
    const key = ReactEditor.findKey(editor, n);
    const range = Editor.range(editor, p);
    const sel =
      selection &&
      range &&
      range?.anchor &&
      range?.focus &&
      Range.intersection(range, selection);
    const ds = decorate([n, p]);

    for (const dec of decorations) {
      const d = Range.intersection(dec, range);

      if (d) {
        ds.push(d);
      }
    }

    if (Element.isElement(n)) {
      children.push(
        <SelectedContext.Provider key={`provider-${key.id}`} value={!!sel}>
          <ElementComponent
            decorations={ds}
            element={n}
            key={key.id}
            renderElement={renderElement}
            renderPlaceholder={renderPlaceholder}
            renderLeaf={renderLeaf}
            renderText={renderText}
            selection={sel}
          />
        </SelectedContext.Provider>,
      );
    } else {
      children.push(
        <TextComponent
          decorations={ds}
          key={key.id}
          isLast={isLeafBlock && i === node.children.length - 1}
          parent={node}
          renderPlaceholder={renderPlaceholder}
          renderLeaf={renderLeaf}
          renderText={renderText}
          text={n}
        />,
      );
    }

    NODE_TO_INDEX.set(n, i);
    NODE_TO_PARENT.set(n, node);
  }

  return children;
};

export default useChildren;
