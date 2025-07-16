import { Editor } from 'slate';

export function normalizeTable<T extends Editor>(editor: T): T {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    normalizeNode(entry, options);
  };

  return editor;
}
