/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { BackspaceKey } from './hotKeyCommands/backspace';

const findElementByNode = (node: ChildNode) => {
  const index = Array.prototype.indexOf.call(node.parentNode!.childNodes, node);
  return node.parentElement!.children[index] as HTMLElement;
};
const fragment = new Set(['body', 'figure', 'div']);

const ELEMENT_TAGS = {
  BLOCKQUOTE: () => ({ type: 'blockquote' }),
  H1: () => ({ type: 'head', level: 1 }),
  H2: () => ({ type: 'head', level: 2 }),
  H3: () => ({ type: 'head', level: 3 }),
  H4: () => ({ type: 'head', level: 4 }),
  H5: () => ({ type: 'head', level: 5 }),
  TABLE: () => ({ type: 'table' }),
  IMG: (el: HTMLImageElement) => {
    return {
      type: 'media',
      url: el.src,
      downloadUrl: el.src && /^https?:/.test(el.src) ? el.src : undefined,
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    };
  },
  TR: () => ({ type: 'table-row' }),
  TH: () => ({ type: 'table-cell', title: true }),
  TD: () => ({ type: 'table-cell' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'list', order: true }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'list' }),
};

const TEXT_TAGS = {
  A: (el: HTMLElement) => ({ url: el.getAttribute('href') }),
  CODE: () => ({ code: true }),
  KBD: () => ({ code: true }),
  SPAN: (el: HTMLElement) => ({ text: el.textContent }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
};

export const deserialize = (
  el: ChildNode,
  parentTag: string = '',
): string | any[] | null | Record<string, any> => {
  if (el.nodeName.toLowerCase() === 'script') return [];
  if (el.nodeName.toLowerCase() === 'style') return [];
  if (el.nodeName.toLowerCase() === 'meta') return [];
  if (el.nodeName.toLowerCase() === 'link') return [];
  if (el.nodeName.toLowerCase() === 'head') return [];
  if (el.nodeName.toLowerCase() === 'colgroup') return [];
  if (el.nodeName.toLowerCase() === 'noscript') return [];
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  let target = el;
  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    target = el.childNodes[0];
  }
  let children = Array.from(target.childNodes)
    .map((n) => {
      return deserialize(n, target.nodeName.toLowerCase().toLowerCase());
    })
    .flat();

  if (children.length === 0) {
    children = [{ text: el.textContent || '' }];
  }

  if (fragment.has(el.nodeName.toLowerCase())) {
    return jsx('fragment', {}, children);
  }
  if (
    TEXT_TAGS[nodeName as 'A'] &&
    Array.from(el.childNodes).some(
      (e) => e.nodeType !== 3 && !TEXT_TAGS[e.nodeName as 'A'],
    )
  ) {
    return jsx('fragment', {}, children);
  }
  if (ELEMENT_TAGS[nodeName as 'BLOCKQUOTE']) {
    if (
      !parentTag ||
      !['h1', 'h2', 'code', 'h3', 'h4', 'h5', 'th', 'td'].includes(parentTag)
    ) {
      if (nodeName === 'PRE') {
        const dom = findElementByNode(el);
        const dataset = dom.dataset;
        const inner = dataset?.blType === 'code';
        if (inner) {
          return {
            type: 'code',
            language: dataset?.blLang,
            children: Array.from(target.childNodes.values()).map((n) => {
              return {
                type: 'code-line',
                children: [
                  {
                    text:
                      n.textContent?.replace(/\n/g, '')?.replace(/\t/g, '  ') ||
                      '',
                  },
                ],
              };
            }),
          };
        } else {
          const text = parserCodeText(findElementByNode(target));
          if (text) {
            return {
              type: 'code',
              children: text.split('\n').map((c) => {
                return { type: 'code-line', children: [{ text: c }] };
              }),
            };
          }
        }
        return null;
      }
      // @ts-ignore
      const attrs = ELEMENT_TAGS[nodeName as 'IMG'](el);
      return jsx('element', attrs, children);
    }
  }
  if (TEXT_TAGS[nodeName as 'A']) {
    // @ts-ignore
    const attrs = TEXT_TAGS[nodeName as 'SPAN'](el);
    return children
      .map((child: any) => {
        return jsx('text', attrs, child);
      })
      .filter((c: any) => !!c.text);
  }
  return children;
};

