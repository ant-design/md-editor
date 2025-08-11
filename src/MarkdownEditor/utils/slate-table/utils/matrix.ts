import { Editor, Location, Node, NodeEntry, Span } from 'slate';
import { isElement } from './is-element';
import { isOfType } from './is-of-type';
import { CellElement } from './types';

export function* matrix(
  editor: Editor,
  options: { at?: Location | Span; reverse?: boolean } = {},
): Generator<NodeEntry<CellElement>[], undefined> {
  const { at, reverse } = options;

  const [table] = Editor.nodes(editor, {
    match: isOfType(editor, 'table'),
    at,
  });

  if (!table) {
    return;
  }

  const [, tablePath] = table;

  for (const [, rowPath] of Editor.nodes(editor, {
    at: Span.isSpan(at) ? at : tablePath,
    match: isOfType(editor, 'tr'),
    reverse,
  })) {
    const cells: NodeEntry<CellElement>[] = [];

    for (const [cell, path] of Node.children(editor, rowPath, { reverse })) {
      if (isElement<CellElement>(cell)) {
        cells.push([cell, path]);
      }
    }

    yield cells;
  }
}
