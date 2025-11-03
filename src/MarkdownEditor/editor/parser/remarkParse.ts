import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Plugin to fix bold text containing special characters like **$9.698M**, **57%**, etc.
 *
 * @returns {(tree: any) => void}
 *   Transformer function.
 */
export function fixStrongWithSpecialChars() {
  // 返回转换器函数
  return (tree: any) => {
    // 先尝试处理段落中的原始文本
    visit(tree, 'paragraph', (paragraphNode: any) => {
      if (Array.isArray(paragraphNode.children)) {
        for (let i = 0; i < paragraphNode.children.length; i++) {
          const child = paragraphNode.children[i];

          if (
            child.type === 'text' &&
            child.value &&
            typeof child.value === 'string'
          ) {
            // 匹配包含特殊字符的加粗文本（美元符号、百分号、引号、书名号、其他数字相关符号）
            const strongPattern =
              /\*\*([^*\n]*[$%#@&+\-=\w\d.，。、；：！？""''（）【】《》]+[^*\n]*?)\*\*/g;

            if (strongPattern.test(child.value)) {
              // 重置正则表达式
              strongPattern.lastIndex = 0;

              const newNodes: any[] = [];
              let lastIndex = 0;
              let match;

              // 分割文本并创建新的节点结构
              while ((match = strongPattern.exec(child.value)) !== null) {
                // 添加匹配前的普通文本
                if (match.index > lastIndex) {
                  const beforeText = child.value.slice(lastIndex, match.index);
                  if (beforeText) {
                    newNodes.push({
                      type: 'text',
                      value: beforeText,
                    });
                  }
                }

                // 添加加粗节点
                newNodes.push({
                  type: 'strong',
                  children: [
                    {
                      type: 'text',
                      value: match[1],
                    },
                  ],
                });

                lastIndex = match.index + match[0].length;
              }

              // 添加剩余的普通文本
              if (lastIndex < child.value.length) {
                const afterText = child.value.slice(lastIndex);
                if (afterText) {
                  newNodes.push({
                    type: 'text',
                    value: afterText,
                  });
                }
              }

              // 替换当前文本节点
              if (newNodes.length > 0) {
                paragraphNode.children.splice(i, 1, ...newNodes);
                i += newNodes.length - 1; // 调整索引以跳过新插入的节点
              }
            }
          }
        }
      }
    });

    // 处理所有文本节点（作为备用方案）
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (node.value && typeof node.value === 'string') {
        // 匹配包含特殊字符的加粗文本（美元符号、百分号、引号、书名号、其他数字相关符号）
        const strongPattern =
          /\*\*([^*\n]*[$%#@&+\-=\w\d.，。、；：！？""''（）【】《》]+[^*\n]*?)\*\*/g;

        if (strongPattern.test(node.value)) {
          // 重置正则表达式
          strongPattern.lastIndex = 0;

          const newNodes: any[] = [];
          let lastIndex = 0;
          let match;

          // 分割文本并创建新的节点结构
          while ((match = strongPattern.exec(node.value)) !== null) {
            // 添加匹配前的普通文本
            if (match.index > lastIndex) {
              const beforeText = node.value.slice(lastIndex, match.index);
              if (beforeText) {
                newNodes.push({
                  type: 'text',
                  value: beforeText,
                });
              }
            }

            // 添加加粗节点
            newNodes.push({
              type: 'strong',
              children: [
                {
                  type: 'text',
                  value: match[1],
                },
              ],
            });

            lastIndex = match.index + match[0].length;
          }

          // 添加剩余的普通文本
          if (lastIndex < node.value.length) {
            const afterText = node.value.slice(lastIndex);
            if (afterText) {
              newNodes.push({
                type: 'text',
                value: afterText,
              });
            }
          }

          // 替换原节点
          if (
            parent &&
            Array.isArray(parent.children) &&
            typeof index === 'number'
          ) {
            parent.children.splice(index, 1, ...newNodes);
          }
        }
      }
    });
  };
}

// 完整的 HTML 渲染解析器
const markdownParser = unified()
  .use(remarkParse)
  .use(remarkHtml)
  .use(remarkGfm) // GFM 插件
  .use(fixStrongWithSpecialChars) // 修复包含特殊字符的加粗文本
  .use(remarkMath as any, {
    singleDollarTextMath: false, // 暂时禁用单美元符号，只使用双美元符号 $$...$$
  })
  .use(remarkRehype as any, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex as any)
  .use(remarkFrontmatter, ['yaml']);

export default markdownParser;
