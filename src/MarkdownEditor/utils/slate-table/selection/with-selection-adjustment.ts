import { Editor, Operation, Range } from "slate";
import { WithTableOptions } from "../options";
import { hasCommon, isOfType } from "../utils";

/**
 * Enhances the editor's selection behaviour when the selection
 * spans over blocks before or after the table.
 * - expand focus to end of table if anchor is above
 * - expand anchor to end of table if focus is above
 * - expand the focus to start of table if anchor is below
 * - expand anchor to start of table if focus is below
 */
export function withSelectionAdjustment<T extends Editor>(
  editor: T,
  { withSelectionAdjustment }: WithTableOptions
): T {
  if (!withSelectionAdjustment) {
    return editor;
  }

  const { apply } = editor;

  editor.apply = (op: Operation): void => {
    if (!Operation.isSelectionOperation(op) || !op.newProperties) {
      return apply(op);
    }

    const selection = {
      ...editor.selection,
      ...op.newProperties,
    };

    if (
      !Range.isRange(selection) ||
      Range.isCollapsed(selection) ||
      hasCommon(editor, [selection.anchor.path, selection.focus.path], "table")
    ) {
      return apply(op);
    }

    const [anchor] = Editor.nodes(editor, {
      match: isOfType(editor, "table"),
      at: selection.anchor,
    });

    const [focus] = Editor.nodes(editor, {
      match: isOfType(editor, "table"),
      at: selection.focus,
    });

    if (anchor) {
      const [, path] = anchor;

      if (Range.isBackward(selection)) {
        op.newProperties.anchor = Editor.end(editor, path);
      } else {
        const start = Editor.start(editor, path);
        const before = Editor.before(editor, start);

        op.newProperties.anchor = before ?? start;
      }
    }

    if (focus) {
      const [, path] = focus;

      if (Range.isBackward(selection)) {
        const start = Editor.start(editor, path);
        const before = Editor.before(editor, start);

        op.newProperties.focus = before ?? start;
      } else {
        op.newProperties.focus = Editor.end(editor, path);
      }
    }

    apply(op);
  };

  return editor;
}
