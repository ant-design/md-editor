import { describe, expect, it, vi } from 'vitest';
import { formatTime } from '../../src/utils/formatTime';

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = (date: any) => {
    const mockDate = new Date(date || Date.now());
    return {
      isSame: vi.fn().mockReturnValue(false),
      format: vi.fn().mockReturnValue(''),
    };
  };
  
  mockDayjs.extend = vi.fn();
  return { default: mockDayjs };
});

describe('formatTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return fixed time in test environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    const result = formatTime(1234567890);
    expect(result).toBe('2024-02-27 17:20:00');

    process.env.NODE_ENV = originalEnv;
  });

  it('should format time for same day', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockDayjs = require('dayjs');
    const mockInstance = mockDayjs();
    mockInstance.isSame.mockReturnValue(true);
    mockInstance.format.mockReturnValue('14:30:25');

    const result = formatTime(1234567890);
    expect(result).toBe('14:30:25');

    process.env.NODE_ENV = originalEnv;
  });

  it('should format time for same year but different day', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockDayjs = require('dayjs');
    const mockInstance = mockDayjs();
    mockInstance.isSame
      .mockReturnValueOnce(false) // not same day
      .mockReturnValueOnce(true); // same year
    mockInstance.format.mockReturnValue('03-15 14:30:25');

    const result = formatTime(1234567890);
    expect(result).toBe('03-15 14:30:25');

    process.env.NODE_ENV = originalEnv;
  });

  it('should format time for different year', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockDayjs = require('dayjs');
    const mockInstance = mockDayjs();
    mockInstance.isSame
      .mockReturnValueOnce(false) // not same day
      .mockReturnValueOnce(false); // not same year
    mockInstance.format.mockReturnValue('2023-03-15 14:30:25');

    const result = formatTime(1234567890);
    expect(result).toBe('2023-03-15 14:30:25');

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle different time inputs', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockDayjs = require('dayjs');
    const mockInstance = mockDayjs();
    mockInstance.isSame.mockReturnValue(true);
    mockInstance.format.mockReturnValue('09:15:30');

    const result = formatTime(0);
    expect(result).toBe('09:15:30');

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle large timestamp', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const mockDayjs = require('dayjs');
    const mockInstance = mockDayjs();
    mockInstance.isSame.mockReturnValue(true);
    mockInstance.format.mockReturnValue('23:59:59');

    const result = formatTime(9999999999999);
    expect(result).toBe('23:59:59');

    process.env.NODE_ENV = originalEnv;
  });
}); 