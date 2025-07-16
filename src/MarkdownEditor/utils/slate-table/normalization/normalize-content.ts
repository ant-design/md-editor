import { Editor, Node, Transforms } from 'slate';
import { WithTableOptions } from '../options';
import { isElement } from '../utils';

/**
 * Will normalize the `content` node. It will remove
 * table-related elements and unwrap their children.
 */
export function normalizeContent<T extends Editor>(
  editor: T,
  { blocks }: WithTableOptions,
): T {
  const { table, thead, tfoot, tr, th, td, content } = blocks;
  const FORBIDDEN = [table, thead, tfoot, tr, th, td, content];

  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;
    if (isElement(node) && node.type === content) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (isElement(child) && FORBIDDEN.includes(child.type)) {
          return Transforms.unwrapNodes(editor, { at: childPath });
        }
      }
    }

    normalizeNode(entry, options);
  };

  return editor;
}
