/**
 * 将KB转换为可读的文件大小格式
 *
 * @param {number} kb - 文件大小（KB）
 * @returns {string} 格式化后的文件大小字符串
 *
 * @example
 * kbToSize(1024) // "1 MB"
 * kbToSize(512) // "512 KB"
 */
export const kbToSize = (kb: number) => {
  const sizes = ['KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(kb) / Math.log(1024));
  return parseFloat((kb / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
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
