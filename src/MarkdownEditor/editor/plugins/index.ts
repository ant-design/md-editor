import { Editor, Node, Path, Transforms } from 'slate';
import { EditorStore } from '../store';

export const inlineNode = new Set(['break']);

const voidNode = new Set(['hr', 'break']);

export const withMarkdown = (editor: Editor, store: EditorStore) => {
  const { isInline, isVoid, apply } = editor;

  editor.isInline = (element) => {
    return inlineNode.has(element.type) || isInline(element);
  };

  editor.isVoid = (element) => {
    return voidNode.has(element.type) || isVoid(element);
  };

  editor.apply = (operation) => {
    if (
      operation.type === 'merge_node' &&
      operation.properties?.type === 'table-cell'
    ) {
      return;
    }

    if (
      operation.type === 'split_node' &&
      operation.properties?.type === 'link-card'
    ) {
      const node = Node.get(editor, operation.path);
      if (node?.type === 'link-card') {
        Transforms.insertNodes(
          editor,
          [
            {
              type: 'paragraph',
              children: [{ text: '', p: 'true' }],
            },
          ],
          {
            at: Path.next(operation.path),
          },
        );
      }
      setTimeout(() => {
        Transforms.setSelection(editor, {
          anchor: { path: Path.next(operation.path), offset: 0 },
          focus: { path: Path.next(operation.path), offset: 0 },
        });
      }, 100);
      return;
    }

    if (
      operation.type === 'split_node' &&
      operation.properties?.type === 'schema'
    ) {
      const node = Node.get(editor, operation.path);
      if (node?.type === 'schema') {
        Transforms.insertNodes(
          editor,
          [
            {
              type: 'paragraph',
              children: [{ text: '', p: 'true' }],
            },
          ],
          {
            at: Path.next(operation.path),
          },
        );
      }
      setTimeout(() => {
        Transforms.setSelection(editor, {
          anchor: { path: Path.next(operation.path), offset: 0 },
          focus: { path: Path.next(operation.path), offset: 0 },
        });
      }, 100);
      return;
    }
    if (
      operation.type === 'split_node' ||
      operation.type === 'merge_node' ||
      operation.type === 'remove_node' ||
      operation.type === 'move_node'
    ) {
      if (operation.type === 'split_node' && operation.path?.at(1) === 1) {
        if (operation.properties.type === 'column-cell') {
          const next = Path.next([operation.path.at(0) || 0]);
          Transforms.insertNodes(
            editor,
            [
              {
                type: 'paragraph',
                children: [{ text: '', p: 'true' }],
              },
            ],
            {
              at: next,
            },
          );
          setTimeout(() => {
            Transforms.setSelection(editor, {
              anchor: { path: next, offset: 0 },
              focus: { path: next, offset: 0 },
            });
          }, 100);
          return;
        }
      }
      const node = Node.get(editor, operation.path);
      if (node?.type === 'column-cell') {
        return;
      }
    }

    if (!store.manual) {
      if (operation.type === 'move_node') {
        const node = Node.get(editor, operation.path);
        if (node?.type === 'table-cell') return;
      }
      if (operation.type === 'remove_node') {
        const { node } = operation;
        if (['table-row', 'table-cell'].includes(node.type)) {
          if (node.type === 'table-cell') {
            Transforms.insertFragment(editor, [{ text: '' }], {
              at: {
                anchor: Editor.start(editor, operation.path),
                focus: Editor.end(editor, operation.path),
              },
            });
          }
          if (node.type === 'table-row') {
            for (let i = 0; i < node.children?.length; i++) {
              Transforms.insertFragment(editor, [{ text: '' }], {
                at: {
                  anchor: Editor.start(editor, [...operation.path, i]),
                  focus: Editor.end(editor, [...operation.path, i]),
                },
              });
            }
          }
          return;
        }
      }
    }
    apply(operation);
  };

  return editor;
};
