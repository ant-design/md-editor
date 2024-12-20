import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { Editor, Element, Node, NodeEntry, Path, Range } from 'slate';
import { useSlate } from 'slate-react';
import { CodeNode } from '../../el';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { highlighter, langSet, loadedLanguage } from '../utils/highlight';

const htmlReg = /<[a-z]+[\s"'=:;()\w\-[\]/.]*\/?>(.*<\/[a-z]+>:?)?/g;
const linkReg =
  /(https?|ftp):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gi;

export const codeCache = new WeakMap<object, { path: Path; range: Range[] }>();

export const cacheTextNode = new WeakMap<
  object,
  { path: Path; range: Range[] }
>();
/**
 * 清除编辑器中所有代码块的缓存。
 *
 * @param editor - 编辑器实例。
 */
export const clearAllCodeCache = (editor: Editor) => {
  const codes = Array.from<any>(
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'code',
      at: [],
    }),
  );
  codes.map((c) => codeCache.delete(c[0]));
};

/**
 * @constant highlightNodes
 * 一个包含需要高亮显示的节点类型的集合。
 * 这些节点类型包括：
 * - 'paragraph'：段落
 * - 'table-cell'：表格单元格
 * - 'code'：代码块
 * - 'head'：标题
 * - 'code-line'：代码行
 */
const highlightNodes = new Set([
  'paragraph',
  'table-cell',
  'code',
  'head',
  'code-line',
]);

let clearTimer = 0;

/**
 * 清除代码缓存。
 *
 * @param node - 要删除缓存的节点。
 */
export const clearCodeCache = (node: any) => {
  codeCache.delete(node);
  clearTimeout(clearTimer);
};

/**
 * 运行代码高亮功能。
 *
 * @param node - 节点条目，包含节点和路径。
 * @param code - 需要高亮的代码字符串。
 * @param lang - 代码语言。
 */
const run = (node: NodeEntry, code: string, lang: any) => {
  try {
    const el = node[0];
    const ranges: Range[] = [];
    if (!highlighter) {
      return;
    }
    const tokens = highlighter?.codeToTokensBase?.(code, {
      lang: lang,
      theme: 'github-light',
      includeExplanation: false,
      tokenizeMaxLineLength: 5000,
    });

    for (let i = 0; i < (tokens?.length || 0); i++) {
      const lineToken = tokens[i];
      let start = 0;
      for (let t of lineToken) {
        const length = t.content.length;
        if (!length) {
          continue;
        }
        const end = start + length;
        const path = [...node[1], i, 0];
        ranges.push({
          anchor: { path, offset: start },
          focus: { path, offset: end },
          color: t.color,
        });
        start = end;
      }
    }
    codeCache.set(el, { path: node[1], range: ranges });
  } catch (e) {
    console.log(e);
  }
};

/**
 * 一个用于存储代码块的堆栈。
 * 每个堆栈元素包含一个 `run` 方法和一个表示语言的字符串 `lang`。
 *
 * @type {Array<{ run: any; lang: string }>}
 */
let stack: { run: any; lang: string }[] = [];

/**
 * 使用高亮功能的钩子函数。
 *
 * @param {EditorStore} [store] - 可选的编辑器存储对象，用于缓存高亮信息。
 * @returns {function} 返回一个回调函数，该函数接收一个节点条目并返回一个范围数组。
 *
 * 回调函数逻辑：
 * - 如果节点是一个元素并且其类型在高亮节点集合中，则从缓存中获取高亮范围。
 * - 如果节点类型是 'code'，则将代码缓存中的范围添加到结果中。
 * - 如果节点类型是 'inline-katex'，则根据缓存或通过解析代码生成高亮范围。
 * - 如果节点类型是 'paragraph' 或 'table-cell'，则处理其子节点的文本内容，生成高亮范围。
 * - 特殊处理 'paragraph' 类型节点的代码块和表格行。
 *
 * @example
 * const highlightRanges = useHighlight(store)([node, path]);
 */

const highlightCache = new WeakMap<object, Range[]>();

