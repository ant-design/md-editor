/**
 * 粘贴处理工具函数
 *
 * 将复杂的粘贴处理逻辑从 Editor.tsx 中提取出来，消除深层嵌套
 */

import { Editor, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { parserMdToSchema } from '../../BaseMarkdownEditor';
import type { MEditorProps } from '../Editor';
import {
  handleFilesPaste,
  handleHtmlPaste,
  handleHttpLinkPaste,
  handlePlainTextPaste,
  handleSlateMarkdownFragment,
  handleSpecialTextPaste,
  handleTagNodePaste,
  shouldInsertTextDirectly,
} from '../plugins/handlePaste';
import { hasEditableTarget } from './editorUtils';

// 编辑器类型，使用 any 避免类型检查问题
type EditorType = any;

/**
 * 粘贴配置类型
 */
interface PasteConfig {
  enabled?: boolean;
  allowedTypes?: Array<
    | 'application/x-slate-md-fragment'
    | 'text/html'
    | 'Files'
    | 'text/markdown'
    | 'text/plain'
  >;
}

/**
 * 默认允许的粘贴类型
 */
const DEFAULT_ALLOWED_TYPES = [
  'application/x-slate-md-fragment',
  'text/html',
  'Files',
  'text/markdown',
  'text/plain',
] as const;

/**
 * 检查是否允许粘贴
 */
const isPasteEnabled = (config?: PasteConfig): boolean => {
  return config?.enabled !== false;
};

/**
 * 获取允许的粘贴类型
 */
const getAllowedTypes = (config?: PasteConfig): string[] => {
  return config?.allowedTypes || DEFAULT_ALLOWED_TYPES;
};

/**
 * 检查是否允许特定类型
 */
const isTypeAllowed = (type: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(type);
};

/**
 * 删除选中的文本
 */
const deleteSelectedText = (editor: EditorType, selection: any): void => {
  if (!selection || !selection.anchor) return;
  if (!Editor.hasPath(editor, selection.anchor.path)) return;
  if (Range.isCollapsed(selection)) return;

  Transforms.delete(editor, {
    at: selection,
    reverse: true,
  });
};

/**
 * 处理 Tag 节点粘贴
 */
const processTagNodePaste = (
  editor: EditorType,
  selection: any,
  clipboardData: DataTransfer,
): boolean => {
  if (!selection) return false;

  const nodeList = Editor.node(editor, selection.focus.path!);
  const curNode = nodeList?.at(0);

  return handleTagNodePaste(editor, selection, clipboardData, curNode);
};

/**
 * 处理 Slate Markdown Fragment
 */
const processSlateFragment = (
  editor: EditorType,
  clipboardData: DataTransfer,
  selection: any,
): boolean => {
  return handleSlateMarkdownFragment(editor, clipboardData, selection);
};

/**
 * 处理 HTML 粘贴
 */
const processHtmlPaste = async (
  editor: EditorType,
  clipboardData: DataTransfer,
  props: MEditorProps,
): Promise<boolean> => {
  return await handleHtmlPaste(editor, clipboardData, props);
};

/**
 * 处理文件粘贴
 */
const processFilesPaste = async (
  editor: EditorType,
  clipboardData: DataTransfer,
  props: MEditorProps,
): Promise<boolean> => {
  return await handleFilesPaste(editor, clipboardData, props);
};

/**
 * 处理 Markdown 文本粘贴
 */
const processMarkdownPaste = (
  editor: EditorType,
  clipboardData: DataTransfer,
  plugins: any[],
): boolean => {
  const text = clipboardData?.getData?.('text/markdown')?.trim() || '';
  if (!text) return false;

  Transforms.insertFragment(
    editor,
    parserMdToSchema(text, plugins).schema,
  );
  return true;
};

/**
 * 处理纯文本粘贴
 */
const processPlainTextPaste = async (
  editor: EditorType,
  clipboardData: DataTransfer,
  selection: any,
  store: any,
  plugins: any[],
): Promise<boolean> => {
  const text = clipboardData?.getData?.('text/plain')?.trim() || '';
  if (!text) return false;

  // 如果是表格或者代码块，直接插入文本
  if (shouldInsertTextDirectly(editor, selection)) {
    Transforms.insertText(editor, text);
    return true;
  }

  try {
    // 处理特殊文本格式（media:// 和 attach:// 链接）
    if (handleSpecialTextPaste(editor, text, selection)) {
      return true;
    }

    // 处理 HTTP 链接
    if (handleHttpLinkPaste(editor, text, selection, store)) {
      return true;
    }

    // 处理普通文本
    if (await handlePlainTextPaste(editor, text, selection, plugins)) {
      return true;
    }
  } catch (e) {
    console.log('insert error', e);
  }

  return false;
};

/**
 * 使用默认插入行为
 */
const useDefaultInsert = (
  editor: EditorType,
  clipboardData: DataTransfer,
  target: EventTarget | null,
): void => {
  if (hasEditableTarget(editor, target)) {
    ReactEditor.insertData(editor, clipboardData);
  }
};

/**
 * 处理粘贴事件的主函数
 */
export const processPasteEvent = async (
  editor: EditorType,
  event: React.ClipboardEvent<HTMLDivElement>,
  props: MEditorProps,
  store: any,
  plugins: any[],
): Promise<void> => {
  // 检查粘贴配置
  if (!isPasteEnabled(props.pasteConfig)) {
    return;
  }

  const selection = editor.selection;
  const allowedTypes = getAllowedTypes(props.pasteConfig);
  const types = event.clipboardData?.types || ['text/plain'];

  // 删除选中的文本
  deleteSelectedText(editor, selection);

  // 处理 Tag 节点粘贴
  if (selection && processTagNodePaste(editor, selection, event.clipboardData)) {
    return;
  }

  // 调用外部粘贴回调
  props.onPaste?.(event);

  // 按优先级处理不同类型的粘贴内容
  // 1. Slate Markdown Fragment
  if (
    types.includes('application/x-slate-md-fragment') &&
    isTypeAllowed('application/x-slate-md-fragment', allowedTypes)
  ) {
    if (processSlateFragment(editor, event.clipboardData, selection)) {
      return;
    }
  }

  // 2. HTML
  if (
    types.includes('text/html') &&
    isTypeAllowed('text/html', allowedTypes)
  ) {
    if (await processHtmlPaste(editor, event.clipboardData, props)) {
      return;
    }
  }

  // 3. Files
  if (types.includes('Files') && isTypeAllowed('Files', allowedTypes)) {
    if (await processFilesPaste(editor, event.clipboardData, props)) {
      return;
    }
  }

  // 4. Markdown
  if (
    types.includes('text/markdown') &&
    isTypeAllowed('text/markdown', allowedTypes)
  ) {
    if (processMarkdownPaste(editor, event.clipboardData, plugins)) {
      return;
    }
  }

  // 5. Plain Text
  if (
    types.includes('text/plain') &&
    isTypeAllowed('text/plain', allowedTypes)
  ) {
    if (
      await processPlainTextPaste(
        editor,
        event.clipboardData,
        selection,
        store,
        plugins,
      )
    ) {
      return;
    }
  }

  // 6. 使用默认插入行为
  useDefaultInsert(editor, event.clipboardData, event.target);
};

