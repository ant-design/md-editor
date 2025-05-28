/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Node, Text } from 'slate';
import stringWidth from 'string-width';
import { ChartNode, ColumnNode, DescriptionNode, TableNode } from '../../el';
import type { MarkdownEditorPlugin } from '../../plugin';
import { getMediaType } from '../utils/dom';

const space = '  ';
const inlineNode = new Set(['break']);

/**
 * 解析单个 Slate 节点并转换为对应的 Markdown 字符串
 *
 * @param node - 要解析的 Slate 节点，包含 type、children、value 等属性
 * @param preString - 前缀字符串，用于处理缩进和格式化，默认为空字符串
 * @param parent - 父节点数组，用于上下文信息和嵌套处理，默认为空数组
 * @param plugins - 可选的插件数组，用于自定义转换逻辑
 * @returns 解析后的 Markdown 字符串
 *
 * @description
 * 该函数是 Slate 节点到 Markdown 转换的核心处理器，支持以下节点类型：
 *
 * **容器节点：**
 * - `card`: 卡片容器，递归处理子节点
 * - `paragraph`: 段落节点，添加前缀并处理子节点
 * - `blockquote`: 引用块，递归处理子节点
 * - `list`: 列表容器，递归处理列表项
 * - `list-item`: 列表项，递归处理子节点
 *
 * **标题节点：**
 * - `head`: 标题节点，根据 level 生成对应级别的 Markdown 标题
 *
 * **代码节点：**
 * - `code`: 代码块，支持三种模式：
 *   - HTML 渲染模式（language='html' && render=true）
 *   - Frontmatter 模式（frontmatter=true）
 *   - 普通代码块模式（默认）
 *
 * **媒体节点：**
 * - `image`: 图片节点，支持 width、height、block 参数，URL 参数化
 * - `media`: 多媒体节点，根据类型生成 video、img 或 iframe 标签
 * - `attach`: 附件节点，生成下载链接
 *
 * **表格节点：**
 * - `table`: 表格节点，调用 table 函数处理
 * - `chart`: 图表节点，以表格形式渲染
 * - `column-group`: 列组节点，以表格形式渲染
 * - `description`: 描述列表，转换为表格格式
 *
 * **其他节点：**
 * - `schema`: 模式定义，生成 schema 代码块
 * - `link-card`: 链接卡片，生成 Markdown 链接格式
 * - `hr`: 水平分割线，生成 `***`
 * - `break`: 换行节点，生成 `<br/>` 标签
 * - `footnoteDefinition`: 脚注定义，生成脚注引用格式
 * - 文本节点：调用 composeText 函数处理文本样式
 *
 * **空节点：**
 * - `card-before`, `card-after`: 卡片前后占位符，不输出内容
 *
 * @example
 * ```typescript
 * // 解析段落节点
 * const paragraphNode = { type: 'paragraph', children: [{ text: 'Hello' }] };
 * const result = parserNode(paragraphNode, '', []);
 * // 输出: "Hello"
 *
 * // 解析标题节点
 * const headNode = { type: 'head', level: 2, children: [{ text: 'Title' }] };
 * const result = parserNode(headNode, '', []);
 * // 输出: "## Title"
 *
 * // 解析代码块
 * const codeNode = { type: 'code', language: 'javascript', value: 'console.log("hello");' };
 * const result = parserNode(codeNode, '', []);
 * // 输出: "```javascript\nconsole.log(\"hello\");\n```"
 * ```
 */
