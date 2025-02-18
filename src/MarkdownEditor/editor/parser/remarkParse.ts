import rehypeKatex from 'rehype-katex';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const parser = unified()
  .use(remarkParse)
  .use(remarkMath as any)
  .use(remarkRehype as any)
  .use(rehypeKatex as any)
  .use(remarkGfm)
  .use(remarkFrontmatter, ['yaml']);

export default parser;
