import { Editor, Transforms } from 'slate';
import { WithTableOptions } from '../options';
import { isElement } from '../utils';
import { CellElement } from '../utils/types';

/**
 * Normalizes the `rowspan` and `colspan` attributes of the `td` elements
 * by removing the attributes when their values is equal to 1.
 */
export function normalizeAttributes<T extends Editor>(
  editor: T,
  { blocks: { td, th } }: WithTableOptions,
) {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;
    if (isElement<CellElement>(node) && [th, td].includes(node.type)) {
      const { rowSpan, colSpan } = node;

      if (rowSpan === 1 || colSpan === 1) {
        const attributes: Array<keyof typeof node> = ['rowSpan', 'colSpan'];

        return Transforms.unsetNodes(
          editor,
          attributes.filter((attr) => node[attr] === 1),
          { at: path },
        );
      }
    }

    normalizeNode(entry, options);
  };

  return editor;
}
