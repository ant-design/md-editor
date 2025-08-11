import { Editor, Element, Node, NodeMatch } from 'slate';
import { WithTableOptions } from '../options';
import { EDITOR_TO_WITH_TABLE_OPTIONS } from '../weak-maps';
import { isElement } from './is-element';
import { WithType } from './types';

/** @returns a `NodeMatch` function which is used to match the elements of a specific `type`. */
export function isOfType<T extends WithType<Element>>(
  editor: Editor,
  ...types: Array<keyof WithTableOptions['blocks']>
): NodeMatch<T> {
  const options = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor),
    elementTypes = types.map((type) => options?.blocks?.[type]);

  return (node: Node): boolean =>
    isElement(node) && elementTypes.includes(node.type);
}
