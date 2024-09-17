/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Node, Text } from 'slate';
import stringWidth from 'string-width';
import { ChartNode, ColumnNode, DescriptionNode, TableNode } from '../../el';
import { getMediaType } from './dom';

const space = '  ';
const inlineNode = new Set(['break']);

/**
 * Parses a node and its children into a Markdown string representation.
 *
 * @param node - The current node to parse.
 * @param preString - A prefix string to prepend to the parsed content.
 * @param parent - An array of parent nodes.
 * @returns The Markdown string representation of the node and its children.
 *
 * The function handles various node types:
 * - `paragraph`: Converts the children nodes to Markdown.
 * - `head`: Converts the node to a Markdown header.
 * - `code`: Converts the node to a Markdown code block.
 * - `attach`: Converts the node to a downloadable link.
 * - `blockquote`: Converts the children nodes to a blockquote.
 * - `media`: Converts the node to an appropriate media tag (image, video, iframe).
 * - `list`: Converts the children nodes to a list.
 * - `list-item`: Converts the children nodes to a list item.
 * - `table`, `chart`, `column-group`, `description`: Converts the node to a table.
 * - `schema`: Converts the node to a schema code block.
 * - `link-card`: Converts the node to a Markdown link.
 * - `hr`: Converts the node to a horizontal rule.
 * - `break`: Converts the node to a line break.
 * - Default: Converts the node to text if it has a `text` property.
 */
const parserNode = (node: any, preString = '', parent: any[]) => {
  let str = '';
  const newParent = [...parent, node];
  switch (node.type) {
    case 'paragraph':
      str += preString + schemaToMarkdown(node.children, preString, newParent);
      break;
    case 'head':
      str +=
        '#'.repeat(node.level) +
        ' ' +
        schemaToMarkdown(node.children, preString, newParent);
      break;
    case 'code':
      const code = node.children
        // @ts-ignore
        .map((c) => {
          return preString + c.children[0]?.text || '';
        })
        .join('\n');
      if (node.language === 'html' && node.render) {
        str += `${preString}\n${code}\n${preString}`;
      } else if (node.frontmatter) {
        str += `${preString}---\n${code}\n${preString}---`;
      } else {
        str += `${preString}\`\`\`${
          node.language || '`'
        }\n${code}\n${preString}\`\`\`${!node.language ? '`' : ''}`;
      }
      break;
    case 'attach':
      str += `<a href="${encodeURI(node.url)}" download data-size="${
        node.size
      }">${node.name}</a>`;
      break;
    case 'blockquote':
      str += schemaToMarkdown(node.children, preString, newParent);
      break;
    case 'media':
      let url = node.url;
      let type = getMediaType(url, node?.alt);
      if (node.height) {
        if (type === 'video') {
          str += `<video src="${encodeURI(url)}" alt="" height="${
            node.height || ''
          }"/>`;
        } else if (type === 'image') {
          str += `<img src="${encodeURI(url)}" alt="" height="${
            node.height || ''
          }" ${node.align ? `data-align="${node.align}"` : ''}/>`;
        }
      } else {
        if (type === 'video') {
          str += `<video src="${encodeURI(url)}"/>`;
        } else if (type === 'image') {
          if (node.align) {
            str += `<img src="${encodeURI(url)}" alt="" ${
              node.align ? `data-align="${node.align}"` : ''
            }/>`;
          } else {
            str += `![${node.alt || ''}](${encodeURI(url)})`;
          }
        } else {
          str += `<iframe src="${encodeURI(url)}"/>`;
        }
      }
      break;
    case 'list':
      str += schemaToMarkdown(node.children, preString, newParent);
      break;
    case 'list-item':
      str += schemaToMarkdown(node.children, preString, newParent);
      break;
    case 'table':
      console.log(node);
      str += table(node, preString, newParent);
      break;
    case 'chart':
      str += table(node, preString, newParent);
      break;
    case 'column-group':
      str += table(node, preString, newParent);
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
      );
      break;
    case 'schema':
      str += '```schema\n' + JSON.stringify(node.otherProps, null, 2) + '\n```';
      break;
    case 'link-card':
      str += `[${node.name}](${node.url} "${node.name}")`;
      break;
    case 'hr':
      str += preString + '***';
      break;
    case 'break':
      str += preString + '<br/>';
      break;
    default:
      if (node.text) str += composeText(node, parent);
      break;
  }
  return str;
};

/**
 * Converts a schema tree to a Markdown string.
 *
 * @param tree - The schema tree to convert, represented as an array of nodes.
 * @param preString - A prefix string to prepend to each line of the output.
 * @param parent - An array representing the parent nodes, defaulting to a root node.
 * @returns The generated Markdown string.
 */
export const schemaToMarkdown = (
  tree: any[],
  preString = '',
  parent: any[] = [{ root: true }],
) => {
  let str = '';
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.otherProps) {
      let configProps = {
        ...node.otherProps,
      };
      delete configProps['columns'];
      delete configProps['dataSource'];
      if (node.type === 'link-card') {
        configProps.url = encodeURI(node.url);
        configProps.name = node.name || node.title || configProps.name;
        configProps.description = node.description || configProps.description;
        configProps.icon = node.icon || configProps.icon;
      }
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
        const nodeStr = parserNode(node, '', parent);
        const lines = nodeStr.split('\n');
        // 处理table多行组件问题
        if (lines.length > 1) {
          str += lines
            .map((l, i) => {
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
              parserNode(node, preString, parent)?.replace(/^[\s\t]+/g, '') +
              '\n\n';
          }
        } else {
          str += parserNode(node, pre, parent) + '\n';
          if (tree.length - 1 !== i) {
            str += '\n';
          }
        }
      }
    } else if (p.type === 'blockquote') {
      str += parserNode(node, preString + '> ', parent);
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
          parserNode(node, preString, parent)?.replace(/^[\s\t]+/g, '') +
          '\n\n';
      }
    } else {
      str += parserNode(node, preString, parent);
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
  if (t.url) str = `<a href="${t.url}">${str}</a>`;
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
  if (t.code) str = `\`${str}\``;
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
  if (t.highColor || (t.strikethrough && (t.bold || t.italic || t.code)))
    return textHtml(t);
  const siblings = parent[parent.length - 1]?.children;
  // @ts-ignore
  const index = siblings?.findIndex((n) => n === t);
  let str = textStyle(t)!;
  if (t.url) {
    str = `[${t.text}](${encodeURI(t.url)})`;
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
) => {
  const children = el.children;
  const head = children[0]?.children;
  if (!children.length || !head.length) return '';
  let data: string[][] = [];

  if (el.type === 'column-group') {
    const row: string[] = [];
    for (let n of children) {
      if (n.type === 'column-cell') {
        row.push(schemaToMarkdown(n.children, '', [...parent, n]) || 'xxx');
      }
    }
    data.push(new Array(row.length).fill('x').map((_, i) => `column${i + 1}`));
    data.push(row);
  } else {
    for (let c of children) {
      const row: string[] = [];
      if (c.type === 'table-row') {
        for (let n of c.children) {
          if (n.type === 'table-cell') {
            row.push(schemaToMarkdown(n.children, '', [...parent, n]));
          }
        }
      }
      if (c.type === 'table-cell') {
        row.push(schemaToMarkdown(c.children, '', [...parent, c]));
      }
      data.push(row);
    }
  }
  let output = '',
    colLength = new Map<number, number>();

  for (let i = 0; i < data[0].length; i++) {
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