const parserNode = (
  node: any,
  preString = '',
  parent: any[],
  plugins?: MarkdownEditorPlugin[],
) => {
  let str = '';
  const newParent = [...parent, node];
  if (!node) return str;

  // 首先尝试使用插件处理
  if (plugins?.length) {
    for (const plugin of plugins) {
      const rule = plugin.toMarkdown?.find((r) => r.match(node));
      if (rule) {
        const converted = rule.convert(node);
        // 将转换后的 Markdown AST 节点转换为字符串
        if (converted.type === 'code') {
          const codeNode = converted as any;
          const language = codeNode.lang || '';
          const value = codeNode.value || '';
          if (!value.trim()) {
            return `${preString}\`\`\`${language}\n${preString}\`\`\``;
          }
          const codeLines = value.split('\n');
          const indentedCode = codeLines
            .map((line: string, index: number) => {
              if (index === 0 || index === codeLines.length - 1) {
                return line;
              }
              return preString + line;
            })
            .join('\n');
          return `${preString}\`\`\`${language}\n${indentedCode}\n${preString}\`\`\``;
        } else if (converted.type === 'blockquote') {
          const blockquoteNode = converted as any;
          // 递归处理 blockquote 的子节点
          return parserSlateNodeToMarkdown(
            blockquoteNode.children || [],
            preString + '> ',
            newParent,
            plugins,
          );
        } else if (converted.type === 'paragraph') {
          const paragraphNode = converted as any;
          return (
            preString +
            parserSlateNodeToMarkdown(
              paragraphNode.children || [],
              preString,
              newParent,
              plugins,
            )
          );
        } else if (converted.type === 'heading') {
          const headingNode = converted as any;
          const level = headingNode.depth || 1;
          return (
            '#'.repeat(level) +
            ' ' +
            parserSlateNodeToMarkdown(
              headingNode.children || [],
              preString,
              newParent,
              plugins,
            )
          );
        } else if (converted.type === 'text') {
          return (converted as any).value || '';
        }
        // 对于其他类型，返回空字符串或基本处理
        return '';
      }
    }
  }

  switch (node.type) {
    case 'card-before':
      break;
    case 'card-after':
      break;
    case 'card':
      str += parserSlateNodeToMarkdown(
        node?.children,
        preString,
        newParent,
        plugins,
      );
      break;
    case 'paragraph':
      str +=
        preString +
        parserSlateNodeToMarkdown(
          node?.children,
          preString,
          newParent,
          plugins,
        );
      break;
    case 'head':
      str +=
        '#'.repeat(node.level) +
        ' ' +
        parserSlateNodeToMarkdown(
          node?.children,
          preString,
          newParent,
          plugins,
        );
      break;
    case 'code':
      const code = node?.value || '';

      /**
       * 处理代码节点，支持三种模式：
       * 1. HTML渲染模式：直接输出HTML内容，不进行Markdown包装
       * 2. Frontmatter模式：使用YAML frontmatter格式（用---包围）
       * 3. 普通代码块模式：使用Markdown代码块格式（用```包围）
       */
      if (node.language === 'html' && node.render) {
        str += code;
        break;
      }

      // Frontmatter 模式：YAML前言格式
      if (node.frontmatter) {
        str += `${preString}---\n${code}\n${preString}---`;
        break;
      }

      // 普通代码块模式
      const language = node.language || '';

      // 如果代码内容为空，生成空的代码块
      if (!code.trim()) {
        str += `${preString}\`\`\`${language}\n${preString}\`\`\``;
        break;
      }

      // 处理多行代码的缩进
      const codeLines = code.split('\n');
      const indentedCode = codeLines
        .map((line: string, index: number) => {
          // 第一行和最后一行不需要额外缩进
          if (index === 0 || index === codeLines.length - 1) {
            return line;
          }
          return preString + line;
        })
        .join('\n');

      str += `${preString}\`\`\`${language}\n${indentedCode}\n${preString}\`\`\``;
      break;
    case 'attach':
      str += `<a href="${encodeURI(node?.url)}" download data-size="${
        node.size
      }">${node.name}</a>`;
      break;
    case 'blockquote':
      str += parserSlateNodeToMarkdown(
        node.children,
        preString,
        newParent,
        plugins,
      );
      break;
    case 'image':
      try {
        let nodeImageUrl = new URL(node?.url);
        if (node.width) {
          nodeImageUrl.searchParams.set('width', node.width);
        }
        if (node.height) {
          nodeImageUrl.searchParams.set('height', node.height);
        }
        if (node.block) {
          nodeImageUrl.searchParams.set('block', node.block);
        }
        str += `![${node.alt || ''}](${nodeImageUrl.toString()})`;
        break;
      } catch (e) {
        str += `![${node.alt || ''}](${encodeURI(node?.url)})`;
      }

    case 'media':
      let nodeUrl = node?.url;
      let type = node.mediaType || getMediaType(nodeUrl, node?.alt);
      if (node.height) {
        if (type === 'video') {
          str += `<video src="${encodeURI(nodeUrl)}" alt="" height="${
            node.height || ''
          }"/>`;
        } else if (type === 'image' || type === 'media') {
          str += `<img src="${encodeURI(nodeUrl)}" alt="" height="${
            node.height || ''
          }" ${node.align ? `data-align="${node.align}"` : ''}/>`;
        }
      } else {
        if (type === 'video') {
          str += `<video src="${encodeURI(nodeUrl)}"/>`;
        } else if (type === 'image' || type === 'media') {
          if (node.align) {
            str += `<img src="${encodeURI(nodeUrl)}" alt="" ${
              node.align ? `data-align="${node.align}"` : ''
            }/>`;
          } else {
            str += `![${node.alt || ''}](${encodeURI(nodeUrl)})`;
          }
        } else {
          str += `<iframe src="${encodeURI(nodeUrl)}"/>`;
        }
      }
      break;
    case 'list':
      str += parserSlateNodeToMarkdown(
        node.children,
        preString,
        newParent,
        plugins,
      );
      break;
    case 'list-item':
      str += parserSlateNodeToMarkdown(
        node.children,
        preString,
        newParent,
        plugins,
      );
      break;
    case 'table':
      str += table(node, preString, newParent, plugins);
      break;
    case 'chart':
      str += table(node, preString, newParent, plugins);
      break;
    case 'column-group':
      str += table(node, preString, newParent, plugins);
      break;
    case 'description':
      const header: any[] = [];
      const rows: any[] = [];
      node.children.forEach((n: any) => {
        if (n.title) {
          header.push(n);
          return;
        }
        rows.push(n);
      });
      str += table(
        {
          ...node,
          children: [
            {
              children: header,
              type: 'table-row',
            },
            {
              children: rows,
              type: 'table-row',
            },
          ],
        },
        preString,
        newParent,
        plugins,
      );
      break;
    case 'schema':
      str += '```schema\n' + JSON.stringify(node.otherProps, null, 2) + '\n```';
      break;
    case 'link-card':
      str += `[${node.name}](${node?.url} "${node.name}")`;
      break;
    case 'hr':
      str += preString + '***';
      break;
    case 'break':
      str += preString + '<br/>';
      break;
    case 'footnoteDefinition':
      str += `[^${node.identifier}]: [${node.value}](${node.url})\n`;
      break;
    default:
      if (node.text) str += composeText(node, parent);
      break;
  }
  return str;
};

