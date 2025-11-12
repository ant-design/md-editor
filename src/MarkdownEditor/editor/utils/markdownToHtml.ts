import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { fixStrongWithSpecialChars } from '../parser/remarkParse';

/**
 * 将 Markdown 内容转换为 HTML（异步版本）
 *
 * 使用 unified 处理器链来处理 Markdown 到 HTML 的转换，支持：
 * - GitHub 风味 Markdown (GFM)
 * - 数学公式 (KaTeX)
 * - 前置元数据 (Frontmatter)
 * - 特殊字符修复
 * - 原始 HTML 标签
 *
 * @param markdown - 要转换的 Markdown 字符串
 * @returns Promise<string> - 从 Markdown 生成的 HTML 字符串
 *
 * @example
 * ```typescript
 * const html = await markdownToHtml('# 标题\n\n这是**粗体**文本');
 * console.log(html); // '<h1>标题</h1><p>这是<strong>粗体</strong>文本</p>'
 * ```
 *
 * @throws {Error} 当转换过程中发生错误时返回空字符串
 */
export const markdownToHtml = async (markdown: string): Promise<string> => {
  try {
    const htmlContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(fixStrongWithSpecialChars)
      .use(remarkMath as any, {
        singleDollarTextMath: true, // 允许单美元符号渲染内联数学公式
      })
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex as any)
      .use(rehypeStringify)
      .process(markdown);

    return String(htmlContent);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '';
  }
};

/**
 * 将 Markdown 内容转换为 HTML（同步版本）
 *
 * 同步版本的 markdownToHtml，使用相同的处理器链但以同步方式执行。
 * 适用于不需要异步处理的场景，但可能会阻塞主线程。
 *
 * @param markdown - 要转换的 Markdown 字符串
 * @returns string - 从 Markdown 生成的 HTML 字符串
 *
 * @example
 * ```typescript
 * const html = markdownToHtmlSync('## 副标题\n\n- 列表项1\n- 列表项2');
 * console.log(html); // '<h2>副标题</h2><ul><li>列表项1</li><li>列表项2</li></ul>'
 * ```
 *
 * @throws {Error} 当转换过程中发生错误时返回空字符串
 *
 * @remarks
 * - 建议在可能的情况下使用异步版本 `markdownToHtml`
 * - 同步版本可能影响用户界面响应性
 */
export const markdownToHtmlSync = (markdown: string): string => {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(fixStrongWithSpecialChars)
      .use(remarkMath as any, {
        singleDollarTextMath: true, // 允许单美元符号渲染内联数学公式
      })
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex as any)
      .use(rehypeStringify);

    const file = processor.processSync(markdown);
    return String(file);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '';
  }
};
