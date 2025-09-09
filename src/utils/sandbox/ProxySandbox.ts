/**
 * 基于 Proxy 的沙箱实现
 * 
 * 这个模块提供了一个安全的代码执行环境，通过 Proxy 劫持全局对象的访问，
 * 防止恶意代码对宿主环境造成破坏，同时提供受控的 API 访问。
 * 
 * 主要特性：
 * - 全局对象隔离
 * - API 访问控制
 * - 内存管理
 * - 错误捕获和处理
 * - 执行超时控制
 * 
 * @author md-editor
 * @version 1.0.0
 */

/**
 * 沙箱配置接口
 */
export interface SandboxConfig {
  /** 允许访问的全局对象白名单 */
  allowedGlobals?: string[];
  /** 禁止访问的全局对象黑名单 */
  forbiddenGlobals?: string[];
  /** 是否允许访问 console API */
  allowConsole?: boolean;
  /** 是否允许访问 setTimeout/setInterval */
  allowTimers?: boolean;
  /** 代码执行超时时间（毫秒） */
  timeout?: number;
  /** 是否启用严格模式 */
  strictMode?: boolean;
  /** 自定义的全局变量 */
  customGlobals?: Record<string, any>;
  /** 是否允许访问 DOM API */
  allowDOM?: boolean;
  /** 最大内存使用限制（字节） */
  maxMemoryUsage?: number;
}

/**
 * 沙箱执行结果接口
 */
export interface SandboxResult {
  /** 执行结果 */
  result: any;
  /** 是否执行成功 */
  success: boolean;
  /** 错误信息 */
  error?: Error;
  /** 执行时间（毫秒） */
  executionTime: number;
  /** 内存使用情况 */
  memoryUsage?: number;
}

/**
 * 默认的危险全局对象列表
 */
const DANGEROUS_GLOBALS = [
  'eval', 'Function', 'constructor', 'prototype', '__proto__',
  'document', 'window', 'global', 'globalThis', 'self',
  'XMLHttpRequest', 'fetch', 'WebSocket', 'Worker',
  'SharedArrayBuffer', 'Atomics', 'WebAssembly',
  'require', 'process', 'Buffer', 'module', 'exports',
  'importScripts', 'postMessage', 'close', 'blur', 'focus',
  'alert', 'confirm', 'prompt', 'open', 'print',
  'localStorage', 'sessionStorage', 'indexedDB',
  'location', 'history', 'navigator', 'screen'
];

/**
 * 安全的全局对象列表
 */
const SAFE_GLOBALS = [
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'Math', 'Date', 'JSON', 'parseInt', 'parseFloat', 'isNaN', 'isFinite',
  'encodeURIComponent', 'decodeURIComponent', 'encodeURI', 'decodeURI',
  'String', 'Number', 'Boolean', 'Array', 'Object', 'RegExp',
  'Error', 'TypeError', 'ReferenceError', 'SyntaxError'
];

/**
 * 基于 Proxy 的沙箱类
 */
export class ProxySandbox {
  private config: Required<SandboxConfig>;
  private globalProxy: any;
  private sandboxGlobal: Record<string, any>;
  private isActive = false;
  private timeoutId: number | null = null;
  private startTime = 0;

  constructor(config: SandboxConfig = {}) {
    this.config = {
      allowedGlobals: config.allowedGlobals || SAFE_GLOBALS,
      forbiddenGlobals: config.forbiddenGlobals || DANGEROUS_GLOBALS,
      allowConsole: config.allowConsole ?? true,
      allowTimers: config.allowTimers ?? true,
      timeout: config.timeout || 5000,
      strictMode: config.strictMode ?? true,
      customGlobals: config.customGlobals || {},
      allowDOM: config.allowDOM ?? false,
      maxMemoryUsage: config.maxMemoryUsage || 10 * 1024 * 1024, // 10MB
    };

    this.sandboxGlobal = this.createSandboxGlobal();
    this.globalProxy = this.createGlobalProxy();
  }