/**
 * 将 Slate 节点树解析为 Markdown 字符串。
 *
 * @param tree - Slate 节点树。
 * @param preString - 前缀字符串，默认为空字符串。
 * @param parent - 父节点数组，默认为包含一个根节点的数组。
 * @returns 解析后的 Markdown 字符串。
 *
 * 该函数遍历 Slate 节点树，并根据节点类型和属性生成相应的 Markdown 字符串。
 * 对于具有其他属性的节点，会将这些属性转换为 JSON 字符串并作为注释插入。
 * 对于列表项、引用块、段落等不同类型的节点，会根据其特定的格式生成相应的 Markdown。
 */
export const parserSlateNodeToMarkdown = (
  tree: any[],
  preString = '',
  parent: any[] = [{ root: true }],
  plugins?: MarkdownEditorPlugin[],
) => {
  let str = '';
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.otherProps && Object.keys(node.otherProps).length) {
      let configProps = {
        ...node.otherProps,
      };

      delete configProps['columns'];
      delete configProps['dataSource'];
      if (node.type === 'link-card') {
        configProps.type = 'card';
        configProps.url = encodeURI(node?.url);
        configProps.name = node.name || node.title || configProps.name;
        configProps.description = node.description || configProps.description;
        configProps.icon = node.icon || configProps.icon;
      }
      Object.keys(configProps).forEach((key) => {
        if (typeof configProps[key] === 'object' && configProps[key]) {
          if (
            Array.isArray(configProps[key]) &&
            configProps[key].length === 0
          ) {
            delete configProps[key];
            return;
          }
          if (Object.keys(configProps[key]).length === 0) {
            delete configProps[key];
            return;
          }
        }
      });

      str += `<!--${JSON.stringify(configProps)}-->\n`;
    }
    const p = parent[parent.length - 1];
    if (p.type === 'list-item') {
      const list = parent[parent.length - 2];
      let pre = preString + (list.order ? space + ' ' : space);

      // @ts-ignore
      let index = list.children.findIndex((c) => c === p);
      if (list.start) index += list.start - 1;
      if (i === 0) {
        str += preString;
        str += list.order ? `${index + 1}. ` : '- ';
        if (typeof p.checked === 'boolean')
          str += `[${p.checked ? 'x' : ' '}] `;
        if (p.mentions && p.mentions.length) {
          p.mentions.forEach((mention: any) => {
            const url = mention?.avatar || '';
            const params = new URLSearchParams('?' + (url.split('?')[1] || ''));
            params.set('id', mention.id);
            str += `[${mention.name}](${
              (url.split('?')[0] || '') + params?.size > 0
                ? '?' + params.toString()
                : ''
            })`;
          });
        }
        const nodeStr = parserNode(node, '', parent, plugins);
        const lines = nodeStr.split('\n');
        // 处理table多行组件问题
        if (lines.length > 1) {
          str += lines
            .map((l: string, i: number) => {
              if (i > 0) {
                l = pre + l;
              }
              return l;
            })
            .join('\n');
        } else {
          str += nodeStr;
        }
        if (tree.length > 1) {
          str += '\n\n';
        }
      } else {
        if (
          node.type === 'paragraph' &&
          tree[i - 1]?.type === 'list' &&
          tree[i + 1]?.type === 'list'
        ) {
          if (!Node.string(node)?.replace(/\s|\t/g, '')) {
            str += `\n\n${pre}<br/>\n\n`;
          } else {
            str +=
              '\n\n' +
              pre +
              parserNode(node, preString, parent, plugins)?.replace(
                /^[\s\t]+/g,
                '',
              ) +
              '\n\n';
          }
        } else {
          str += parserNode(node, pre, parent, plugins) + '\n';
          if (tree.length - 1 !== i) {
            str += '\n';
          }
        }
      }
    } else if (p.type === 'blockquote') {
      str += parserNode(node, preString + '> ', parent, plugins);
      if (node.type && i !== tree.length - 1) {
        str += `\n${preString}> `;
        if (p.type !== 'list') {
          str += '\n';
        }
      }
    } else if (
      node.type === 'paragraph' &&
      tree[i - 1]?.type === 'list' &&
      tree[i + 1]?.type === 'list'
    ) {
      if (!Node.string(node)?.replace(/\s|\t/g, '')) {
        str += '<br/>\n\n';
      } else {
        str +=
          preString +
          parserNode(node, preString, parent, plugins)?.replace(
            /^[\s\t]+/g,
            '',
          ) +
          '\n\n';
      }
    } else {
      str += parserNode(node, preString, parent, plugins);
      if (node.type && !inlineNode.has(node.type) && i !== tree.length - 1) {
        str += '\n';
        if (p.type !== 'list') {
          str += '\n';
        }
      }
    }
  }
  return str;
};

