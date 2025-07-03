import { Editor, Node, Path, Point, Range, Transforms } from 'slate';
import { WithTableOptions } from './options';
import { hasCommon, isOfType } from './utils';
import { EDITOR_TO_SELECTION } from './weak-maps';

export function withDelete<T extends Editor>(
  editor: T,
  { withDelete, withSelection, blocks }: WithTableOptions,
): T {
  if (!withDelete) {
    return editor;
  }

  const { deleteBackward, deleteForward, deleteFragment } = editor;

  editor.deleteBackward = (unit): void => {
    const { selection } = editor;

    if (!selection || Range.isExpanded(selection)) {
      return deleteBackward(unit);
    }

    const [td] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: selection,
    });

    const before = Editor.before(editor, selection, { unit });
    const [tdBefore] = before
      ? Editor.nodes(editor, {
          match: isOfType(editor, 'th', 'td'),
          at: before,
        })
      : [undefined];

    if (!td && !tdBefore) {
      return deleteBackward(unit);
    }

    if (!td && tdBefore && before) {
      return Transforms.select(editor, before);
    }

    const [, tdPath] = td;
    const start = Editor.start(editor, tdPath);

    if (Point.equals(selection.anchor, start)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit): void => {
    const { selection } = editor;

    if (!selection || Range.isExpanded(selection)) {
      return deleteForward(unit);
    }

    const [td] = Editor.nodes(editor, {
      match: isOfType(editor, 'th', 'td'),
      at: selection,
    });

    const after = Editor.after(editor, selection, { unit });
    const [tdAfter] = after
      ? Editor.nodes(editor, { match: isOfType(editor, 'th', 'td'), at: after })
      : [undefined];

    if (!td && !tdAfter) {
      return deleteForward(unit);
    }

    if (!td && tdAfter && after) {
      return Transforms.select(editor, after);
    }

    const [, tdPath] = td;
    const end = Editor.end(editor, tdPath);

    if (Point.equals(selection.anchor, end)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (options): void => {
    const { selection } = editor;

    if (!selection || Range.isCollapsed(selection)) {
      return deleteFragment(options);
    }

    const [startPoint, endPoint] = Range.edges(selection);
    const edges: [Path, Path] = [startPoint.path, endPoint.path];

    if (
      !hasCommon(editor, edges, 'table') ||
      hasCommon(editor, edges, 'th', 'td')
    ) {
      return deleteFragment(options);
    }

    const isBackward = options?.direction === 'backward';
    const selected = EDITOR_TO_SELECTION.get(editor);

    Editor.withoutNormalizing(editor, () => {
      if (withSelection && selected && selected.length) {
        // prettier-ignore
        const [[, lastPath]] = selected[selected.length - 1][selected[selected.length - 1].length - 1];
        const [[, firstPath]] = selected[0][0];

        for (let x = selected.length - 1; x >= 0; x--) {
          for (let y = selected[x].length - 1; y >= 0; y--) {
            const [[, path], { rtl, ttb }] = selected[x][y];

            // skip fake cell
            if (rtl > 1 || ttb > 1) {
              continue;
            }

            for (const [, childPath] of Node.children(editor, path, {
              reverse: true,
            })) {
              Transforms.removeNodes(editor, { at: childPath });
            }

            Transforms.insertNodes(
              editor,
              {
                type: blocks.content,
                children: [{ text: '' }],
              } as Node,
              { at: [...path, 0] },
            );
          }
        }

        Transforms.select(editor, isBackward ? firstPath : lastPath);
        return;
      }

      let firstPath: Path | null = null;
      let lastPath: Path | null = null;

      for (const [, path] of Editor.nodes(editor, {
        match: isOfType(editor, 'th', 'td'),
        at: selection,
        reverse: true,
      })) {
        for (const [, childPath] of Node.children(editor, path, {
          reverse: true,
        })) {
          Transforms.removeNodes(editor, { at: childPath });
        }

        // seems backwards but we iterate the cells in reverse order
        firstPath = [...path, 0];
        lastPath = !lastPath ? [...path, 0] : lastPath;

        Transforms.insertNodes(
          editor,
          {
            type: blocks.content,
            children: [{ text: '' }],
          } as Node,
          { at: [...path, 0] },
        );
      }

      if (isBackward) {
        Transforms.select(editor, Path.isPath(firstPath) ? firstPath : []);
        return;
      }

      Transforms.select(editor, Path.isPath(lastPath) ? lastPath : []);
    });
  };

  return editor;
}
