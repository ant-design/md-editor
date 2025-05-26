// 生成随机ID的工具函数
export function createRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const ELTYPE = {
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  DIVIDE: 'hr',
  CARD: 'card',
  CARD_PRE: 'card-pre',
  CARD_SUF: 'card-suf',
  PARAGRAPH: 'paragraph',
};
