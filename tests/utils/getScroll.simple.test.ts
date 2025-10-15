import { describe, expect, it } from 'vitest';
import getScroll, {
  getScrollRailHeight,
  isWindow,
} from '../../src/utils/getScroll';

describe('getScroll 工具函数 - 简化测试', () => {
  describe('isWindow', () => {
    it('应该识别 window 对象', () => {
      expect(isWindow(window)).toBe(true);
    });

    it('应该拒绝 null', () => {
      expect(isWindow(null)).toBe(false);
    });

    it('应该拒绝 undefined', () => {
      expect(isWindow(undefined)).toBe(false);
    });

    it('应该拒绝普通对象', () => {
      expect(isWindow({})).toBe(false);
    });
  });

  describe('getScroll', () => {
    it('应该返回数字', () => {
      const scroll = getScroll(window);
      expect(typeof scroll).toBe('number');
    });

    it('应该处理 null 值', () => {
      const scroll = getScroll(null);
      expect(scroll).toBe(0);
    });

    it('应该处理 HTMLElement', () => {
      const div = document.createElement('div');
      const scroll = getScroll(div);
      expect(typeof scroll).toBe('number');
    });

    it('应该处理 Document', () => {
      const scroll = getScroll(document);
      expect(typeof scroll).toBe('number');
    });
  });

  describe('getScrollRailHeight', () => {
    it('应该返回数字', () => {
      const height = getScrollRailHeight(window);
      expect(typeof height).toBe('number');
    });

    it('应该处理 null 值', () => {
      const height = getScrollRailHeight(null);
      expect(height).toBe(0);
    });

    it('应该处理 HTMLElement', () => {
      const div = document.createElement('div');
      const height = getScrollRailHeight(div);
      expect(typeof height).toBe('number');
    });

    it('应该处理 Document', () => {
      const height = getScrollRailHeight(document);
      expect(typeof height).toBe('number');
    });
  });
});


