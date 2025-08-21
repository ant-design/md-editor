import dayjs from 'dayjs';

/**
 * 格式化时间显示
 * @param time 时间戳或时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (time?: number | string): string => {
  if (!time) {
    return '';
  }
  // 如果是今天
  if (dayjs().isSame(dayjs(time), 'day')) {
    return '今日';
  }
  if (dayjs().isSame(dayjs(time).add(1, 'day'), 'day')) {
    return '昨日';
  }
  if (dayjs().isSame(dayjs(time).add(7, 'day'), 'day')) {
    return '一周内';
  }
  //@ts-ignore 如果是昨天
  return dayjs(time)?.fromNow?.();
};

/**
 * 按指定键对数组进行分组
 * @param list 要分组的数组
 * @param getCategoryKey 分组键的获取函数
 * @returns 分组后的对象
 */
export const groupByCategory = <T>(
  list: T[],
  getCategoryKey: (item: T) => string,
): Record<string, T[]> => {
  return list.reduce(
    (prev, curr) => {
      const group = getCategoryKey(curr);
      if (!prev[group]) {
        prev[group] = [];
      }
      prev[group].push(curr);
      return prev;
    },
    {} as Record<string, T[]>,
  );
};
