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

    // 将文本按行分割并处理每一行
    const lines = normalizedText.split('\n').map((line) => line.trim());
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 跳过空行
      if (!line) continue;

      // 如果不是第一个非空行，添加空行
      if (result.length > 0) {
        result.push('');
      }

      result.push(line);
    }

    return result.join('\n');
  }

  /**
   * 在中英文之间添加空格（盘古之白）
   * @param text Markdown 文本
   * @returns 格式化后的文本
   */
  static addPanguSpacing(text: string): string {
    // 保存 Markdown 特殊语法
    const placeholders: { [key: string]: string } = {};
    let counter = 0;

    // 临时替换 Markdown 链接和行内代码
    const preservedText = text
      .replace(/(\[([^\]]+)\]\([^)]+\))/g, (match) => {
        const placeholder = `__LINK_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      })
      .replace(/(`[^`]+`)/g, (match) => {
        const placeholder = `__CODE_${counter}__`;
        placeholders[placeholder] = match;
        counter++;
        return placeholder;
      });

    // 添加空格
    let spacedText = preservedText
      // 在中文和英文字母/数字之间添加空格
      .replace(/([\u4e00-\u9fa5])([A-Za-z0-9])/g, '$1 $2')
      .replace(/([A-Za-z0-9])([\u4e00-\u9fa5])/g, '$1 $2')
      // 修复可能出现的多余空格，但保留换行符
      .replace(/([^\s\n])\s+([^\s\n])/g, '$1 $2');

    // 还原 Markdown 特殊语法，同时处理其周围的空格
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

    // 然后添加盘古之白
    return this.addPanguSpacing(paragraphsFixed);
  }
}

export default MarkdownFormatter;
