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
  LinkCardNode,
  MediaNode,
  TableNode,
  TableRowNode,
} from '../../el';
import partialJsonParse from './json-parse';
import parser from './remarkParse';

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
    if (n.type === 'link')
      leafs = leafs.concat(parseText(n.children, { ...leaf, url: n.url }));
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
    table?.children?.slice(1).map((row) => {
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
      otherProps: config,
    };
    return {
      type: 'card',
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        node,
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    };
  }

  const children = table.children.map((r: { children: any[] }, l: number) => {
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
  }) as TableRowNode[];

  const otherProps = {
    config: config,
    columns,
    dataSource: dataSource.map((item) => {
      delete item?.chartType;
      return {
        ...item,
      };
    }),
  };
  if (!isChart && dataSource.length < 2 && columns.length > 4) {
    return {
      type: 'card',
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        parserTableToDescription(children),
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    };
  }

  const node: TableNode | ChartNode = {
    type: isChart ? 'chart' : 'table',
    children: children,
    otherProps,
  };
  return {
    type: 'card',
    children: [
      {
        type: 'card-before',
        children: [{ text: '' }],
      },
      node,
      {
        type: 'card-after',
        children: [{ text: '' }],
      },
    ],
  };
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
    const currentNode = nodes[i];
    const config =
      preElement?.type === 'code' &&
      preElement?.language === 'html' &&
      preElement?.otherProps
        ? preElement?.otherProps
        : {};

    switch (currentNode.type) {
      case 'heading':
        el = {
          type: 'head',
          level: currentNode.depth,
          children: currentNode.children?.length
            ? parserBlock(currentNode.children, false, currentNode)
            : [{ text: '' }],
        };
        break;
      case 'html':
        const value =
          currentNode?.value?.replace('<!--', '').replace('-->', '').trim() ||
          '{}';

        if (value) {
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
          const img = findImageElement(currentNode.value);
          if (img) {
            el = {
              type: 'media',
              align: img.align,
              alt: img.alt,
              height: img?.height,
              url: decodeURIComponent(img?.url || ''),
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
          } else {
            if (currentNode.value === '<br/>') {
              el = { type: 'paragraph', children: [{ text: '' }] };
            } else {
              el = {
                type: 'code',
                language: 'html',
                render: true,
                children: currentNode.value.split('\n').map((s: any) => {
                  return {
                    type: 'code-line',
                    children: [{ text: s }],
                  };
                }),
              };
            }
          }
        } else {
          const breakMatch = currentNode.value.match(/<br\/?>/);
          if (breakMatch) {
            el = { type: 'break', children: [{ text: '' }] };
          } else {
            const htmlMatch = currentNode.value.match(
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
                    el = { text: currentNode.value };
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
              const img = findImageElement(currentNode.value);
              if (img) {
                el = {
                  type: 'media',
                  align: img.align,
                  alt: img.alt,
                  height: img?.height,
                  url: img?.url,
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
              } else {
                el = { text: currentNode.value };
              }
            }
          }
        }

        if (el) {
          el.otherProps = contextProps;
        }

        break;
      case 'image':
        el = {
          type: 'media',
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
          url: decodeURIComponent(currentNode?.url),
          alt: currentNode.alt,
        } as MediaNode;
        break;
      case 'list':
        el = {
          type: 'list',
          order: currentNode.ordered,
          start: currentNode.start,
          children: parserBlock(currentNode.children, false, currentNode),
        };
        el.task = el.children?.some((s: any) => typeof s.checked === 'boolean');
        break;
      case 'footnoteReference':
        el = {
          text: `${currentNode.identifier}`,
          identifier: currentNode.identifier,
          type: 'footnoteReference',
        };
        break;
      case 'footnoteDefinition':
        el = {
          type: 'footnoteDefinition',
          identifier: currentNode.identifier,
          children: [
            { text: `[^${currentNode.identifier}]:` },
            ...(parserBlock(currentNode.children, false, currentNode)[0] as any)
              ?.children,
          ],
        };
        break;
      case 'listItem':
        const children = currentNode.children?.length
          ? parserBlock(currentNode.children, false, currentNode)
          : ([{ type: 'paragraph', children: [{ text: '' }] }] as any);
        let mentions = undefined;
        if (
          // @ts-ignore
          currentNode.children?.[0]?.children?.[0]?.type === 'link' &&
          // @ts-ignore
          currentNode.children?.[0]?.children?.length > 1
        ) {
          const item = // @ts-ignore
            children?.[0]?.children?.[0] as LinkCardNode;
          // @ts-ignore
          const label = item.text;
          if (label) {
            mentions = [
              {
                avatar: item.url,
                name: label,
                id:
                  new URLSearchParams('?' + item.url?.split('?')[1]).get(
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
          checked: currentNode.checked,
          children: children,
          mentions,
        };
        break;
      case 'paragraph':
        if (
          currentNode.children?.[0].type === 'html' &&
          currentNode.children[0].value.startsWith('<a')
        ) {
          const text = currentNode.children
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
              name: name ? name[1] : attach.url,
            };
            break;
          }
        }

        if (
          currentNode?.children?.at(0)?.type === 'link' &&
          config.type === 'card'
        ) {
          const link = currentNode?.children?.at(0) as {
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
        for (let c of currentNode.children || []) {
          if (c.type === 'image') {
            if (textNodes.length) {
              el.push({
                type: 'paragraph',
                children: parserBlock(textNodes, false, currentNode),
              });
              textNodes = [];
            }
            el.push({
              type: 'media',
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
              url: decodeURIComponent(c.url),
              alt: c.alt,
            });
          } else if (c.type === 'html') {
            const img = findImageElement(c.value);
            if (img) {
              el.push({
                type: 'media',
                align: img.align,
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
                url: decodeURIComponent(img?.url || ''),
                height: img.height,
                alt: img.alt,
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
            children: parserBlock(textNodes, false, currentNode),
          });
        }
        break;
      case 'inlineCode':
        el = { text: currentNode.value, code: true };
        break;
      case 'thematicBreak':
        el = { type: 'hr', children: [{ text: '' }] };
        break;
      case 'code':
        let json = [];
        try {
          json = json5.parse(currentNode.value || '[]');
        } catch (error) {
          try {
            json = partialJsonParse(currentNode.value || '[]');
          } catch (error) {
            json = currentNode.value as any;
          }
        }
        const isSchema =
          currentNode.lang === 'schema' || currentNode.lang === 'apaasify';

        el = {
          type: isSchema ? currentNode.lang : 'code',
          language: currentNode.lang,
          render: currentNode.meta === 'render',
          value: isSchema ? json : currentNode.value,
          otherProps: config,
          children: isSchema
            ? [
                {
                  text: '',
                },
              ]
            : currentNode.value.split('\n').map((s: any) => {
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
          value: currentNode.value,
          frontmatter: true,
          children: currentNode.value.split('\n').map((s: any) => {
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
          children: currentNode.children?.length
            ? parserBlock(currentNode.children, false, currentNode)
            : [{ type: 'paragraph', children: [{ text: '' }] }],
        };
        break;
      case 'table':
        el = parseTableOrChart(currentNode, preElement);
        break;
      default:
        if (currentNode.type === 'text' && htmlTag.length) {
          el = { text: currentNode.value };
          if (currentNode.value) {
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
          ].includes(currentNode.type)
        ) {
          if (currentNode.type === 'text') {
            el = { text: currentNode.value };
          } else {
            const leaf: CustomLeaf = {};
            if (currentNode.type === 'strong') leaf.bold = true;
            if (currentNode.type === 'emphasis') leaf.italic = true;
            if (currentNode.type === 'delete') leaf.strikethrough = true;
            if (currentNode.type === 'link') {
              try {
                leaf.url = decodeURIComponent(currentNode?.url);
              } catch (error) {
                leaf.url = currentNode?.url;
              }
            }
            el = parseText(
              // @ts-ignore
              currentNode.children?.length
                ? // @ts-ignore
                  currentNode.children
                : [{ value: leaf.url || '' }],
              leaf,
            );
          }
        } else if (currentNode.type === 'break') {
          el = { text: '\n' };
        } else {
          el = { text: '' };
        }
    }

    if (preNode && top) {
      const distance =
        (currentNode.position?.start.line || 0) -
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

    preNode = currentNode;

    preElement = el;

    el = null;
  }
  return els.sort((a, b) => {
    if ((a as any).type === 'footnoteDefinition') return 1;
    if ((b as any).type === 'footnoteDefinition') return -1;
    return 0;
  });
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

export const parserMarkdown = (
  md: string,
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
  const root = parser.parse(markdown);

  const schema = parserBlock(root.children as any[], true) as Elements[];
  const links = findLinks(schema);
  return { schema, links };
};
