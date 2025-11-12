import React from 'react';
import { render, screen } from '@testing-library/react';
import SkeletonList from '../../src/Bubble/List/SkeletonList';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('SkeletonList', () => {
  it('should render correctly', () => {
    render(<SkeletonList />);
    
    // 检查是否渲染了两个 Skeleton 组件
    const skeletonElements = screen.getAllByRole('list', { hidden: true });
    expect(skeletonElements).toHaveLength(2);
    
    // 检查第一个 Skeleton 组件的属性
    const firstSkeleton = skeletonElements[0];
    expect(firstSkeleton).toBeInTheDocument();
    
    // 检查第二个 Skeleton 组件的属性
    const secondSkeleton = skeletonElements[1];
    expect(secondSkeleton).toBeInTheDocument();
    
    // 检查旋转样式的应用
    const skeletonContainers = document.querySelectorAll('.ant-skeleton');
    expect(skeletonContainers).toHaveLength(2);
    expect(skeletonContainers[1]).toHaveStyle('transform: rotate(180deg)');
  });
});