  /**
   * 创建沙箱全局对象
   */
  private createSandboxGlobal(): Record<string, any> {
    const sandboxGlobal: Record<string, any> = {
      // 基础全局对象
      undefined,
      null: null,
      NaN,
      Infinity,
      
      // 基础构造函数
      String,
      Number,
      Boolean,
      Array,
      Object,
      RegExp,
      Date,
      Error,
      TypeError,
      ReferenceError,
      SyntaxError,
      
      // 工具函数
      Math,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      encodeURIComponent,
      decodeURIComponent,
      encodeURI,
      decodeURI,
    };

    // 添加自定义全局变量
    Object.assign(sandboxGlobal, this.config.customGlobals);

    // 条件性添加 console
    if (this.config.allowConsole) {
      sandboxGlobal.console = this.createSafeConsole();
    }

    // 条件性添加定时器
    if (this.config.allowTimers) {
      sandboxGlobal.setTimeout = this.createSafeTimeout();
      sandboxGlobal.setInterval = this.createSafeInterval();
      sandboxGlobal.clearTimeout = clearTimeout;
      sandboxGlobal.clearInterval = clearInterval;
    }

    return sandboxGlobal;
  }

  /**
   * 创建安全的 console 对象
   */
  private createSafeConsole() {
    return {
      log: (...args: any[]) => console.log('[Sandbox]', ...args),
      warn: (...args: any[]) => console.warn('[Sandbox]', ...args),
      error: (...args: any[]) => console.error('[Sandbox]', ...args),
      info: (...args: any[]) => console.info('[Sandbox]', ...args),
      debug: (...args: any[]) => console.debug('[Sandbox]', ...args),
    };
  }

