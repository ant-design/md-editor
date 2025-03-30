import copyToClipboard from 'copy-to-clipboard';
import { Editor } from 'slate';

/**
 * 复制编辑器中选中的文本块
 *
 * @description
 * 该函数将选中的文本块复制到剪贴板。具体执行以下操作:
 * - 获取编辑器中当前选中的片段
 * - 将选中内容以纯文本和HTML格式写入剪贴板
 * - 将选中内容作为slate片段格式(经过编码)写入剪贴板
 *
 * @param editor - Slate编辑器实例
 *
 * @example
 * ```ts
 * copySelectedBlocks(editor);
 * ```
 *
 * @remarks
 * - 使用window.btoa进行base64编码
 * - 使用encodeURIComponent处理UTF-8字符
 * - 通过DataTransfer API设置多种剪贴板格式
 */
export const copySelectedBlocks = (
  editor: Editor,
  container: HTMLDivElement,
) => {
  const selectedFragment = editor.selection;
  copyToClipboard(window?.getSelection?.()?.toString() || ' ', {
    onCopy: (dataTransfer) => {
      const data = dataTransfer as DataTransfer;
      if (!data) return;
      if (!editor.selection) return;
      const selectedText = Editor.string(editor, editor.selection!);
      data.setData('text/plain', selectedText || '');
      data.setData('text/html', container?.innerHTML || '');
      const selectedFragmentStr = JSON.stringify(selectedFragment);
      const encodedFragment = window.btoa(
        encodeURIComponent(selectedFragmentStr),
      );
      data.setData('application/x-slate-md-fragment', encodedFragment);
    },
  });
};
