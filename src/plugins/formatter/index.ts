/**
 * 格式化 Markdown 文本
 * 1. 规范化段落之间的换行符（确保段落之间只有两个换行符）
 * 2. 添加盘古之白（中英文之间添加空格）
 */
export class MarkdownFormatter {
  /**
   * 规范化段落之间的换行符
   * @param text Markdown 文本
   * @returns 格式化后的文本
   */
  static normalizeParagraphs(text: string): string {
    // 将所有的换行符统一为 \n
    let normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 清理开头和结尾的空白字符
    normalizedText = normalizedText.trim();

    // 将连续的空白行（包括只包含空格的行）替换为单个换行符
    normalizedText = normalizedText.replace(/\n[\s\n]+/g, '\n');

    // 确保段落之间有一个空行
    normalizedText = normalizedText.replace(/\n(?!\n)/g, '\n\n');

    // 移除末尾多余的换行符
    normalizedText = normalizedText.replace(/\n+$/, '');

    return normalizedText;
  }

  /**
   * 在中英文之间添加空格（盘古之白）
   * @param text Markdown 文本
   * @returns 格式化后的文本
   */
  static addPanguSpacing(text: string): string {
    // 保存 HTML 内容、Markdown 特殊语法
    const placeholders: { [key: string]: string } = {};
    let counter = 0;

    // 临时替换需要保护的内容
    const preservedText = text
      // 保存 HTML 注释
      .replace(/(<!--[\s\S]*?-->)/g, (match) => {
        const placeholder = `__COMMENT_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      })
      // 保存 Markdown 链接（包含 HTML 标签的情况）
      .replace(/\[([^\]]*<[^>]+>[^\]]*)\]\([^)]+\)/g, (match) => {
        const placeholder = `__LINK_HTML_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      })
      // 保存完整的 HTML 标签块（包括内容）
      .replace(/(<[^>]+>.*?<\/[^>]+>|<[^>]+>)/g, (match) => {
        const placeholder = `__HTML_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      })
      // 保存普通 Markdown 链接
      .replace(/(\[([^\]]+)\]\([^)]+\))/g, (match) => {
        const placeholder = `__LINK_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      })
      // 保存行内代码
      .replace(/(`[^`]+`)/g, (match) => {
        const placeholder = `__CODE_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      });

    // 添加空格
    let spacedText = preservedText
      // 在中文和英文之间添加空格
      .replace(/([\u4e00-\u9fa5])([A-Za-z])/g, '$1 $2')
      .replace(/([A-Za-z])([\u4e00-\u9fa5])/g, '$1 $2')
      // 在中文和数字之间添加空格
      .replace(/([\u4e00-\u9fa5])(\d+)/g, '$1 $2')
      .replace(/(\d+)([\u4e00-\u9fa5])/g, '$1 $2')
      // 在中文和括号之间添加空格
      .replace(/([\u4e00-\u9fa5])([\(\)])/g, '$1 $2')
      .replace(/([\(\)])([\u4e00-\u9fa5])/g, '$1 $2')
      // 修复可能出现的多余空格，但保留换行符
      .replace(/([^\s\n])\s+([^\s\n])/g, '$1 $2');

    // 还原所有保护的内容
    Object.entries(placeholders).forEach(([placeholder, original]) => {
      spacedText = spacedText.replace(
        new RegExp(`(\\s*)${placeholder}(\\s*)`),
        (_, before, after) => {
          // 确保特殊语法前后有空格
          const needSpaceBefore =
            before === '' &&
            /[\u4e00-\u9fa5]$/.test(spacedText.split(placeholder)[0]);
          const needSpaceAfter =
            after === '' &&
            /^[\u4e00-\u9fa5]/.test(spacedText.split(placeholder)[1]);
          return `${needSpaceBefore ? ' ' : ''}${original}${needSpaceAfter ? ' ' : ''}`;
        },
      );
    });

    return spacedText;
  }

  /**
   * 格式化 Markdown 文本
   * @param text Markdown 文本
   * @returns 格式化后的文本
   */
  static format(text: string): string {
    // 首先处理段落格式
    const paragraphsFixed = this.normalizeParagraphs(text);

    // 然后添加盘古之白，按行处理以保持换行格式
    const lines = paragraphsFixed.split('\n');
    const formattedLines = lines.map((line) => this.addPanguSpacing(line));
    return formattedLines.join('\n');
  }
}

export default MarkdownFormatter;
