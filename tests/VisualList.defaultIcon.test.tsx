import { render, screen } from '@testing-library/react';
import React from 'react';
import { VisualList, VisualListItem } from '../src/components/VisualList';

describe('VisualList 默认图标测试', () => {
  const mockData: VisualListItem[] = [
    {
      id: '1',
      src: 'invalid-url.jpg', // 故意使用无效URL来触发错误处理
      alt: '测试图片',
      title: '测试标题',
    },
    {
      id: '2',
      src: 'https://via.placeholder.com/100x100', // 有效URL
      alt: '有效图片',
      title: '有效标题',
    },
  ];

  it('应该显示默认浏览器图标当图片加载失败时', () => {
    render(<VisualList data={mockData} />);

    // 等待图片加载失败并显示默认图标
    setTimeout(() => {
      const defaultIcon = screen.getByTestId('browser-icon');
      expect(defaultIcon).toBeInTheDocument();
    }, 100);
  });

  it('应该正确渲染有效图片', () => {
    render(<VisualList data={[mockData[1]]} />);

    const image = screen.getByAltText('有效图片');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/100x100');
  });

  it('默认图标应该适应圆形形状', () => {
    render(<VisualList data={[mockData[0]]} shape="circle" />);

    setTimeout(() => {
      const defaultIconContainer = document.querySelector(
        '.visual-list-default-icon',
      );
      expect(defaultIconContainer).toHaveStyle('border-radius: 50%');
    }, 100);
  });
});
