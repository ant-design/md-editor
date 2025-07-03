import { Editor, Element, Node, NodeEntry, Path, Transforms } from 'slate';
import { WithTableOptions } from '../options';
import { isElement, isOfType } from '../utils';

/** Normalizes the given `table` node by wrapping invalid nodes into a `tbody`. */
export function normalizeTable<T extends Editor>(
  editor: T,
  { blocks: { table, thead, tbody, tfoot } }: WithTableOptions,
): T {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;
    if (isElement(node) && node.type === table) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (isElement(child) && [thead, tbody, tfoot].includes(child.type)) {
          continue;
        }

        const tbodyEntry = immediateTbody(editor, path);

        if (!tbodyEntry) {
          return Transforms.wrapNodes(
            editor,
            {
              type: tbody,
              children: [child],
            } as Element,
            { at: childPath },
          );
        }

        const [tbodyElement, tbodyPath] = tbodyEntry;

        const elements = tbodyElement.children.filter(
          (n) => isElement(n) && !editor.isInline(n),
        );

        return Transforms.moveNodes(editor, {
          at: childPath,
          to: [...tbodyPath, elements.length],
        });
      }
    }

    normalizeNode(entry, options);
  };

  return editor;
}

/**
 * @returns {NodeEntry<Element> | undefined} The immediate child `tbody` element
 * of the `table`, or `undefined` if it does not exist.
 */
const immediateTbody = (
  editor: Editor,
  tablePath: Path,
): NodeEntry<Element> | undefined => {
  const [tbody] = Editor.nodes(editor, {
    match: isOfType(editor, 'tbody'),
    at: tablePath,
  });

  if (!tbody) {
    return undefined;
  }

  const [, path] = tbody;

  if (!Path.isChild(path, tablePath)) {
    return undefined;
  }

  return tbody;
};