const parserCodeText = (el: HTMLElement) => {
  el.innerHTML = el.innerHTML.replace(/<br\/?>|<\/div>(?=\S)/g, '\n');
  return el.innerText;
};

const getTextsNode = (nodes: any[]) => {
  let text: any[] = [];
  for (let n of nodes) {
    if (n.text) {
      text.push(n);
    }
    if (n?.children) {
      text.push(...getTextsNode(n.children));
    }
  }
  return text;
};

const processFragment = (fragment: any[], parentType = '') => {
  let trans: any[] = [];
  let container: null | any = null;
  fragment = fragment.filter(
    (f) =>
      !(!f.type && !(f.text as string).trim()) ||
      (f.type === 'media' && !f.url),
  );
  for (let f of fragment) {
    if (f.type === 'table') {
      f.children = [
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
        ...(f.children as any[])
          .filter((r) => {
            if (r?.text) {
              if (!f.text?.trim?.().replace(/^\n+|\n+$/g, '')) return false;
            }
            if (!r) return false;
            return true;
          })
          .map((r: any, index) => {
            if (index === 0) {
              return {
                type: 'table-row',
                children: r?.children
                  ?.filter((c: any) => !!c?.children)
                  ?.map((c: any) => {
                    return {
                      type: 'table-cell',
                      children: c.children,
                      title: true,
                    };
                  }),
              };
            }
            return r;
          }),
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ];
    }
    if (
      f.type === 'paragraph' &&
      f.children?.every((s: any) => s.type === 'media')
    ) {
      trans.push(...f.children);
      continue;
    }
    if (f.text) {
      f.text = f.text?.trim?.().replace(/^\n+|\n+$/g, '');
      if (!f.text) continue;
    }
    if (f.type === 'media') {
      trans.push(f);
      continue;
    }
    if (
      (['link'].includes(f.type) || f.text) &&
      !['paragraph', 'table-cell', 'head'].includes(parentType)
    ) {
      if (!container) {
        f = { type: 'paragraph', children: [f] };
        container = f;
        trans.push(container);
      } else {
        container.children.push(f);
      }
      continue;
    }
    if (f.type === 'list-item' && parentType !== 'list') {
      if (!container) {
        container = { type: 'list', children: [f] };
        trans.push(container);
      } else {
        container.children.push(f);
      }
      continue;
    }
    if (f.children && f.type && f.type !== 'code') {
      f.children = processFragment(f.children, f.type);
      if (!f.children?.length) continue;
    }
    trans.push(f);
  }
  return trans;
};

/**
 * 转化 html 到 slate
 * @param editor
 * @param html
 * @returns
 */