export const isMix = (t: Text) => {
  return (
    Object.keys(t).filter((key) =>
      ['bold', 'code', 'italic', 'strikethrough'].includes(key),
    ).length > 1
  );
};

/**
 * Converts a Text object to an HTML string with appropriate formatting.
 *
 * @param {Text} t - The Text object to be converted.
 * @returns {string} - The formatted HTML string.
 *
 * The function applies the following HTML tags based on the properties of the Text object:
 * - `<span style="color:{highColor}">` if `highColor` is defined.
 * - `<code>` if `code` is true.
 * - `<i>` if `italic` is true.
 * - `<b>` if `bold` is true.
 * - `<del>` if `strikethrough` is true.
 * - `<a href="{url}">` if `url` is defined.
 */
const textHtml = (t: Text) => {
  let str = t.text || '';
  if (t.highColor) str = `<span style="color:${t.highColor}">${str}</span>`;
  if (t.code) str = `<code>${str}</code>`;
  if (t.italic) str = `<i>${str}</i>`;
  if (t.bold) str = `<b>${str}</b>`;
  if (t.strikethrough) str = `<del>${str}</del>`;
  if (t?.url) str = `<a href="${t?.url}">${str}</a>`;
  if (t?.identifier || t?.fnc) str = `[^${str}]`;
  return str;
};