export function useHighlight() {
  return useCallback(([node, path]: NodeEntry): Range[] => {
    if (Element.isElement(node) && highlightNodes.has(node.type)) {
      const ranges = highlightCache.get(node) || [];
      if (node.type === 'code') {
        ranges.push(...(codeCache.get(node)?.range || []));
      }
      const cacheText = cacheTextNode.get(node);
      // if (node.type === 'inline-katex') {
      //   if (cacheText && Path.equals(cacheText.path, path)) {
      //     ranges.push(...cacheText.range);
      //   } else {
      //     const code = Node.string(node);
      //     if (code) {
      //       let textRanges: any[] = [];
      //       const tokens = highlighter?.codeToTokensBase?.(code, {
      //         lang: 'text',
      //         theme: 'github-light',
      //         includeExplanation: false,
      //         tokenizeMaxLineLength: 5000,
      //       });
      //       let start = 0;
      //       const lineToken = tokens[0];
      //       for (let t of lineToken) {
      //         const length = t.content.length;
      //         if (!length) {
      //           continue;
      //         }
      //         const end = start + length;
      //         textRanges.push({
      //           anchor: { path, offset: start },
      //           focus: { path, offset: end },
      //           color: t.color,
      //         });
      //         start = end;
      //       }
      //       cacheTextNode.set(node, { path, range: textRanges });
      //       ranges.push(...textRanges);
      //     }
      //   }
      // }
      // footnote
      if (['paragraph', 'table-cell'].includes(node.type)) {
        for (let i = 0; i < node.children.length; i++) {
          const c = node.children[i];
          if (c.text && !EditorUtils.isDirtLeaf(c)) {
            if (cacheText && Path.equals(cacheText.path, path)) {
              ranges.push(...cacheText.range);
            } else {
              let textRanges: any[] = [];
              const matchHtml = c.text.matchAll(htmlReg);
              for (let m of matchHtml) {
                textRanges.push({
                  anchor: { path: [...path, i], offset: m.index },
                  focus: {
                    path: [...path, i],
                    offset: m.index + m[0].length,
                  },
                  html: true,
                });
              }
              const match = c.text.matchAll(/\[\^.+?]:?/g);
              for (let m of match) {
                if (typeof m.index !== 'number') continue;
                textRanges.push({
                  anchor: { path: [...path, i], offset: m.index },
                  focus: {
                    path: [...path, i],
                    offset: m.index + m[0].length,
                  },
                  fnc: !m[0].endsWith(':'),
                  fnd: m[0].endsWith(':'),
                });
              }
              cacheTextNode.set(node, { path, range: textRanges });
              ranges.push(...textRanges);
            }
          }
          if (c.text && !c.url && !c.docId && !c.hash) {
            let textRanges: any[] = [];
            const links = (c.text as string).matchAll(linkReg);
            for (let m of links) {
              textRanges.push({
                anchor: { path: [...path, i], offset: m.index },
                focus: {
                  path: [...path, i],
                  offset: m.index! + m[0].length,
                },
                link: m[0],
              });
            }
            ranges.push(...textRanges);
          }
        }
      }
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        !EditorUtils.isDirtLeaf(node.children[0])
      ) {
        if (cacheText && Path.equals(cacheText.path, path)) {
          ranges.push(...cacheText.range);
        } else {
          const str = Node.string(node);
          if (str.startsWith('```')) {
            ranges.push({
              anchor: {
                path: [...path, 0],
                offset: 0,
              },
              focus: {
                path: [...path, 0],
                offset: 3,
              },
              color: '#a3a3a3',
            });
            cacheTextNode.set(node, { path, range: ranges });
          } else if (/^\|([^|]+\|)+$/.test(str)) {
            ranges.push({
              anchor: {
                path: [...path, 0],
                offset: 0,
              },
              focus: {
                path: [...path, 0],
                offset: str.length,
              },
              color: '#a3a3a3',
            });
            cacheTextNode.set(node, { path, range: ranges });
          }
        }
      }
      return ranges;
    }
    return [];
  }, []);
}

/**
 * 观察者组件 SetNodeToDecorations，用于在 Slate 编辑器中设置代码节点的装饰。
 *
 * @returns null
 *
 * 该组件使用 `useSlate` 获取编辑器实例，使用 `useEditorStore` 获取编辑器存储。
 *
 * `parser` 函数通过遍历编辑器中的所有代码节点，检查并更新代码缓存。如果代码节点的语言未加载，
 * 则将其添加到加载队列中。加载完成后，刷新代码高亮。
 *
 * `useMemo` 钩子在编辑器内容或暂停代码高亮状态变化时调用 `parser` 函数。
 *
 * 主要功能：
 * - 遍历编辑器中的代码节点
 * - 检查并更新代码缓存
 * - 加载未加载的语言并刷新代码高亮
 */
export const SetNodeToDecorations = observer(() => {
  const editor = useSlate();
  const { store } = useEditorStore();
  const parser = useCallback(() => {
    const codes = Array.from(
      Editor.nodes<CodeNode>(editor, {
        at: [],
        match: (n, path) => {
          if (Element.isElement(n) && n.type === 'code') {
            const cache = codeCache.get(n);
            if (!cache) return true;
            if (!Path.equals(cache.path, path)) {
              codeCache.set(n, {
                path,
                range: cache.range.map((r) => {
                  return {
                    ...r,
                    anchor: {
                      path: [...path, ...r.anchor.path.slice(-2)],
                      offset: r.anchor.offset,
                    },
                    focus: {
                      path: [...path, ...r.focus.path.slice(-2)],
                      offset: r.focus.offset,
                    },
                  };
                }),
              });
              return true;
            }
          }
          return false;
        },
      }),
    ).map((node) => {
      return {
        node,
        code: node[0].children.map((n) => Node.string(n)).join('\n'),
      };
    });
    for (let c of codes) {
      if (c.code.length > 10000) continue;
      const lang = c.node[0].language?.toLowerCase() || '';
      if (!langSet.has(lang)) continue;
      const el = c.node[0];
      let handle = codeCache.get(el);
      if (!handle) {
        if (!loadedLanguage.has(lang)) {
          stack.push({
            run: () => run(c.node, c.code, lang),
            lang: lang,
          });
        } else {
          run(c.node, c.code, lang);
        }
      }
    }
    if (stack.length) {
      const loadLang = stack.map((s) => s.lang as any);
      highlighter?.loadLanguage?.(...loadLang).then(() => {
        stack.map((s) => loadedLanguage.add(s.lang));
        stack.forEach((s) => s.run());
        stack = [];
        runInAction(() => (store.refreshHighlight = Date.now()));
      });
    }
  }, []);
  useMemo(() => {
    parser();
  }, [editor.children, store.refreshHighlight]);
  return null;
});
