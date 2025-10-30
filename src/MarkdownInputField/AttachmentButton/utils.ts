/**
 * 将KB转换为可读的文件大小格式
 * 支持从字节（B）到TB的所有单位，最小单位为B
 *
 * @param {number} kb - 文件大小（KB）
 * @returns {string} 格式化后的文件大小字符串
 *
 * @example
 * kbToSize(1073741824) // "1 TB"
 * kbToSize(1048576) // "1 GB"
 * kbToSize(1024) // "1 MB"
 * kbToSize(512) // "512 KB"
 * kbToSize(1) // "1 KB"
 * kbToSize(0.5) // "512 B"
 * kbToSize(0.1) // "102.4 B"
 * kbToSize(0.0001) // "0.1 B"
 * kbToSize(0) // "0 B"
 */
export const kbToSize = (kb: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const bytes = kb * 1024;

  // 处理边界情况：0或负数直接返回0 B
  if (bytes <= 0) {
    return '0 B';
  }

  // 如果小于1KB，直接返回字节
  if (bytes < 1024) {
    return parseFloat(bytes.toFixed(2)) + ' ' + sizes[0];
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 检查文件是否为图片类型
 *
 * @param {File} file - 要检查的文件
 * @returns {boolean} 是否为图片文件
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
