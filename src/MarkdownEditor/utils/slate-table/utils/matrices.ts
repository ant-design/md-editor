import { Editor, Location, NodeEntry } from 'slate';
import { isOfType } from './is-of-type';
import { CellElement } from './types';

/** Generates a matrix for each table section (`thead`, `tbody`, `tfoot`) */
export function* matrices(
  editor: Editor,
  options: { at?: Location } = {},
): Generator<NodeEntry<CellElement>[][]> {
  const [table] = Editor.nodes(editor, {
    match: isOfType(editor, 'table'),
    at: options.at,
  });

  if (!table) {
    return [];
  }

  const [, tablePath] = table;

  for (const [, path] of Editor.nodes(editor, {
    match: isOfType(editor, 'thead', 'tbody', 'tfoot'),
    at: tablePath,
  })) {
    const matrix: NodeEntry<CellElement>[][] = [];

    for (const [, trPath] of Editor.nodes(editor, {
      match: isOfType(editor, 'tr'),
      at: path,
    })) {
      matrix.push([
        ...Editor.nodes<CellElement>(editor, {
          match: isOfType(editor, 'th', 'td'),
          at: trPath,
        }),
      ]);
    }

    yield matrix;
  }
}