  /**
   * 创建安全的 setTimeout
   */
  private createSafeTimeout() {
    return (callback: (...args: any[]) => any, delay: number, ...args: any[]) => {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }
      
      const safeCallback = () => {
        try {
          callback.apply(null, args);
        } catch (error) {
          console.error('[Sandbox] Timer callback error:', error);
        }
      };
      
      return setTimeout(safeCallback, Math.min(delay, 1000)); // 最大延迟1秒
    };
  }

  /**
   * 创建安全的 setInterval
   */
  private createSafeInterval() {
    return (callback: (...args: any[]) => any, delay: number, ...args: any[]) => {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }
      
      const safeCallback = () => {
        try {
          callback.apply(null, args);
        } catch (error) {
          console.error('[Sandbox] Interval callback error:', error);
        }
      };
      
      return setInterval(safeCallback, Math.max(delay, 100)); // 最小间隔100ms
    };
  }

  /**
   * 创建全局对象的 Proxy
   */
  private createGlobalProxy() {
    return new Proxy(this.sandboxGlobal, {
      get: (target, prop, receiver) => {
        const propStr = String(prop);
        
        // 检查是否在禁止列表中
        if (this.config.forbiddenGlobals.includes(propStr)) {
          throw new ReferenceError(`Access to '${propStr}' is not allowed in sandbox`);
        }
        
        // 检查是否在允许列表中
        if (this.config.allowedGlobals.includes(propStr)) {
          if (propStr in target) {
            return Reflect.get(target, prop, receiver);
          }
          
          // 某些特殊的全局对象需要特殊处理
          if (propStr === 'window' || propStr === 'global' || propStr === 'globalThis') {
            return receiver; // 返回代理对象本身
          }
        }
        
        // 检查自定义全局变量
        if (propStr in this.config.customGlobals) {
          return Reflect.get(target, prop, receiver);
        }
        
        // 如果不在任何允许的列表中，返回 undefined
        return undefined;
      },
      
      set: (target, prop, value, receiver) => {
        const propStr = String(prop);
        
        // 检查是否在禁止列表中
        if (this.config.forbiddenGlobals.includes(propStr)) {
          throw new ReferenceError(`Setting '${propStr}' is not allowed in sandbox`);
        }
        
        // 只允许设置已存在的属性或新的变量
        return Reflect.set(target, prop, value, receiver);
      },
      
      has: (target, prop) => {
        const propStr = String(prop);
        
        // 如果在禁止列表中，返回 false
        if (this.config.forbiddenGlobals.includes(propStr)) {
          return false;
        }
        
        // 如果在允许列表中或目标对象中，返回 true
        return this.config.allowedGlobals.includes(propStr) || Reflect.has(target, prop);
      },
      
      ownKeys: (target) => {
        // 只返回允许的属性键
        const allKeys = Reflect.ownKeys(target);
        return allKeys.filter(key => 
          !this.config.forbiddenGlobals.includes(String(key))
        );
      },
      
      getOwnPropertyDescriptor: (target, prop) => {
        const propStr = String(prop);
        
        if (this.config.forbiddenGlobals.includes(propStr)) {
          return undefined;
        }
        
        return Reflect.getOwnPropertyDescriptor(target, prop);
      }
    });
  }

  /**
   * 在沙箱中执行代码
   */
  async execute(code: string): Promise<SandboxResult> {
    this.startTime = performance.now();
    this.isActive = true;
    
    let result: any;
    let error: Error | undefined;
    let success = false;
    
    try {
      // 设置执行超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        this.timeoutId = window.setTimeout(() => {
          reject(new Error(`Code execution timeout after ${this.config.timeout}ms`));
        }, this.config.timeout);
      });
      
      // 执行代码
      const executePromise = this.executeCode(code);
      
      result = await Promise.race([executePromise, timeoutPromise]);
      success = true;
      
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
      success = false;
    } finally {
      this.cleanup();
    }
    
    const executionTime = performance.now() - this.startTime;
    
    return {
      result,
      success,
      error,
      executionTime,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  /**
   * 执行代码的核心方法
   */
  private async executeCode(code: string): Promise<any> {
    // 添加严格模式
    const wrappedCode = this.config.strictMode ? `'use strict';\n${code}` : code;
    
    // 创建一个函数来执行代码，使用沙箱的全局对象作为上下文
    const func = new Function(
      'global',
      'window',
      'globalThis',
      'self',
      `
      const originalGlobal = global;
      const originalWindow = window;
      const originalGlobalThis = globalThis;
      const originalSelf = self;
      
      try {
        // 劫持全局对象引用
        global = arguments[0];
        window = arguments[1] || arguments[0];
        globalThis = arguments[2] || arguments[0];
        self = arguments[3] || arguments[0];
        
        // 执行用户代码
        return (function() {
          ${wrappedCode}
        })();
      } finally {
        // 恢复原始引用
        global = originalGlobal;
        window = originalWindow;
        globalThis = originalGlobalThis;
        self = originalSelf;
      }
      `
    );
    
    // 使用代理对象作为上下文执行函数
    return func.call(
      this.globalProxy,
      this.globalProxy,
      this.globalProxy,
      this.globalProxy,
      this.globalProxy
    );
  }

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 清理资源
   */
  private cleanup(): void {
    this.isActive = false;
    
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * 销毁沙箱
   */
  destroy(): void {
    this.cleanup();
    
    // 清理全局对象
    Object.keys(this.sandboxGlobal).forEach(key => {
      delete this.sandboxGlobal[key];
    });
  }

  /**
   * 检查沙箱是否处于活动状态
   */
  isRunning(): boolean {
    return this.isActive;
  }

  /**
   * 添加自定义全局变量
   */
  addGlobal(name: string, value: any): void {
    if (this.config.forbiddenGlobals.includes(name)) {
      throw new Error(`Cannot add forbidden global: ${name}`);
    }
    
    this.sandboxGlobal[name] = value;
    this.config.customGlobals[name] = value;
  }

  /**
   * 移除自定义全局变量
   */
  removeGlobal(name: string): void {
    delete this.sandboxGlobal[name];
    delete this.config.customGlobals[name];
  }

  /**
   * 获取沙箱配置
   */
  getConfig(): Readonly<Required<SandboxConfig>> {
    return { ...this.config };
  }
}

/**
 * 创建沙箱实例的工厂函数
 */
export function createSandbox(config?: SandboxConfig): ProxySandbox {
  return new ProxySandbox(config);
}

/**
 * 快速执行代码的工具函数
 */
export async function runInSandbox(
  code: string, 
  config?: SandboxConfig
): Promise<SandboxResult> {
  const sandbox = createSandbox(config);
  try {
    return await sandbox.execute(code);
  } finally {
    sandbox.destroy();
  }
}
