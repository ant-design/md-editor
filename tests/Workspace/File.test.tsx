import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { File } from '../../src/Workspace/File';
import type { FileNode, GroupNode } from '../../src/Workspace/types';

const imageFile: FileNode = {
  name: '图片.png',
  type: 'image',
  url: 'https://example.com/image.png',
};

const textFile: FileNode = {
  name: '说明.md',
  type: 'markdown',
  content: '# Hello',
};

describe('Workspace File 组件', () => {
  it('分组展开/收起与组下载回调', () => {
    const onToggleGroup = vi.fn();
    const onGroupDownload = vi.fn();

    const group: GroupNode = {
      name: '图片组',
      type: 'image',
      children: [imageFile],
      collapsed: true,
    };

    render(
      <File
        nodes={[group]}
        onGroupDownload={onGroupDownload}
        onToggleGroup={onToggleGroup}
      />,
    );

    // 展开分组
    const header = screen.getByLabelText('展开图片组分组');
    fireEvent.click(header);
    expect(onToggleGroup).toHaveBeenCalledWith('image', false);

    // 点击组下载按钮
    const downloadBtn = screen.getByLabelText('下载图片组文件');
    fireEvent.click(downloadBtn);
    expect(onGroupDownload).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: imageFile.name,
          type: imageFile.type,
          url: imageFile.url,
        }),
      ]),
      'image',
    );
  });

  it('单文件点击与下载回调', () => {
    const onFileClick = vi.fn();
    const onDownload = vi.fn();

    render(
      <File
        nodes={[textFile]}
        onFileClick={onFileClick}
        onDownload={onDownload}
      />,
    );

    // 点击文件项
    const fileItem = screen.getByLabelText('文件：说明.md');
    fireEvent.click(fileItem);
    expect(onFileClick).toHaveBeenCalledWith(
      expect.objectContaining({
        name: textFile.name,
        type: textFile.type,
        content: textFile.content,
      }),
    );

    // 点击下载按钮（存在 onDownload 时，直接调用回调）
    const downloadBtn = within(fileItem).getByLabelText('下载');
    fireEvent.click(downloadBtn);
    expect(onDownload).toHaveBeenCalledWith(
      expect.objectContaining({
        name: textFile.name,
        type: textFile.type,
        content: textFile.content,
      }),
    );
  });

  it('图片文件预览与文本文件预览，以及 onPreview 自定义覆盖', async () => {
    const onPreview = vi.fn(async (file: FileNode) => file);

    // 分别测试图片文件
    const { unmount } = render(
      <File nodes={[imageFile]} onPreview={onPreview} />,
    );

    // 对图片：有预览按钮
    const imgPreviewBtn = screen.getByLabelText('预览');
    fireEvent.click(imgPreviewBtn);
    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({
        name: imageFile.name,
        type: imageFile.type,
        url: imageFile.url,
      }),
    );

    unmount();

    // 重置 mock 函数调用次数
    onPreview.mockClear();

    // 分别测试文本文件
    render(<File nodes={[textFile]} onPreview={onPreview} />);

    // 对文本：有预览按钮
    const txtPreviewBtn = screen.getByLabelText('预览');
    fireEvent.click(txtPreviewBtn);
    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({
        name: textFile.name,
        type: textFile.type,
        content: textFile.content,
      }),
    );
  });

  it('键盘导航可访问性', () => {
    const onFileClick = vi.fn();
    const onPreview = vi.fn();

    render(
      <File
        nodes={[textFile]}
        onFileClick={onFileClick}
        onPreview={onPreview}
      />,
    );

    // 测试文件项的键盘导航
    const fileItem = screen.getByLabelText('文件：说明.md');
    fireEvent.keyDown(fileItem, { key: 'Enter' });
    expect(onFileClick).toHaveBeenCalledWith(
      expect.objectContaining({
        name: textFile.name,
        type: textFile.type,
        content: textFile.content,
      }),
    );

    // 测试预览按钮（使用点击事件以匹配实现）
    const previewBtn = within(fileItem).getByLabelText('预览');
    fireEvent.click(previewBtn);
    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({
        name: textFile.name,
        type: textFile.type,
        content: textFile.content,
      }),
    );

    // 测试空格键（不触发额外预览）
    fireEvent.keyDown(previewBtn, { key: ' ' });
    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});
