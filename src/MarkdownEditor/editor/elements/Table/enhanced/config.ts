// 表格相关的元素类型定义
export const ELTYPE = {
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  PARAGRAPH: 'paragraph',
  // 可以根据需要添加其他类型
} as const;

export type ElementType = (typeof ELTYPE)[keyof typeof ELTYPE];
