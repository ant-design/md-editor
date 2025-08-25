/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import { message } from 'antd';
import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { debugLog, EditorUtils } from '../utils';
import { docxDeserializer } from '../utils/docx/docxDeserializer';
import {
  generateOperationId,
  performanceMonitor,
} from '../utils/performanceMonitor';
import { BackspaceKey } from './hotKeyCommands/backspace';

// 性能优化常量
const BATCH_SIZE = 10; // 每批处理的节点数量
const BATCH_DELAY = 16; // 每批之间的延迟时间(ms)，约60fps
const MAX_SYNC_SIZE = 1000; // 同步处理的最大字符数

const findElementByNode = (node: ChildNode) => {
  const index = Array.prototype.indexOf.call(node.parentNode!.childNodes, node);
  return node.parentElement!.children[index] as HTMLElement;
};
const fragment = new Set(['body', 'figure', 'div']);

export const ELEMENT_TAGS = {
  BLOCKQUOTE: () => ({ type: 'blockquote' }),
  H1: () => ({ type: 'head', level: 1 }),
  H2: () => ({ type: 'head', level: 2 }),
  H3: () => ({ type: 'head', level: 3 }),
  H4: () => ({ type: 'head', level: 4 }),
  H5: () => ({ type: 'head', level: 5 }),
  TABLE: () => ({ type: 'table' }),
  IMG: (el: HTMLImageElement) => {
    return EditorUtils.createMediaNode(el.src, 'image', {
      alt: el.alt,
      downloadUrl: el.src && /^https?:/.test(el.src) ? el.src : undefined,
    });
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

export const TEXT_TAGS = {
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
          const value = Array.from(target.childNodes.values()).map((n) => {
            return n.textContent?.replace(/\n/g, '')?.replace(/\t/g, '  ');
          });
          return {
            type: 'code',
            language: dataset?.blLang,
            value,
            children: [
              {
                text: value,
              },
            ],
          };
        } else {
          const text = parserCodeText(findElementByNode(target));
          if (text) {
            return {
              type: 'code',
              value: text,
              children: [
                {
                  text: text,
                },
              ],
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

const blobToFile = async (blobUrl: string, fileName: string) => {
  const blob = await fetch(blobUrl).then((r) => r.blob());
  const file = new File([blob], fileName);
  return file;
};

/**
 * 分段处理文件上传，避免阻塞主线程
 */
const upLoadFileBatch = async (fragmentList: any[], editorProps: any) => {
  const mediaFragments: any[] = [];

  // 收集所有需要上传的媒体文件
  const collectMediaFragments = (fragments: any[]) => {
    for (const fragment of fragments) {
      if (fragment.type === 'media') {
        mediaFragments.push(fragment);
      }
      if (fragment?.children) {
        collectMediaFragments(fragment.children);
      }
    }
  };

  collectMediaFragments(fragmentList);

  if (mediaFragments.length === 0) {
    return;
  }

  // 显示上传进度
  const hideLoading = message.loading(
    `Uploading ${mediaFragments.length} files...`,
    0,
  );

  try {
    // 分批处理文件上传
    for (let i = 0; i < mediaFragments.length; i += BATCH_SIZE) {
      const batch = mediaFragments.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (fragment) => {
          const url = fragment.url;
          if (url?.startsWith('blob:')) {
            const file = await blobToFile(fragment?.url, 'image.png');
            if (editorProps.image?.upload) {
              const serverUrl = [await editorProps.image.upload([file])].flat(
                1,
              );
              fragment.url = serverUrl?.[0];
              fragment.downloadUrl = serverUrl?.[0];
            }
          } else {
            if (editorProps.image?.upload) {
              const serverUrl = [
                await editorProps.image.upload([fragment?.url]),
              ].flat(1);
              fragment.url = serverUrl?.[0];
              fragment.downloadUrl = serverUrl?.[0];
            }
          }
        }),
      );

      // 更新进度
      const progress = Math.min(
        ((i + BATCH_SIZE) / mediaFragments.length) * 100,
        100,
      );
      hideLoading();
      message.loading(
        `Uploading ${mediaFragments.length} files... ${Math.round(progress)}%`,
        0,
      );

      // 添加延迟，让出主线程
      if (i + BATCH_SIZE < mediaFragments.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    message.success('Upload completed');
  } catch (error) {
    console.error('文件上传失败:', error);
    message.error('Some files failed to upload');
  } finally {
    hideLoading();
  }
};

/**
 * 分段插入节点，避免一次性插入大量内容导致卡顿
 */
const insertNodesBatch = async (
  editor: Editor,
  nodes: any[],
  at?: Path,
  options?: { select?: boolean },
) => {
  if (nodes.length <= BATCH_SIZE) {
    // 小批量直接插入
    Transforms.insertNodes(editor, nodes, { at, ...options });
    return;
  }

  // 大批量分段插入
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);

    // 计算插入位置
    const insertAt = at
      ? [...at.slice(0, -1), at[at.length - 1] + i]
      : undefined;

    Transforms.insertNodes(editor, batch, {
      at: insertAt,
      select: options?.select && i + BATCH_SIZE >= nodes.length,
    });

    // 让出主线程，避免阻塞UI
    if (i + BATCH_SIZE < nodes.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
    }
  }
};

/**
 * 优化的HTML解析函数，支持分段处理
 */
const parseHtmlOptimized = async (html: string, rtf: string) => {
  // 对于小内容，使用同步处理
  if (html.length < MAX_SYNC_SIZE) {
    return docxDeserializer(rtf, html.trim());
  }

  // 对于大内容，使用异步处理
  return new Promise<any[]>((resolve) => {
    // 使用 requestIdleCallback 在空闲时间处理
    const processInIdle = () => {
      try {
        const result = docxDeserializer(rtf, html.trim());
        resolve(result);
      } catch (error) {
        console.error('HTML解析失败:', error);
        resolve([]);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(processInIdle, { timeout: 1000 });
    } else {
      // 降级到 setTimeout
      setTimeout(processInIdle, 0);
    }
  });
};

/**
 * 转化 html 到 slate - 性能优化版本
 * @param editor
 * @param html
 * @returns
 */
export const htmlToFragmentList = (html: string, rtl: string) => {
  let fragmentList = docxDeserializer(rtl, html.trim());

  return fragmentList.map((fragment) => {
    if (fragment.type === 'table') {
      return EditorUtils.wrapperCardNode(fragment);
    }
    if (fragment.type === '"paragraph"' && fragment.children.length === 1) {
      return {
        type: 'paragraph',
        children: fragment.children,
      };
    }
    return fragment;
  });
};

export const insertParsedHtmlNodes = async (
  editor: Editor,
  html: string,
  editorProps: any,
  rtl: string,
) => {
  // 1. 基础检查
  if (
    html.startsWith('<html>\r\n<body>\r\n\x3C!--StartFragment--><img src="')
  ) {
    return false;
  }

  // 性能监控
  const operationId = generateOperationId();
  performanceMonitor.startMonitoring(operationId, 'html', html.length);

  // 2. 显示解析提示
  const hideLoading = message.loading('parsing...', 0);

  try {
    // 3. 异步解析 HTML
    const fragmentList = await parseHtmlOptimized(html, rtl);

    if (!fragmentList?.length) {
      hideLoading();
      return false;
    }

    // 4. 异步处理文件上传
    await upLoadFileBatch(fragmentList, editorProps);

    debugLog('wordFragmentList', fragmentList);
    hideLoading();

    // 5. 获取当前节点
    let [node] = Editor.nodes<Element>(editor, {
      match: (n) => Element.isElement(n),
    });

    const selection = editor.selection;

    // 6. 如果没有选区或路径无效，直接插入
    if (!selection || !Editor.hasPath(editor, selection.anchor.path)) {
      const processedNodes = fragmentList?.map((item) => {
        if (!item.type) {
          return { type: 'paragraph', children: [item] };
        }
        return item;
      });

      await insertNodesBatch(editor, processedNodes);
      return true;
    }

    // 7. 处理非折叠选区
    if (!Range.isCollapsed(selection)) {
      const back = new BackspaceKey(editor);
      back.range();
      Transforms.select(editor, Range.start(selection));
      setTimeout(() => {
        const node = Editor?.node(editor, [0]);
        if (
          editor.children.length > 1 &&
          node?.[0]?.type === 'paragraph' &&
          !Node.string(node[0])
        ) {
          Transforms.delete(editor, { at: [0] });
        }
      });
    }

    // 8. 获取特殊节点类型
    const [specialNode] = Editor.nodes<Element>(editor, {
      match: (n) =>
        Element.isElement(n) &&
        ['code', 'table-cell', 'head', 'list-item'].includes(n.type),
      at: Range.isCollapsed(selection)
        ? selection.anchor.path
        : Range.start(selection).path,
    });

    if (specialNode) {
      node = specialNode;
    }

    // 9. 处理代码块和表格单元格
    const parsed = new DOMParser().parseFromString(html, 'text/html').body;
    const inner = !!parsed.querySelector('[data-be]');

    // 对于代码块，检查是否包含代码相关的标签
    if (node?.[0].type === 'code') {
      const hasCodeTags =
        html.includes('<pre>') || html.includes('<code>') || inner;
      if (hasCodeTags) {
        // 从 HTML 中提取纯文本内容
        const textContent = parsed.textContent || '';
        if (textContent.trim()) {
          Transforms.insertText(editor, textContent.trim(), { at: selection! });
          return true;
        }
      }
    }

    // 处理表格单元格
    if (inner && node?.[0].type === 'table-cell') {
      return true;
    }

    // 10. 处理列表项
    if (node?.[0].type === 'list-item' && fragmentList[0].type === 'list') {
      const children = fragmentList[0].children || [];
      if (!children.length) {
        return false;
      }

      const [p] = Editor.nodes<Element>(editor, {
        match: (n) => Element.isElement(n) && n.type === 'paragraph',
        at: Range.isCollapsed(selection)
          ? selection.anchor.path
          : Range.start(selection).path,
      });

      if (specialNode && !Path.hasPrevious(p[1])) {
        if (!Node.string(p[0])) {
          await insertNodesBatch(editor, children, Path.next(specialNode[1]));
          const parent = Node.parent(editor, p[1]);
          const nextPath = [
            ...specialNode[1].slice(0, -1),
            specialNode[1][specialNode[1].length - 1] + children.length,
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
          Transforms.delete(editor, { at: selection! });
        } else {
          await insertNodesBatch(editor, children, selection!.anchor.path, {
            select: true,
          });
        }

        if (fragmentList.length > 1) {
          await insertNodesBatch(
            editor,
            fragmentList.slice(1),
            selection!.anchor.path,
            { select: true },
          );
        }
        return true;
      }
    }

    // 11. 处理表格单元格
    if (node?.[0].type === 'table-cell') {
      Transforms.insertFragment(editor, getTextsNode(fragmentList), {
        at: selection!,
      });
      return true;
    }

    // 12. 处理标题
    if (node?.[0].type === 'head') {
      if (fragmentList[0].type) {
        if (fragmentList[0].type !== 'paragraph') {
          Transforms.insertNodes(
            editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            { at: selection!, select: true },
          );
          return true;
        }
        return false;
      }

      const texts = fragmentList.filter((c) => c.text);
      if (texts.length) {
        await insertNodesBatch(editor, texts, selection!.anchor.path);
        return true;
      }
      return false;
    }

    // 13. 处理单个段落的特殊情况
    if (
      fragmentList.length === 1 &&
      (fragmentList[0].type === 'paragraph' || !fragmentList[0].type) &&
      node
    ) {
      const text = Node.string(fragmentList[0]);
      if (text) {
        Transforms.insertText(editor, text, {
          at: selection!,
        });
        return true;
      }
    }

    // 14. 默认情况：替换选中节点
    const processedNodes = fragmentList?.map((item) => {
      if (!item.type) {
        return { type: 'paragraph', children: [item] };
      }
      return item;
    });

    await insertNodesBatch(editor, processedNodes);

    // 结束性能监控
    performanceMonitor.endMonitoring(operationId);

    return true;
  } catch (error) {
    console.error('插入HTML节点失败:', error);
    hideLoading();
    message.error('Content parsing failed, please try again');

    // 结束性能监控
    performanceMonitor.endMonitoring(operationId);

    return false;
  }
};
