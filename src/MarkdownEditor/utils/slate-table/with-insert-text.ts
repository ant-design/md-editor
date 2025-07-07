/* eslint-disable @typescript-eslint/no-use-before-define */
import { Editor, Range, Transforms } from 'slate';
import { WithTableOptions } from './options';
import { TableCursor } from './table-cursor';
import { hasCommon } from './utils';

export function withInsertText<T extends Editor>(
  editor: T,
  { withInsertText }: WithTableOptions,
): T {
  if (!withInsertText) {
    return editor;
  }

  const { insertText, insertBreak, insertSoftBreak } = editor;

  editor.insertText = (text, options) => {
    if (shouldCollapse(editor)) {
      Transforms.collapse(editor, { edge: 'focus' });
    }

    insertText(text, options);
  };

  editor.insertBreak = () => {
    if (shouldCollapse(editor)) {
      Transforms.collapse(editor, { edge: 'focus' });
    }

    insertBreak();
  };

  editor.insertSoftBreak = () => {
    if (shouldCollapse(editor)) {
      Transforms.collapse(editor, { edge: 'focus' });
    }

    insertSoftBreak();
  };

  return editor;
}

// collapse when selection is in table and not in common cell
function shouldCollapse(editor: Editor): boolean {
  const { selection } = editor;

  if (!selection || Range.isCollapsed(selection)) {
    return false;
  }

  const [startPoint, endPoint] = Range.edges(selection);

  return (
    TableCursor.isInTable(editor, { at: selection }) &&
    !hasCommon(editor, [startPoint.path, endPoint.path], 'th', 'td')
  );
}
