import { Editor, Node, Operation, Path, Range, Transforms } from 'slate';
import { ReactEditor } from '../slate-react';

export const inlineNode = new Set(['break']);

const voidNode = new Set(['hr', 'break']);

function hasRange(editor: Editor, range: { anchor: any; focus: any }): boolean {
  const { anchor, focus } = range;
  return (
    Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus.path)
  );
}

/**
 * 处理卡片选择规范化 - 当选中整个卡片时自动定位到 card-after
 * @param editor - Slate编辑器实例
 * @param selection - 当前选择
 */
const normalizeCardSelection = (editor: Editor, selection: Range) => {
  if (!selection) {
    return;
  }

  // 调试信息
  const isDebug = process.env.NODE_ENV === 'development';

  try {
    const { anchor, focus } = selection;

    // 情况1: 折叠选择（单点选择）
    if (Range.isCollapsed(selection)) {
      // 检查是否选中卡片节点或其子节点
      const checkCardSelection = (path: Path) => {
        // 直接选中卡片节点
        if (path.length === 1) {
          const node = Node.get(editor, path);
          if (node && node.type === 'card') {
            if (isDebug) {
              console.log('Card node selected, moving to card-after');
            }
            const cardAfterPath = [...path, 2, 0];
            moveToCardAfter(editor, cardAfterPath);
            return true;
          }
        }
        // 选中卡片的子节点
        else if (path.length >= 2) {
          // 检查是否在卡片内
          let currentPath = path;
          while (currentPath.length > 1) {
            currentPath = Path.parent(currentPath);
            const node = Node.get(editor, currentPath);
            if (node && node.type === 'card') {
              // 如果选择的是卡片内容区域且路径指向卡片本身，移动到 card-after
              if (path.length === 2 && path[1] === 1) {
                const cardAfterPath = [...currentPath, 2, 0];
                moveToCardAfter(editor, cardAfterPath);
                return true;
              }
              break;
            }
          }
        }
        return false;
      };

      checkCardSelection(anchor.path);
    }

    // 情况2: 范围选择
    else {
      // 检查是否选中了整个卡片
      if (anchor.path.length === 1 && focus.path.length === 1) {
        if (Path.equals(anchor.path, focus.path)) {
          const selectedNode = Node.get(editor, anchor.path);
          if (selectedNode && selectedNode.type === 'card') {
            if (isDebug) {
              console.log('Entire card range selected, moving to card-after');
            }
            const cardAfterPath = [...anchor.path, 2, 0];
            moveToCardAfter(editor, cardAfterPath);
            return;
          }
        }
      }

      // 检查是否选中了卡片内的所有内容
      if (anchor.path.length >= 2 && focus.path.length >= 2) {
        const anchorCardPath = findCardPath(editor, anchor.path);
        const focusCardPath = findCardPath(editor, focus.path);

        if (
          anchorCardPath &&
          focusCardPath &&
          Path.equals(anchorCardPath, focusCardPath)
        ) {
          const cardAfterPath = [...anchorCardPath, 2, 0];
          moveToCardAfter(editor, cardAfterPath);
          return;
        }
      }
    }
  } catch (error) {
    if (isDebug) {
      console.error('Error in normalizeCardSelection:', error);
    }
  }
};

/**
 * 查找路径中的卡片路径
 * @param editor - Slate编辑器实例
 * @param path - 节点路径
 * @returns 卡片路径或null
 */
const findCardPath = (editor: Editor, path: Path): Path | null => {
  try {
    let currentPath = path;
    while (currentPath.length > 0) {
      const node = Node.get(editor, currentPath);
      if (node && node.type === 'card') {
        return currentPath;
      }
      if (currentPath.length === 1) break;
      currentPath = Path.parent(currentPath);
    }
  } catch (error) {
    // 忽略错误
  }
  return null;
};

/**
 * 将光标移动到 card-after 节点
 * @param editor - Slate编辑器实例
 * @param cardAfterPath - card-after 文本节点的路径
 */
const moveToCardAfter = (editor: Editor, cardAfterPath: Path) => {
  try {
    const cardAfterNode = Node.get(editor, cardAfterPath);
    if (cardAfterNode && typeof cardAfterNode.text === 'string') {
      // 使用 setTimeout 确保在下一个事件循环中执行，避免与当前选择操作冲突
      setTimeout(() => {
        try {
          Transforms.select(editor, {
            anchor: { path: cardAfterPath, offset: cardAfterNode.text.length },
            focus: { path: cardAfterPath, offset: cardAfterNode.text.length },
          });
        } catch (error) {
          // 如果移动失败，忽略错误
        }
      }, 0);
    }
  } catch (error) {
    // 如果 card-after 节点不存在或获取失败，忽略错误
  }
};

