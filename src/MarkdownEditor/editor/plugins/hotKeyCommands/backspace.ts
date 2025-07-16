import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import { Elements } from '../../../el';
import { EditorUtils } from '../../utils/editorUtils';

export class BackspaceKey {
  constructor(private readonly editor: Editor) {}

  range() {
    const sel = this.editor.selection;
    if (!sel) return;
    let [start, end] = Range.edges(sel);
    if (
      Point.equals(start, Editor.start(this.editor, [])) &&
      Point.equals(end, Editor.end(this.editor, []))
    ) {
      EditorUtils.deleteAll(this.editor);
      Transforms.select(this.editor, Editor.end(this.editor, []));
      return true;
    }
    return false;
  }

  private clearStyle(sel: Range) {
    const start = Range.start(sel);
    const leaf = Node.leaf(this.editor, start.path);
    if (leaf.text?.length === 1 && EditorUtils.isDirtLeaf(leaf)) {
      EditorUtils.clearMarks(this.editor);
    }
  }

  run() {
    const sel = this.editor.selection;
    if (!sel) return;
    const nodes = Array.from<any>(
      Editor.nodes<Elements>(this.editor, {
        mode: 'lowest',
        match: (n) => Element.isElement(n),
      }),
    );
    const [node] = nodes;
    const [el, path] = node;
    const parent = Editor.parent(this.editor, path);
    if (el.type !== 'paragraph' && parent?.[0]?.type !== 'list-item') {
      this.clearStyle(sel);
    }
    if (el.type === 'head') {
      const str = Node.string(el);
      if (!str) {
        Transforms.setNodes(
          this.editor,
          {
            type: 'paragraph',
          },
          { at: path },
        );
        return true;
      }
    }
    if (el.type === 'media' || el.type === 'attach') {
      Transforms.removeNodes(this.editor, { at: path });
      Transforms.insertNodes(this.editor, EditorUtils.p, {
        at: node[1],
        select: true,
      });
      return true;
    }

    if (el.type === 'paragraph') {
      const parent = Editor.parent(this.editor, path);
      if (parent?.[0]?.type === 'list-item') {
        if (Node.string(parent[0]) !== '') {
          return false;
        }
        if (Node.string(parent[0]) === '') {
          // 使用新的拆分逻辑处理空的list-item
          const listPath = Path.parent(parent[1]);
          const listNode = Editor.node(this.editor, listPath);
          const currentItemIndex = parent[1][parent[1].length - 1];
          const isLastItem =
            currentItemIndex === listNode[0].children.length - 1;

          if (isLastItem) {
            // 如果是最后一个项目，删除list-item并替换成paragraph
            Transforms.delete(this.editor, { at: parent[1] });
            Transforms.insertNodes(
              this.editor,
              { type: 'paragraph', children: [{ text: '' }] },
              { at: parent[1], select: true },
            );
          } else {
            // 如果不是最后一个项目，拆分列表
            const remainingItems = listNode[0].children.slice(
              currentItemIndex + 1,
            );

            // 删除当前item之后的所有items
            for (
              let i = listNode[0].children.length - 1;
              i > currentItemIndex;
              i--
            ) {
              Transforms.delete(this.editor, { at: [...listPath, i] });
            }

            // 删除当前item
            Transforms.delete(this.editor, { at: parent[1] });

            // 插入paragraph
            const insertPath = Path.next(listPath);
            Transforms.insertNodes(
              this.editor,
              { type: 'paragraph', children: [{ text: '' }] },
              { at: insertPath, select: true },
            );

            // 如果有剩余的items，创建新的列表
            if (remainingItems.length > 0) {
              const newListPath = Path.next(insertPath);
              Transforms.insertNodes(
                this.editor,
                {
                  type: listNode[0].type, // 保持原列表类型 (ordered/unordered)
                  children: remainingItems,
                },
                { at: newListPath },
              );
            }
          }
          return true;
        }
      }
    }
    /**
     * 处理表格单元格在起始位置的情况
     */
    if (el.type === 'table-cell' && sel.anchor.offset === 0) {
      // 当光标在表格单元格的起始位置时，阻止继续退格
      const start = Range.start(sel);
      if (!Path.hasPrevious(start.path)) {
        return true;
      }
    }

    /**
     * 防止删除paragraph与空table-cell混合
     */
    if (sel.anchor.offset === 0) {
      const preInline = Editor.previous<any>(this.editor, {
        at: sel.focus.path,
      });
      if (preInline && preInline[0].type === 'break') {
        Transforms.delete(this.editor, { at: preInline[1] });
        return true;
      }
      if (el.type === 'paragraph') {
        const pre = Editor.previous<any>(this.editor, { at: path });
        if (pre) {
          if (['table', 'code'].includes(pre[0].type)) {
            const end = Editor.end(this.editor, pre[1]);
            if (!Node.string(Node.get(this.editor, end.path))) {
              Transforms.delete(this.editor, { at: path });
              const text = Node.string(el);
              if (text) {
                Transforms.insertNodes(
                  this.editor,
                  pre[0].type === 'code' ? [{ text }] : el.children,
                  {
                    at: end,
                  },
                );
              }
              Transforms.select(this.editor, end);
              return true;
            }
          }
          if (pre[0].type === 'media' || pre[0].type === 'attach') {
            if (!Node.string(el)) {
              Transforms.delete(this.editor, { at: path });
            }
            Transforms.select(this.editor, pre[1]);
            return true;
          }
        }
        if (
          !pre &&
          !Editor.previous<any>(this.editor, { at: sel.anchor.path })
        ) {
          const parent = Editor.parent(this.editor, path);
          if (parent[0].type === 'blockquote') {
            if (Editor.hasPath(this.editor, Path.next(path))) {
              Transforms.delete(this.editor, { at: path });
            } else {
              Transforms.delete(this.editor, { at: parent[1] });
            }
            Transforms.insertNodes(
              this.editor,
              { type: 'paragraph', children: el.children },
              { at: parent[1] },
            );
            Transforms.select(
              this.editor,
              Editor.start(this.editor, parent[1]),
            );
            return true;
          }

          // 可删除顶级元素中的第一个段落
          const next = Editor.hasPath(this.editor, Path.next(path));
          if (
            Editor.isEditor(parent[0]) &&
            next &&
            Editor?.node(this.editor, Path.next(path))[0].type !== 'hr'
          ) {
            Transforms.delete(this.editor, { at: path });
            return true;
          }
        }
        return false;
      }
    }

    return false;
  }
}
