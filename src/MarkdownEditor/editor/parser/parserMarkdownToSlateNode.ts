/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-use-before-define */
import json5 from 'json5';
import type { Root, RootContent, Table } from 'mdast';
//@ts-ignore
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { Element } from 'slate';
import {
  CardNode,
  ChartNode,
  ColumnCellNode,
  ColumnNode,
  CustomLeaf,
  DescriptionNode,
  Elements,
  InlineKatexNode,
  LinkCardNode,
  TableNode,
  TableRowNode,
} from '../../el';
import { MarkdownEditorPlugin } from '../../plugin';
import { htmlToFragmentList } from '../plugins/insertParsedHtmlNodes';
import { EditorUtils } from '../utils';
import partialJsonParse from './json-parse';
import parser from './remarkParse';

const advancedNumericCheck = (value: string | number) => {
  const numericPattern = /^[-+]?[0-9,]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
  return (
    typeof value === 'number' ||
    (typeof value === 'string' && numericPattern.test(value))
  );
};
const isNumericValue = (value: string | number) => {
  return (
    typeof value === 'number' ||
    (!isNaN(parseFloat(value)) && isFinite(value as unknown as number)) ||
    advancedNumericCheck(value)
  );
};

const getColumnAlignment = (
  data: any[],
  columns: {
    dataIndex: string;
  }[],
) => {
  if (!data.length) return [];
  return columns.map((col) => {
    const values = data.map((row: { [x: string]: any }) => row[col.dataIndex]);

    return values.every(isNumericValue) ? 'right' : null;
  });
};

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
        alt: match[0].match(/alt="([^"\n]+)"/)?.[1],
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

const parseText = (
  els: RootContent[],
  leaf: CustomLeaf = {
    data: {},
  },
) => {
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
    if (n.type === 'link') {
      leafs = leafs.concat(parseText(n.children, { ...leaf, url: n?.url }));
    }
    if (n.type === 'inlineCode')
      leafs.push({ ...leaf, text: n.value, code: true });
    // @ts-ignore
    leafs.push({ ...leaf, text: n.value || '' });
  }
  return leafs;
};

