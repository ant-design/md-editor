import { Editor, Node, Operation, Path, Range, Transforms } from 'slate';

export const inlineNode = new Set(['break']);

const voidNode = new Set(['hr', 'break']);

const TableInlineNode = new Set([
  'inline-code',
  'inline-katex',
  'paragraph',
  'footnoteDefinition',
  'table-row',
  'break',
  'html',
  'table-cell',
  'media',
]);

function hasRange(editor: Editor, range: { anchor: any; focus: any }): boolean {
  const { anchor, focus } = range;
  return (
    Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus.path)
  );
}

// 处理表格相关节点的操作
const handleTableOperation = (
  editor: Editor,
  operation: Operation,
): boolean => {
  const { apply } = editor;

  if (
    operation.type === 'merge_node' &&
    operation.properties?.type === 'table-cell'
  ) {
    return true;
  }

  if (operation.type === 'move_node') {
    const node = Node.get(editor, operation.path);
    if (node?.type === 'table-cell') return true;
  }

  if (operation.type === 'remove_node') {
    const { node } = operation;
    if (['table-row', 'table-cell'].includes(node.type)) {
      if (node.type === 'table-cell' || node.type === 'table-row') {
        apply(operation);
        return true;
      }
      return true;
    }
  }

  if (operation.type === 'insert_node') {
    const parentNode = Node.get(editor, Path.parent(operation.path));
    if (parentNode.type === 'table-cell' || parentNode.type === 'table-row') {
      if (TableInlineNode.has(operation.node.type) || !operation.node.type) {
        apply(operation);
        return true;
      }
      if (operation.node.type === 'card') {
        const relativeNode = operation.node.children.at(1);
        if (TableInlineNode.has(relativeNode.type)) {
          apply(operation);
          return true;
        }
      }
      console.error('表格内部只支持行内节点！');
      return true;
    }
  }

  return false;
};

// 处理卡片相关节点的操作
const handleCardOperation = (editor: Editor, operation: Operation): boolean => {
  if (operation.type === 'remove_node') {
    const { node } = operation;
    const selectPath = editor.selection?.anchor?.path;
    const selectionNode = selectPath
      ? Node.get(editor, Path.parent(selectPath))
      : null;

    // 删除card时，选中card_AFTER 节点
    if (node.type === 'card' && selectionNode?.type !== 'card-after') {
      Transforms.select(editor, [...(operation.path || []), 2]);
      return true;
    }
    if (node.type === 'card-after') {
      Transforms.removeNodes(editor, {
        at: Path.parent(operation.path),
      });
      return true;
    }
    if (node.type === 'card-before') {
      return true;
    }
  }

  if (operation.type === 'insert_text') {
    const parentNode = Node.get(editor, Path.parent(operation.path));
    if (parentNode.type === 'card-after') {
      if (
        Node.get(editor, Path.parent(Path.parent(operation.path))).type ===
        'card'
      ) {
        Transforms.insertNodes(
          editor,
          [
            {
              type: 'paragraph',
              children: [{ text: operation.text }],
            },
          ],
          {
            at: Path.next(Path.parent(Path.parent(operation.path))),
            select: true,
          },
        );
        return true;
      }
      return true;
    }
  }

  if (operation.type === 'insert_node') {
    const parentNode = Node.get(editor, Path.parent(operation.path));
    if (parentNode.type === 'card-before' || parentNode.type === 'card-after') {
      if (
        Node.get(editor, Path.parent(Path.parent(operation.path))).type ===
        'card'
      ) {
        Transforms.insertNodes(editor, operation.node, {
          at: Path.next(Path.parent(Path.parent(operation.path))),
        });
        return true;
      }
      Transforms.insertNodes(editor, operation.node, {
        at: Path.parent(operation.path),
      });
      return true;
    }
  }

  return false;
};

// 处理链接卡片和媒体相关节点的操作
const handleLinkAndMediaOperation = (
  editor: Editor,
  operation: Operation,
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

// 处理schema相关节点的操作
const handleSchemaOperation = (
  editor: Editor,
  operation: Operation,
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

// 处理代码/标签相关节点的操作
const handleCodeTagOperation = (
  editor: Editor,
  operation: Operation,
): boolean => {
  if (operation.type === 'remove_text') {
    const currentNode = Node.get(editor, operation.path);
    if (currentNode?.tag) {
      if (
        currentNode.triggerText &&
        operation.text === currentNode.triggerText
      ) {
        Transforms.setNodes(
          editor,
          { tag: false, code: false, text: ' ' },
          { at: operation.path },
        );
        Transforms.delete(editor, {
          at: {
            anchor: { path: operation.path, offset: 0 },
            focus: { path: operation.path, offset: operation.text.length },
          },
        });
        return true;
      }

      if (
        currentNode.text?.trim() === '' &&
        editor?.children?.at(0)?.children?.length === 1 &&
        editor?.children?.at(0)?.children?.at(0)?.tag
      ) {
        Transforms.setNodes(
          editor,
          { tag: false, code: false, text: ' ' },
          { at: operation.path },
        );
        return true;
      }
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
      editor.apply(operation);
      return true;
    }
  }

  if (operation.type === 'insert_text') {
    const node = Node.get(editor, operation.path);
    const currentNode = Node.get(editor, operation.path);

    if (
      currentNode?.tag &&
      operation.text === ' ' &&
      editor.selection?.focus.offset === node.text.length
    ) {
      // 如果当前节点是代码块，且输入的是空格，则插入一个空格到 code 节点外
      Transforms.insertNodes(editor, [{ text: ' ' }]);
      return true;
    }
  }

  return false;
};

// 将所有处理函数放入数组
const operationHandlers = [
  handleTableOperation,
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
  const { isInline, isVoid, apply, deleteBackward } = editor;

  editor.isInline = (element) => {
    return inlineNode.has(element.type) || isInline(element);
  };

  editor.isVoid = (element) => {
    return voidNode.has(element.type) || isVoid(element);
  };

  editor.apply = (operation: Operation) => {
    // 依次尝试每个处理函数
    for (const handler of operationHandlers) {
      if (handler(editor, operation)) {
        return;
      }
    }

    apply(operation);
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
    }

    deleteBackward(unit);
  };

  return editor;
};
