/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  Operation,
  Path,
  Point,
  Range,
  Transforms,
} from 'slate';
import { filledMatrix, isOfType, matrix } from './utils';
import { Edge, NodeEntryWithContext, SelectionMode } from './utils/types';
import {
  EDITOR_TO_SELECTION,
  EDITOR_TO_SELECTION_SET,
  EDITOR_TO_WITH_TABLE_OPTIONS,
} from './weak-maps';

export const TableCursor = {
  /** @returns {boolean} `true` if the selection is inside a table, otherwise `false`. */
  isInTable(editor: Editor, options: { at?: Location } = {}): boolean {
    const [table] = Editor.nodes(editor, {
      match: isOfType(editor, 'table'),
      at: options.at,
    });

    return !!table;
  },
  /**
   * Moves the cursor to the cell above the current selection.
   * @param {'start' | 'end' | 'all'} [options.mode] - Specifies the selection mode,
   * which can be one of the following: `start` to move the cursor to the beginning
   * of the cell's content, `end` to move it to the end, or `all` to extend the
   * selection over the entire cell's content.
   * @returns {boolean} `true` if the action was successful, `false` otherwise.
   */
  upward(editor: Editor, options: { mode?: SelectionMode } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
    });

    if (!table || !td) {
      return false;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    const m = filledMatrix(editor, { at: tablePath });

    let previous: NodeEntryWithContext[] | undefined;
    let indexY = 0;
    outer: for (let x = 0; x < m.length; x++) {
      for (indexY = 0; indexY < m[x].length; indexY++) {
        const [[, path], { ltr: colSpan }] = m[x][indexY];
        if (Path.equals(path, tdPath)) {
          break outer;
        }

        indexY += colSpan - 1;
      }
      previous = m[x];
    }

    if (!previous || !previous[indexY]) {
      if (Path.hasPrevious(tablePath)) {
        Transforms.select(editor, Editor.end(editor, Path.previous(tablePath)));
        return true;
      }

      return false;
    }

    const [[, path]] = previous[indexY];

    options.mode === 'all'
      ? Transforms.select(editor, path)
      : Transforms.select(
          editor,
          options.mode === 'start'
            ? Editor.start(editor, path)
            : Editor.end(editor, path),
        );

    return true;
  },
  /**
   * Moves the cursor to the cell below the current selection.
   * @param {'start' | 'end' | 'all'} [options.mode] - Specifies the selection mode,
   * which can be one of the following: `start` to move the cursor to the beginning
   * of the cell's content, `end` to move it to the end, or `all` to extend the
   * selection over the entire cell's content.
   * @returns {boolean} `true` if the action was successful, `false` otherwise.
   */
  downward(editor: Editor, options: { mode?: SelectionMode } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
      at: Range.end(editor.selection),
    });

    if (!table || !td) {
      return false;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    const m = filledMatrix(editor, { at: tablePath });

    let next: NodeEntryWithContext[] | undefined;
    let indexY = 0;
    outer: for (let x = 0; x < m.length; x++) {
      for (indexY = 0; indexY < m[x].length; indexY++) {
        const [[, path], { ltr: colSpan, btt: rowSpan }] = m[x][indexY];

        if (rowSpan === 1 && Path.equals(path, tdPath)) {
          next = m[x + 1];
          break outer;
        }

        indexY += colSpan - 1;
      }
    }

    if (!next || !next[indexY]) {
      if (Node.has(editor, Path.next(tablePath))) {
        Transforms.select(editor, Editor.end(editor, Path.next(tablePath)));
        return true;
      }

      return false;
    }

    const [[, path]] = next[indexY];

    options.mode === 'all'
      ? Transforms.select(editor, path)
      : Transforms.select(
          editor,
          options.mode === 'start'
            ? Editor.start(editor, path)
            : Editor.end(editor, path),
        );

    return true;
  },
  /**
   * Moves the cursor to the cell next to the current selection.
   * @param {'start' | 'end' | 'all'} [options.mode] - Specifies the selection mode,
   * which can be one of the following: `start` to move the cursor to the beginning
   * of the cell's content, `end` to move it to the end, or `all` to extend the
   * selection over the entire cell's content.
   * @returns {boolean} `true` if the action was successful, `false` otherwise.
   */
  forward(editor: Editor, options: { mode?: SelectionMode } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
      at: Range.end(editor.selection),
    });

    if (!table || !td) {
      return false;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    let foundTd = false;
    let nextPath: Path | undefined;
    outer: for (const tr of matrix(editor, { at: tablePath })) {
      for (const [, path] of tr) {
        if (!foundTd) {
          foundTd = Path.equals(path, tdPath);
          continue;
        }

        nextPath = path;
        break outer;
      }
    }

    if (!nextPath) {
      if (Node.has(editor, Path.next(tablePath))) {
        Transforms.select(editor, Editor.end(editor, Path.next(tablePath)));
        return true;
      }

      return false;
    }

    options.mode === 'all'
      ? Transforms.select(editor, nextPath)
      : Transforms.select(
          editor,
          options.mode === 'start'
            ? Editor.start(editor, nextPath)
            : Editor.end(editor, nextPath),
        );

    return true;
  },
  /**
   * Moves the cursor to the cell before the current selection.
   * @param {'start' | 'end' | 'all'} [options.mode] - Specifies the selection mode,
   * which can be one of the following: `start` to move the cursor to the beginning
   * of the cell's content, `end` to move it to the end, or `all` to extend the
   * selection over the entire cell's content.
   * @returns {boolean} `true` if the action was successful, `false` otherwise.
   */
  backward(editor: Editor, options: { mode?: SelectionMode } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
      at: Range.start(editor.selection),
    });

    if (!table || !td) {
      return false;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    let foundTd = false;
    let previousPath: Path | undefined;
    outer: for (const tr of matrix(editor, { at: tablePath, reverse: true })) {
      for (const [, path] of tr) {
        if (!foundTd) {
          foundTd = Path.equals(path, tdPath);
          continue;
        }

        previousPath = path;
        break outer;
      }
    }

    if (!previousPath) {
      if (Path.hasPrevious(tablePath)) {
        Transforms.select(editor, Editor.end(editor, Path.previous(tablePath)));
        return true;
      }

      return false;
    }

    options.mode === 'all'
      ? Transforms.select(editor, previousPath)
      : Transforms.select(
          editor,
          options.mode === 'start'
            ? Editor.start(editor, previousPath)
            : Editor.end(editor, previousPath),
        );

    return true;
  },
  /**
   * Checks if the selection is positioned on an edge within a td or th.
   * @param {'start' | 'end' | 'top' | 'bottom'} edge - Specifies which edge to check:
   * - `start`: checks if the cursor is positioned at the start of the cell's content
   * - `end`: checks if the cursor is positioned at the end of the cell's content
   * - `top`: checks if the cursor is positioned at the first block of the cell's content
   * - `bottom`: checks if the cursor is positioned at the last block of the cell's content
   * @returns {boolean} `true` if the cursor is on the specified edge, `false` otherwise.
   */
  isOnEdge(editor: Editor, edge: Edge): boolean {
    const { selection } = editor;
    if (!selection) {
      return false;
    }

    const point =
      edge === 'start' || edge === 'top'
        ? Range.start(selection)
        : Range.end(selection);

    const [td] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: point,
    });

    if (!td) {
      return false;
    }

    const [, tdPath] = td;
    const endPoint = Editor.end(editor, tdPath);
    const startPoint = Editor.start(editor, tdPath);

    switch (edge) {
      case 'start':
        return Point.equals(point, startPoint);
      case 'end':
        return Point.equals(point, endPoint);
      case 'top':
        return Path.equals(point.path, startPoint.path);
      case 'bottom':
        return Path.equals(point.path, endPoint.path);
      default:
        return false;
    }
  },
  /**
   * Checks if the cursor is in the first cell of the table.
   * @param {boolean} [options.reverse] - If true, checks the table
   * in reverse order to determine if the cell is last in table.
   * @returns {boolean} `true` if the cursor is in the first cell, otherwise `false`.
   */
  isInFirstCell(editor: Editor, options: { reverse?: boolean } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, td] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'th', 'td'),
      reverse: options.reverse,
    });

    if (!table || !td) {
      return false;
    }

    const [, tablePath] = table;
    const [, tdPath] = td;

    const [first] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      reverse: options.reverse,
      at: tablePath,
    });

    return Path.equals(first[1], tdPath);
  },
  /**
   * Checks if the cursor is in the last cell of the table
   * @returns {boolean} `true` if the cursor is in the last cell, otherwise `false`.
   */
  isInLastCell(editor: Editor): boolean {
    return TableCursor.isInFirstCell(editor, { reverse: true });
  },
  /**
   * Checks if the cursor is in the first tr of the table.
   * @param {boolean} [options.reverse] - If true, checks the table
   * in reverse order to determine if the tr is last in table.
   * @returns {boolean} `true` if the cursor is in the first row, otherwise `false`.
   */
  isInFirstRow(editor: Editor, options: { reverse?: boolean } = {}): boolean {
    if (!editor.selection) {
      return false;
    }

    const [table, tr] = Editor.nodes(editor, {
      match: isOfType(editor, 'table', 'tr'),
      reverse: options.reverse,
    });

    if (!table || !tr) {
      return false;
    }

    const [, tablePath] = table;
    const [, trPath] = tr;

    const [first] = Editor.nodes(editor, {
      match: isOfType(editor, 'tr'),
      reverse: options.reverse,
      at: tablePath,
    });

    return Path.equals(first[1], trPath);
  },
  /**
   * Checks if the cursor is in the last row of the table
   * @returns {boolean} `true` if the cursor is in the first row, otherwise `false`.
   */
  isInLastRow(editor: Editor): boolean {
    return TableCursor.isInFirstRow(editor, { reverse: true });
  },
  /**
   * Retrieves a matrix representing the selected cells within a table.
   * @returns {NodeEntry<T>[][]} A matrix containing the selected cells.
   */
  *selection(editor: Editor): Generator<NodeEntry[]> {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);
    if (!editorOptions?.withSelection) {
      throw new Error(
        'The `selection` command must be used with the `withSelection` option.',
      );
    }

    const matrix = EDITOR_TO_SELECTION.get(editor);
    for (let x = 0; matrix && x < matrix.length; x++) {
      const cells: NodeEntry[] = [];
      for (let y = 0; y < matrix[x].length; y++) {
        const [entry, { ltr: colSpan, ttb }] = matrix[x][y];

        ttb === 1 && cells.push(entry);

        y += colSpan - 1;
      }

      yield cells;
    }
  },
  /** Clears the selection from the table */
  unselect(editor: Editor): void {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);
    if (!editorOptions?.withSelection) {
      throw new Error(
        'The `unselect` command must be used with the `withSelection` option.',
      );
    }

    const matrix = EDITOR_TO_SELECTION.get(editor);

    if (!matrix?.length) {
      return;
    }

    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const [[, path], { ltr: colSpan, ttb }] = matrix[x][y];
        y += colSpan - 1;

        if (ttb > 1) {
          continue;
        }

        // no-op since the paths are the same
        const noop: Operation = {
          type: 'move_node',
          newPath: path,
          path: path,
        };
        Transforms.transform(editor, noop);
      }
    }

    EDITOR_TO_SELECTION_SET.delete(editor);
    EDITOR_TO_SELECTION.delete(editor);
  },
  /**
   * Checks whether a given cell is part of the current table selection.
   * @returns {boolean} - Returns true if the cell is selected, otherwise false.
   */
  isSelected<T extends Element>(editor: Editor, element: T): boolean {
    const editorOptions = EDITOR_TO_WITH_TABLE_OPTIONS.get(editor);
    if (!editorOptions?.withSelection) {
      throw new Error(
        'The `isSelected` command must be used with the `withSelection` option.',
      );
    }

    const selectedElements = EDITOR_TO_SELECTION_SET.get(editor);

    if (!selectedElements) {
      return false;
    }

    return selectedElements.has(element);
  },
};
