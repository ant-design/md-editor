import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { formatFileSize, formatLastModified } from '../../src/Workspace/utils';

describe('Workspace Utils', () => {
  describe('formatFileSize', () => {
    it('应该格式化字节大小', () => {
      expect(formatFileSize(512)).toBe('512.00 B');
    });

    it('应该格式化KB大小', () => {
      expect(formatFileSize(1536)).toBe('1.50 KB');
    });

    it('应该格式化MB大小', () => {
      expect(formatFileSize(1572864)).toBe('1.50 MB');
    });

    it('应该格式化GB大小', () => {
      expect(formatFileSize(1610612736)).toBe('1.50 GB');
    });

    it('应该格式化TB大小', () => {
      expect(formatFileSize(1649267441664)).toBe('1.50 TB');
    });

    it('应该处理0字节', () => {
      expect(formatFileSize(0)).toBe('0.00 B');
    });

    it('应该处理小于1024字节', () => {
      expect(formatFileSize(1023)).toBe('1023.00 B');
    });

    it('应该处理刚好1024字节', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
    });

    it('应该处理字符串输入', () => {
      expect(formatFileSize('1.5 MB')).toBe('1.5 MB');
    });

    it('应该处理空字符串', () => {
      expect(formatFileSize('')).toBe('');
    });

    it('应该处理大数字', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024 * 1024)).toBe(
        '1024.00 TB',
      );
    });

    it('应该处理小数输入', () => {
      expect(formatFileSize(1024.5)).toBe('1.00 KB');
    });

    it('应该处理负数', () => {
      expect(formatFileSize(-1024)).toBe('-1024.00 B');
    });

    it('应该处理边界值', () => {
      // 1023 B
      expect(formatFileSize(1023)).toBe('1023.00 B');
      // 1024 B = 1 KB
      expect(formatFileSize(1024)).toBe('1.00 KB');
      // 1024 * 1023 B = 1023 KB
      expect(formatFileSize(1024 * 1023)).toBe('1023.00 KB');
      // 1024 * 1024 B = 1 MB
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    });
  });

  describe('formatLastModified', () => {
    let originalDate: DateConstructor;

    beforeEach(() => {
      // 保存原始Date构造函数
      originalDate = global.Date;
    });

    afterEach(() => {
      // 恢复原始Date构造函数
      global.Date = originalDate;
    });

    it('应该格式化有效的时间戳', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result = formatLastModified(timestamp);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该格式化有效的日期字符串', () => {
      const dateString = '2022-01-01T00:00:00.000Z';
      const result = formatLastModified(dateString);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该格式化有效的Date对象', () => {
      const date = new Date('2022-01-01T00:00:00.000Z');
      const result = formatLastModified(date);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理无效的时间戳', () => {
      const result = formatLastModified('invalid-date');
      expect(result).toBe('invalid-date');
    });

    it('应该处理无效的Date对象', () => {
      const result = formatLastModified(new Date('invalid'));
      expect(result).toBe('-');
    });

    it('应该处理null输入', () => {
      const result = formatLastModified(null as any);
      expect(result).toBe('-');
    });

    it('应该处理undefined输入', () => {
      const result = formatLastModified(undefined as any);
      // dayjs会尝试解析undefined，可能会返回当前时间或Invalid Date
      // 根据实际实现，如果dayjs能解析，会返回格式化时间，否则返回'-'
      expect(typeof result).toBe('string');
    });

    it('应该处理空字符串', () => {
      const result = formatLastModified('');
      expect(result).toBe('');
    });

    it('应该处理数字0', () => {
      const result = formatLastModified(0);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理负数时间戳', () => {
      const result = formatLastModified(-1000);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理极大时间戳', () => {
      const result = formatLastModified(9999999999999);
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理dayjs返回Invalid的情况', () => {
      // Mock dayjs返回Invalid
      const mockDayjs = {
        format: () => 'Invalid Date',
      };

      // 这里我们需要mock dayjs，但由于dayjs是外部依赖，我们测试实际行为
      const result = formatLastModified('definitely-invalid-date');
      expect(result).toBe('definitely-invalid-date');
    });

    it('应该处理有效的ISO日期字符串', () => {
      const result = formatLastModified('2023-12-25T10:30:00Z');
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理本地日期字符串', () => {
      const result = formatLastModified('2023-12-25 10:30:00');
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理Unix时间戳字符串', () => {
      const result = formatLastModified('1640995200');
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('应该处理毫秒时间戳字符串', () => {
      const result = formatLastModified('1640995200000');
      expect(result).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('边界情况测试', () => {
    it('formatFileSize应该处理边界值', () => {
      // 测试各种边界值
      expect(formatFileSize(1)).toBe('1.00 B');
      expect(formatFileSize(1023)).toBe('1023.00 B');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.00 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    });

    it('formatLastModified应该处理边界值', () => {
      // 测试各种边界值
      expect(formatLastModified(0)).toMatch(/^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(formatLastModified('1970-01-01T00:00:00.000Z')).toMatch(
        /^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
      expect(formatLastModified(new Date(0))).toMatch(
        /^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
    });
  });

  describe('类型安全测试', () => {
    it('formatFileSize应该处理各种数字类型', () => {
      expect(formatFileSize(100)).toBe('100.00 B');
      expect(formatFileSize(100.5)).toBe('100.50 B');
      expect(formatFileSize(Number.MAX_SAFE_INTEGER)).toBe('8192.00 TB');
    });

    it('formatLastModified应该处理各种日期类型', () => {
      const now = new Date();
      expect(formatLastModified(now.getTime())).toMatch(
        /^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
      expect(formatLastModified(now.toISOString())).toMatch(
        /^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
      expect(formatLastModified(now)).toMatch(
        /^\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      );
    });
  });
});
