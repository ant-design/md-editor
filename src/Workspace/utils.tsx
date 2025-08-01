import React from 'react';

/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (size: number | string): string => {
  if (typeof size === 'string') return size;
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let fileSize = size;
  let unitIndex = 0;
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }
  
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * 格式化最后修改时间
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串 (MM-DD HH:mm)
 */
export const formatLastModified = (timestamp: number | string): string => {
  if (typeof timestamp === 'string') return timestamp;
  
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${month}-${day} ${hours}:${minutes}`;
}; 