/**
 * 清空卡片区域的文本内容 - 使用零宽字符替换
 * @param editor - Slate编辑器实例
 * @param path - 要清空的节点路径
 */
const clearCardAreaText = (editor: Editor, path: Path) => {
  try {
    const node = Node.get(editor, path);
    if (node) {
      // 尝试直接DOM操作，设置为零宽字符
      try {
        const domNode = ReactEditor.toDOMNode(editor, node);

        if (domNode) {
          const zeroWidthNode = domNode?.querySelector(
            '[data-slate-zero-width]',
          );
          if (zeroWidthNode) {
            zeroWidthNode.textContent = '\uFEFF';
          }
        }
      } catch (domError) {
        console.log('DOM operation failed, falling back to Slate transforms');
      }
    }
  } catch (error) {
    // 如果操作失败，忽略错误
    console.log('clearCardAreaText error:', error);
  }
};

/**
 * 检查卡片是否为空
 * @param cardNode - 卡片节点
 * @returns 如果卡片为空则返回true
 */
const isCardEmpty = (cardNode: any): boolean => {
  if (!cardNode || cardNode.type !== 'card' || !cardNode.children) {
    return false;
  }

  // 查找实际内容节点（非card-before和card-after的节点）
  const contentNodes = cardNode.children.filter(
    (child: any) => child.type !== 'card-before' && child.type !== 'card-after',
  );

  // 如果没有内容节点，则为空
  if (contentNodes.length === 0) {
    return true;
  }

  // 检查内容节点是否为空
  return contentNodes.every((node: any) => {
    if (!node.children || node.children.length === 0) {
      return true;
    }
    // 检查是否只包含空文本
    return node.children.every((child: any) => {
      return child.text === '' || (child.text && child.text.trim() === '');
    });
  });
};

/**
 * 处理卡片相关节点的操作
 *
 * @param editor - Slate编辑器实例
 * @param operation - 要处理的操作
 * @param apply - 原始的apply函数
 * @returns 如果操作被处理则返回true，否则返回false
 *
 * @description
 * 处理以下卡片相关操作:
 * - 删除卡片节点 (remove_node)，包括card、card-before和card-after
 * - 在卡片后插入文本 (insert_text)
 * - 在卡片内插入节点 (insert_node)
 * - 检查并删除空卡片
 */
const handleCardOperation = (
  editor: Editor,
  operation: Operation,
  apply: (op: Operation) => void,
): boolean => {
  if (operation.type === 'remove_node') {
    const { node } = operation;
    const selectPath = editor.selection?.anchor?.path;
    const selectionNode = selectPath
      ? Node.get(editor, Path.parent(selectPath))
      : null;

    // 删除card时，直接删除整个卡片
    if (node.type === 'card') {
      // 直接执行原始操作，避免递归
      apply(operation);
      return true;
    }

    // 删除card-after时，删除整个卡片
    if (node.type === 'card-after') {
      Transforms.removeNodes(editor, {
        at: Path.parent(operation.path),
      });
      return true;
    }

    // 删除card-before时，阻止操作
    if (node.type === 'card-before') {
      return true;
    }

    // 检查操作后的父级是否为空卡片，如果是则删除
    if (operation.path && operation.path.length > 0) {
      try {
        const parentPath = Path.parent(operation.path);
        const parentNode = Node.get(editor, parentPath);
        if (
          parentNode &&
          parentNode.type === 'card' &&
          isCardEmpty(parentNode)
        ) {
          Transforms.removeNodes(editor, {
            at: parentPath,
          });
          return true;
        }
      } catch (error) {
        // 如果无法获取父节点，忽略错误
      }
    }
  }

  if (operation.type === 'insert_text') {
    try {
      const parentNode = Node.get(editor, Path.parent(operation.path));

      // card-before 不允许任何文本输入
      if (parentNode.type === 'card-before') {
        return true; // 阻止输入
      }

      // card-after 的输入会插入到卡片后面的新段落中
      if (parentNode.type === 'card-after') {
        try {
          const grandParentPath = Path.parent(Path.parent(operation.path));
          const grandParentNode = Node.get(editor, grandParentPath);

          if (grandParentNode.type === 'card') {
            // 使用 Editor.withoutNormalizing 确保操作的原子性
            Editor.withoutNormalizing(editor, () => {
              // 先创建新段落
              Transforms.insertNodes(
                editor,
                {
                  type: 'paragraph',
                  children: [{ text: operation.text }],
                },
                {
                  at: Path.next(grandParentPath),
                },
              );
              // 然后选中新创建的段落
              const newParagraphPath = Path.next(grandParentPath);
              const textPath = [...newParagraphPath, 0];
              Transforms.select(editor, {
                anchor: { path: textPath, offset: operation.text.length },
                focus: { path: textPath, offset: operation.text.length },
              });
              clearCardAreaText(editor, operation.path);
            });
            return true;
          }
        } catch (error) {
          // 如果获取父级节点失败，继续阻止输入
        }
        return true;
      }
    } catch (error) {
      // 如果无法获取父节点，允许操作继续
    }
  }

  if (operation.type === 'insert_node') {
    const parentNode = Node.get(editor, Path.parent(operation.path));

    // card-before 不允许任何节点插入
    if (parentNode.type === 'card-before') {
      return true; // 阻止插入
    }

    // card-after 的节点插入会放到卡片后面
    if (parentNode.type === 'card-after') {
      if (
        Node.get(editor, Path.parent(Path.parent(operation.path))).type ===
        'card'
      ) {
        const cardPath = Path.parent(Path.parent(operation.path));
        Transforms.insertNodes(editor, operation.node, {
          at: Path.next(cardPath),
        });
        return true;
      }
      Transforms.insertNodes(editor, operation.node, {
        at: Path.parent(operation.path),
      });
      return true;
    }
  }

  // 对于删除文本操作，我们需要在操作执行后检查卡片是否变空
  // 这将在 editor.apply 的最后处理

  return false;
};

