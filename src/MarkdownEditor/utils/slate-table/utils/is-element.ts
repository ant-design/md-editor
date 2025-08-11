import { Editor, Element, Node } from 'slate';
import { WithType } from './types';

export function isElement<T extends Element>(node: Node): node is WithType<T> {
  return !Editor.isEditor(node) && Element.isElement(node) && 'type' in node;
}
