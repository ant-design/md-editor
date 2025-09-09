/**
 * 沙箱系统集成测试
 * 
 * 测试完整的沙箱系统集成，包括多个组件的协同工作。
 */

import { describe, it, expect } from 'vitest';
import { 
  createConfiguredSandbox, 
  quickExecute, 
  safeMathEval, 
  sandboxHealthChecker 
} from '../../../src/utils/sandbox';

describe('沙箱系统集成测试', () => {
  describe('预配置沙箱测试', () => {
    it('应该创建基础沙箱', () => {
      const sandbox = createConfiguredSandbox('basic');
      
      expect(sandbox).toBeDefined();
      expect(sandbox.getConfig().allowConsole).toBe(true);
      
      sandbox.destroy();
    });

    it('应该创建安全沙箱', () => {
      const sandbox = createConfiguredSandbox('secure');
      
      expect(sandbox).toBeDefined();
      expect(sandbox.getConfig().allowConsole).toBe(false);
      expect(sandbox.getConfig().timeout).toBe(2000);
      
      sandbox.destroy();
    });

    it('应该创建受限沙箱', () => {
      const sandbox = createConfiguredSandbox('restricted');
      
      expect(sandbox).toBeDefined();
      expect(sandbox.getConfig().allowConsole).toBe(false);
      expect(sandbox.getConfig().timeout).toBe(1000);
      expect(sandbox.getConfig().maxMemoryUsage).toBe(1024 * 1024);
      
      sandbox.destroy();
    });
  });

  describe('快速执行功能测试', () => {
    it('应该能够快速执行简单代码', async () => {
      const result = await quickExecute('return 5 + 3');
      
      expect(result).toBe(8);
    });

    it('应该能够使用自定义全局变量', async () => {
      const result = await quickExecute(
        'return myVar * 2', 
        { myVar: 6 }
      );
      
      expect(result).toBe(12);
    });

    it('应该在代码执行失败时抛出错误', async () => {
      await expect(quickExecute('throw new Error("test")')).rejects.toThrow('test');
    });

    it('应该处理语法错误', async () => {
      await expect(quickExecute('return 1 +')).rejects.toThrow();
    });
  });

  describe('安全数学计算测试', () => {
    it('应该能够计算简单数学表达式', async () => {
      const result = await safeMathEval('2 + 3 * 4');
      
      expect(result).toBe(14);
    });

    it('应该能够使用数学函数', async () => {
      const result = await safeMathEval('Math.sqrt(16)');
      
      expect(result).toBe(4);
    });

    it('应该能够使用预定义的数学函数', async () => {
      const result = await safeMathEval('sqrt(25)');
      
      expect(result).toBe(5);
    });

    it('应该能够使用数学常量', async () => {
      const result = await safeMathEval('PI');
      
      expect(result).toBe(Math.PI);
    });

    it('应该阻止不安全的字符', async () => {
      await expect(safeMathEval('eval("1+1")')).rejects.toThrow('unsafe characters');
    });

    it('应该确保结果是有效数字', async () => {
      await expect(safeMathEval('"not a number"')).rejects.toThrow('not a valid number');
    });

    it('应该处理复杂的数学表达式', async () => {
      const result = await safeMathEval('pow(2, 3) + sqrt(9) * sin(PI/2)');
      
      expect(result).toBeCloseTo(11, 5); // 8 + 3 * 1 = 11
    });
  });

  describe('健康检查功能测试', () => {
    it('应该检查环境支持', () => {
      const support = sandboxHealthChecker.checkEnvironmentSupport();
      
      expect(support).toBeDefined();
      expect(support.supported).toBeDefined();
      expect(Array.isArray(support.issues)).toBe(true);
      expect(Array.isArray(support.recommendations)).toBe(true);
    });

    it('应该测试基本功能', async () => {
      const testResult = await sandboxHealthChecker.testBasicFunctionality();
      
      expect(testResult).toBeDefined();
      expect(testResult.passed).toBeDefined();
      expect(testResult.results).toBeDefined();
      expect(Array.isArray(testResult.errors)).toBe(true);
    });

    it('应该通过基本执行测试', async () => {
      const testResult = await sandboxHealthChecker.testBasicFunctionality();
      
      expect(testResult.results.basicExecution).toBe(true);
    });

    it('应该通过全局隔离测试', async () => {
      const testResult = await sandboxHealthChecker.testBasicFunctionality();
      
      expect(testResult.results.globalIsolation).toBe(true);
    });

    it('应该通过超时机制测试', async () => {
      const testResult = await sandboxHealthChecker.testBasicFunctionality();
      
      expect(testResult.results.timeoutMechanism).toBe(true);
    });
  });

  describe('复杂场景集成测试', () => {
    it('应该处理嵌套函数调用', async () => {
      const code = `
        function factorial(n) {
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
        return factorial(5);
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(120);
    });

    it('应该处理对象和数组操作', async () => {
      const code = `
        const data = {
          numbers: [1, 2, 3, 4, 5],
          multiplier: 2
        };
        
        return data.numbers
          .map(n => n * data.multiplier)
          .reduce((sum, n) => sum + n, 0);
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(30); // (1+2+3+4+5) * 2 = 30
    });

    it('应该处理闭包和作用域', async () => {
      const code = `
        function createCounter(start) {
          let count = start;
          return function() {
            return ++count;
          };
        }
        
        const counter = createCounter(10);
        return counter() + counter() + counter();
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(36); // 11 + 12 + 13 = 36
    });

    it('应该处理异常和错误恢复', async () => {
      const code = `
        let result = 0;
        try {
          throw new Error("intentional error");
        } catch (e) {
          result = 42;
        }
        return result;
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(42);
    });

    it('应该处理字符串操作', async () => {
      const code = `
        const text = "Hello World";
        return text
          .split(" ")
          .map(word => word.toUpperCase())
          .join("-");
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe("HELLO-WORLD");
    });

    it('应该处理日期操作', async () => {
      const code = `
        const date = new Date(2023, 0, 1); // 2023年1月1日
        return date.getFullYear() + date.getMonth() + date.getDate();
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(2024); // 2023 + 0 + 1 = 2024
    });

    it('应该处理正则表达式', async () => {
      const code = `
        const pattern = /\\d+/g;
        const text = "I have 5 apples and 3 oranges";
        const numbers = text.match(pattern);
        return numbers.map(Number).reduce((sum, n) => sum + n, 0);
      `;
      
      const result = await quickExecute(code);
      expect(result).toBe(8); // 5 + 3 = 8
    });
  });

  describe('性能和并发测试', () => {
    it('应该处理并发执行', async () => {
      const codes = [
        'return 1 * 1',
        'return 2 * 2', 
        'return 3 * 3',
        'return 4 * 4',
        'return 5 * 5'
      ];
      
      const promises = codes.map(code => quickExecute(code));
      const results = await Promise.all(promises);
      
      expect(results).toEqual([1, 4, 9, 16, 25]);
    });

    it('应该处理大量小任务', async () => {
      const tasks = Array.from({ length: 20 }, (_, i) => 
        quickExecute(`return ${i} + 1`)
      );
      
      const results = await Promise.all(tasks);
      const expected = Array.from({ length: 20 }, (_, i) => i + 1);
      
      expect(results).toEqual(expected);
    });

    it('应该在合理时间内完成简单计算', async () => {
      const startTime = Date.now();
      await quickExecute('return Math.sqrt(144)');
      const executionTime = Date.now() - startTime;
      
      expect(executionTime).toBeLessThan(100); // 应该在100ms内完成
    });
  });

  describe('边界和错误情况测试', () => {
    it('应该处理空代码', async () => {
      const result = await quickExecute('');
      expect(result).toBeUndefined();
    });

    it('应该处理只有注释的代码', async () => {
      const result = await quickExecute('// just a comment');
      expect(result).toBeUndefined();
    });

    it('应该处理大数字计算', async () => {
      const result = await safeMathEval('1e10 + 1e10');
      expect(result).toBe(2e10);
    });

    it('应该处理小数计算', async () => {
      const result = await safeMathEval('0.1 + 0.2');
      expect(result).toBeCloseTo(0.3, 5);
    });

    it('应该处理负数计算', async () => {
      const result = await safeMathEval('-5 + 3');
      expect(result).toBe(-2);
    });
  });
});
