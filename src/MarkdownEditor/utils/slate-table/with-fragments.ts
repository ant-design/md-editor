import { Descendant, Editor, Node } from 'slate';
import { WithTableOptions } from './options';
import { isOfType } from './utils';

export function withFragments<T extends Editor>(
  editor: T,
  { withFragments }: WithTableOptions,
): T {
  if (!withFragments) {
    return editor;
  }

  const { getFragment } = editor;

  editor.getFragment = () => {
    const newFragment: Descendant[] = [];

    for (const fragment of getFragment()) {
      if (!isOfType(editor, 'table')(fragment, [])) {
        newFragment.push(fragment);
        continue;
      }

      for (const [node] of Node.nodes(fragment, {
        pass: ([node]) => isOfType(editor, 'content')(node, []),
      })) {
        if (isOfType(editor, 'content')(node, [])) {
          newFragment.push(node);
        }
      }
    }

    return newFragment;
  };

  return editor;
}
