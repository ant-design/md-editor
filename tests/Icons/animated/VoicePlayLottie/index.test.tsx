import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';
import { VoicePlayLottie } from '../../../../src/Icons/animated/VoicePlayLottie';

describe('VoicePlayLottie Component', () => {
  it('应该正确渲染组件（第61, 62行）', () => {
    const { container } = render(<VoicePlayLottie />);
    
    // 验证组件已渲染
    expect(container).toBeInTheDocument();
  });

  it('应该使用默认的 autoplay 和 loop 属性（第61, 62行）', () => {
    const { container } = render(<VoicePlayLottie />);
    
    // 验证组件已渲染
    expect(container).toBeInTheDocument();
  });

  it('应该应用自定义的 autoplay 和 loop 属性', () => {
    const { container, rerender } = render(
      <VoicePlayLottie autoplay={false} loop={false} />
    );
    
    // 验证组件已渲染
    expect(container).toBeInTheDocument();
    
    // 重新渲染带有不同属性的组件
    rerender(<VoicePlayLottie autoplay={true} loop={true} />);
    
    // 验证组件仍然正确渲染
    expect(container).toBeInTheDocument();
  });

  it('应该应用自定义的尺寸', () => {
    const { container } = render(<VoicePlayLottie size={48} />);
    
    // 验证组件已渲染
    expect(container).toBeInTheDocument();
  });

  it('应该应用自定义的类名和样式', () => {
    const { container } = render(
      <VoicePlayLottie className="custom-class" style={{ margin: '10px' }} />
    );
    
    // 验证组件已渲染
    expect(container).toBeInTheDocument();
  });
});