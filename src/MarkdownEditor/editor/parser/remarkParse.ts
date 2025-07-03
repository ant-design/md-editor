import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// 插件：处理加粗方式，确保 "**90%+**" 正常渲染
function fixStrongFormatting() {
  return (tree: any) => {
    visit(tree, 'strong', (node) => {
      // 强制将不符合解析的加粗节点修正
      if (
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        typeof node.children[0].value === 'string'
      ) {
        node.children[0].value = node.children[0].value.trim();
      }
    });
  };
}

const parser = unified()
  .use(remarkParse)
  .use(remarkMath as any)
  .use(remarkRehype as any, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex as any)
  .use(remarkGfm)
  .use(fixStrongFormatting) // 使用自定义插件修正加粗格式
  .use(remarkFrontmatter, ['yaml']);

export default parser;
