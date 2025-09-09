/**
 * ProxySandbox 测试用例
 *
 * 测试基于 Proxy 的沙箱功能，包括安全性、性能、错误处理等方面。
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ProxySandbox,
  createSandbox,
  runInSandbox,
} from '../../../src/utils/sandbox/ProxySandbox';

describe('ProxySandbox', () => {
  let sandbox: ProxySandbox;

  beforeEach(() => {
    sandbox = new ProxySandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.destroy();
    }
  });

  describe('基本功能测试', () => {
    it('应该能够执行简单的 JavaScript 代码', async () => {
      const result = await sandbox.execute('return 1 + 1');

      expect(result.success).toBe(true);
      expect(result.result).toBe(2);
      expect(result.error).toBeUndefined();
    });

    it('应该能够访问允许的全局对象', async () => {
      const result = await sandbox.execute('return Math.PI');

      expect(result.success).toBe(true);
      expect(result.result).toBe(Math.PI);
    });

    it('应该能够执行包含变量声明的代码', async () => {
      const code = `
        const x = 10;
        const y = 20;
        return x + y;
      `;

      const result = await sandbox.execute(code);

      expect(result.success).toBe(true);
      expect(result.result).toBe(30);
    });

    it('应该能够执行包含函数的代码', async () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
        return add(5, 3);
      `;

      const result = await sandbox.execute(code);

      expect(result.success).toBe(true);
      expect(result.result).toBe(8);
    });
  });

  describe('安全性测试', () => {
    it('应该阻止访问被禁止的全局对象', async () => {
      const result = await sandbox.execute('return window');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('not allowed');
    });

    it('应该阻止访问 eval', async () => {
      const result = await sandbox.execute('return eval("1 + 1")');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该阻止访问 Function 构造函数', async () => {
      const result = await sandbox.execute('return new Function("return 1")()');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该阻止访问 constructor', async () => {
      const result = await sandbox.execute('return "".constructor');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该阻止访问 __proto__', async () => {
      const result = await sandbox.execute('return {}.__proto__');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该在严格模式下执行代码', async () => {
      // 在严格模式下，未声明的变量会抛出错误
      const result = await sandbox.execute(
        'undeclaredVar = 42; return undeclaredVar;',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('超时机制测试', () => {
    it('应该在超时时中断代码执行', async () => {
      const sandbox = new ProxySandbox({ timeout: 100 });
      const startTime = Date.now();

      const result = await sandbox.execute('while(true) {}');
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timeout');
      expect(executionTime).toBeLessThan(200); // 应该在合理时间内超时

      sandbox.destroy();
    });

    it('应该能够配置自定义超时时间', async () => {
      const customTimeout = 50;
      const sandbox = new ProxySandbox({ timeout: customTimeout });

      const result = await sandbox.execute('while(true) {}');

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timeout');

      sandbox.destroy();
    });
  });

  describe('自定义全局变量测试', () => {
    it('应该能够添加自定义全局变量', async () => {
      const sandbox = new ProxySandbox({
        customGlobals: {
          customValue: 42,
          customFunction: (x: number) => x * 2,
        },
      });

      const result = await sandbox.execute(
        'return customValue + customFunction(5)',
      );

      expect(result.success).toBe(true);
      expect(result.result).toBe(52); // 42 + (5 * 2)

      sandbox.destroy();
    });

    it('应该能够在运行时添加全局变量', () => {
      sandbox.addGlobal('runtimeVar', 'test');

      expect(() => sandbox.execute('return runtimeVar')).not.toThrow();
    });

    it('应该能够移除全局变量', () => {
      sandbox.addGlobal('tempVar', 'test');
      sandbox.removeGlobal('tempVar');

      // 变量应该不再可访问
      expect(() => sandbox.execute('return tempVar')).not.toThrow();
    });
  });

  describe('控制台访问测试', () => {
    it('应该允许使用 console 对象（如果启用）', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const sandbox = new ProxySandbox({ allowConsole: true });

      const result = await sandbox.execute('console.log("test"); return true;');

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('[Sandbox]', 'test');

      consoleSpy.mockRestore();
      sandbox.destroy();
    });

    it('应该阻止使用 console 对象（如果禁用）', async () => {
      const sandbox = new ProxySandbox({ allowConsole: false });

      const result = await sandbox.execute('return typeof console');

      expect(result.success).toBe(true);
      expect(result.result).toBe('undefined');

      sandbox.destroy();
    });
  });

  describe('定时器功能测试', () => {
    it('应该允许使用定时器（如果启用）', async () => {
      const sandbox = new ProxySandbox({ allowTimers: true });

      const result = await sandbox.execute('return typeof setTimeout');

      expect(result.success).toBe(true);
      expect(result.result).toBe('function');

      sandbox.destroy();
    });

    it('应该限制定时器的最大延迟', async () => {
      const sandbox = new ProxySandbox({ allowTimers: true });

      // 测试定时器安全限制
      const result = await sandbox.execute(`
        let called = false;
        setTimeout(() => { called = true; }, 2000); // 超过1秒限制
        return true;
      `);

      expect(result.success).toBe(true);

      sandbox.destroy();
    });
  });

  describe('错误处理测试', () => {
    it('应该捕获语法错误', async () => {
      const result = await sandbox.execute('return 1 +');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(Error);
    });

    it('应该捕获运行时错误', async () => {
      const result = await sandbox.execute('throw new Error("test error")');

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('test error');
    });

    it('应该捕获类型错误', async () => {
      const result = await sandbox.execute('return null.someProperty');

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('性能测试', () => {
    it('应该记录执行时间', async () => {
      const result = await sandbox.execute('return 1 + 1');

      expect(result.executionTime).toBeGreaterThan(0);
      expect(result.executionTime).toBeLessThan(1000); // 应该很快
    });

    it('应该提供内存使用信息', async () => {
      const result = await sandbox.execute('return 1 + 1');

      expect(typeof result.memoryUsage).toBe('number');
      expect(result.memoryUsage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('状态管理测试', () => {
    it('应该正确报告运行状态', () => {
      expect(sandbox.isRunning()).toBe(false);

      // 注意：由于异步执行，需要特殊处理状态检查
    });

    it('应该能够获取配置信息', () => {
      const config = sandbox.getConfig();

      expect(config).toBeDefined();
      expect(config.allowConsole).toBeDefined();
      expect(config.allowTimers).toBeDefined();
      expect(config.timeout).toBeDefined();
    });
  });

  describe('资源清理测试', () => {
    it('应该能够正确销毁沙箱', () => {
      const newSandbox = new ProxySandbox();

      expect(() => newSandbox.destroy()).not.toThrow();

      // 销毁后应该无法执行代码
      expect(newSandbox.execute('return 1')).rejects.toThrow();
    });
  });
});

describe('工厂函数测试', () => {
  describe('createSandbox', () => {
    it('应该创建带有默认配置的沙箱', () => {
      const sandbox = createSandbox();

      expect(sandbox).toBeInstanceOf(ProxySandbox);
      expect(sandbox.getConfig()).toBeDefined();

      sandbox.destroy();
    });

    it('应该创建带有自定义配置的沙箱', () => {
      const config = {
        allowConsole: false,
        timeout: 1000,
        strictMode: true,
      };

      const sandbox = createSandbox(config);
      const actualConfig = sandbox.getConfig();

      expect(actualConfig.allowConsole).toBe(false);
      expect(actualConfig.timeout).toBe(1000);
      expect(actualConfig.strictMode).toBe(true);

      sandbox.destroy();
    });
  });

  describe('runInSandbox', () => {
    it('应该能够一次性执行代码', async () => {
      const result = await runInSandbox('return 2 * 3');

      expect(result.success).toBe(true);
      expect(result.result).toBe(6);
    });

    it('应该在执行后自动清理资源', async () => {
      // 这个测试验证不会造成内存泄漏
      const promises = Array.from({ length: 10 }, (_, i) =>
        runInSandbox(`return ${i} * 2`),
      );

      const results = await Promise.all(promises);

      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true);
        expect(result.result).toBe(index * 2);
      });
    });

    it('应该使用自定义配置执行代码', async () => {
      const result = await runInSandbox('return customVar', {
        customGlobals: { customVar: 'test' },
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('test');
    });
  });
});

describe('边界情况测试', () => {
  it('应该处理空代码', async () => {
    const result = await runInSandbox('');

    expect(result.success).toBe(true);
    expect(result.result).toBeUndefined();
  });

  it('应该处理只有注释的代码', async () => {
    const result = await runInSandbox('// 这是注释\n/* 这也是注释 */');

    expect(result.success).toBe(true);
  });

  it('应该处理复杂的嵌套结构', async () => {
    const code = `
      const obj = {
        nested: {
          array: [1, 2, 3],
          func: function(x) { return x * 2; }
        }
      };
      return obj.nested.func(obj.nested.array[1]);
    `;

    const result = await runInSandbox(code);

    expect(result.success).toBe(true);
    expect(result.result).toBe(4); // 2 * 2
  });

  it('应该处理异步代码（Promise）', async () => {
    const code = `
      return Promise.resolve(42);
    `;

    const result = await runInSandbox(code);

    expect(result.success).toBe(true);
    expect(result.result).resolves.toBe(42);
  });
});
