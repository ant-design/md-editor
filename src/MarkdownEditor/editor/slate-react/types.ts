import React from 'react';
import { Element, Range, Text } from 'slate';

/**
 * Props passed to the `Editable` component.
 */
export interface EditableProps {
  decorate?: (entry: [Node, Path]) => Range[];
  onDOMBeforeInput?: (event: Event) => void;
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  role?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element;
  renderText?: (props: RenderTextProps) => JSX.Element;
  [key: string]: any;
}

/**
 * Props passed to the `Element` component.
 */
export interface RenderElementProps {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  element: Element;
}

/**
 * Props passed to the `Leaf` component.
 */
export interface RenderLeafProps {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  leaf: Text;
  text: Text;
}

/**
 * Props passed to the `Placeholder` component.
 */
export interface RenderPlaceholderProps {
  children: React.ReactNode;
}

/**
 * Props passed to the `Text` component.
 */
export interface RenderTextProps {
  children: React.ReactNode;
  text: Text;
}

/**
 * Default placeholder component.
 */
export type DefaultPlaceholder = (props: RenderPlaceholderProps) => JSX.Element;
