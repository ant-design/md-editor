import { Editor, Transforms } from 'slate';
import { parserMdToSchema } from '../parser/parserMdToSchema';

/**
 * 解析Markdown并插入节点
 *
 * @param editor - 编辑器实例
 * @param markdown - 要解析的Markdown字符串
 * @returns 如果插入成功则返回true
 */
export const parseMarkdownToNodesAndInsert = (
  editor: Editor,
  markdown: string,
) => {
  const nodes = JSON.parse(JSON.stringify(parserMdToSchema(markdown).schema));

  nodes.push({ type: 'paragraph', children: [{ text: '' }] });

  const fragment = nodes;
  const sel = editor.selection;
  if (sel) {
    Transforms.removeNodes(editor, { at: sel });
    Transforms.insertNodes(editor, fragment, { at: sel });
    return true;
  }
  Transforms.insertNodes(editor, fragment);
  return true;
};
