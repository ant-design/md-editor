import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Editor, Element, Node, NodeEntry, Path, Range } from 'slate';
import { useSlate } from 'slate-react';
import { CodeNode } from '../../el';
import { EditorStore, useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { langSet, loadedLanguage } from '../utils/highlight';

const htmlReg = /<[a-z]+[\s"'=:;()\w\-\[\]\/.]*\/?>(.*<\/[a-z]+>:?)?/g;
export const codeCache = new WeakMap<object, { path: Path; range: Range[] }>();
export const cacheTextNode = new WeakMap<object, { path: Path; range: Range[] }>();
export const clearAllCodeCache = (editor: Editor) => {
  const codes = Array.from<any>(
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'code',
      at: [],
    }),
  );
  codes.map((c) => codeCache.delete(c[0]));
};

const highlightNodes = new Set(['paragraph', 'table-cell', 'code', 'head', 'code-line']);
let clearTimer = 0;

export const clearCodeCache = (node: any) => {
  codeCache.delete(node);
  clearTimeout(clearTimer);
  clearTimer = window.setTimeout(() => {}, 60);
};

const run = (node: NodeEntry, code: string, lang: any) => {};
let stack: { run: Function; lang: string }[] = [];

export function useHighlight(store?: EditorStore) {
  return useCallback(
    ([node, path]: NodeEntry): Range[] => {
      if (Element.isElement(node) && highlightNodes.has(node.type)) {
        const ranges = store?.highlightCache.get(node) || [];
        if (node.type === 'code') {
          ranges.push(...(codeCache.get(node)?.range || []));
        }
        const cacheText = cacheTextNode.get(node);
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
                    focus: { path: [...path, i], offset: m.index + m[0].length },
                    html: true,
                  });
                }
                const match = c.text.matchAll(/\[\^.+?]:?/g);
                for (let m of match) {
                  if (typeof m.index !== 'number') continue;
                  textRanges.push({
                    anchor: { path: [...path, i], offset: m.index },
                    focus: { path: [...path, i], offset: m.index + m[0].length },
                    fnc: !m[0].endsWith(':'),
                    fnd: m[0].endsWith(':'),
                  });
                }
                const matchSymbol = (c.text as string).matchAll(/[\[\]\{\}@;#$￥&]/g);
                // @ts-ignore
                for (let m of matchSymbol) {
                  textRanges.push({
                    anchor: { path: [...path, i], offset: m.index },
                    focus: { path: [...path, i], offset: m.index! + m[0].length },
                    color: '#8b5cf6',
                  });
                }
                cacheTextNode.set(node, { path, range: textRanges });
                ranges.push(...textRanges);
              }
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
    },
    [store?.refreshHighlight],
  );
}

export const SetNodeToDecorations = observer(() => {
  const editor = useSlate();
  const store = useEditorStore();
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
      // @ts-ignore
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
  }, []);
  useMemo(() => {
    if (store?.pauseCodeHighlight) return;
    parser();
  }, [editor.children, store?.pauseCodeHighlight]);
  return null;
});
