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
 * Converts Markdown content to HTML
 *
 * @param markdown - The Markdown string to convert
 * @returns The HTML string generated from the Markdown
 */
export const markdownToHtml = async (markdown: string): Promise<string> => {
  try {
    const htmlContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(fixStrongWithSpecialChars)
      .use(remarkMath as any, {
        singleDollarTextMath: false, // 禁用单美元符号数学公式
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
 * Synchronous version of markdownToHtml
 *
 * @param markdown - The Markdown string to convert
 * @returns The HTML string generated from the Markdown
 */
export const markdownToHtmlSync = (markdown: string): string => {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(fixStrongWithSpecialChars)
      .use(remarkMath as any, {
        singleDollarTextMath: false, // 禁用单美元符号数学公式
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
