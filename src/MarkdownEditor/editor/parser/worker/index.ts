/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Root, RootContent, Table } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { Element } from 'slate';
import {
  ChartNode,
  CustomLeaf,
  Elements,
  MediaNode,
  TableNode,
} from '../../../el';
import parser from './parser';

const stringifyObj = remark().use(remarkGfm);

const myRemark = {
  stringify: (obj: Root) => {
    const mdStr = stringifyObj.stringify(obj);
    return mdStr;
  },
};

const findImageElement = (str: string) => {
  try {
    const match = str.match(
      /^\s*<(img|video|iframe)[^>\n]*\/?>(.*<\/(?:img|video|iframe)>:?)?\s*$/,
    );
    if (match) {
      const url = match[0].match(/src="([^"\n]+)"/);
      const height = match[0].match(/height="(\d+)"/);
      const align = match[0].match(/data-align="(\w+)"/);
      return {
        url: url?.[1],
        height: height ? +height[1] : undefined,
        align: align?.[1],
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

const findAttachment = (str: string) => {
  try {
    const match = str.match(/^\s*<a[^>\n]*download[^>\n]*\/?>(.*<\/a>:?)?\s*$/);
    if (match) {
      const url = match[0].match(/href="([^"\n]+)"/);
      const size = match[0].match(/data-size="(\d+)"/);
      if (url) {
        return { url: url[1], size: Number(size?.[1] || 0) };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

const parseText = (els: RootContent[], leaf: CustomLeaf = {}) => {
  let leafs: CustomLeaf[] = [];
  for (let n of els) {
    if (n.type === 'strong')
      leafs = leafs.concat(parseText(n.children, { ...leaf, bold: true }));
    if (n.type === 'emphasis')
      leafs = leafs.concat(parseText(n.children, { ...leaf, italic: true }));
    if (n.type === 'delete')
      leafs = leafs.concat(
        parseText(n.children, { ...leaf, strikethrough: true }),
      );
    if (n.type === 'link')
      leafs = leafs.concat(parseText(n.children, { ...leaf, url: n.url }));
    if (n.type === 'inlineCode')
      leafs.push({ ...leaf, text: n.value, code: true });
    // @ts-ignore
    leafs.push({ ...leaf, text: n.value || '' });
  }
  return leafs;
};

const parseTableOrChart = (
  table: Table,
  preNode: RootContent,
): TableNode | ChartNode => {
  const keyMap = new Map<string, string>();

  // @ts-ignore
  const config =
    // @ts-ignore
    preNode.type === 'code' && preNode.language === 'html'
      ? // @ts-ignore
        preNode.otherProps
      : {};

  const tableHeader = table?.children?.at(0);
  const columns =
    tableHeader?.children
      ?.map((node) =>
        myRemark
          .stringify({
            type: 'root',
            children: [node],
          })
          ?.replace(/\n/g, '')
          .trim(),
      )
      .map((title, index) => {
        if (keyMap.has(title)) {
          keyMap.set(title, keyMap.get(title) + '_' + index);
          return {
            title: title,
            dataIndex: title + '_' + index,
            key: title + '_' + index,
          };
        }
        keyMap.set(title, title);
        return {
          title: title,
          dataIndex: title,
          key: title,
        };
      }) || [];

  const dataSource =
    table?.children?.slice(1).map((row) => {
      return row.children?.reduce((acc, cell, index) => {
        acc[columns[index].dataIndex] = myRemark
          .stringify({
            type: 'root',
            children: [cell],
          })
          ?.replace(/\n/g, '')
          .trim();
        return acc;
      }, {} as any);
    }) || [];
  const aligns = table.align;
  const isChart = config?.chartType || config?.at?.(0)?.chartType;
  const node: TableNode | ChartNode = {
    type: config?.chartType || config?.at?.(0)?.chartType ? 'chart' : 'table',
    children: isChart
      ? [{ text: '' } as any]
      : table.children.map((r: { children: any[] }, l: number) => {
          return {
            type: 'table-row',
            children: r.children.map(
              (c: { children: string | any[] }, i: string | number) => {
                return {
                  type: 'table-cell',
                  align: aligns?.[i as number] || undefined,
                  title: l === 0,
                  // @ts-ignore
                  children: c.children?.length
                    ? parserBlock(c.children as any, false, c as any)
                    : [{ text: '' }],
                };
              },
            ),
          };
        }),
    otherProps: {
      config: config,
      columns,
      dataSource: dataSource.map((item) => {
        delete item?.chartType;
        return {
          ...item,
        };
      }),
    },
  };
  return node;
};

const parserBlock = (
  nodes: RootContent[],
  top = false,
  parent?: RootContent,
) => {
  if (!nodes?.length) return [{ type: 'paragraph', children: [{ text: '' }] }];
  let els: (Elements | Text)[] = [];
  let el: Element | null | Element[] = null;
  let preNode: null | RootContent = null;
  let preElement: Element = null;
  let htmlTag: { tag: string; color?: string; url?: string }[] = [];
  let contextProps = {};
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    switch (n.type) {
      case 'heading':
        el = {
          type: 'head',
          level: n.depth,
          children: n.children?.length
            ? parserBlock(n.children, false, n)
            : [{ text: '' }],
        };
        break;
      case 'html':
        const value =
          n?.value?.replace('<!--', '').replace(' -->', '').trim() || '{}';
        if (value) {
          try {
            contextProps = JSON.parse(value);
          } catch (e) {
            console.error('parse html error', e);
          }
        }
        if (!parent || ['listItem', 'blockquote'].includes(parent.type)) {
          const img = findImageElement(n.value);
          if (img) {
            el = {
              type: 'media',
              align: img.align,
              height: img?.height,
              url: decodeURIComponent(img?.url || ''),
              children: [{ text: '' }],
            };
          } else {
            if (n.value === '<br/>') {
              el = { type: 'paragraph', children: [{ text: '' }] };
            } else {
              el = {
                type: 'code',
                language: 'html',
                render: true,
                children: n.value.split('\n').map((s: any) => {
                  return {
                    type: 'code-line',
                    children: [{ text: s }],
                  };
                }),
              };
            }
          }
        } else {
          const breakMatch = n.value.match(/<br\/?>/);
          if (breakMatch) {
            el = { type: 'break', children: [{ text: '' }] };
          } else {
            const htmlMatch = n.value.match(
              /<\/?(b|i|del|code|span|a)[^\n>]*?>/,
            );
            if (htmlMatch) {
              const [str, tag] = htmlMatch;
              if (
                str.startsWith('</') &&
                htmlTag.length &&
                htmlTag[htmlTag.length - 1].tag === tag
              ) {
                htmlTag.pop();
              }
              if (!str.startsWith('</')) {
                if (tag === 'span') {
                  try {
                    const styles = str.match(/style="([^"\n]+)"/);
                    if (styles) {
                      // @ts-ignore
                      const stylesMap = new Map(
                        styles[1]
                          .split(';')
                          .map((item: string) =>
                            item.split(':').map((item: string) => item.trim()),
                          ) as [string, string][],
                      );
                      if (stylesMap.get('color')) {
                        htmlTag.push({
                          tag: tag,
                          color: stylesMap.get('color') as string,
                        });
                      }
                    }
                  } catch (e) {
                    el = { text: n.value };
                  }
                } else if (tag === 'a') {
                  const url = str.match(/href="([\w:./_\-#\\]+)"/);
                  if (url) {
                    htmlTag.push({
                      tag: tag,
                      url: url[1],
                    });
                  }
                } else {
                  htmlTag.push({ tag: tag });
                }
              }
            } else {
              const img = findImageElement(n.value);
              if (img) {
                el = {
                  type: 'media',
                  align: img.align,
                  height: img?.height,
                  url: img?.url,
                  children: [{ text: '' }],
                };
              } else {
                el = { text: n.value };
              }
            }
          }
        }
        el.otherProps = contextProps;

        break;
      case 'image':
        el = {
          type: 'media',
          children: [{ text: '' }],
          url: decodeURIComponent(n.url),
          alt: n.alt,
        } as MediaNode;
        break;
      case 'list':
        el = {
          type: 'list',
          order: n.ordered,
          start: n.start,
          children: parserBlock(n.children, false, n),
        };
        el.task = el.children?.some((s: any) => typeof s.checked === 'boolean');
        break;
      case 'footnoteReference':
        el = { text: `[^${n.identifier}]` };
        break;
      case 'footnoteDefinition':
        el = {
          type: 'paragraph',
          children: [
            { text: `[^${n.identifier}]:` },
            ...(parserBlock(n.children, false, n)[0] as any)?.children,
          ],
        };
        break;
      case 'listItem':
        const children = n.children?.length
          ? parserBlock(n.children, false, n)
          : ([{ type: 'paragraph', children: [{ text: '' }] }] as any);
        if (children[0].type === 'paragraph' && children[0].children[0]?.text) {
          const text = children[0].children[0]?.text;
          const m = text.match(/^\[([x\s])]/);
          if (m) {
            el = {
              type: 'list-item',
              checked: m ? m[1] === 'x' : undefined,
              children: children,
            };
            children[0].children[0].text = text.replace(/^\[([x\s])]/, '');
            break;
          }
        }
        el = { type: 'list-item', checked: n.checked, children: children };
        break;
      case 'paragraph':
        if (
          n.children?.[0].type === 'html' &&
          n.children[0].value.startsWith('<a')
        ) {
          const text = n.children
            .map((n: any) => (n as any).value || '')
            .join('');
          const attach = findAttachment(text);
          if (attach) {
            const name = text.match(/>(.*)<\/a>/);
            el = {
              type: 'attach',
              url: decodeURIComponent(attach.url),
              size: attach.size,
              children: [{ text: '' }],
              name: name ? name[1] : attach.url,
            };
            break;
          }
        }
        el = [];
        let textNodes: any[] = [];
        for (let c of n.children || []) {
          if (c.type === 'image') {
            if (textNodes.length) {
              el.push({
                type: 'paragraph',
                children: parserBlock(textNodes, false, n),
              });
              textNodes = [];
            }
            el.push({
              type: 'media',
              children: [{ text: '' }],
              url: decodeURIComponent(c.url),
            });
          } else if (c.type === 'html') {
            const img = findImageElement(c.value);
            if (img) {
              el.push({
                type: 'media',
                align: img.align,
                children: [{ text: '' }],
                url: decodeURIComponent(img.url || ''),
                height: img.height,
              });
            } else {
              textNodes.push({ type: 'html', value: c.value });
            }
          } else {
            textNodes.push(c);
          }
        }
        if (textNodes.length) {
          el.push({
            type: 'paragraph',
            children: parserBlock(textNodes, false, n),
          });
        }
        break;
      case 'inlineCode':
        el = { text: n.value, code: true };
        break;
      case 'thematicBreak':
        el = { type: 'hr', children: [{ text: '' }] };
        break;
      case 'code':
        el = {
          type: n.lang === 'schema' ? 'schema' : 'code',
          language: n.lang,
          render: n.meta === 'render',
          value: n.value,
          children: n.value.split('\n').map((s: any) => {
            return {
              type: 'code-line',
              children: [{ text: s }],
            };
          }),
        };
        break;
      case 'yaml':
        el = {
          type: 'code',
          language: 'yaml',
          value: n.value,
          frontmatter: true,
          children: n.value.split('\n').map((s: any) => {
            return {
              type: 'code-line',
              children: [{ text: s }],
            };
          }),
        };
        break;
      case 'blockquote':
        el = {
          type: 'blockquote',
          children: n.children?.length
            ? parserBlock(n.children, false, n)
            : [{ type: 'paragraph', children: [{ text: '' }] }],
        };
        break;
      case 'table':
        el = parseTableOrChart(n, preElement);
        break;
      default:
        if (n.type === 'text' && htmlTag.length) {
          el = { text: n.value };
          if (n.value) {
            for (let t of htmlTag) {
              if (t.tag === 'code') el.code = true;
              if (t.tag === 'i') el.italic = true;
              if (t.tag === 'b' || t.tag === 'strong') el.bold = true;
              if (t.tag === 'del') el.strikethrough = true;
              if (t.tag === 'span' && t.color) el.highColor = t.color;
              if (t.tag === 'a' && t.url) {
                el.url = t.url;
              }
            }
          }
          break;
        } else if (
          [
            'strong',
            'link',
            'text',
            'emphasis',
            'delete',
            'inlineCode',
          ].includes(n.type)
        ) {
          if (n.type === 'text') {
            el = { text: n.value };
          } else {
            const leaf: CustomLeaf = {};
            if (n.type === 'strong') leaf.bold = true;
            if (n.type === 'emphasis') leaf.italic = true;
            if (n.type === 'delete') leaf.strikethrough = true;
            if (n.type === 'link') {
              leaf.url = decodeURIComponent(n.url);
            }
            el = parseText(
              // @ts-ignore
              n.children?.length ? n.children : [{ value: leaf.url || '' }],
              leaf,
            );
          }
        } else if (n.type === 'break') {
          el = { text: '\n' };
        } else {
          el = { text: '' };
        }
    }

    if (preNode && top) {
      const distance =
        (n.position?.start.line || 0) - (preNode.position?.end.line || 0);
      if (distance >= 4) {
        const lines = Math.floor((distance - 2) / 2);
        Array.from(new Array(lines)).forEach(() => {
          els.push({ type: 'paragraph', children: [{ text: '' }] });
        });
      }
    }

    if (el) {
      if (Array.isArray(el)) {
        el = (el as Element[]).map((item) => {
          item.contextProps = contextProps;
          return item;
        }) as Element[];
      } else {
        el.contextProps = contextProps;
        el.originalNode = n;
      }

      Array.isArray(el) ? els.push(...el) : els.push(el);
    }

    preNode = n;
    preElement = el;

    el = null;
  }
  return els;
};

const findLinks = (
  schema: any[],
  prePath: number[] = [],
  links: { path: number[]; target: string }[] = [],
) => {
  for (let i = 0; i < schema.length; i++) {
    const n = schema[i];
    const curPath = [...prePath, i];
    if (n.url) {
      links.push({ path: curPath, target: n.url });
    }
    if (n.children) {
      findLinks(n.children, curPath, links);
    }
  }
  return links;
};

export const parserMarkdown = (md: string) => {
  const root = parser.parse(md || '');
  const schema = parserBlock(root.children as any[], true);
  const links = findLinks(schema);
  return { schema, links };
};
