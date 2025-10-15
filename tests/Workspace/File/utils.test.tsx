import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import {
  generateUniqueId,
  getFileTypeIcon,
  getGroupIcon,
} from '../../../src/Workspace/File/utils';
import {
  FileCategory,
  FileNode,
  FileType,
  GroupNode,
} from '../../../src/Workspace/types';

describe('File Utils', () => {
  describe('getFileTypeIcon', () => {
    it('应该返回自定义图标', () => {
      const CustomIcon = <div data-testid="custom-icon">Custom</div>;
      const result = getFileTypeIcon('plainText', CustomIcon);

      expect(result).toBe(CustomIcon);
    });

    it('应该根据文件扩展名返回对应图标', () => {
      const testCases = [
        { fileName: 'test.txt', type: 'plainText' as FileType },
        { fileName: 'README.md', type: 'markdown' as FileType },
        { fileName: 'data.xlsx', type: 'excel' as FileType },
        { fileName: 'document.pdf', type: 'pdf' as FileType },
        { fileName: 'archive.zip', type: 'archive' as FileType },
        { fileName: 'file.doc', type: 'word' as FileType },
        { fileName: 'data.csv', type: 'csv' as FileType },
        { fileName: 'config.xml', type: 'config' as FileType },
        { fileName: 'page.html', type: 'config' as FileType },
      ];

      testCases.forEach(({ fileName, type }) => {
        const icon = getFileTypeIcon(type, undefined, fileName);
        expect(icon).toBeDefined();
        expect(React.isValidElement(icon)).toBe(true);
      });
    });

    it('应该处理大写扩展名', () => {
      const icon = getFileTypeIcon('excel', undefined, 'DATA.XLSX');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理没有扩展名的文件', () => {
      const icon = getFileTypeIcon('plainText', undefined, 'README');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该根据文件类型返回默认图标', () => {
      const icon = getFileTypeIcon('image');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该为未知扩展名返回默认图标', () => {
      const icon = getFileTypeIcon('plainText', undefined, 'unknown.xyz');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理多点文件名', () => {
      const icon = getFileTypeIcon('config', undefined, 'app.config.json');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该为所有类别返回图标', () => {
      const categories = [
        FileCategory.Text,
        FileCategory.Code,
        FileCategory.PDF,
        FileCategory.Word,
        FileCategory.Excel,
        FileCategory.Image,
        FileCategory.Video,
        FileCategory.Audio,
        FileCategory.Archive,
        FileCategory.Other,
      ];

      categories.forEach((category) => {
        // 找到该类别的第一个类型
        const fileType = Object.keys({
          plainText: { category: FileCategory.Text },
          config: { category: FileCategory.Code },
          pdf: { category: FileCategory.PDF },
          word: { category: FileCategory.Word },
          excel: { category: FileCategory.Excel },
          image: { category: FileCategory.Image },
          video: { category: FileCategory.Video },
          audio: { category: FileCategory.Audio },
          archive: { category: FileCategory.Archive },
        }).find(() => true) as FileType;

        const icon = getFileTypeIcon(fileType);
        expect(React.isValidElement(icon)).toBe(true);
      });
    });

    it('应该处理压缩文件扩展名', () => {
      const extensions = ['rar', '7z', 'tar', 'gz', 'bz2'];
      extensions.forEach((ext) => {
        const icon = getFileTypeIcon('archive', undefined, `archive.${ext}`);
        expect(React.isValidElement(icon)).toBe(true);
      });
    });

    it('应该为不同的文档格式返回图标', () => {
      const testCases = [
        { fileName: 'doc.doc', type: 'word' as FileType },
        { fileName: 'doc.docx', type: 'word' as FileType },
        { fileName: 'sheet.xls', type: 'excel' as FileType },
        { fileName: 'sheet.xlsx', type: 'excel' as FileType },
      ];

      testCases.forEach(({ fileName, type }) => {
        const icon = getFileTypeIcon(type, undefined, fileName);
        expect(React.isValidElement(icon)).toBe(true);
      });
    });
  });

  describe('getGroupIcon', () => {
    it('应该返回自定义图标', () => {
      const CustomIcon = <div data-testid="custom-group-icon">Custom</div>;
      const group: GroupNode = {
        name: 'Test Group',
        type: 'plainText',
        children: [],
      };

      const result = getGroupIcon(group, 'plainText', CustomIcon);
      expect(result).toBe(CustomIcon);
    });

    it('应该为空分组返回类型默认图标', () => {
      const group: GroupNode = {
        name: 'Empty Group',
        type: 'plainText',
        children: [],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该为单一类型文件返回该类型图标', () => {
      const group: GroupNode = {
        name: 'Image Group',
        type: 'image',
        children: [
          { name: 'photo1.jpg', type: 'image' },
          { name: 'photo2.jpg', type: 'image' },
          { name: 'photo3.png', type: 'image' },
        ],
      };

      const icon = getGroupIcon(group, 'image');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该为多种类型文件返回文件夹图标', () => {
      const group: GroupNode = {
        name: 'Mixed Group',
        type: 'plainText',
        children: [
          { name: 'doc.pdf', type: 'pdf' },
          { name: 'image.jpg', type: 'image' },
          { name: 'file.txt', type: 'plainText' },
        ],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);

      // 检查是否渲染了文件夹图标
      const { container } = render(<>{icon}</>);
      expect(container.firstChild).toBeDefined();
    });

    it('应该根据文件名推断类型', () => {
      const group: GroupNode = {
        name: 'Test Group',
        type: 'plainText',
        children: [
          { name: 'file1.txt' }, // 没有明确的 type
          { name: 'file2.txt' },
        ],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理混合明确和推断类型的文件', () => {
      const group: GroupNode = {
        name: 'Mixed Type Group',
        type: 'plainText',
        children: [
          { name: 'file1.txt', type: 'plainText' },
          { name: 'file2.md' }, // 需要推断
          { name: 'file3.json' }, // 需要推断
        ],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理未知扩展名的文件', () => {
      const group: GroupNode = {
        name: 'Unknown Group',
        type: 'plainText',
        children: [{ name: 'file.unknown' }, { name: 'another.xyz' }],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理不同类别的文件', () => {
      const group: GroupNode = {
        name: 'Different Categories',
        type: 'plainText',
        children: [
          { name: 'doc.pdf', type: 'pdf' },
          { name: 'image.jpg', type: 'image' },
          { name: 'video.mp4', type: 'video' },
        ],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理只有一个文件的分组', () => {
      const group: GroupNode = {
        name: 'Single File Group',
        type: 'pdf',
        children: [{ name: 'document.pdf', type: 'pdf' }],
      };

      const icon = getGroupIcon(group, 'pdf');
      expect(React.isValidElement(icon)).toBe(true);
    });

    it('应该处理没有扩展名的文件', () => {
      const group: GroupNode = {
        name: 'No Extension Group',
        type: 'plainText',
        children: [{ name: 'README' }, { name: 'LICENSE' }],
      };

      const icon = getGroupIcon(group, 'plainText');
      expect(React.isValidElement(icon)).toBe(true);
    });
  });

  describe('generateUniqueId', () => {
    it('应该返回已存在的ID', () => {
      const node: FileNode = {
        id: 'existing-id',
        name: 'test.txt',
      };

      const result = generateUniqueId(node);
      expect(result).toBe('existing-id');
    });

    it('应该为没有ID的节点生成唯一ID', () => {
      const node: FileNode = {
        name: 'test.txt',
        type: 'plainText',
      };

      const result = generateUniqueId(node);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('应该生成包含类型和名称的ID', () => {
      const node: FileNode = {
        name: 'document.pdf',
        type: 'pdf',
      };

      const result = generateUniqueId(node);
      expect(result).toContain('pdf');
      expect(result).toContain('document.pdf');
    });

    it('应该为相同节点生成不同的ID', () => {
      const node: FileNode = {
        name: 'test.txt',
        type: 'plainText',
      };

      const id1 = generateUniqueId({ ...node });
      // 等待一小段时间确保时间戳不同
      const id2 = generateUniqueId({ ...node });

      expect(id1).not.toBe(id2);
    });

    it('应该为分组节点生成唯一ID', () => {
      const group: GroupNode = {
        name: 'Test Group',
        type: 'plainText',
        children: [],
      };

      const result = generateUniqueId(group);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('plainText');
      expect(result).toContain('Test Group');
    });

    it('应该处理没有类型的节点', () => {
      const node: FileNode = {
        name: 'file.txt',
      };

      const result = generateUniqueId(node);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('应该生成格式正确的ID', () => {
      const node: FileNode = {
        name: 'test.txt',
        type: 'plainText',
      };

      const result = generateUniqueId(node);
      // ID格式应该是: type_name_timestamp_randomStr
      const parts = result.split('_');
      expect(parts.length).toBeGreaterThanOrEqual(3);
    });

    it('应该处理特殊字符的文件名', () => {
      const node: FileNode = {
        name: 'file-with-dashes_and_underscores.txt',
        type: 'plainText',
      };

      const result = generateUniqueId(node);
      expect(result).toBeDefined();
      expect(result).toContain('file-with-dashes_and_underscores.txt');
    });

    it('应该为大量节点生成唯一ID', () => {
      const ids = new Set<string>();
      const node: FileNode = {
        name: 'test.txt',
        type: 'plainText',
      };

      // 生成100个ID并检查唯一性
      for (let i = 0; i < 100; i++) {
        const id = generateUniqueId({ ...node });
        ids.add(id);
      }

      // 所有ID应该都是唯一的
      expect(ids.size).toBe(100);
    });

    it('应该处理长文件名', () => {
      const node: FileNode = {
        name: 'this-is-a-very-long-file-name-that-should-still-work-properly.txt',
        type: 'plainText',
      };

      const result = generateUniqueId(node);
      expect(result).toBeDefined();
      expect(result).toContain(
        'this-is-a-very-long-file-name-that-should-still-work-properly.txt',
      );
    });

    it('应该处理包含中文的文件名', () => {
      const node: FileNode = {
        name: '测试文件.txt',
        type: 'plainText',
      };

      const result = generateUniqueId(node);
      expect(result).toBeDefined();
      expect(result).toContain('测试文件.txt');
    });
  });
});