const parseTableOrChart = (table: Table, preNode: RootContent): CardNode => {
  const keyMap = new Map<string, string>();

  // @ts-ignore
  const config =
    // @ts-ignore
    preNode?.type === 'code' && // @ts-ignore
    preNode?.language === 'html' && // @ts-ignore
    preNode?.otherProps
      ? // @ts-ignore
        preNode?.otherProps
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
      .map((title) => title?.replaceAll('\\', '') || ' ')
      .map((title, index) => {
        if (keyMap.has(title)) {
          keyMap.set(title, keyMap.get(title) + '_' + index);
          return {
            title: title
              ?.replace(/\n/g, '')
              ?.replace(/\\(?=")/g, '')
              ?.replace(/\\_/g, '')
              ?.trim(),
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
    table?.children?.slice(1)?.map((row) => {
      return row.children?.reduce((acc, cell, index) => {
        // 如果数据列数超出表头列数，舍弃多余的数据
        if (index >= columns.length) {
          return acc;
        }
        acc[columns[index].dataIndex] = myRemark
          .stringify({
            type: 'root',
            children: [cell],
          })
          ?.replace(/\n/g, '')
          ?.replace(/\\(?=")/g, '')
          ?.replace(/\\_/g, '')
          ?.trim();
        return acc;
      }, {} as any);
    }) || [];

  if (table.align?.every((item) => !item)) {
    const aligns = getColumnAlignment(dataSource, columns);
    table.align = aligns;
  }

  const aligns = table.align;

  const isChart = config?.chartType || config?.at?.(0)?.chartType;
  const isColumn = config?.elementType === 'column';

  /**
   * 如果是分栏，将表格转换为分栏节点
   */
  if (isColumn) {
    const children = table.children
      ?.at(1)
      ?.children?.map((c: { children: any[] }) => {
        return {
          type: 'column-cell',
          children: c.children?.length
            ? parserBlock(c.children as any, false, c as any)
            : [{ text: '' }],
        };
      }) as ColumnCellNode[];
    const node: ColumnNode = {
      type: 'column-group',
      children,
      style: {
        flex: 1,
      },
      otherProps: config,
    };
    return EditorUtils.wrapperCardNode(node);
  }

  const children = table.children.map((r: { children: any[] }, l: number) => {
    return {
      type: 'table-row',
      align: aligns?.[l] || undefined,
      children: r.children.map(
        (c: { children: string | any[] }, i: string | number) => {
          return {
            type: 'table-cell',
            align: aligns?.[i as number] || undefined,
            title: l === 0,
            rows: l,
            cols: i,
            children: c.children?.length
              ? parserBlock(c.children as any, false, c as any)
              : [{ text: '' }],
          };
        },
      ),
    };
  }) as TableRowNode[];

  const otherProps = {
    ...(isChart
      ? {
          config,
        }
      : config),
    columns,
    dataSource: dataSource.map((item) => {
      delete item?.chartType;
      return {
        ...item,
      };
    }),
  };

  if (!isChart && dataSource.length < 2 && columns.length > 4) {
    return EditorUtils.wrapperCardNode(parserTableToDescription(children));
  }

  const node: TableNode | ChartNode = {
    type: isChart ? 'chart' : 'table',
    children: children,
    otherProps,
  } as any;
  return EditorUtils.wrapperCardNode(node);
};

const parserTableToDescription = (children: TableRowNode[]) => {
  const header = children[0];
  const body = children.slice(1);

  const newChildren = body
    .map((row) => {
      const list = row.children
        .map((item, index) => {
          return [header.children[index], item];
        })
        .flat(1);
      return list;
    })
    .flat(1);

  const node: DescriptionNode = {
    type: 'description',
    children: newChildren,
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
    const currentElement = nodes[i];
    const config =
      preElement?.type === 'code' &&
      preElement?.language === 'html' &&
      preElement?.otherProps
        ? preElement?.otherProps
        : {};

    switch (currentElement.type) {
      case 'heading':
        el = {
          type: 'head',
          level: currentElement.depth,
          children: currentElement.children?.length
            ? parserBlock(currentElement.children, false, currentElement)
            : [{ text: '' }],
        };
        break;
      case 'html':
        const value =
          currentElement?.value
            ?.replace('<!--', '')
            .replace('-->', '')
            .trim() || '{}';

        if (
          value &&
          currentElement?.value?.trim()?.endsWith('-->') &&
          currentElement?.value.trim()?.startsWith('<!--')
        ) {
          try {
            contextProps = json5.parse(value);
          } catch (e) {
            try {
              contextProps = partialJsonParse(value);
            } catch (error) {}
            console.log('parse html error', e);
          }
        }

        if (!parent || ['listItem', 'blockquote'].includes(parent.type)) {
          const img = findImageElement(currentElement.value);
          if (img) {
            el = EditorUtils.createMediaNode(
              decodeURIComponent(img?.url || '')!,
              'image',
              { align: img.align, alt: img.alt, height: img?.height },
            );
          } else {
            if (currentElement.value === '<br/>') {
              el = { type: 'paragraph', children: [{ text: '' }] };
            } else {
              el = currentElement.value.match(
                /<\/?(table|div|ul|li|ol|p|strong)[^\n>]*?>/,
              )
                ? htmlToFragmentList(currentElement.value, '')
                : {
                    type: 'code',
                    language: 'html',
                    render: true,
                    value: currentElement.value,
                    children: [
                      {
                        text: currentElement.value,
                      },
                    ],
                  };
            }
          }
        } else {
          const breakMatch = currentElement.value.match(/<br\/?>/);
          if (breakMatch) {
            el = { type: 'break', children: [{ text: '\n' }] };
          } else {
            const htmlMatch = currentElement.value.match(
              /<\/?(b|i|del|font|code|span|sup|sub|strong|a)[^\n>]*?>/,
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
                    el = { text: currentElement.value };
                  }
                } else if (tag === 'a') {
                  const url = str.match(/href="([\w:./_\-#\\]+)"/);
                  if (url) {
                    htmlTag.push({
                      tag: tag,
                      url: url[1],
                    });
                  }
                } else if (tag === 'font') {
                  let color = str.match(/color="([^"\n]+)"/);
                  if (!color) {
                    color = str.match(/color=([^"\n]+)/);
                  }
                  if (color) {
                    htmlTag.push({
                      tag: tag,
                      color: color[1].replaceAll('>', ''),
                    });
                  }
                } else {
                  htmlTag.push({ tag: tag });
                }
              }
            } else {
              const img = findImageElement(currentElement.value);
              if (img) {
                el = EditorUtils.createMediaNode(img?.url, 'image', img);
              } else {
                el = { text: currentElement.value };
              }
            }
          }
        }

        if (el) {
          el.isConfig = currentElement?.value.trim()?.startsWith('<!--');
          el.otherProps = contextProps;
        }

        break;
      case 'image':
        el = EditorUtils.createMediaNode(
          decodeURIComponent(currentElement?.url),
          'image',
          {
            alt: currentElement.alt,
          },
        );

        break;
      case 'inlineMath':
        el = {
          type: 'inline-katex',
          children: [{ text: currentElement.value }],
        } as InlineKatexNode;
        break;
      case 'math':
        el = {
          // @ts-ignore
          type: 'katex',
          language: 'latex',
          katex: true,
          value: currentElement.value,
          children: [{ text: '' }],
        };
        break;
      case 'list':
        el = {
          type: 'list',
          order: currentElement.ordered,
          start: currentElement.start,
          children: parserBlock(currentElement.children, false, currentElement),
        };
        el.task = el.children?.some((s: any) => typeof s.checked === 'boolean');
        break;
      case 'footnoteReference':
        el = {
          text: `${currentElement.identifier?.toUpperCase()}`,
          identifier: currentElement.identifier,
          type: 'footnoteReference',
        };
        break;
      case 'footnoteDefinition':
        const linkNode = parserBlock(
          currentElement.children,
          false,
          currentElement,
        )
          ?.at(0)
          // @ts-ignore
          ?.children?.at(0) as any;
        el = {
          value: linkNode.text,
          url: linkNode?.url,
          type: 'footnoteDefinition',
          identifier: currentElement.identifier,
          children: [linkNode],
        };

        break;
      case 'listItem':
        const children = currentElement.children?.length
          ? parserBlock(currentElement.children, false, currentElement)
          : ([{ type: 'paragraph', children: [{ text: '' }] }] as any);
        let mentions = undefined;
        if (
          // @ts-ignore
          currentElement.children?.[0]?.children?.[0]?.type === 'link' &&
          // @ts-ignore
          currentElement.children?.[0]?.children?.length > 1
        ) {
          const item = // @ts-ignore
            children?.[0]?.children?.[0] as LinkCardNode;
          // @ts-ignore
          const label = item.text;
          if (label) {
            mentions = [
              {
                avatar: item?.url,
                name: label,
                id:
                  new URLSearchParams('?' + item?.url?.split('?')[1]).get(
                    'id',
                  ) || undefined,
              },
            ];
            delete children?.[0]?.children?.[0];
            if (children?.[0]?.children) {
              children[0].children = children?.[0]?.children?.filter(Boolean);
            }
          }
        }
        if (children[0].type === 'paragraph' && children[0].children[0]?.text) {
          const text = children[0].children[0]?.text;
          const m = text.match(/^\[([x\s])]/);

          if (m) {
            el = {
              type: 'list-item',
              checked: m ? m[1] === 'x' : undefined,
              children: children,
              mentions,
            };
            children[0].children[0].text = text.replace(/^\[([x\s])]/, '');
            break;
          }
        }
        el = {
          type: 'list-item',
          checked: currentElement.checked,
          children: children,
          mentions,
        };
        break;
      case 'paragraph':
        if (
          currentElement.children?.[0].type === 'html' &&
          currentElement.children[0].value.startsWith('<a')
        ) {
          const text = currentElement.children
            .map((n: any) => (n as any).value || '')
            .join('');
          const attach = findAttachment(text);

          if (attach) {
            const name = text.match(/>(.*)<\/a>/);
            el = {
              type: 'attach',
              url: decodeURIComponent(attach?.url),
              size: attach.size,
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
              name: name ? name[1] : attach?.url,
            };
            break;
          }
        }

        if (
          currentElement?.children?.at(0)?.type === 'link' &&
          config.type === 'card'
        ) {
          const link = currentElement?.children?.at(0) as {
            type: 'link';
            url: string;
            title: string;
          };

          el = {
            ...config,
            type: 'link-card',
            url: decodeURIComponent(link?.url),
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
            name: link.title,
          };
          break;
        }
        el = [];
        let textNodes: any[] = [];
        for (let currentChild of currentElement.children || []) {
          if (currentChild.type === 'image') {
            if (textNodes.length) {
              el.push({
                type: 'paragraph',
                children: parserBlock(textNodes, false, currentElement),
              });
              textNodes = [];
            }
            el.push(
              EditorUtils.createMediaNode(
                decodeURIComponent(currentChild?.url),
                'image',
                {
                  alt: currentChild.alt,
                },
              ),
            );
          } else if (currentChild.type === 'html') {
            const img = findImageElement(currentChild.value);
            if (img) {
              el.push(
                EditorUtils.createMediaNode(
                  decodeURIComponent(img?.url || ''),
                  'image',
                  {
                    alt: img.alt,
                    height: img.height,
                  },
                ),
              );
            } else {
              textNodes.push({ type: 'html', value: currentChild.value });
            }
          } else {
            textNodes.push(currentChild);
          }
        }
        if (textNodes.length) {
          el.push({
            type: 'paragraph',
            children: parserBlock(textNodes, false, currentElement),
          });
        }
        break;
      case 'inlineCode':
        el = {
          text: currentElement.value,
          tag: currentElement.value?.startsWith('${'),
          placeHolder: currentElement.value
            ?.replaceAll('${', '')
            .replaceAll('}', ''),
          code: true,
        };
        break;
      case 'thematicBreak':
        el = { type: 'hr', children: [{ text: '' }] };
        break;
      case 'code':
        el = {
          type: 'code',
          language:
            currentElement.lang === 'apassify'
              ? 'apaasify'
              : currentElement.lang,
          render: currentElement.meta === 'render',
          value: currentElement.value,
          isConfig: currentElement?.value.trim()?.startsWith('<!--'),
          children: [
            {
              text: currentElement.value,
            },
          ],
        };
        const isSchema =
          currentElement.lang === 'schema' ||
          currentElement.lang === 'apaasify' ||
          currentElement.lang === 'apassify';

        if (currentElement.lang === 'mermaid') {
          el.type = 'mermaid';
        } else if (isSchema) {
          let json = [];
          try {
            json = json5.parse(currentElement.value || '[]');
          } catch (error) {
            try {
              json = partialJsonParse(currentElement.value || '[]');
            } catch (error) {
              json = currentElement.value as any;
            }
          }
          el.type = 'apaasify';
          el.value = json;
          el.children = [{ text: '' }];
        } else if (currentElement.lang === 'katex') {
          el.type = 'katex';
        }
        break;
      case 'yaml':
        el = {
          type: 'code',
          language: 'yaml',
          value: currentElement.value,
          frontmatter: true,
          children: [{ text: currentElement.value }],
        };
        break;
      case 'blockquote':
        el = {
          type: 'blockquote',
          children: currentElement.children?.length
            ? parserBlock(currentElement.children, false, currentElement)
            : [{ type: 'paragraph', children: [{ text: '' }] }],
        };
        break;
      case 'table':
        el = parseTableOrChart(currentElement, preElement);
        break;
      default:
        if (currentElement.type === 'text' && htmlTag.length) {
          el = { text: currentElement.value };
          if (currentElement.value) {
            for (let t of htmlTag) {
              if (t.tag === 'font') {
                el.color = t.color;
              }
              if (t.tag === 'sup') el.identifier = el.text;
              if (t.tag === 'sub') el.identifier = el.text;
              if (t.tag === 'code') el.code = true;
              if (t.tag === 'i') el.italic = true;
              if (t.tag === 'b' || t.tag === 'strong') el.bold = true;
              if (t.tag === 'del') el.strikethrough = true;
              if ((t.tag === 'span' || t.tag === 'font') && t.color)
                el.highColor = t.color;
              if (t.tag === 'a' && t?.url) {
                el.url = t?.url;
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
          ].includes(currentElement.type)
        ) {
          if (currentElement.type === 'text') {
            el = { text: currentElement.value };
          } else {
            const leaf: CustomLeaf = {};

            if (currentElement.type === 'strong') leaf.bold = true;
            if (currentElement.type === 'emphasis') leaf.italic = true;
            if (currentElement.type === 'delete') leaf.strikethrough = true;
            if (currentElement.type === 'link') {
              try {
                leaf.url = decodeURIComponent(currentElement?.url);
              } catch (error) {
                leaf.url = currentElement?.url;
              }
            }
            if (leaf) {
              for (let t of htmlTag) {
                if (t.tag === 'font') {
                  leaf.color = t.color;
                }
                if (t.tag === 'sup') leaf.identifier = el.text;
                if (t.tag === 'sub') leaf.identifier = el.text;
                if (t.tag === 'code') leaf.code = true;
                if (t.tag === 'i') leaf.italic = true;
                if (t.tag === 'b' || t.tag === 'strong') leaf.bold = true;
                if (t.tag === 'del') leaf.strikethrough = true;
                if ((t.tag === 'span' || t.tag === 'font') && t.color)
                  leaf.highColor = t.color;
              }
            }
            if (
              (currentElement as any)?.children?.some(
                (n: any) => n.type === 'html',
              )
            ) {
              el = {
                ...parserBlock(
                  (currentElement as any)?.children,
                  false,
                  currentElement,
                )?.at(0),
                url: leaf.url,
              };
            } else {
              el = parseText(
                // @ts-ignore
                currentElement.children?.length
                  ? // @ts-ignore
                    currentElement.children
                  : [{ value: leaf?.url || '' }],
                leaf,
              );
            }
          }
        } else if (currentElement.type === 'break') {
          el = { text: '\n' };
        } else {
          el = { text: '' };
        }
    }

    if (preNode && top) {
      const distance =
        (currentElement.position?.start.line || 0) -
        (preNode.position?.end.line || 0);
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
          if (Object.keys(contextProps || {}).length) {
            item.contextProps = contextProps;
          }
          if (Object.keys(config || {}).length && !el.otherProps) {
            item.otherProps = config;
          }
          return item;
        }) as Element[];
      } else {
        if (Object.keys(contextProps || {}).length) {
          el.contextProps = contextProps;
        }
        if (Object.keys(config || {}).length && !el.otherProps) {
          el.otherProps = config;
        }
      }

      Array.isArray(el) ? els.push(...el) : els.push(el);
    }

    preNode = currentElement;

    preElement = el;

    el = null;
  }
  return els.sort((a, b) => {
    if ((a as any).type === 'footnoteDefinition') return 1;
    if ((b as any).type === 'footnoteDefinition') return -1;
    return 0;
  });
};

// Markdown 转 Slate
const parseWithPlugins = (root: Root, plugins: MarkdownEditorPlugin[]) => {
  return root.children.map((node) => {
    for (const plugin of plugins) {
      const rule = plugin.parseMarkdown?.find((r) => r.match(node));
      if (rule) return rule.convert(node);
    }
    return node; // 默认转换逻辑
  });
};

/**
 * 解析Markdown字符串并返回解析后的结构和链接信息。
 *
 * @param md - 要解析的Markdown字符串。
 * @param plugins - 可选的Markdown编辑器插件数组，用于扩展解析功能。
 * @returns 一个包含解析后的元素数组和链接信息的对象。
 *
 * @property schema - 解析后的元素数组。
 * @property links - 包含路径和目标链接的对象数组。
 */
export const parserMarkdownToSlateNode = (
  md: string,
  plugins?: MarkdownEditorPlugin[],
): {
  schema: Elements[];
  links: { path: number[]; target: string }[];
} => {
  let markdown = md;
  try {
    markdown =
      md
        .replaceAll(/([\u4e00-\u9fa5]+)([a-zA-Z])/g, '$1 $2')
        .replaceAll(/([a-zA-Z])([\u4e00-\u9fa5]+)/g, '$1 $2')
        .replaceAll('）', ' )')
        .replaceAll('】', ' 】')
        .replaceAll('，', ' ，')
        .replaceAll('。', ' 。')
        .replaceAll('？', ' ？')
        ?.replace(/ +\[/g, ' [')
        ?.replace(/ +\\n/g, ' \n')
        .replaceAll('！', ' ！') || '';
  } catch (error) {}

  const markdownRoot = parser.parse(markdown);

  const root =
    (plugins || [])?.length > 0
      ? parseWithPlugins(markdownRoot, plugins || [])
      : markdownRoot.children;

  const schema = parserBlock(root as any[], true) as Elements[];

  return { schema, links: [] };
};
