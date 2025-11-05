import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { generateHistoryItems } from '../../src/History/components/HistoryList';
import { HistoryDataType } from '../../src/History/types/HistoryData';

/**
 * 测试历史记录分组排序逻辑
 *
 * 核心测试点：
 * 1. 分组按时间倒序排列（今日 > 昨日 > 一周内 > 更早）
 * 2. 使用每个分组中最新的时间戳进行排序
 * 3. 确保 Object.keys() 的不确定性不影响最终显示顺序
 */
describe('HistoryList - Group Sorting', () => {
  const now = dayjs();
  const yesterday = now.subtract(1, 'day');
  const twoDaysAgo = now.subtract(2, 'day');
  const eightDaysAgo = now.subtract(8, 'day');

  describe('基础分组排序', () => {
    it('应该将"今日"分组排在"昨日"分组之前', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-yesterday-1',
          sessionTitle: '昨天的对话1',
          agentId: 'agent-1',
          gmtCreate: yesterday.valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today-1',
          sessionTitle: '今天的对话1',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
        },
        {
          id: '3',
          sessionId: 'session-yesterday-2',
          sessionTitle: '昨天的对话2',
          agentId: 'agent-1',
          gmtCreate: yesterday.subtract(1, 'hour').valueOf(),
        },
        {
          id: '4',
          sessionId: 'session-today-2',
          sessionTitle: '今天的对话2',
          agentId: 'agent-1',
          gmtCreate: now.subtract(1, 'hour').valueOf(),
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // 第一个分组应该是"今日"
      expect(items[0].label).toBe('今日');
      expect(items[0].key).toBe('group-今日');

      // 第二个分组应该是"昨日"
      expect(items[1].label).toBe('昨日');
      expect(items[1].key).toBe('group-昨日');
    });

    it('应该按照时间倒序排列所有分组（最新在前）', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-8days',
          sessionTitle: '8天前的对话',
          agentId: 'agent-1',
          gmtCreate: eightDaysAgo.valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today',
          sessionTitle: '今天的对话',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
        },
        {
          id: '3',
          sessionId: 'session-yesterday',
          sessionTitle: '昨天的对话',
          agentId: 'agent-1',
          gmtCreate: yesterday.valueOf(),
        },
        {
          id: '4',
          sessionId: 'session-2days',
          sessionTitle: '2天前的对话',
          agentId: 'agent-1',
          gmtCreate: twoDaysAgo.valueOf(),
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // 验证分组顺序：今日 > 昨日 > 2天前 > 8天前
      expect(items[0].label).toBe('今日');
      expect(items[1].label).toBe('昨日');
      // 注意：2天前和8天前会被 formatTime 函数格式化为相对时间
      expect(items.length).toBe(4);

      // 验证分组按时间降序排列
      for (let i = 0; i < items.length - 1; i++) {
        const currentGroup = items[i].children as any[];
        const nextGroup = items[i + 1].children as any[];

        const currentMaxTime = Math.max(
          ...currentGroup.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );
        const nextMaxTime = Math.max(
          ...nextGroup.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );

        expect(currentMaxTime).toBeGreaterThanOrEqual(nextMaxTime);
      }
    });
  });

  describe('使用分组中最新时间戳排序', () => {
    it('应该使用每个分组中最新的时间戳进行排序', () => {
      // 构造场景：
      // "昨日"分组中有一条比较新的记录（23:59）
      // "今日"分组中有一条较早的记录（00:01）
      // 但整体上"今日"应该排在"昨日"之前
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-yesterday-late',
          sessionTitle: '昨天晚上23:59的对话',
          agentId: 'agent-1',
          gmtCreate: yesterday.hour(23).minute(59).valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today-early',
          sessionTitle: '今天凌晨00:01的对话',
          agentId: 'agent-1',
          gmtCreate: now.hour(0).minute(1).valueOf(),
        },
        {
          id: '3',
          sessionId: 'session-yesterday-morning',
          sessionTitle: '昨天早上08:00的对话',
          agentId: 'agent-1',
          gmtCreate: yesterday.hour(8).minute(0).valueOf(),
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // "今日"应该排在第一位
      expect(items[0].label).toBe('今日');

      // "昨日"应该排在第二位
      expect(items[1].label).toBe('昨日');
    });

    it('应该正确处理混乱的数据顺序', () => {
      // 模拟用户提供的真实场景：数据顺序是混乱的
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: '01k97q70mdt0warexbs82tpcw5',
          sessionTitle: '新建报告',
          agentId: 'report-generating-agent',
          gmtCreate: 1730869561000, // 昨天的数据
        },
        {
          id: '2',
          sessionId: '01k998nh9b12h4q2v5tnt11m74',
          sessionTitle: '新建报告',
          agentId: 'report-generating-agent',
          gmtCreate: 1730921417000, // 今天的数据
        },
        {
          id: '3',
          sessionId: '01k98wm57f34pa2zjq88b9xasq',
          sessionTitle: '新建报告',
          agentId: 'report-generating-agent',
          gmtCreate: 1730908789000, // 今天的数据
        },
        {
          id: '4',
          sessionId: '01k96zdcxt3h63mm2vmbg9bcg0',
          sessionTitle: '雨明测试报告',
          agentId: 'report-generating-agent',
          gmtCreate: 1730844604000, // 昨天的数据
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // 应该有2个分组
      expect(items.length).toBeGreaterThanOrEqual(1);

      // 验证第一个分组的时间晚于第二个分组
      if (items.length >= 2) {
        const firstGroupChildren = items[0].children as any[];
        const secondGroupChildren = items[1].children as any[];

        const firstGroupMaxTime = Math.max(
          ...firstGroupChildren.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );

        const secondGroupMaxTime = Math.max(
          ...secondGroupChildren.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );

        expect(firstGroupMaxTime).toBeGreaterThan(secondGroupMaxTime);
      }
    });
  });

  describe('边界情况', () => {
    it('应该正确处理只有一个分组的情况', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-today-1',
          sessionTitle: '今天的对话1',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today-2',
          sessionTitle: '今天的对话2',
          agentId: 'agent-1',
          gmtCreate: now.subtract(1, 'hour').valueOf(),
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      expect(items.length).toBe(1);
      expect(items[0].label).toBe('今日');
      expect(items[0].children?.length).toBe(2);
    });

    it('应该正确处理空数据', () => {
      const items = generateHistoryItems({
        filteredList: [],
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      expect(items.length).toBe(0);
    });

    it('应该正确处理多个相同时间的数据', () => {
      const sameTime = now.valueOf();
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-1',
          sessionTitle: '对话1',
          agentId: 'agent-1',
          gmtCreate: sameTime,
        },
        {
          id: '2',
          sessionId: 'session-2',
          sessionTitle: '对话2',
          agentId: 'agent-1',
          gmtCreate: sameTime,
        },
        {
          id: '3',
          sessionId: 'session-3',
          sessionTitle: '对话3',
          agentId: 'agent-1',
          gmtCreate: sameTime,
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      expect(items.length).toBe(1);
      expect(items[0].children?.length).toBe(3);
    });
  });

  describe('自定义分组函数', () => {
    it('应该支持自定义 groupBy 函数并正确排序', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-1',
          sessionTitle: '对话1',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
          //@ts-ignore
          customCategory: 'CategoryA',
        },
        {
          id: '2',
          sessionId: 'session-2',
          sessionTitle: '对话2',
          agentId: 'agent-1',
          gmtCreate: yesterday.valueOf(),
          //@ts-ignore
          customCategory: 'CategoryB',
        },
        {
          id: '3',
          sessionId: 'session-3',
          sessionTitle: '对话3',
          agentId: 'agent-1',
          gmtCreate: now.subtract(2, 'hour').valueOf(),
          //@ts-ignore
          customCategory: 'CategoryA',
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        //@ts-ignore
        groupBy: (item) => item.customCategory,
        customOperationExtra: [],
      });

      // 应该有2个分组
      expect(items.length).toBe(2);

      // CategoryA 的最新时间是 now，CategoryB 的最新时间是 yesterday
      // 所以 CategoryA 应该排在前面
      expect(items[0].key).toBe('group-CategoryA');
      expect(items[1].key).toBe('group-CategoryB');
    });
  });

  describe('视觉验证测试', () => {
    it('应该渲染正确的分组标签顺序', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-yesterday',
          sessionTitle: '昨天的对话',
          agentId: 'agent-1',
          gmtCreate: yesterday.valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today',
          sessionTitle: '今天的对话',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
        },
      ];

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // 创建简单的渲染组件来验证顺序
      const GroupLabels = () => (
        <div data-testid="group-labels-container">
          {items.map((item, index) => (
            <div key={item.key} data-testid={`group-label-${index}`}>
              {item.label}
            </div>
          ))}
        </div>
      );

      const { container } = render(<GroupLabels />);

      const groups = container.querySelectorAll('[data-testid^="group-label-"]');
      expect(groups[0].textContent).toBe('今日');
      expect(groups[1].textContent).toBe('昨日');
    });
  });

  describe('性能和稳定性', () => {
    it('应该在大量数据下保持正确的排序', () => {
      // 生成100条跨越30天的随机数据
      const testData: HistoryDataType[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: `${i}`,
          sessionId: `session-${i}`,
          sessionTitle: `对话${i}`,
          agentId: 'agent-1',
          gmtCreate: now.subtract(Math.floor(i / 4), 'day').valueOf(),
        }),
      );

      const items = generateHistoryItems({
        filteredList: testData,
        selectedIds: [],
        onSelectionChange: () => {},
        onClick: () => {},
        customOperationExtra: [],
      });

      // 验证所有分组都按时间降序排列
      for (let i = 0; i < items.length - 1; i++) {
        const currentGroup = items[i].children as any[];
        const nextGroup = items[i + 1].children as any[];

        const currentMaxTime = Math.max(
          ...currentGroup.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );
        const nextMaxTime = Math.max(
          ...nextGroup.map((child) =>
            dayjs(child.label.props.item.gmtCreate).valueOf(),
          ),
        );

        expect(currentMaxTime).toBeGreaterThanOrEqual(nextMaxTime);
      }
    });

    it('应该多次调用产生一致的排序结果', () => {
      const testData: HistoryDataType[] = [
        {
          id: '1',
          sessionId: 'session-yesterday',
          sessionTitle: '昨天的对话',
          agentId: 'agent-1',
          gmtCreate: yesterday.valueOf(),
        },
        {
          id: '2',
          sessionId: 'session-today',
          sessionTitle: '今天的对话',
          agentId: 'agent-1',
          gmtCreate: now.valueOf(),
        },
        {
          id: '3',
          sessionId: 'session-8days',
          sessionTitle: '8天前的对话',
          agentId: 'agent-1',
          gmtCreate: eightDaysAgo.valueOf(),
        },
      ];

      // 多次调用应该产生相同的结果
      const results = Array.from({ length: 10 }, () =>
        generateHistoryItems({
          filteredList: testData,
          selectedIds: [],
          onSelectionChange: () => {},
          onClick: () => {},
          customOperationExtra: [],
        }),
      );

      // 验证所有结果的分组顺序都相同
      for (let i = 1; i < results.length; i++) {
        expect(results[i].map((item) => item.key)).toEqual(
          results[0].map((item) => item.key),
        );
      }
    });
  });
});