/**
 * 处理链接卡片和媒体相关节点的操作
 *
 * @param editor - Slate编辑器实例
 * @param operation - 要处理的操作
 * @param apply - 原始的apply函数
 * @returns 如果操作被处理则返回true，否则返回false
 *
 * @description
 * 处理以下链接和媒体相关操作:
 * - 拆分链接卡片或媒体节点 (split_node)
 * - 删除链接卡片内的节点 (remove_node)
 */
const handleLinkAndMediaOperation = (
  editor: Editor,
  operation: Operation,
  apply: (op: Operation) => void,
): boolean => {
  if (
    operation.type === 'split_node' &&
    (operation.properties?.type === 'link-card' ||
      operation.properties?.type === 'media')
  ) {
    const node = Node.get(editor, operation.path);
    if (['link-card', 'media'].includes(node?.type)) {
      Transforms.insertNodes(
        editor,
        [
          {
            type: 'paragraph',
            children: [{ text: '', p: 'true' }],
          },
        ],
        {
          at: Path.next([operation.path.at(0)!]),
          select: true,
        },
      );
    }
    return true;
  }

  if (operation.type === 'remove_node') {
    const parentNode = Node.get(editor, Path.parent(operation.path));
    if ('link-card' === parentNode.type) {
      Transforms.removeNodes(editor, {
        at: Path.parent(operation.path),
      });
      return true;
    }
  }

  return false;
};

/**
 * 处理schema相关节点的操作
 *
 * @param editor - Slate编辑器实例
 * @param operation - 要处理的操作
 * @param apply - 原始的apply函数
 * @returns 如果操作被处理则返回true，否则返回false
 *
 * @description
 * 处理以下schema相关操作:
 * - 拆分schema节点 (split_node)，在拆分点之后插入新的段落节点
 */
const handleSchemaOperation = (
  editor: Editor,
  operation: Operation,
  apply: (op: Operation) => void,
): boolean => {
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
          select: true,
        },
      );
    }
    return true;
  }

  return false;
};

/**
 * 处理代码和标签相关节点的操作
 *
 * @param editor - Slate编辑器实例
 * @param operation - 要处理的操作
 * @param apply - 原始的apply函数
 * @returns 如果操作被处理则返回true，否则返回false
 *
 * @description
 * 处理以下代码和标签相关操作:
 * - 删除文本 (remove_text)，处理特殊触发文本和空标签
 * - 删除节点 (remove_node)，处理代码块周围的空格
 * - 插入文本 (insert_text)，处理代码块中的空格插入
 */
