import React from 'react';
import { describe, expect, it } from 'vitest';
import {
  BaseChildProps,
  CustomProps,
  FILE_TYPES,
  FileActionRef,
  FileCategory,
  FileNode,
  FileProps,
  FileType,
  getFileCategory,
  getFileType,
  getMimeType,
  GroupNode,
  TabConfiguration,
  TabItem,
  WorkspaceProps,
} from '../../src/Workspace/types';

describe('Workspace Types', () => {
  describe('FILE_TYPES 常量', () => {
    it('应该包含所有预期的文件类型', () => {
      const expectedTypes = [
        'plainText',
        'markdown',
        'image',
        'video',
        'audio',
        'pdf',
        'word',
        'excel',
        'csv',
        'archive',
        'javascript',
        'typescript',
        'react',
        'python',
        'java',
        'cpp',
        'c',
        'csharp',
        'go',
        'rust',
        'php',
        'ruby',
        'shell',
        'powershell',
        'sql',
        'lua',
        'perl',
        'scala',
        'config',
      ];

      expectedTypes.forEach((type) => {
        expect(FILE_TYPES).toHaveProperty(type);
      });
    });

    it('应该为每个文件类型提供正确的结构', () => {
      Object.entries(FILE_TYPES).forEach(([, definition]) => {
        expect(definition).toHaveProperty('category');
        expect(definition).toHaveProperty('extensions');
        expect(definition).toHaveProperty('mimeTypes');
        expect(definition).toHaveProperty('name');

        expect(Array.isArray(definition.extensions)).toBe(true);
        expect(Array.isArray(definition.mimeTypes)).toBe(true);
        expect(typeof definition.name).toBe('string');
        expect(definition.extensions.length).toBeGreaterThan(0);
        expect(definition.mimeTypes.length).toBeGreaterThan(0);
      });
    });

    it('应该为文本文件提供正确的配置', () => {
      expect(FILE_TYPES.plainText.category).toBe(FileCategory.Text);
      expect(FILE_TYPES.plainText.extensions).toContain('txt');
      expect(FILE_TYPES.plainText.mimeTypes).toContain('text/plain');
      expect(FILE_TYPES.plainText.name).toBe('文本文件');

      expect(FILE_TYPES.markdown.category).toBe(FileCategory.Text);
      expect(FILE_TYPES.markdown.extensions).toContain('md');
      expect(FILE_TYPES.markdown.extensions).toContain('markdown');
      expect(FILE_TYPES.markdown.mimeTypes).toContain('text/markdown');
      expect(FILE_TYPES.markdown.name).toBe('Markdown');
    });

    it('应该为图片文件提供正确的配置', () => {
      expect(FILE_TYPES.image.category).toBe(FileCategory.Image);
      expect(FILE_TYPES.image.extensions).toContain('jpg');
      expect(FILE_TYPES.image.extensions).toContain('png');
      expect(FILE_TYPES.image.extensions).toContain('gif');
      expect(FILE_TYPES.image.mimeTypes).toContain('image/jpeg');
      expect(FILE_TYPES.image.mimeTypes).toContain('image/png');
      expect(FILE_TYPES.image.name).toBe('图片');
    });

    it('应该为代码文件提供正确的配置', () => {
      expect(FILE_TYPES.javascript.category).toBe(FileCategory.Code);
      expect(FILE_TYPES.javascript.extensions).toContain('js');
      expect(FILE_TYPES.javascript.mimeTypes).toContain('text/javascript');
      expect(FILE_TYPES.javascript.name).toBe('JavaScript');

      expect(FILE_TYPES.typescript.category).toBe(FileCategory.Code);
      expect(FILE_TYPES.typescript.extensions).toContain('ts');
      expect(FILE_TYPES.typescript.mimeTypes).toContain('text/typescript');
      expect(FILE_TYPES.typescript.name).toBe('TypeScript');

      expect(FILE_TYPES.python.category).toBe(FileCategory.Code);
      expect(FILE_TYPES.python.extensions).toContain('py');
      expect(FILE_TYPES.python.mimeTypes).toContain('text/x-python');
      expect(FILE_TYPES.python.name).toBe('Python');
    });

    it('应该为文档文件提供正确的配置', () => {
      expect(FILE_TYPES.pdf.category).toBe(FileCategory.PDF);
      expect(FILE_TYPES.pdf.extensions).toContain('pdf');
      expect(FILE_TYPES.pdf.mimeTypes).toContain('application/pdf');
      expect(FILE_TYPES.pdf.name).toBe('PDF文档');

      expect(FILE_TYPES.word.category).toBe(FileCategory.Word);
      expect(FILE_TYPES.word.extensions).toContain('doc');
      expect(FILE_TYPES.word.extensions).toContain('docx');
      expect(FILE_TYPES.word.mimeTypes).toContain('application/msword');
      expect(FILE_TYPES.word.name).toBe('Word文档');

      expect(FILE_TYPES.excel.category).toBe(FileCategory.Excel);
      expect(FILE_TYPES.excel.extensions).toContain('xls');
      expect(FILE_TYPES.excel.extensions).toContain('xlsx');
      expect(FILE_TYPES.excel.mimeTypes).toContain('application/vnd.ms-excel');
      expect(FILE_TYPES.excel.name).toBe('Excel表格');
    });
  });

  describe('FileCategory 枚举', () => {
    it('应该包含所有预期的分类', () => {
      expect(FileCategory.Text).toBe('text');
      expect(FileCategory.Code).toBe('code');
      expect(FileCategory.Image).toBe('image');
      expect(FileCategory.Video).toBe('video');
      expect(FileCategory.Audio).toBe('audio');
      expect(FileCategory.PDF).toBe('pdf');
      expect(FileCategory.Word).toBe('word');
      expect(FileCategory.Excel).toBe('excel');
      expect(FileCategory.Archive).toBe('archive');
      expect(FileCategory.Other).toBe('other');
    });
  });

  describe('getFileType 函数', () => {
    it('应该根据文件扩展名返回正确的文件类型', () => {
      expect(getFileType('test.txt')).toBe('plainText');
      expect(getFileType('README.md')).toBe('markdown');
      expect(getFileType('image.jpg')).toBe('image');
      expect(getFileType('script.js')).toBe('javascript');
      expect(getFileType('component.tsx')).toBe('react');
      expect(getFileType('app.py')).toBe('python');
      expect(getFileType('document.pdf')).toBe('pdf');
      expect(getFileType('data.xlsx')).toBe('excel');
    });

    it('应该处理大小写不敏感的文件名', () => {
      expect(getFileType('TEST.TXT')).toBe('plainText');
      expect(getFileType('Image.JPG')).toBe('image');
      expect(getFileType('Script.JS')).toBe('javascript');
    });

    it('应该处理没有扩展名的文件', () => {
      expect(getFileType('README')).toBe('plainText');
      expect(getFileType('Makefile')).toBe('plainText');
    });

    it('应该处理空文件名', () => {
      expect(getFileType('')).toBe('plainText');
    });

    it('应该处理多个点的文件名', () => {
      expect(getFileType('app.min.js')).toBe('javascript');
      expect(getFileType('style.min.css')).toBe('plainText'); // CSS 不在 FILE_TYPES 中
    });

    it('应该处理未知扩展名', () => {
      expect(getFileType('unknown.xyz')).toBe('plainText');
    });
  });

  describe('getMimeType 函数', () => {
    it('应该返回正确的 MIME 类型', () => {
      expect(getMimeType('plainText')).toBe('text/plain');
      expect(getMimeType('markdown')).toBe('text/markdown');
      expect(getMimeType('javascript')).toBe('text/javascript');
      expect(getMimeType('image')).toBe('image/jpeg');
      expect(getMimeType('pdf')).toBe('application/pdf');
    });

    it('应该处理不存在的文件类型', () => {
      expect(() => getMimeType('nonexistent' as FileType)).toThrow();
    });
  });

  describe('getFileCategory 函数', () => {
    it('应该返回正确的文件分类', () => {
      expect(getFileCategory('plainText')).toBe(FileCategory.Text);
      expect(getFileCategory('markdown')).toBe(FileCategory.Text);
      expect(getFileCategory('javascript')).toBe(FileCategory.Code);
      expect(getFileCategory('image')).toBe(FileCategory.Image);
      expect(getFileCategory('pdf')).toBe(FileCategory.PDF);
      expect(getFileCategory('word')).toBe(FileCategory.Word);
      expect(getFileCategory('excel')).toBe(FileCategory.Excel);
    });

    it('应该处理不存在的文件类型', () => {
      expect(() => getFileCategory('nonexistent' as FileType)).toThrow();
    });
  });

  describe('类型定义验证', () => {
    it('应该正确验证 TabConfiguration 类型', () => {
      const tabConfig: TabConfiguration = {
        key: 'test-tab',
        icon: <div>Icon</div>,
        title: 'Test Tab',
        count: 5,
      };

      expect(tabConfig.key).toBe('test-tab');
      expect(tabConfig.title).toBe('Test Tab');
      expect(tabConfig.count).toBe(5);
    });

    it('应该正确验证 TabItem 类型', () => {
      const tabItem: TabItem = {
        key: 'test-item',
        label: 'Test Item',
        title: 'Test Title',
        icon: <div>Icon</div>,
        content: <div>Content</div>,
      };

      expect(tabItem.key).toBe('test-item');
      expect(tabItem.label).toBe('Test Item');
      expect(tabItem.title).toBe('Test Title');
    });

    it('应该正确验证 WorkspaceProps 类型', () => {
      const workspaceProps: WorkspaceProps = {
        activeTabKey: 'tab1',
        onTabChange: (key: string) => console.log(key),
        style: { width: '100%' },
        className: 'workspace',
        title: 'Workspace',
        onClose: () => console.log('close'),
        children: <div>Children</div>,
      };

      expect(workspaceProps.activeTabKey).toBe('tab1');
      expect(workspaceProps.className).toBe('workspace');
      expect(workspaceProps.title).toBe('Workspace');
    });

    it('应该正确验证 BaseChildProps 类型', () => {
      const baseChildProps: BaseChildProps = {
        tab: {
          key: 'child-tab',
          title: 'Child Tab',
        },
      };

      expect(baseChildProps.tab?.key).toBe('child-tab');
      expect(baseChildProps.tab?.title).toBe('Child Tab');
    });

    it('应该正确验证 FileNode 类型', () => {
      const fileNode: FileNode = {
        id: 'file-1',
        name: 'test.txt',
        type: 'plainText',
        size: 1024,
        lastModified: new Date(),
        url: 'https://example.com/file.txt',
        canPreview: true,
        canDownload: true,
        canShare: false,
      };

      expect(fileNode.id).toBe('file-1');
      expect(fileNode.name).toBe('test.txt');
      expect(fileNode.type).toBe('plainText');
      expect(fileNode.size).toBe(1024);
      expect(fileNode.canPreview).toBe(true);
      expect(fileNode.canDownload).toBe(true);
      expect(fileNode.canShare).toBe(false);
    });

    it('应该正确验证 GroupNode 类型', () => {
      const groupNode: GroupNode = {
        id: 'group-1',
        name: 'Documents',
        type: 'pdf',
        collapsed: false,
        children: [
          {
            id: 'file-1',
            name: 'doc1.pdf',
            type: 'pdf',
          },
          {
            id: 'file-2',
            name: 'doc2.pdf',
            type: 'pdf',
          },
        ],
      };

      expect(groupNode.id).toBe('group-1');
      expect(groupNode.name).toBe('Documents');
      expect(groupNode.type).toBe('pdf');
      expect(groupNode.collapsed).toBe(false);
      expect(groupNode.children).toHaveLength(2);
    });

    it('应该正确验证 FileActionRef 类型', () => {
      const fileActionRef: FileActionRef = {
        openPreview: (file: FileNode) => console.log('open preview', file),
        backToList: () => console.log('back to list'),
        updatePreviewHeader: (partial: Partial<FileNode>) =>
          console.log('update header', partial),
      };

      expect(typeof fileActionRef.openPreview).toBe('function');
      expect(typeof fileActionRef.backToList).toBe('function');
      expect(typeof fileActionRef.updatePreviewHeader).toBe('function');
    });

    it('应该正确验证 FileProps 类型', () => {
      const fileProps: FileProps = {
        tab: { key: 'files', title: 'Files' },
        nodes: [
          {
            id: 'file-1',
            name: 'test.txt',
            type: 'plainText',
          },
        ],
        onDownload: (file: FileNode) => console.log('download', file),
        onFileClick: (file: FileNode) => console.log('click', file),
        onToggleGroup: (type: FileType, collapsed: boolean) =>
          console.log('toggle', type, collapsed),
        onPreview: () => Promise.resolve(<div>Preview</div>),
        onBack: () => Promise.resolve(true),
        onShare: (file: FileNode, ctx) => console.log('share', file, ctx),
        markdownEditorProps: { theme: 'dark' },
        actionRef: { current: null },
        loading: false,
        loadingRender: () => <div>Loading...</div>,
        emptyRender: <div>No files</div>,
        keyword: 'search',
        onChange: (keyword: string) => console.log('search', keyword),
        showSearch: true,
        searchPlaceholder: 'Search files...',
      };

      expect(fileProps.nodes).toHaveLength(1);
      expect(fileProps.loading).toBe(false);
      expect(fileProps.showSearch).toBe(true);
      expect(fileProps.searchPlaceholder).toBe('Search files...');
    });

    it('应该正确验证 CustomProps 类型', () => {
      const customProps: CustomProps = {
        tab: { key: 'custom', title: 'Custom' },
        children: <div>Custom Content</div>,
      };

      expect(customProps.tab?.key).toBe('custom');
      expect(customProps.tab?.title).toBe('Custom');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空字符串文件名', () => {
      expect(getFileType('')).toBe('plainText');
    });

    it('应该处理只有点的文件名', () => {
      expect(getFileType('.')).toBe('plainText');
    });

    it('应该处理多个连续点的文件名', () => {
      expect(getFileType('file...txt')).toBe('plainText');
    });

    it('应该处理很长的扩展名', () => {
      expect(getFileType('file.verylongextension')).toBe('plainText');
    });

    it('应该处理特殊字符的文件名', () => {
      expect(getFileType('file with spaces.txt')).toBe('plainText');
      expect(getFileType('file-with-dashes.txt')).toBe('plainText');
      expect(getFileType('file_with_underscores.txt')).toBe('plainText');
    });
  });

  describe('性能测试', () => {
    it('应该快速处理大量文件类型查询', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        getFileType(`file${i}.txt`);
        getFileType(`script${i}.js`);
        getFileType(`image${i}.jpg`);
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('应该快速处理 MIME 类型查询', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        getMimeType('plainText');
        getMimeType('javascript');
        getMimeType('image');
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('集成测试', () => {
    it('应该正确处理完整的文件类型检测流程', () => {
      const filename = 'document.pdf';
      const fileType = getFileType(filename);
      const category = getFileCategory(fileType);
      const mimeType = getMimeType(fileType);

      expect(fileType).toBe('pdf');
      expect(category).toBe(FileCategory.PDF);
      expect(mimeType).toBe('application/pdf');
    });

    it('应该正确处理代码文件的完整流程', () => {
      const filename = 'component.tsx';
      const fileType = getFileType(filename);
      const category = getFileCategory(fileType);
      const mimeType = getMimeType(fileType);

      expect(fileType).toBe('react');
      expect(category).toBe(FileCategory.Code);
      expect(mimeType).toBe('text/jsx');
    });
  });
});
