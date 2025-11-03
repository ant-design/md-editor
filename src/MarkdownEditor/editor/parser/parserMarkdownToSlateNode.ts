/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-use-before-define */
import json5 from 'json5';
import type { Root, RootContent, Table } from 'mdast';
//@ts-ignore
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { Element } from 'slate';
import { fixStrongWithSpecialChars } from './remarkParse';

import {
  CardNode,
  ChartNode,
  CustomLeaf,
  Elements,
  InlineKatexNode,
} from '../../el';
import { MarkdownEditorPlugin } from '../../plugin';
import { htmlToFragmentList } from '../plugins/insertParsedHtmlNodes';
import { TableNode, TrNode as TableRowNode } from '../types/Table';
import { EditorUtils } from '../utils';
import partialJsonParse from './json-parse';
import mdastParser from './remarkParse';

// 类型定义
type CodeElement = {
  type: string;
  language?: string | null;
  render?: boolean;
  value: any;
  isConfig?: boolean;
  children: Array<{ text: string }>;
};

type LanguageHandler = (element: CodeElement, value: string) => CodeElement;

// 处理schema类型语言的辅助函数
const processSchemaLanguage = (
  element: CodeElement,
  value: string,
): CodeElement => {
  let json = [];
  try {
    json = json5.parse(value || '[]');
  } catch (error) {
    try {
      json = partialJsonParse(value || '[]');
    } catch (error) {
      json = value as any;
      console.error('parse schema error', error);
    }
  }
  return {
    ...element,
    type: 'apaasify',
    value: json,
    children: [{ text: value }],
  };
};

// 语言类型处理策略配置
const LANGUAGE_HANDLERS: Record<string, LanguageHandler> = {
  mermaid: (element) => ({
    ...element,
    type: 'mermaid',
  }),
  schema: processSchemaLanguage,
  apaasify: processSchemaLanguage,
  apassify: processSchemaLanguage,
  katex: (element) => ({
    ...element,
    type: 'katex',
  }),
  'agentar-card': processSchemaLanguage,
};

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

/**
 * 判断是否包含不完整输入
 * 如果一行中包含可能尚未完成的数字输入，返回 true
 */
const hasIncompleteNumericInput = (values: any[]): boolean => {
  // 检查是否有可能是正在输入的不完整数字
  // 例如: '12.' 或 '0.' 或 '-' 或 仅有一个数字字符的情况
  return values.some((val) => {
    if (typeof val !== 'string') return false;
    return (
      (val.endsWith('.') && /\d/.test(val)) || // 以小数点结尾
      val === '-' || // 只有负号
      val === '+' || // 只有正号
      (val.length === 1 && /\d/.test(val)) // 只有一个数字
    );
  });
};

// 获取文件中定义的AlignType类型或声明一个等效类型
type AlignType = 'left' | 'center' | 'right' | null;

const getColumnAlignment = (
  data: any[],
  columns: {
    dataIndex: string;
  }[],
): AlignType[] => {
  if (!data.length) return [];

  // 缓存上一次的对齐结果，避免频繁切换
  const prevAlignments: AlignType[] = [];

  return columns.map((col, index) => {
    const values = data
      .map((row: { [x: string]: any }) => row[col.dataIndex])
      .filter(Boolean);
    values?.pop();
    // 如果检测到可能正在输入的数字，保持当前对齐状态
    if (hasIncompleteNumericInput(values)) {
      return prevAlignments[index] || null;
    }

    const alignment: AlignType = values.every(isNumericValue) ? 'right' : null;
    prevAlignments[index] = alignment;
    return alignment;
  });
};

const stringifyObj = remark()
  .use(remarkParse)
  .use(fixStrongWithSpecialChars)
  .use(remarkMath as any, {
    singleDollarTextMath: false, // 暂时禁用单美元符号，只使用双美元符号 $$...$$
  })
  .use(remarkRehype as any, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex as any)
  .use(remarkGfm)
  .use(remarkFrontmatter, ['yaml']);

const myRemark = {
  stringify: (obj: Root) => {
    const mdStr = stringifyObj.stringify(obj);
    return mdStr;
  },
};

/**
 * 检测和解析 think 标签
 * @param str - 要检测的字符串
 * @returns think 标签的内容，如果不是 think 标签则返回 null
 */
