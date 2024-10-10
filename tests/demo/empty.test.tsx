import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyComponent from '../../src/MarkdownEditor/demos/empty';

describe('EmptyComponent', () => {
  it('renders the MarkdownEditor component', () => {
    render(<EmptyComponent />);

    const editorElements = screen.getAllByText(/请输入公司标题/i);
    expect(editorElements.length).toBeGreaterThan(0);
  });

  it('inserts markdown content when "插入一个markdown" button is clicked', () => {
    render(<EmptyComponent />);

    const insertButton = screen.getAllByText('插入一个markdown')[0];
    fireEvent.click(insertButton);

    const heading = screen.getByText(/标题/i);
    expect(heading).toBeInTheDocument();
  });

  it('clears markdown content when "清空" button is clicked', () => {
    render(<EmptyComponent />);

    const clearButton = screen.getByText('清空');
    fireEvent.click(clearButton);

    const heading = screen.queryByText(/标题/i);
    expect(heading).not.toBeInTheDocument();
  });
});
