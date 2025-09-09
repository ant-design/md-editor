/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * 创建一个新的 `Intl.NumberFormat` 实例，用于将数字格式化为美国英语的十进制格式。
 *
 * @constant
 * @type {Intl.NumberFormat}
 * @default
 * @example
 * const formattedNumber = intl.format(1234567.89);
 * console.log(formattedNumber); // 输出: "1,234,567.89"
 */
const intl = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});

/**
 * 将数字或字符串格式化为字符串。
 *
 * @param value - 要格式化的值，可以是字符串或数字。
 * @returns 格式化后的字符串。如果输入值为字符串，则直接返回该字符串；
 *          如果输入值为数字，则使用 `intl.format` 方法格式化后返回；
 *          如果输入值为空或格式化过程中发生错误，则返回原始值。
 */
export const stringFormatNumber = (value: string | number) => {
  if (!value) return value;
  try {
    if (typeof value === 'string') return value;

    if (typeof value === 'number') {
      return intl.format(Number(value));
    }
    return value;
  } catch (error) {
    return value;
  }
};

export function debounce(
  func: { (): void; apply?: any },
  delay: number | undefined,
) {
  let timer: any = null;
  const fn = function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, arguments);
    }, delay);
  };
  fn.flush = function () {
    clearTimeout(timer);
    //@ts-ignore
    func.apply(this, arguments);
  };
  fn.cancel = function () {
    clearTimeout(timer);
  };
  return fn;
}

/**
 * 数据项接口，用于图表数据处理
 */
export interface ChartDataItem {
  /** 数据类别 */
  category: string;
  /** 数据类型 */
  type: string;
  /** X轴值 */
  x: number | string;
  /** Y轴值 */
  y: number | string;
  /** X轴标题 */
  xtitle?: string;
  /** Y轴标题 */
  ytitle?: string;
  /** 筛选标签 */
  filterLable?: string;
}

/**
 * 归一化 x 轴值，将字符串数字转换为数字，避免重复标签
 * @param value - 原始 x 轴值
 * @returns 归一化后的值
 */
export const normalizeXValue = (value: number | string): number | string => {
  if (typeof value === 'number') {
    return value;
  }

  const numValue = Number(value);
  // 如果字符串可以转换为有效数字，则返回数字
  if (Number.isFinite(numValue)) {
    return numValue;
  }

  // 否则返回原始字符串
  return value;
};

/**
 * 比较两个 x 轴值的大小，用于排序
 * @param a - 第一个值
 * @param b - 第二个值
 * @returns 比较结果
 */
export const compareXValues = (
  a: number | string,
  b: number | string,
): number => {
  const normalizedA = normalizeXValue(a);
  const normalizedB = normalizeXValue(b);

  // 如果都是数字，按数值比较
  if (typeof normalizedA === 'number' && typeof normalizedB === 'number') {
    return normalizedA - normalizedB;
  }

  // 如果一个是数字，一个是字符串，数字优先
  if (typeof normalizedA === 'number' && typeof normalizedB === 'string') {
    return -1;
  }
  if (typeof normalizedA === 'string' && typeof normalizedB === 'number') {
    return 1;
  }

  // 如果都是字符串，按字符串比较
  return String(normalizedA).localeCompare(String(normalizedB));
};

/**
 * 检查两个 x 轴值是否相等
 * @param a - 第一个值
 * @param b - 第二个值
 * @returns 是否相等
 */
export const isXValueEqual = (
  a: number | string,
  b: number | string,
): boolean => {
  const normalizedA = normalizeXValue(a);
  const normalizedB = normalizeXValue(b);

  // 如果都是数字，按数值比较
  if (typeof normalizedA === 'number' && typeof normalizedB === 'number') {
    return normalizedA === normalizedB;
  }

  // 否则按字符串比较
  return String(normalizedA) === String(normalizedB);
};

/**
 * 从数据中提取并排序 x 轴值
 * @param data - 图表数据数组
 * @returns 排序后的唯一 x 轴值数组
 */
export const extractAndSortXValues = (
  data: ChartDataItem[],
): Array<number | string> => {
  // 提取所有 x 值并归一化
  const normalizedValues = data.map((item) => normalizeXValue(item.x));

  // 去重并排序
  const uniqueValues = [...new Set(normalizedValues)];

  return uniqueValues.sort(compareXValues);
};

/**
 * 根据 x 轴值查找对应的数据点
 * @param data - 数据数组
 * @param type - 数据类型
 * @param xValue - x 轴值
 * @returns 匹配的数据点，如果未找到返回 undefined
 */
export const findDataPointByXValue = (
  data: ChartDataItem[],
  type: string,
  xValue: number | string,
): ChartDataItem | undefined => {
  return data.find(
    (item) => item.type === type && isXValueEqual(item.x, xValue),
  );
};

/**
 * 将值转换为数字
 * @param val - 要转换的值
 * @param fallback - 转换失败时的默认值
 * @returns 转换后的数字
 */
export const toNumber = (val: any, fallback: number): number => {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * 检查值是否不为空
 * @param val - 要检查的值
 * @returns 是否不为空
 */
export const isNotEmpty = (val: any) => {
  return val !== null && val !== undefined;
};
