/**
 * 性能监控工具
 * 用于监控粘贴操作的性能表现
 */

interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  contentSize: number;
  contentType: 'text' | 'html' | 'files' | 'mixed';
  operationType: 'parse' | 'upload' | 'insert' | 'total';
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * 开始监控
   */
  startMonitoring(
    operationId: string,
    contentType: PerformanceMetrics['contentType'],
    contentSize: number,
  ): void {
    if (!this.isEnabled) return;

    this.metrics.set(operationId, {
      startTime: performance.now(),
      contentSize,
      contentType,
      operationType: 'total',
    });

    console.log(`🚀 开始粘贴操作 [${operationId}]:`, {
      contentType,
      contentSize: this.formatSize(contentSize),
    });
  }

  /**
   * 记录子操作开始
   */
  startSubOperation(
    operationId: string,
    subOperation: PerformanceMetrics['operationType'],
  ): void {
    if (!this.isEnabled) return;

    const metric = this.metrics.get(operationId);
    if (metric) {
      this.metrics.set(`${operationId}-${subOperation}`, {
        startTime: performance.now(),
        contentSize: metric.contentSize,
        contentType: metric.contentType,
        operationType: subOperation,
      });
    }
  }

  /**
   * 记录子操作结束
   */
  endSubOperation(
    operationId: string,
    subOperation: PerformanceMetrics['operationType'],
  ): void {
    if (!this.isEnabled) return;

    const subMetricId = `${operationId}-${subOperation}`;
    const metric = this.metrics.get(subMetricId);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;

      console.log(
        `✅ ${this.getOperationName(subOperation)} 完成 [${operationId}]:`,
        {
          duration: `${metric.duration.toFixed(2)}ms`,
          contentSize: this.formatSize(metric.contentSize),
        },
      );
    }
  }

  /**
   * 结束监控
   */
  endMonitoring(operationId: string): void {
    if (!this.isEnabled) return;

    const metric = this.metrics.get(operationId);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;

      console.log(`🎉 粘贴操作完成 [${operationId}]:`, {
        totalDuration: `${metric.duration.toFixed(2)}ms`,
        contentType: metric.contentType,
        contentSize: this.formatSize(metric.contentSize),
        performance: this.getPerformanceRating(
          metric.duration,
          metric.contentSize,
        ),
      });

      // 清理内存
      this.metrics.delete(operationId);
    }
  }

  /**
   * 获取性能评级
   */
  private getPerformanceRating(duration: number, contentSize: number): string {
    const sizeInKB = contentSize / 1024;
    const durationPerKB = duration / sizeInKB;

    if (durationPerKB < 10) return '🚀 优秀';
    if (durationPerKB < 50) return '✅ 良好';
    if (durationPerKB < 100) return '⚠️ 一般';
    return '🐌 较慢';
  }

  /**
   * 格式化文件大小
   */
  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * 获取操作名称
   */
  private getOperationName(
    operationType: PerformanceMetrics['operationType'],
  ): string {
    const names = {
      parse: '内容解析',
      upload: '文件上传',
      insert: '内容插入',
      total: '总操作',
    };
    return names[operationType];
  }

  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 获取性能报告
   */
  getReport(): { totalOperations: number; averageDuration: number } {
    const operations = Array.from(this.metrics.values()).filter(
      (m) => m.duration,
    );
    const totalOperations = operations.length;
    const averageDuration =
      operations.reduce((sum, m) => sum + (m.duration || 0), 0) /
      totalOperations;

    return {
      totalOperations,
      averageDuration,
    };
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

/**
 * 性能监控装饰器
 */
export const withPerformanceMonitoring = <T extends any[], R>(
  operationType: PerformanceMetrics['operationType'],
  fn: (...args: T) => Promise<R> | R,
) => {
  return async (...args: T): Promise<R> => {
    const operationId = `${operationType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    performanceMonitor.startSubOperation(operationId, operationType);

    try {
      const result = await fn(...args);
      performanceMonitor.endSubOperation(operationId, operationType);
      return result;
    } catch (error) {
      console.error(`❌ ${operationType} 操作失败:`, error);
      throw error;
    }
  };
};

/**
 * 生成操作ID
 */
export const generateOperationId = (): string => {
  return `paste-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
