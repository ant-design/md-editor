import { FILE_TYPES, FileCategory, FileNode } from '../types';

/**
 * 文件数据源枚举
 */
export enum DataSourceType {
  URL = 'url', // 远程URL
  CONTENT = 'content', // 文本内容
  FILE = 'file', // 原生File/Blob对象
}

/**
 * 预览能力枚举
 */
export enum PreviewCapability {
  FULL = 'full', // 完全支持预览
  BASIC = 'basic', // 基础预览（如图片）
  NONE = 'none', // 不支持预览
}

/**
 * 数据源处理结果
 */
export interface DataSourceResult {
  /** 数据源类型 */
  sourceType: DataSourceType;
  /** 预览能力 */
  previewCapability: PreviewCapability;
  /** 预览用的资源URL */
  previewUrl?: string;
  /** 内容数据 */
  content?: string;
  /** MIME类型 */
  mimeType?: string;
  /** 是否需要清理资源 */
  needsCleanup: boolean;
}

/**
 * 数据源策略抽象接口
 */
export interface DataSourceStrategy {
  /** 检查是否可以处理该文件 */
  canHandle(file: FileNode): boolean;
  /** 处理文件数据并返回结果 */
  process(file: FileNode): DataSourceResult;
}

/**
 * URL数据源策略
 */
export class UrlDataSourceStrategy implements DataSourceStrategy {
  canHandle(file: FileNode): boolean {
    return Boolean(file.url);
  }

  process(file: FileNode): DataSourceResult {
    if (!file.url) {
      throw new Error('URL not provided');
    }

    const fileCategory = this.getFileCategory(file);

    return {
      sourceType: DataSourceType.URL,
      previewCapability: this.getPreviewCapability(fileCategory),
      previewUrl: file.url,
      mimeType: this.inferMimeType(file),
      needsCleanup: false,
    };
  }

  private getFileCategory(file: FileNode): FileCategory {
    const extension = file.url?.split('.').pop()?.toLowerCase();
    if (!extension) return FileCategory.Other;

    // 根据扩展名判断分类
    for (const [, definition] of Object.entries(FILE_TYPES)) {
      if (definition.extensions.includes(extension)) {
        return definition.category;
      }
    }

    return FileCategory.Other;
  }

  private getPreviewCapability(category: FileCategory): PreviewCapability {
    switch (category) {
      case FileCategory.Image:
        return PreviewCapability.BASIC;
      default:
        return PreviewCapability.NONE;
    }
  }

  private inferMimeType(file: FileNode): string {
    // 基于URL后缀推断MIME类型
    const extension = file.url?.split('.').pop()?.toLowerCase();
    if (!extension) return 'application/octet-stream';

    // 使用文件类型定义中的MIME类型
    for (const [, definition] of Object.entries(FILE_TYPES)) {
      if (definition.extensions.includes(extension)) {
        return definition.mimeTypes[0];
      }
    }

    return 'application/octet-stream';
  }
}

/**
 * 内容数据源策略
 */
export class ContentDataSourceStrategy implements DataSourceStrategy {
  canHandle(file: FileNode): boolean {
    return Boolean(file.content);
  }

  process(file: FileNode): DataSourceResult {
    if (!file.content) {
      throw new Error('Content not provided');
    }

    // 为文本内容创建Blob URL（仅在浏览器环境中）
    let previewUrl: string | undefined;
    if (typeof URL !== 'undefined' && URL.createObjectURL) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      previewUrl = URL.createObjectURL(blob);
    }

    return {
      sourceType: DataSourceType.CONTENT,
      previewCapability: PreviewCapability.FULL,
      previewUrl,
      content: file.content,
      mimeType: 'text/plain',
      needsCleanup: Boolean(previewUrl),
    };
  }
}

/**
 * File对象数据源策略
 */
export class FileDataSourceStrategy implements DataSourceStrategy {
  canHandle(file: FileNode): boolean {
    return Boolean(file.file);
  }

  process(file: FileNode): DataSourceResult {
    if (!file.file) {
      throw new Error('File object not provided');
    }

    // 为File对象创建URL（仅在浏览器环境中）
    let previewUrl: string | undefined;
    if (typeof URL !== 'undefined' && URL.createObjectURL) {
      previewUrl = URL.createObjectURL(file.file);
    }

    const fileCategory = this.getCategoryFromMimeType(file.file.type);

    return {
      sourceType: DataSourceType.FILE,
      previewCapability: this.getPreviewCapability(fileCategory),
      previewUrl,
      mimeType: file.file.type,
      needsCleanup: Boolean(previewUrl),
    };
  }

  private getCategoryFromMimeType(mimeType: string): FileCategory {
    if (mimeType.startsWith('image/')) return FileCategory.Image;
    if (mimeType.startsWith('video/')) return FileCategory.Video;
    if (mimeType.startsWith('text/')) return FileCategory.Text;
    if (mimeType === 'application/pdf') return FileCategory.PDF;
    return FileCategory.Other;
  }

  private getPreviewCapability(category: FileCategory): PreviewCapability {
    switch (category) {
      case FileCategory.Text:
      case FileCategory.Image:
      case FileCategory.Video:
      case FileCategory.PDF:
        return PreviewCapability.FULL;
      default:
        return PreviewCapability.NONE;
    }
  }
}

/**
 * 数据源管理器
 */
export class DataSourceManager {
  private strategies: DataSourceStrategy[] = [
    new ContentDataSourceStrategy(),
    new FileDataSourceStrategy(),
    new UrlDataSourceStrategy(),
  ];

  /**
   * 处理文件数据源
   */
  processFile(file: FileNode): DataSourceResult {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(file)) {
        return strategy.process(file);
      }
    }

    // 默认处理
    return {
      sourceType: DataSourceType.URL,
      previewCapability: PreviewCapability.NONE,
      needsCleanup: false,
    };
  }

    /**
   * 清理资源
   */
  cleanupResult(result: DataSourceResult): void {
    if (!result.needsCleanup || !result.previewUrl?.startsWith('blob:')) return;
    
    // 直接清理 Blob URL，不需要找到具体的策略（仅在浏览器环境中）
    if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
      URL.revokeObjectURL(result.previewUrl);
    }
  }

  /**
   * 注册新的数据源策略
   */
  registerStrategy(strategy: DataSourceStrategy): void {
    this.strategies.unshift(strategy); // 新策略优先级更高
  }
}

/**
 * 全局数据源管理器实例
 */
export const dataSourceManager = new DataSourceManager();