const findThinkElement = (str: string) => {
  try {
    // 匹配 <think>内容</think> 格式
    const thinkMatch = str.match(/^\s*<think>([\s\S]*?)<\/think>\s*$/);
    if (thinkMatch) {
      return {
        content: thinkMatch[1].trim(),
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * 检测和解析 answer 标签
 * @param str - 要检测的字符串
 * @returns answer 标签的内容，如果不是 answer 标签则返回 null
 */
const findAnswerElement = (str: string) => {
  try {
    // 匹配 <answer>内容</answer> 格式
    const answerMatch = str.match(/^\s*<answer>([\s\S]*?)<\/answer>\s*$/);
    if (answerMatch) {
      return {
        content: answerMatch[1].trim(),
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

const findImageElement = (str: string) => {
  try {
    // 首先尝试匹配包含source标签的video格式
    const videoWithSourceMatch = str.match(
      /^\s*<video[^>\n]*>[\s\S]*?<source[^>]*src="([^"\n]+)"[^>]*>[\s\S]*?<\/video>\s*$/,
    );

    if (videoWithSourceMatch) {
      const tagName = 'video';
      const height = str.match(/height="(\d+)"/);
      const width = str.match(/width="(\d+)"/);
      const align = str.match(/data-align="(\w+)"/);
      const controls = str.match(/controls/);
      const autoplay = str.match(/autoplay/);
      const loop = str.match(/loop/);
      const muted = str.match(/muted/);
      const poster = str.match(/poster="([^"\n]+)"/);

      return {
        url: videoWithSourceMatch[1],
        height: height ? +height[1] : undefined,
        width: width ? +width[1] : undefined,
        align: align?.[1],
        alt: str.match(/alt="([^"\n]+)"/)?.[1],
        tagName,
        controls: !!controls,
        autoplay: !!autoplay,
        loop: !!loop,
        muted: !!muted,
        poster: poster?.[1],
      };
    }

    // 匹配完整的 HTML 标签，包括自闭合和带结束标签的
    const match = str.match(
      /^\s*<(img|video|iframe)[^>\n]*\/?>(.*<\/(?:img|video|iframe)>)?\s*$/,
    );
    // 如果没有匹配到完整标签，尝试匹配自闭合标签
    const selfClosingMatch = str.match(/^\s*<(img|video|iframe)[^>\n]*\/>\s*$/);
    // 尝试匹配完整的开始和结束标签
    const fullTagMatch = str.match(
      /^\s*<(img|video|iframe)[^>\n]*>.*?<\/(?:img|video|iframe)>\s*$/,
    );
    // 尝试匹配只有开始标签的情况
    const startTagMatch = str.match(/^\s*<(img|video|iframe)[^>\n]*>\s*$/);
    const fullMatch =
      fullTagMatch || match || selfClosingMatch || startTagMatch;
    if (fullMatch) {
      const tagName = fullMatch[0].match(/<(img|video|iframe)/)?.[1];

      // 首先尝试从video标签本身获取src属性
      let url = fullMatch[0].match(/src="([^"\n]+)"/);

      // 如果是video标签且没有找到src，尝试从source标签中获取
      if (tagName === 'video' && !url) {
        const sourceMatch = fullMatch[0].match(
          /<source[^>]*src="([^"\n]+)"[^>]*>/,
        );
        if (sourceMatch) {
          url = sourceMatch;
        }
      }

      const height = fullMatch[0].match(/height="(\d+)"/);
      const width = fullMatch[0].match(/width="(\d+)"/);
      const align = fullMatch[0].match(/data-align="(\w+)"/);
      const controls = fullMatch[0].match(/controls/);
      const autoplay = fullMatch[0].match(/autoplay/);
      const loop = fullMatch[0].match(/loop/);
      const muted = fullMatch[0].match(/muted/);
      const poster = fullMatch[0].match(/poster="([^"\n]+)"/);

      return {
        url: url?.[1],
        height: height ? +height[1] : undefined,
        width: width ? +width[1] : undefined,
        align: align?.[1],
        alt: fullMatch[0].match(/alt="([^"\n]+)"/)?.[1],
        tagName,
        controls: !!controls,
        autoplay: !!autoplay,
        loop: !!loop,
        muted: !!muted,
        poster: poster?.[1],
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
      leafs.push({ ...leaf, text: (n as any).value, code: true });
    if (n.type === 'inlineMath') {
      // 处理内联数学公式，返回一个特殊的节点而不是叶子节点
      leafs.push({
        ...leaf,
        type: 'inline-katex',
        children: [{ text: (n as any).value }],
      } as any);
      continue; // 跳过后面的默认处理
    }
    // @ts-ignore
    leafs.push({ ...leaf, text: (n as any).value || '' });
  }
  return leafs;
};

const parseTableOrChart = (
  table: Table,
  preNode: RootContent,
  plugins: MarkdownEditorPlugin[],
): CardNode => {
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
      ?.map((node) => {
        return myRemark
          .stringify({
            type: 'root',
            children: [node],
          })
          ?.replace(/\n/g, '')
          .trim();
      })
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

  /**
   * 如果是分栏，将表格转换为分栏节点
   */

  // 计算合并单元格信息
  const mergeCells = config.mergeCells || [];

  // 创建合并单元格映射，用于快速查找
  const mergeMap = new Map<
    string,
    { rowSpan: number; colSpan: number; hidden?: boolean }
  >();
  mergeCells?.forEach(
    ({ row, col, rowSpan, rowspan, colSpan, colspan }: any) => {
      let rawRowSpan = rowSpan || rowspan;
      let rawColSpan = colSpan || colspan;
      // 主单元格
      mergeMap.set(`${row}-${col}`, {
        rowSpan: rawRowSpan,
        colSpan: rawColSpan,
      });

      // 被合并的单元格标记为隐藏
      for (let r = row; r < row + rawRowSpan; r++) {
        for (let c = col; c < col + rawColSpan; c++) {
          if (r !== row || c !== col) {
            mergeMap.set(`${r}-${c}`, { rowSpan: 1, colSpan: 1, hidden: true });
          }
        }
      }
    },
  );

  const children = table.children.map((r: { children: any[] }, l: number) => {
    return {
      type: 'table-row',
      align: aligns?.[l] || undefined,
      children: r.children.map(
        (c: { children: string | any[] }, i: string | number) => {
          const mergeInfo = mergeMap.get(`${l}-${i}`);
          return {
            type: 'table-cell',
            align: aligns?.[i as number] || undefined,
            title: l === 0,
            rows: l,
            cols: i,
            // 直接设置 rowSpan 和 colSpan
            ...(mergeInfo?.rowSpan && mergeInfo.rowSpan > 1
              ? { rowSpan: mergeInfo.rowSpan }
              : {}),
            ...(mergeInfo?.colSpan && mergeInfo.colSpan > 1
              ? { colSpan: mergeInfo.colSpan }
              : {}),
            // 如果是被合并的单元格，标记为隐藏
            ...(mergeInfo?.hidden ? { hidden: true } : {}),
            children: c.children?.length
              ? [
                  {
                    type: 'paragraph',
                    children: parserBlock(
                      c.children as any,
                      false,
                      c as any,
                      plugins,
                    ),
                  },
                ]
              : [
                  {
                    type: 'paragraph',
                    children: [{ text: '' }],
                  },
                ],
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

  const node: TableNode | ChartNode = {
    type: isChart ? 'chart' : 'table',
    children: children,
    otherProps,
  } as any;
  return EditorUtils.wrapperCardNode(node);
};

/**
 * 处理标题节点
 * @param currentElement - 当前处理的标题元素，包含depth和children属性
 * @returns 返回格式化的标题节点对象
 */
const handleHeading = (
  currentElement: any,
  plugins: MarkdownEditorPlugin[],
) => {
  return {
    type: 'head',
    level: currentElement.depth,
    children: currentElement.children?.length
      ? parserBlock(currentElement.children, false, currentElement, plugins)
      : [{ text: '' }],
  };
};

export const decodeURIComponentUrl = (url: string) => {
  try {
    return decodeURIComponent(url);
  } catch (e) {
    console.error('Failed to decode URI component:', e);
    return url;
  }
};

/**
 * 处理HTML节点
 * @param currentElement - 当前处理的HTML元素
 * @param parent - 父级元素，用于判断上下文
 * @param htmlTag - HTML标签栈，用于跟踪嵌套的HTML标签
 * @returns 返回包含解析后元素和上下文属性的对象
 */
const handleHtml = (currentElement: any, parent: any, htmlTag: any[]) => {
  const value =
    currentElement?.value?.replace('<!--', '').replace('-->', '').trim() ||
    '{}';

  let contextProps = {};
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

  let el: any;
  if (!parent || ['listItem', 'blockquote'].includes(parent.type)) {
    // 检查是否为 <think> 标签
    const thinkElement = findThinkElement(currentElement.value);
    if (thinkElement) {
      // 将 <think> 标签转换为 think 类型的代码块
      el = {
        type: 'code',
        language: 'think',
        value: thinkElement.content,
        children: [
          {
            text: thinkElement.content,
          },
        ],
      };
    } else {
      // 检查是否为 <answer> 标签
      const answerElement = findAnswerElement(currentElement.value);
      if (answerElement) {
        // 将 <answer> 标签的内容作为普通文本
        el = { text: answerElement.content };
      } else {
        const mediaElement = findImageElement(currentElement.value);
        if (mediaElement) {
          // 根据标签类型确定媒体类型
          let mediaType = 'image';
          if (mediaElement.tagName === 'video') {
            mediaType = 'video';
          } else if (mediaElement.tagName === 'iframe') {
            mediaType = 'iframe';
          }

          el = EditorUtils.createMediaNode(
            decodeURIComponentUrl(mediaElement?.url || '')!,
            mediaType,
            {
              align: mediaElement.align,
              alt: mediaElement.alt,
              height: mediaElement?.height,
              width: mediaElement?.width,
              controls: mediaElement?.controls,
              autoplay: mediaElement?.autoplay,
              loop: mediaElement?.loop,
              muted: mediaElement?.muted,
              poster: mediaElement?.poster,
            },
          );
        } else if (currentElement.value === '<br/>') {
          el = { type: 'paragraph', children: [{ text: '' }] };
        } else if (currentElement.value.match(/^<\/(img|video|iframe)>/)) {
          // 如果是媒体标签的结束标签，跳过处理
          el = null;
        } else {
          // 检查是否为注释（注释需要特殊处理以提取配置）
          const isComment =
            currentElement.value.trim().startsWith('<!--') &&
            currentElement.value.trim().endsWith('-->');

          // 检查是否为标准 HTML 元素或注释
          if (isComment || isStandardHtmlElement(currentElement.value)) {
            // 标准 HTML 元素或注释：按原逻辑处理
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
          } else {
            // 非标准元素（如自定义标签）：当作普通文本处理
            el = { text: currentElement.value };
          }
        }
      }
    }
  } else {
    el = processInlineHtml(currentElement, htmlTag);
  }

  if (el && !Array.isArray(el)) {
    // 只有非文本节点才设置 isConfig 和 otherProps
    if (!('text' in el && Object.keys(el).length === 1)) {
      el.isConfig = currentElement?.value?.trim()?.startsWith('<!--');
      el.otherProps = contextProps;
    }
  }

  return { el, contextProps };
};

/**
 * 处理内联HTML元素
 * @param currentElement - 当前处理的HTML元素
 * @param htmlTag - HTML标签栈
 * @returns 返回处理后的元素对象，如果是标签则返回null
 */
const processInlineHtml = (currentElement: any, htmlTag: any[]) => {
  const breakMatch = currentElement.value.match(/<br\/?>/);
  if (breakMatch) {
    return { type: 'break', children: [{ text: '\n' }] };
  }

  // 检查是否为 <answer> 标签（内联场景）
  const answerElement = findAnswerElement(currentElement.value);
  if (answerElement) {
    // 将 <answer> 标签的内容作为普通文本
    return { text: answerElement.content };
  }

  // 检查是否为非标准 HTML 元素，如果是则直接当作文本
  if (!isStandardHtmlElement(currentElement.value)) {
    return { text: currentElement.value };
  }

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
      processHtmlTag(str, tag, htmlTag);
    }
    return null;
  } else {
    const mediaElement = findImageElement(currentElement.value);
    if (mediaElement) {
      // 根据标签类型确定媒体类型
      let mediaType = 'image';
      if (mediaElement.tagName === 'video') {
        mediaType = 'video';
      } else if (mediaElement.tagName === 'iframe') {
        mediaType = 'iframe';
      }

      return EditorUtils.createMediaNode(
        decodeURIComponentUrl(mediaElement?.url || ''),
        mediaType,
        {
          align: mediaElement.align,
          alt: mediaElement.alt,
          height: mediaElement?.height,
          width: mediaElement?.width,
          controls: mediaElement?.controls,
          autoplay: mediaElement?.autoplay,
          loop: mediaElement?.loop,
          muted: mediaElement?.muted,
          poster: mediaElement?.poster,
        },
      );
    } else {
      return { text: currentElement.value };
    }
  }
};

/**
 * 处理HTML标签并添加到标签栈中
 * @param str - HTML标签字符串
 * @param tag - 标签名称
 * @param htmlTag - HTML标签栈
 */
const processHtmlTag = (str: string, tag: string, htmlTag: any[]) => {
  if (tag === 'span') {
    try {
      const styles = str.match(/style="([^"\n]+)"/);
      if (styles) {
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
      // Handle error silently
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
};

/**
 * 处理图片节点
 * @param currentElement - 当前处理的图片元素，包含url和alt属性
 * @returns 返回格式化的图片节点对象
 */
const handleImage = (currentElement: any) => {
  return EditorUtils.createMediaNode(
    decodeURIComponent(currentElement?.url),
    'image',
    {
      alt: currentElement.alt,
    },
  );
};

/**
 * 处理内联数学公式
 * @param currentElement - 当前处理的内联数学公式元素
 * @returns 返回格式化的内联KaTeX节点对象
 */
const handleInlineMath = (currentElement: any) => {
  return {
    type: 'inline-katex',
    children: [{ text: currentElement.value }],
  } as InlineKatexNode;
};

/**
 * 处理数学公式块
 * @param currentElement - 当前处理的数学公式块元素
 * @returns 返回格式化的KaTeX块节点对象
 */
const handleMath = (currentElement: any) => {
  return {
    type: 'katex',
    language: 'latex',
    katex: true,
    value: currentElement.value,
    children: [{ text: '' }],
  };
};

/**
 * 处理列表节点
 * @param currentElement - 当前处理的列表元素，包含ordered、start等属性
 * @returns 返回格式化的列表节点对象
 */
const handleList = (currentElement: any, plugins: MarkdownEditorPlugin[]) => {
  const el: any = {
    type: 'list',
    order: currentElement.ordered,
    start: currentElement.start,
    children: parserBlock(
      currentElement.children,
      false,
      currentElement,
      plugins,
    ),
  };
  el.task = el.children?.some((s: any) => typeof s.checked === 'boolean');
  return el;
};

/**
 * 处理脚注引用
 * @param currentElement - 当前处理的脚注引用元素
 * @returns 返回格式化的脚注引用节点对象
 */
const handleFootnoteReference = (currentElement: any) => {
  return {
    text: `${currentElement.identifier?.toUpperCase()}`,
    identifier: currentElement.identifier,
    type: 'footnoteReference',
  };
};

/**
 * 处理脚注定义
 * @param currentElement - 当前处理的脚注定义元素
 * @returns 返回格式化的脚注定义节点对象
 */
const handleFootnoteDefinition = (
  currentElement: any,
  plugins: MarkdownEditorPlugin[],
) => {
  const linkNode = parserBlock(
    currentElement.children,
    false,
    currentElement,
    plugins,
  )?.at(0) as any;

  const cellNode = linkNode?.children?.at(0) as any;

  return {
    value: cellNode?.text,
    url: cellNode?.url,
    type: 'footnoteDefinition',
    identifier: currentElement.identifier,
    children: [cellNode],
  };
};

/**
 * 处理列表项节点
 * @param currentElement - 当前处理的列表项元素
 * @returns 返回格式化的列表项节点对象，包含复选框状态和提及信息
 */
const handleListItem = (
  currentElement: any,
  plugins: MarkdownEditorPlugin[],
) => {
  const children = currentElement.children?.length
    ? parserBlock(currentElement.children, false, currentElement, plugins)
    : ([{ type: 'paragraph', children: [{ text: '' }] }] as any);

  let mentions = undefined;
  if (
    currentElement.children?.[0]?.children?.[0]?.type === 'link' &&
    currentElement.children?.[0]?.children?.length > 1
  ) {
    const item = children?.[0]?.children?.[0] as any;
    const label = item?.text;
    if (label) {
      mentions = [
        {
          avatar: item?.url,
          name: label,
          id:
            new URLSearchParams('?' + item?.url?.split('?')[1]).get('id') ||
            undefined,
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
      children[0].children[0].text = text.replace(/^\[([x\s])]/, '');
      return {
        type: 'list-item',
        checked: m ? m[1] === 'x' : undefined,
        children: children,
        mentions,
      };
    }
  }

  return {
    type: 'list-item',
    checked: currentElement.checked,
    children: children,
    mentions,
  };
};

/**
 * 处理段落节点
 * @param currentElement - 当前处理的段落元素
 * @param config - 配置对象，包含样式和行为设置
 * @param plugins - 插件数组
 * @returns 返回格式化的段落节点对象或元素数组
 */
const handleParagraph = (
  currentElement: any,
  config: any,
  plugins: MarkdownEditorPlugin[],
) => {
  // 检查是否是附件链接
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
      return {
        type: 'attach',
        url: decodeURIComponentUrl(attach?.url),
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
    }
  }

  // 检查是否是链接卡片
  if (
    currentElement?.children?.at(0)?.type === 'link' &&
    config.type === 'card'
  ) {
    const link = currentElement?.children?.at(0) as {
      type: 'link';
      url: string;
      title: string;
    };

    return {
      ...config,
      type: 'link-card',
      url: decodeURIComponentUrl(link?.url),
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
  }

  // 处理混合内容段落
  const elements = [];
  let textNodes: any[] = [];

  for (let currentChild of currentElement.children || []) {
    if (currentChild.type === 'image') {
      if (textNodes.length) {
        elements.push({
          type: 'paragraph',
          children: parseWithPlugins(textNodes, plugins, false, currentElement),
        });
        textNodes = [];
      }
      elements.push(
        EditorUtils.createMediaNode(
          decodeURIComponentUrl(currentChild?.url),
          'image',
          {
            alt: currentChild.alt,
          },
        ),
      );
    } else if (currentChild.type === 'html') {
      // 检查是否是结束标签
      if (currentChild.value.match(/^<\/(img|video|iframe)>/)) {
        // 跳过结束标签
        continue;
      }

      const mediaElement = findImageElement(currentChild.value);
      if (mediaElement) {
        // 根据标签类型确定媒体类型
        let mediaType = 'image';
        if (mediaElement.tagName === 'video') {
          mediaType = 'video';
        } else if (mediaElement.tagName === 'iframe') {
          mediaType = 'iframe';
        }

        elements.push(
          EditorUtils.createMediaNode(
            decodeURIComponentUrl(mediaElement?.url || ''),
            mediaType,
            {
              alt: mediaElement.alt,
              height: mediaElement?.height,
              width: mediaElement?.width,
              controls: mediaElement?.controls,
              autoplay: mediaElement?.autoplay,
              loop: mediaElement?.loop,
              muted: mediaElement?.muted,
              poster: mediaElement?.poster,
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
    elements.push({
      type: 'paragraph',
      children: parseWithPlugins(textNodes, plugins, false, currentElement),
    });
  }

  return elements;
};

/**
 * 处理内联代码节点
 * @param currentElement - 当前处理的内联代码元素
 * @returns 返回格式化的内联代码节点对象，支持占位符和初始值
 */
const handleInlineCode = (currentElement: any) => {
  const hasPlaceHolder = currentElement.value?.match(/\$\{(.*?)\}/);
  const values = hasPlaceHolder
    ? hasPlaceHolder[1]
        .split(';')
        .map((item: string) => {
          const values = item?.split(':');
          return {
            [values?.at(0) || '']: values?.at(1),
          };
        })
        .reduce((acc: any, item: any) => {
          return {
            ...acc,
            ...item,
          };
        }, {})
    : undefined;

  return {
    text: values ? values?.initialValue || ' ' : currentElement.value,
    tag: currentElement.value?.startsWith('${'),
    placeholder: values?.placeholder || undefined,
    initialValue: values?.initialValue || undefined,
    code: true,
  };
};

/**
 * 处理分割线节点
 * @returns 返回格式化的分割线节点对象
 */
const handleThematicBreak = () => {
  return { type: 'hr', children: [{ text: '' }] };
};

/**
 * 处理代码块节点
 * @param currentElement - 当前处理的代码块元素，包含语言和内容
 * @returns 返回格式化的代码块节点对象，根据语言类型进行特殊处理
 */
const handleCode = (currentElement: any) => {
  const baseCodeElement = {
    type: 'code',
    language:
      currentElement.lang === 'apaasify' ? 'apaasify' : currentElement.lang,
    render: currentElement.meta === 'render',
    value: currentElement.value,
    isConfig: currentElement?.value.trim()?.startsWith('<!--'),
    children: [{ text: currentElement.value }],
  };

  const handler =
    LANGUAGE_HANDLERS[currentElement.lang as keyof typeof LANGUAGE_HANDLERS];

  return handler
    ? handler(baseCodeElement, currentElement.value)
    : baseCodeElement;
};

/**
 * 处理YAML节点
 * @param currentElement - 当前处理的YAML元素
 * @returns 返回格式化的YAML代码块节点对象
 */
const handleYaml = (currentElement: any) => {
  return {
    type: 'code',
    language: 'yaml',
    value: currentElement.value,
    frontmatter: true,
    children: [{ text: currentElement.value }],
  };
};

/**
 * 处理引用块节点
 * @param currentElement - 当前处理的引用块元素
 * @returns 返回格式化的引用块节点对象
 */
const handleBlockquote = (
  currentElement: any,
  plugins: MarkdownEditorPlugin[],
) => {
  return {
    type: 'blockquote',
    children: currentElement.children?.length
      ? parserBlock(currentElement.children, false, currentElement, plugins)
      : [{ type: 'paragraph', children: [{ text: '' }] }],
  };
};

/**
 * 处理定义节点
 * @param currentElement - 当前处理的定义元素，包含标签和URL
 * @returns 返回格式化的定义段落节点对象
 */
const handleDefinition = (currentElement: any) => {
  return {
    type: 'paragraph',
    children: [
      {
        text:
          `[${currentElement.label}]: ` +
          (currentElement.url ? `${currentElement.url}` : ''),
      },
    ],
  };
};

/**
 * 处理文本和内联元素节点
 * @param currentElement - 当前处理的文本或内联元素
 * @param htmlTag - HTML标签栈，用于应用样式
 * @returns 返回格式化的文本或内联元素节点对象
 */
const handleTextAndInlineElements = (
  currentElement: any,
  htmlTag: any[],
  plugins: MarkdownEditorPlugin[],
) => {
  if (currentElement.type === 'text' && htmlTag.length) {
    const el = { text: currentElement.value };
    if (currentElement.value) {
      applyHtmlTagsToElement(el, htmlTag);
    }
    return el;
  }

  if (
    ['strong', 'link', 'text', 'emphasis', 'delete', 'inlineCode'].includes(
      currentElement.type,
    )
  ) {
    if (currentElement.type === 'text') {
      return { text: currentElement.value };
    }

    const leaf: CustomLeaf = {};
    applyInlineFormatting(leaf, currentElement);
    applyHtmlTagsToElement(leaf, htmlTag);

    if (
      (currentElement as any)?.children?.some((n: any) => n.type === 'html')
    ) {
      return {
        ...parserBlock(
          (currentElement as any)?.children,
          false,
          currentElement,
          plugins,
        )?.at(0),
        url: leaf.url,
      };
    } else {
      return parseText(
        currentElement.children?.length
          ? currentElement.children
          : [{ value: leaf?.url || '' }],
        leaf,
      );
    }
  }
  if (currentElement.type === 'break') {
    return { text: '\n' };
  }

  return { text: '' };
};

/**
 * 应用内联格式到叶子节点
 * @param leaf - 目标叶子节点对象
 * @param currentElement - 当前处理的元素，包含格式信息
 */
const applyInlineFormatting = (leaf: CustomLeaf, currentElement: any) => {
  if (currentElement.type === 'strong') leaf.bold = true;
  if (currentElement.type === 'emphasis') leaf.italic = true;
  if (currentElement.type === 'delete') leaf.strikethrough = true;
  if (currentElement.type === 'link') {
    try {
      leaf.url = currentElement?.url;
    } catch (error) {
      leaf.url = currentElement?.url;
    }
  }
};

/**
 * 应用HTML标签样式到元素
 * @param el - 目标元素对象
 * @param htmlTag - HTML标签数组，包含样式信息
 */
const applyHtmlTagsToElement = (el: any, htmlTag: any[]) => {
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
};

/**
 * 应用上下文属性和配置到元素
 * @param el - 目标元素或元素数组
 * @param contextProps - 上下文属性对象
 * @param config - 配置对象
 * @returns 返回应用了属性和配置的元素
 */
const applyContextPropsAndConfig = (
  el: any,
  contextProps: any,
  config: any,
) => {
  if (Array.isArray(el)) {
    return (el as Element[]).map((item) => {
      if (Object.keys(contextProps || {}).length) {
        item.contextProps = contextProps;
      }
      if (Object.keys(config || {}).length && !item.otherProps) {
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
    return el;
  }
};

/**
 * 根据行间距添加空行元素
 * @param els - 目标元素数组
 * @param preNode - 前一个节点
 * @param currentElement - 当前处理的元素
 * @param top - 是否为顶级解析
 */
const addEmptyLinesIfNeeded = (
  els: any[],
  preNode: any,
  currentElement: any,
  top: boolean,
) => {
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
};

/**
 * 解析Markdown节点块为Slate节点数组
 * 这是核心的解析函数，负责将各种类型的Markdown节点转换为对应的Slate编辑器节点
 *
 * @param nodes - 要解析的Markdown节点数组
 * @param top - 是否为顶级解析，影响空行处理逻辑
 * @param parent - 父级节点，用于上下文判断
 * @returns 返回解析后的Slate节点数组
 *
 * @example
 * ```typescript
 * const markdownNodes = [
 *   { type: 'heading', depth: 1, children: [...] },
 *   { type: 'paragraph', children: [...] }
 * ];
 * const slateNodes = parserBlock(markdownNodes, true);
 * ```
 */
const parserBlock = (
  nodes: RootContent[],
  top = false,
  parent: RootContent | undefined = undefined,
  plugins: MarkdownEditorPlugin[],
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
        el = handleHeading(currentElement, plugins || []);
        break;
      case 'html':
        const htmlResult = handleHtml(currentElement, parent, htmlTag);
        el = htmlResult.el;
        if (htmlResult.contextProps) {
          contextProps = { ...contextProps, ...htmlResult.contextProps };
        }
        break;
      case 'image':
        el = handleImage(currentElement);
        break;
      case 'inlineMath':
        el = handleInlineMath(currentElement);
        break;
      case 'math':
        el = handleMath(currentElement);
        break;
      case 'list':
        el = handleList(currentElement, plugins || []);
        break;
      case 'footnoteReference':
        el = handleFootnoteReference(currentElement);
        break;
      case 'footnoteDefinition':
        el = handleFootnoteDefinition(currentElement, plugins || []);
        break;
      case 'listItem':
        el = handleListItem(currentElement, plugins || []);
        break;
      case 'paragraph':
        el = handleParagraph(currentElement, config, plugins || []);
        break;
      case 'inlineCode':
        el = handleInlineCode(currentElement);
        break;
      case 'thematicBreak':
        el = handleThematicBreak();
        break;
      case 'code':
        el = handleCode(currentElement);
        break;
      case 'yaml':
        el = handleYaml(currentElement);
        break;
      case 'blockquote':
        el = handleBlockquote(currentElement, plugins || []);
        break;
      case 'table':
        el = parseTableOrChart(currentElement, preElement, plugins || []);
        break;
      case 'definition':
        el = handleDefinition(currentElement);
        break;
      default:
        el = handleTextAndInlineElements(
          currentElement,
          htmlTag,
          plugins || [],
        );
    }

    addEmptyLinesIfNeeded(els, preNode, currentElement, top);

    if (el) {
      el = applyContextPropsAndConfig(el, contextProps, config);
      Array.isArray(el) ? els.push(...el) : els.push(el);
    }

    preNode = currentElement;
    preElement = el;
    el = null;
  }

  return els;
};

// Markdown 转 Slate
const parseWithPlugins = (
  nodes: RootContent[],
  plugins: MarkdownEditorPlugin[],
  top = false,
  parent?: RootContent,
): (Elements | Text)[] => {
  if (!nodes?.length) return [{ type: 'paragraph', children: [{ text: '' }] }];

  let els: (Elements | Text)[] = [];
  let preNode: null | RootContent = null;
  let preElement: Element = null;
  let htmlTag: { tag: string; color?: string; url?: string }[] = [];
  let contextProps = {};

  for (let i = 0; i < nodes.length; i++) {
    const currentElement = nodes[i] as any;
    let el: Element | null | Element[] = null;
    let pluginHandled = false;

    // 首先尝试使用插件处理
    for (const plugin of plugins) {
      const rule = plugin.parseMarkdown?.find((r) => r.match(currentElement));
      if (rule) {
        const converted = rule.convert(currentElement);
        // 检查转换结果是否为 NodeEntry<Text> 格式
        if (Array.isArray(converted) && converted.length === 2) {
          // NodeEntry<Text> 格式: [node, path]
          el = converted[0] as Element;
        } else {
          // Elements 格式
          el = converted as Element;
        }
        pluginHandled = true;
        break;
      }
    }

    // 如果插件没有处理，使用默认处理逻辑
    if (!pluginHandled) {
      const config =
        preElement?.type === 'code' &&
        preElement?.language === 'html' &&
        preElement?.otherProps
          ? preElement?.otherProps
          : {};

      switch (currentElement.type) {
        case 'heading':
          el = handleHeading(currentElement, plugins || []);
          break;
        case 'html':
          const htmlResult = handleHtml(currentElement, parent, htmlTag);
          el = htmlResult.el;
          if (htmlResult.contextProps) {
            contextProps = { ...contextProps, ...htmlResult.contextProps };
          }
          break;
        case 'image':
          el = handleImage(currentElement);
          break;
        case 'inlineMath':
          el = handleInlineMath(currentElement);
          break;
        case 'math':
          el = handleMath(currentElement);
          break;
        case 'list':
          el = handleList(currentElement, plugins || []);
          break;
        case 'footnoteReference':
          el = handleFootnoteReference(currentElement);
          break;
        case 'footnoteDefinition':
          el = handleFootnoteDefinition(currentElement, plugins || []);
          break;
        case 'listItem':
          el = handleListItem(currentElement, plugins || []);
          break;
        case 'paragraph':
          el = handleParagraph(currentElement, config, plugins);

          break;
        case 'inlineCode':
          el = handleInlineCode(currentElement);
          break;
        case 'thematicBreak':
          el = handleThematicBreak();
          break;
        case 'code':
          el = handleCode(currentElement);
          break;
        case 'yaml':
          el = handleYaml(currentElement);
          break;
        case 'blockquote':
          el = handleBlockquote(currentElement, plugins || []);
          break;
        case 'table':
          el = parseTableOrChart(currentElement, preElement, plugins || []);
          break;
        case 'definition':
          el = handleDefinition(currentElement);
          break;
        default:
          el = handleTextAndInlineElements(
            currentElement,
            htmlTag,
            plugins || [],
          );
      }
    }

    addEmptyLinesIfNeeded(els, preNode, currentElement, top);

    if (el) {
      el = applyContextPropsAndConfig(el, contextProps, {});
      Array.isArray(el) ? els.push(...el) : els.push(el);
    }

    preNode = currentElement;
    preElement = el as Element;
  }

  return els;
};

const tableRegex = /^\|.*\|\s*\n\|[-:| ]+\|/m;

/**
 * 标准 HTML 元素列表
 * 这些标签会被正常解析为 HTML，其他标签会被当作普通文本处理
 */
const STANDARD_HTML_ELEMENTS = new Set([
  // 文档结构
  'html',
  'head',
  'body',
  'title',
  'meta',
  'link',
  'style',
  'script',
  // 内容分区
  'header',
  'nav',
  'main',
  'section',
  'article',
  'aside',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  // 文本内容
  'div',
  'p',
  'hr',
  'pre',
  'blockquote',
  // 列表
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  // 表格
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'colgroup',
  'col',
  // 表单
  'form',
  'input',
  'textarea',
  'button',
  'select',
  'option',
  'label',
  'fieldset',
  'legend',
  // 内联文本语义
  'a',
  'em',
  'strong',
  'small',
  'mark',
  'del',
  'ins',
  'sub',
  'sup',
  'i',
  'b',
  'u',
  's',
  'code',
  'kbd',
  'samp',
  'var',
  'span',
  'br',
  'wbr',
  // 图片和多媒体
  'img',
  'video',
  'audio',
  'source',
  'track',
  'iframe',
  'embed',
  'object',
  'param',
  'picture',
  // 其他
  'canvas',
  'svg',
  'math',
  'details',
  'summary',
  'dialog',
  'menu',
  'menuitem',
  // 字体
  'font',
]);

/**
 * 检查 HTML 标签是否为标准元素
 * @param htmlString - HTML 字符串
 * @returns 是否为标准 HTML 元素
 */
function isStandardHtmlElement(htmlString: string): boolean {
  // 提取标签名（支持开始标签和结束标签）
  const tagMatch = htmlString.match(/<\/?(\w+)/);
  if (!tagMatch) return false;

  const tagName = tagMatch[1].toLowerCase();
  return STANDARD_HTML_ELEMENTS.has(tagName);
}

/**
 * 预处理特殊标签（think/answer），将其转换为代码块格式
 * @param markdown - 原始 Markdown 字符串
 * @param tagName - 标签名称（think 或 answer）
 * @returns 处理后的 Markdown 字符串
 */
function preprocessSpecialTags(
  markdown: string,
  tagName: 'think' | 'answer',
): string {
  const tagRegex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g');

  return markdown?.replace(tagRegex, (match, content) => {
    const trimmedContent = content.trim();

    // 如果内容中包含代码块标记（三个反引号），需要进行转义
    // 策略：使用特殊标记替换代码块，保持原始格式
    const processedContent = trimmedContent?.replace(
      /```(\w*)\n?([\s\S]*?)```/g,
      (_: string, lang: string, code: string) => {
        // 使用特殊标记包裹，保留语言和代码内容
        // 格式：【CODE_BLOCK:lang】code【/CODE_BLOCK】
        const marker = '\u200B'; // 零宽空格，用于标记
        return `${marker}【CODE_BLOCK:${lang || ''}】\n${code}\n【/CODE_BLOCK】${marker}`;
      },
    );

    // 构建对应类型的代码块
    return `\`\`\`${tagName}\n${processedContent}\n\`\`\``;
  });
}

/**
 * 预处理 <think> 标签，将其转换为 ```think 代码块格式
 * @param markdown - 原始 Markdown 字符串
 * @returns 处理后的 Markdown 字符串
 */
function preprocessThinkTags(markdown: string): string {
  return preprocessSpecialTags(markdown, 'think');
}

/**
 * 预处理所有非标准 HTML 标签，提取其内容（删除标签本身）
 * @param markdown - 原始 Markdown 字符串
 * @returns 处理后的 Markdown 字符串
 */
function preprocessNonStandardHtmlTags(markdown: string): string {
  let result = markdown;
  let hasNonStandardTags = true;

  // 循环处理，直到没有非标准标签（处理嵌套情况）
  while (hasNonStandardTags) {
    const before = result;

    // 匹配所有 HTML 标签对：<tagname>content</tagname>
    result = result.replace(
      /<(\w+)>([\s\S]*?)<\/\1>/g,
      (match, tagName, content) => {
        // 检查是否为标准 HTML 元素
        if (STANDARD_HTML_ELEMENTS.has(tagName.toLowerCase())) {
          // 标准元素保持不变
          return match;
        }
        // 非标准元素只保留内容（不 trim，保持原始格式）
        return content;
      },
    );

    // 如果没有变化，说明处理完成
    hasNonStandardTags = before !== result;
  }

  return result;
}

function preprocessMarkdownTableNewlines(markdown: string) {
  // 检查是否包含表格
  if (!tableRegex.test(markdown)) return markdown; // 如果没有表格，直接返回原始字符串

  // 处理表格结尾的换行符：
  // 1. 如果只有一个换行符，改成两个
  // 2. 如果有两个以上换行符，改成两个
  // 3. 如果已经是两个换行符，保持不变
  let processedMarkdown = markdown
    .replace(
      /(\|[^|\n]*\|)\n(?!\n|\|)/g, // 匹配表格行后面跟着单个换行符（不是两个），但下一行不是表格行
      '$1\n\n', // 替换为两个换行符
    )
    .replace(
      /(\|[^|\n]*\|)\n{3,}(?!\|)/g, // 匹配表格行后面跟着3个或更多换行符，但下一行不是表格行
      '$1\n\n', // 替换为两个换行符
    );

  // 如果包含表格，处理换行符
  return processedMarkdown
    ?.split('\n\n')
    .map((line) => {
      if (line.includes('```')) return line; // 如果包含代码块，直接返回原始字符串
      // 检查是否包含表格
      if (!tableRegex.test(line)) return line; // 如果没有表格，直接返回原始字符串
      // 匹配所有表格的行（确保我们在表格行内匹配换行符）
      return line.replace(/\|([^|]+)\|/g, (match) => {
        if (match.replaceAll('\n', '')?.length < 5) return match; // 如果匹配的长度小于5，直接返回原始字符串
        // 只替换每个表格单元格内的换行符
        return match.split('\n').join('<br>');
      });
    })
    .join('\n\n');
}

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
  // 先预处理 <think> 标签，再预处理其他非标准 HTML 标签，最后处理表格换行
  const thinkProcessed = preprocessThinkTags(md || '');
  const nonStandardProcessed = preprocessNonStandardHtmlTags(thinkProcessed);
  const processedMarkdown = mdastParser.parse(
    preprocessMarkdownTableNewlines(nonStandardProcessed),
  ) as any;

  const markdownRoot = processedMarkdown.children;

  const schema =
    (plugins || [])?.length > 0
      ? (parseWithPlugins(markdownRoot, plugins || [], true) as Elements[])
      : (parserBlock(markdownRoot as any[], true, undefined, []) as Elements[]);
  return {
    schema: schema?.filter((item) => {
      if (item.type === 'paragraph' && item.children?.length === 1) {
        if (item.children[0].text === '\n') {
          return false;
        }
        return true;
      }
      return true;
    }),
    links: [],
  };
};
