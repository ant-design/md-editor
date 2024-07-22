import { Editor, Transforms } from 'slate';
import { parserMdToSchema } from '../parser/parser';

/**
 * 转化 markdown 到 slate
 * @param editor
 * @param markdown
 * @returns
 */
export const markdownParser = (editor: Editor, markdown: string) => {
  const nodes = JSON.parse(JSON.stringify(parserMdToSchema(markdown).schema));

  nodes.push({ type: 'paragraph', children: [{ text: '' }] });

  const fragment = nodes;
  const sel = editor.selection;
  if (sel) {
    Transforms.insertNodes(editor, fragment, { at: sel });
    return true;
  }
  Transforms.insertNodes(editor, fragment);
  return true;
};