/**
 * Formats a given text object into a Markdown string with appropriate styles.
 *
 * @param t - The text object to be formatted.
 * @returns The formatted Markdown string.
 *
 * The function applies the following Markdown styles based on the properties of the text object:
 * - `code`: Wraps the text in backticks (`).
 * - `italic`: Wraps the text in asterisks (*).
 * - `bold`: Wraps the text in double asterisks (**).
 * - `strikethrough`: Wraps the text in double tildes (~~).
 *
 * Additionally, it escapes backslashes and replaces newline characters with Markdown line breaks.
 */
const textStyle = (t: Text) => {
  if (!t.text) return '';
  let str = t.text.replace(/(?<!\\)\\/g, '\\').replace(/\n/g, '  \n');
  let preStr = '',
    afterStr = '';
  if (t.code || t.bold || t.strikethrough || t.italic) {
    preStr = str.match(/^\s+/)?.[0] || '';
    afterStr = str.match(/\s+$/)?.[0] || '';
    str = str.trim();
  }
  if (t.code && !t.tag) str = `\`${str}\``;
  if (t.tag)
    str = `\`${str || `\${placeholder:${(t as any)?.placeholder}}` || ''}\``;
  if (t.italic) str = `*${str}*`;
  if (t.bold) str = `**${str}**`;
  if (t.strikethrough) str = `~~${str}~~`;
  return `${preStr}${str}${afterStr}`;
};

/**
 * Composes a text string from a given Text node and its parent nodes.
 *
 * @param t - The Text node to compose the string from.
 * @param parent - An array representing the parent nodes of the Text node.
 * @returns The composed text string. If the Text node has no text, returns an empty string.
 *
 * The function handles different text styles and formats:
 * - If the text has highColor or a combination of strikethrough with bold, italic, or code, it returns HTML formatted text.
 * - If the text has a URL, it returns the text as a markdown link.
 * - If the text is mixed and not at the end of a sentence, it ensures proper spacing between words.
 */
const composeText = (t: Text, parent: any[]) => {
  if (!t.text) return '';
  if (
    t.highColor ||
    t.identifier ||
    t.fnc ||
    (t.strikethrough && (t.bold || t.italic || t.code))
  )
    return textHtml(t);
  const siblings = parent[parent.length - 1]?.children;
  // @ts-ignore
  const index = siblings?.findIndex((n) => n === t);
  let str = textStyle(t)!;
  if (t?.url) {
    str = `[${t.text}](${encodeURI(t?.url)})`;
  } else if (isMix(t) && index !== -1) {
    const next = siblings[index + 1];
    if (!str.endsWith(' ') && next && !Node.string(next).startsWith(' ')) {
      str += ' ';
    }
  }
  return str;
};