const handleCodeTagOperation = (
  editor: Editor,
  operation: Operation,
  apply: (op: Operation) => void,
): boolean => {
  if (operation.type === 'remove_text') {
    const currentNode = Node.get(editor, operation.path);

    if (currentNode?.tag) {
      // 处理空标签的删除
      if (currentNode.text?.trim() === '') {
        Editor.withoutNormalizing(editor, () => {
          Transforms.setNodes(
            editor,
            { tag: false, code: false, text: ' ', triggerText: undefined },
            { at: operation.path },
          );
        });
        return true;
      }

      // 光标在 tag 内部，执行原始的删除操作
      apply(operation);
      return true;
    }
  }

  if (operation.type === 'remove_node') {
    const { node } = operation;
    const selectPath = editor.selection?.anchor?.path;
    // 删除代码块时，删除空格
    // 代码块的前一个节点是代码块时，删除前一个节点
    const [preNode, prePath] =
      Editor.previous(editor, { at: selectPath }) || [];

    //@ts-ignore
    if (preNode?.tag && node?.text === ' ') {
      Transforms.removeNodes(editor, {
        at: prePath,
      });
      apply(operation);
      return true;
    }
  }

  if (operation.type === 'insert_text') {
    const currentNode = Node.get(editor, operation.path);

    if (
      currentNode?.tag &&
      operation.text === ' ' &&
      editor.selection?.focus.offset === currentNode.text.length
    ) {
      // 如果当前节点是代码块，且输入的是空格，则插入一个空格到 code 节点外
      Transforms.insertNodes(editor, [{ text: ' ' }]);
      return true;
    }
  }

  if (operation.type === 'split_node') {
    const node = Node.get(editor, operation.path);
    if (node?.tag || node?.code) {
      return true;
    }
  }
  return false;
};

// 将所有处理函数放入数组
const operationHandlers = [
  handleCardOperation,
  handleLinkAndMediaOperation,
  handleSchemaOperation,
  handleCodeTagOperation,
];

/**
 * 为Slate编辑器添加Markdown支持的插件函数
 *
 * @param editor - 要扩展的Slate编辑器实例
 * @returns 增强后的编辑器实例，具有Markdown处理能力
 *
 * @description
 * 该插件通过扩展编辑器的基本功能，使其能够处理和渲染Markdown内容：
 * - 扩展`isInline`方法，识别特定的行内元素
 * - 扩展`isVoid`方法，识别特定的空元素
 * - 重写`apply`方法，添加自定义操作处理逻辑
 * - 重写`deleteBackward`方法，处理特殊节点的删除行为
 *
 * 自定义操作处理流程：
 * 1. 按顺序尝试所有专用处理函数（表格、卡片、链接、Schema等）
 * 2. 如果任一处理函数返回true，则操作被消费
 * 3. 否则，调用原始的apply方法处理操作
 */