export const insertParsedHtmlNodes = async (
  editor: Editor,
  html: string,
  editorProps: any,
) => {
  if (
    html.startsWith('<html>\r\n<body>\r\n\x3C!--StartFragment--><img src="')
  ) {
    return false;
  }
  const parsed = new DOMParser().parseFromString(html, 'text/html').body;
  const inner = !!parsed.querySelector('[data-be]');
  const sel = editor.selection;

  let fragmentList = processFragment([deserialize(parsed)].flat(1));
  for await (let fragment of fragmentList) {
    if (fragment.type === 'media') {
      const serverUrl = [
        await editorProps.image?.upload?.([fragment.url]),
      ].flat(1);
      fragment.url = serverUrl?.[0];
      fragment.downloadUrl = serverUrl?.[0];
    }
  }

  fragmentList = fragmentList.map((fragment) => {
    if (fragment.type === 'table') {
      return {
        type: 'card',
        children: [
          {
            type: 'card-before',
            children: [{ text: '' }],
          },
          fragment,
          {
            type: 'card-after',
            children: [{ text: '' }],
          },
        ],
      };
    }
    return fragment;
  });

  if (!fragmentList?.length) return;
  let [node] = Editor.nodes<Element>(editor, {
    match: (n) => Element.isElement(n),
  });

  if (sel) {
    if (!Range.isCollapsed(sel)) {
      const back = new BackspaceKey(editor);
      back.range();
      Transforms.select(editor, Range.start(sel));
      setTimeout(() => {
        const node = Editor.node(editor, [0]);
        if (
          editor.children.length > 1 &&
          node[0].type === 'paragraph' &&
          !Node.string(node[0])
        ) {
          Transforms.delete(editor, { at: [0] });
        }
      });
    }
    const [n] = Editor.nodes<Element>(editor, {
      match: (n) =>
        Element.isElement(n) &&
        ['code', 'table-cell', 'head', 'list-item'].includes(n.type),
      at: Range.isCollapsed(sel) ? sel.anchor.path : Range.start(sel).path,
    });
    if (n) node = n;
    if (node) {
      if (node[0].type === 'list-item' && fragmentList[0].type === 'list') {
        const children = fragmentList[0].children || [];
        if (!children.length) return false;
        const [p] = Editor.nodes<Element>(editor, {
          match: (n) => Element.isElement(n) && n.type === 'paragraph',
          at: Range.isCollapsed(sel) ? sel.anchor.path : Range.start(sel).path,
        });
        if (n && !Path.hasPrevious(p[1])) {
          if (!Node.string(p[0])) {
            Transforms.insertNodes(editor, children, { at: Path.next(n[1]) });
            const parent = Node.parent(editor, p[1]);
            const nextPath = [
              ...n[1].slice(0, -1),
              n[1][n[1].length - 1] + children.length,
            ];
            if (parent.children.length > 1) {
              Transforms.moveNodes(editor, {
                at: {
                  anchor: { path: Path.next(p[1]), offset: 0 },
                  focus: {
                    path: [...p[1].slice(0, -1), parent.children.length - 1],
                    offset: 0,
                  },
                },
                to: [...nextPath, 1],
              });
            }
            Transforms.delete(editor, { at: n[1] });
            Transforms.select(
              editor,
              Editor.end(editor, [
                ...nextPath.slice(0, -1),
                nextPath.pop() - 1,
              ]),
            );
          } else {
            Transforms.insertNodes(editor, children, { at: Path.next(n[1]) });
            Transforms.select(
              editor,
              Editor.end(editor, [
                ...n[1].slice(0, -1),
                n[1].pop()! + children.length,
              ]),
            );
          }
          if (fragmentList.length > 1) {
            Transforms.insertNodes(editor, fragmentList.slice(1), {
              at: Path.next(Path.parent(n[1])),
            });
          }
          return true;
        }
      }
      if (node[0].type === 'table-cell') {
        Transforms.insertFragment(editor, getTextsNode(fragmentList));
        return true;
      }
      if (node[0].type === 'head') {
        if (fragmentList[0].type) {
          if (fragmentList[0].type !== 'paragraph') {
            Transforms.insertNodes(
              editor,
              {
                type: 'paragraph',
                children: [{ text: '' }],
              },
              { at: Path.next(node[1]), select: true },
            );
            return false;
          } else {
            return false;
          }
        } else {
          const texts = fragmentList.filter((c) => c.text);
          if (texts.length) {
            Transforms.insertNodes(editor, texts);
            return true;
          }
        }
        return false;
      }
    }
  }
  if (inner && !['code', 'code-line', 'table-cell'].includes(node?.[0].type))
    return false;

  Transforms.insertFragment(editor, fragmentList);
  return true;
};