/**
 * Converts a table-like node structure into a Markdown table string.
 *
 * @param el - The table node which can be of type `TableNode`, `ColumnNode`, `DescriptionNode`, or `ChartNode`.
 * @param preString - A prefix string to prepend to each line of the output Markdown table.
 * @param parent - An array representing the parent nodes of the current node.
 * @returns A string representing the Markdown table.
 */
const table = (
  el: TableNode | ColumnNode | DescriptionNode | ChartNode,
  preString = '',
  parent: any[],
  plugins?: MarkdownEditorPlugin[],
) => {
  const children = el.children;
  const head = children[0]?.children;
  if (!children.length || !head.length) return '';
  let data: string[][] = [];

  if (el.type === 'column-group') {
    const row: string[] = [];
    for (let n of children) {
      if (n.type === 'column-cell') {
        if (!n?.children) continue;
        row.push(
          parserSlateNodeToMarkdown(n?.children, '', [...parent, n], plugins) ||
            'xxx',
        );
      }
    }
    data.push(new Array(row.length).fill('x').map((_, i) => `column${i + 1}`));
    data.push(row);
  } else {
    for (let c of children) {
      if (!c) continue;
      const row: string[] = [];
      if (c?.type === 'table-row') {
        if (!c?.children) continue;
        for (let n of c?.children || []) {
          if (n.type === 'table-cell') {
            row.push(
              parserSlateNodeToMarkdown(
                n.children,
                '',
                [...parent, n],
                plugins,
              ),
            );
          }
        }
      }
      if (c.type === 'table-cell') {
        row.push(
          parserSlateNodeToMarkdown(c.children, '', [...parent, c], plugins),
        );
      }
      if (row?.every((r) => !r)) continue;
      data.push(row);
    }
  }
  let output = '',
    colLength = new Map<number, number>();

  for (let i = 0; i < data?.[0]?.length; i++) {
    colLength.set(
      i,
      data.map((d) => stringWidth(d[i])).sort((a, b) => b - a)[0],
    );
  }

  for (let i = 0; i < data.length; i++) {
    let cells: string[] = [];
    for (let j = 0; j < data[i].length; j++) {
      let str = data[i][j];
      const strLength = stringWidth(str);
      const length = colLength.get(j) || 2;
      if (length > strLength) {
        if (head[j]?.align === 'right') {
          str = ' '.repeat(length - strLength) + str;
        } else if (head[j]?.align === 'center') {
          const spaceLength = length - strLength;
          const pre = Math.floor(spaceLength / 2);
          if (pre > 0) str = ' '.repeat(pre) + str;
          const next = spaceLength - pre;
          if (next > 0) str = str + ' '.repeat(next);
        } else {
          str += ' '.repeat(length - strLength);
        }
      }
      str = str.replace(/\|/g, '\\|');
      cells.push(str);
    }
    output += `${preString}| ${cells.join(' | ')} |`;
    if (i !== data.length - 1 || data.length === 1) output += '\n';
    if (i === 0) {
      output += `${preString}| ${cells
        .map((_, i) => {
          const removeLength = head[i]?.align
            ? head[i]?.align === 'center'
              ? 2
              : 1
            : 0;
          let str = '-'.repeat(Math.max(colLength.get(i)! - removeLength, 2));
          switch (head[i]?.align) {
            case 'left':
              str = `:${str}`;
              break;
            case 'center':
              str = `:${str}:`;
              break;
            case 'right':
              str = `${str}:`;
              break;
          }
          return str;
        })
        .join(' | ')} |\n`;
    }
  }
  return output;
};