export const withMarkdown = (editor: Editor) => {
  const {
    isInline,
    isVoid,
    apply,
    deleteBackward,
    insertText,
    insertFragment,
  } = editor;

  editor.isInline = (element) => {
    return inlineNode.has(element.type) || isInline(element);
  };

  editor.isVoid = (element) => {
    return voidNode.has(element.type) || isVoid(element);
  };

  editor.apply = (operation: Operation) => {
    // 依次尝试每个处理函数
    for (const handler of operationHandlers) {
      if (handler(editor, operation, apply)) {
        return;
      }
    }

    // 记录操作前可能涉及的卡片路径，用于操作后检查
    let cardPathsToCheck: Path[] = [];

    if (operation.type === 'remove_text' || operation.type === 'insert_text') {
      if (operation.path && operation.path.length > 0) {
        try {
          // 向上查找是否在卡片内
          let currentPath = operation.path;
          while (currentPath.length > 0) {
            const node = Node.get(editor, currentPath);
            if (node && node.type === 'card') {
              cardPathsToCheck.push(currentPath);
              break;
            }
            currentPath = Path.parent(currentPath);
          }
        } catch (error) {
          // 如果无法获取节点，忽略错误
        }
      }
    }

    // 执行原始操作
    apply(operation);

    // 操作执行后，检查涉及的卡片是否变空
    for (const cardPath of cardPathsToCheck) {
      try {
        const cardNode = Node.get(editor, cardPath);
        if (cardNode && cardNode.type === 'card' && isCardEmpty(cardNode)) {
          Transforms.removeNodes(editor, {
            at: cardPath,
          });
        }
      } catch (error) {
        // 如果节点已被删除或不存在，忽略错误
      }
    }

    // 处理选择规范化 - 当选中整个卡片时自动定位到 card-after
    // 在测试环境中不执行自动选择规范化，避免干扰测试用例
    if (
      operation.type === 'set_selection' &&
      operation.newProperties &&
      editor.selection &&
      typeof window !== 'undefined'
    ) {
      normalizeCardSelection(editor, editor.selection);
    }
  };

  editor.insertText = (text: string) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      try {
        const node = Node.get(editor, Path.parent(selection.anchor.path));

        // card-before 不允许任何文本输入
        if (node.type === 'card-before') {
          return; // 阻止输入
        }

        // card-after 的输入会插入到卡片后面的新段落中
        if (node.type === 'card-after') {
          const grandParentPath = Path.parent(
            Path.parent(selection.anchor.path),
          );
          const grandParent = Node.get(editor, grandParentPath);

          if (grandParent.type === 'card') {
            Editor.withoutNormalizing(editor, () => {
              Transforms.insertNodes(
                editor,
                {
                  type: 'paragraph',
                  children: [{ text: text }],
                },
                {
                  at: Path.next(grandParentPath),
                },
              );
              // 选中新创建的段落
              const newParagraphPath = Path.next(grandParentPath);
              const textPath = [...newParagraphPath, 0];
              Transforms.select(editor, {
                anchor: { path: textPath, offset: text.length },
                focus: { path: textPath, offset: text.length },
              });
              const cardAfterPath = [...grandParentPath, 2, 0];
              clearCardAreaText(editor, cardAfterPath);
            });
            return;
          }
        }
      } catch (error) {
        // 如果无法获取节点，继续原有逻辑
      }
    }

    insertText(text);
  };

  editor.insertFragment = (fragment: any) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      try {
        const node = Node.get(editor, Path.parent(selection.anchor.path));

        // card-before 不允许任何片段插入
        if (node.type === 'card-before') {
          return; // 阻止插入
        }

        // card-after 的片段插入会放到卡片后面
        if (node.type === 'card-after') {
          const grandParentPath = Path.parent(
            Path.parent(selection.anchor.path),
          );
          const grandParent = Node.get(editor, grandParentPath);

          if (grandParent.type === 'card') {
            // 将片段内容插入到卡片后面
            Transforms.insertNodes(editor, fragment, {
              at: Path.next(grandParentPath),
              select: true,
            });
            return;
          }
        }
      } catch (error) {
        // 如果无法获取节点，继续原有逻辑
      }
    }

    insertFragment(fragment);
  };

  editor.deleteBackward = (unit: any) => {
    const { selection } = editor;
    if (
      selection &&
      hasRange(editor, selection) &&
      Range.isCollapsed(selection)
    ) {
      const node = Node.get(editor, Path.parent(selection.anchor.path));
      if (node.type === 'card-before') {
        return;
      }
      if (node.type === 'card-after') {
        Transforms.removeNodes(editor, {
          at: Path.parent(selection.anchor.path),
        });
        return;
      }

      // 检查前一个节点是否是 tag
      try {
        const [previousNode, previousPath] =
          Editor.previous(editor, {
            at: selection.anchor.path,
          }) || [];

        const isBeforeTag = selection && selection.anchor.offset <= 1;

        if (previousNode?.tag && previousPath && isBeforeTag) {
          // 如果前一个节点是 tag，直接删除整个 tag
          Editor.withoutNormalizing(editor, () => {
            const parent = Node.get(editor, Path.parent(previousPath));
            const index = previousPath[previousPath.length - 1];

            if (parent.children.length === 1) {
              // 如果是唯一的节点，转换为普通文本
              Transforms.setNodes(
                editor,
                { tag: false, code: false, text: ' ', triggerText: undefined },
                { at: previousPath },
              );
            } else if (index === 0) {
              // 如果是第一个节点，删除并合并下一个节点
              Transforms.removeNodes(editor, { at: previousPath });
            } else {
              // 如果是中间或最后节点，先合并再删除
              Transforms.removeNodes(editor, { at: previousPath });
            }
          });
          return;
        }
      } catch (error) {
        // 如果获取前一个节点失败，继续执行原始删除操作
      }
      try {
        const node = Node.get(editor, selection.anchor.path);

        if (node.tag && selection.anchor.offset <= 1) {
          const text = node?.text?.replace(node.triggerText || '', '');
          Transforms.setNodes(
            editor,
            {
              tag: false,
              code: false,
            },
            { at: selection.anchor.path },
          );
          Transforms.insertText(editor, text, {
            at: selection.anchor.path,
          });
          return;
        }
      } catch {}
    }

    deleteBackward(unit);
  };

  return editor;
};
