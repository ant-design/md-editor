import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { AgenticLayout } from '../index';

describe('AgenticLayout', () => {
  it('renders with basic props', () => {
    render(
      <AgenticLayout center={<div>Center content</div>}>
        <div>Test content</div>
      </AgenticLayout>,
    );

    expect(screen.getByText('Center content')).toBeInTheDocument();
  });

  it('renders with header configuration', () => {
    render(
      <AgenticLayout
        center={<div>Center content</div>}
        header={{ title: 'Agentic Layout' }}
      >
        <div>Test content</div>
      </AgenticLayout>,
    );

    expect(screen.getByText('Agentic Layout')).toBeInTheDocument();
  });

  it('renders left and right sidebars', () => {
    render(
      <AgenticLayout
        left={<div>Left content</div>}
        center={<div>Center content</div>}
        right={<div>Right content</div>}
      >
        <div>Test content</div>
      </AgenticLayout>,
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Center content')).toBeInTheDocument();
    expect(screen.getByText('Right content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AgenticLayout
        center={<div>Center content</div>}
        className="custom-class"
      >
        <div>Test content</div>
      </AgenticLayout>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('ant-agentic-layout');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { container } = render(
      <AgenticLayout center={<div>Center content</div>} style={customStyle}>
        <div>Test content</div>
      </AgenticLayout>,
    );

    expect(container.firstChild).toHaveStyle(
      'background-color: rgb(0, 0, 255)',
    );
  });
});
