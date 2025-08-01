import React, { useCallback, useRef } from 'react';
import { DecoratedRange, Element, Text as SlateText } from 'slate';
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  isTextDecorationsEqual,
  NODE_TO_ELEMENT,
} from 'slate-dom';
import { ReactEditor, useSlateStatic } from '..';
import {
  RenderLeafProps,
  RenderPlaceholderProps,
  RenderTextProps,
} from './editable';
import Leaf from './leaf';

/**
 * Text.
 */

const Text = (props: {
  decorations: DecoratedRange[];
  isLast: boolean;
  parent: Element;
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  renderText?: (props: RenderTextProps) => JSX.Element;
  text: SlateText;
}) => {
  const {
    decorations,
    isLast,
    parent,
    renderPlaceholder,
    renderLeaf,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    renderText = (props: RenderTextProps) => <DefaultText {...props} />,
    text,
  } = props;
  const editor = useSlateStatic();
  const ref = useRef<HTMLSpanElement | null>(null);
  const decoratedLeaves = SlateText.decorations(text, decorations);
  const key = ReactEditor.findKey(editor, text);
  const children = [];

  for (let i = 0; i < decoratedLeaves.length; i++) {
    const { leaf, position } = decoratedLeaves[i];

    children.push(
      <Leaf
        isLast={isLast && i === decoratedLeaves.length - 1}
        key={`${key.id}-${i}`}
        renderPlaceholder={renderPlaceholder}
        leaf={leaf}
        leafPosition={position}
        text={text}
        parent={parent}
        renderLeaf={renderLeaf}
      />,
    );
  }

  // Update element-related weak maps with the DOM element ref.
  const callbackRef = useCallback(
    (span: HTMLSpanElement | null) => {
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
      if (span) {
        KEY_TO_ELEMENT?.set(key, span);
        NODE_TO_ELEMENT.set(text, span);
        ELEMENT_TO_NODE.set(span, text);
      } else {
        KEY_TO_ELEMENT?.delete(key);
        NODE_TO_ELEMENT.delete(text);
        if (ref.current) {
          ELEMENT_TO_NODE.delete(ref.current);
        }
      }
      ref.current = span;
    },
    [ref, editor, key, text],
  );

  const attributes: {
    'data-slate-node': 'text';
    ref: any;
  } = {
    'data-slate-node': 'text',
    ref: callbackRef,
  };

  return renderText({
    text,
    children,
    attributes,
  });
};

export const InlineChromiumBugfix = React.memo(() => (
  <span
    contentEditable={false}
    style={{ fontSize: 0, opacity: 0, width: 0, height: 0, lineHeight: 0 }}
  >
    {String.fromCodePoint(160)}
  </span>
));

function isSafari() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  let ua = navigator.userAgent;

  return ua.includes('Safari') && !ua.includes('Chrome');
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderText === prev.renderText &&
    next.renderLeaf === prev.renderLeaf &&
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    isTextDecorationsEqual(next.decorations, prev.decorations)
  );
});

export const DefaultText = (props: RenderTextProps) => {
  const { attributes, children } = props;
  return (
    <span {...attributes}>
      {!props.text?.text && isSafari() && <InlineChromiumBugfix />}
      {children}
      {!props.text?.text && isSafari() && <InlineChromiumBugfix />}
    </span>
  );
};

export default MemoizedText;
