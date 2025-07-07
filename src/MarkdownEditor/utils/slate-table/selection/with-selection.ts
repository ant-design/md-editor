import { Editor, Element, Operation, Path, Range } from 'slate';
import { WithTableOptions } from '../options';
import { TableCursor } from '../table-cursor';
import { Point, filledMatrix, hasCommon, isOfType } from '../utils';
import { NodeEntryWithContext } from '../utils/types';
import { EDITOR_TO_SELECTION, EDITOR_TO_SELECTION_SET } from '../weak-maps';

export function withSelection<T extends Editor>(
  editor: T,
  { withSelection }: WithTableOptions,
) {
  if (!withSelection) {
    return editor;
  }

  const { apply } = editor;

  editor.apply = (op: Operation): void => {
    if (!Operation.isSelectionOperation(op) || !op.newProperties) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    const selection = {
      ...editor.selection,
      ...op.newProperties,
    };

    if (!Range.isRange(selection)) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    const [fromEntry] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: Range.start(selection),
    });

    const [toEntry] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: Range.end(selection),
    });

    if (!fromEntry || !toEntry) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    const [, fromPath] = fromEntry;
    const [, toPath] = toEntry;

    if (
      Path.equals(fromPath, toPath) ||
      !hasCommon(editor, [fromPath, toPath], 'table')
    ) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // TODO: perf: could be improved by passing a Span [fromPath, toPath]
    const filled = filledMatrix(editor, { at: fromPath });

    // Validate matrix integrity and add safety checks
    if (!filled || filled.length === 0) {
      TableCursor.unselect(editor);
      return apply(op);
    }

    // find initial bounds
    const from = Point.valueOf(0, 0);
    const to = Point.valueOf(0, 0);
    outer: for (let x = 0; x < filled.length; x++) {
      if (!filled[x]) continue; // Skip undefined rows

      for (let y = 0; y < filled[x].length; y++) {
        const cell = filled[x][y];
        if (!cell) continue; // Skip null/undefined cells

        const [[, path]] = cell;

        if (Path.equals(fromPath, path)) {
          from.x = x;
          from.y = y;
        }

        if (Path.equals(toPath, path)) {
          to.x = x;
          to.y = y;
          break outer;
        }
      }
    }

    let start = Point.valueOf(Math.min(from.x, to.x), Math.min(from.y, to.y));
    let end = Point.valueOf(Math.max(from.x, to.x), Math.max(from.y, to.y));

    // expand the selection based on rowSpan and colSpan
    for (;;) {
      const nextStart = Point.valueOf(start.x, start.y);
      const nextEnd = Point.valueOf(end.x, end.y);

      for (let x = nextStart.x; x <= nextEnd.x; x++) {
        for (let y = nextStart.y; y <= nextEnd.y; y++) {
          // Add boundary check to prevent accessing undefined array elements
          if (!filled[x] || !filled[x][y]) {
            continue;
          }

          const [, { rtl, ltr, btt, ttb }] = filled[x][y];

          nextStart.x = Math.min(nextStart.x, x - (ttb - 1));
          nextStart.y = Math.min(nextStart.y, y - (rtl - 1));

          nextEnd.x = Math.max(nextEnd.x, x + (btt - 1));
          nextEnd.y = Math.max(nextEnd.y, y + (ltr - 1));
        }
      }

      if (Point.equals(start, nextStart) && Point.equals(end, nextEnd)) {
        break;
      }

      start = nextStart;
      end = nextEnd;
    }

    const selected: NodeEntryWithContext[][] = [];
    const selectedSet = new WeakSet<Element>();

    for (let x = start.x; x <= end.x; x++) {
      const cells: NodeEntryWithContext[] = [];
      for (let y = start.y; y <= end.y; y++) {
        // Add boundary check to prevent accessing undefined array elements
        if (!filled[x] || !filled[x][y]) {
          continue;
        }

        const [[element]] = filled[x][y];
        selectedSet.add(element);
        cells.push(filled[x][y]);
      }
      selected.push(cells);
    }

    EDITOR_TO_SELECTION.set(editor, selected);
    EDITOR_TO_SELECTION_SET.set(editor, selectedSet);

    apply(op);
  };

  return editor;
}
