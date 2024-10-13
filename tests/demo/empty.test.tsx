import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyComponent from '../../src/MarkdownEditor/demos/empty';
describe('MarkdownEditor Component', () => {
  it('renders markdown editor with toolbar buttons', () => {
    render(<EmptyComponent />);

    const insertButton = screen.getAllByText('插入一个markdown')[0];
    const clearButton = screen.getByText('清空');

    expect(insertButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it('inserts markdown content when "插入一个markdown" button is clicked', () => {
    render(<EmptyComponent />);
    const insertButton = screen.getAllByText('插入一个markdown')[0];

    const logSpy = vi.spyOn(console, 'log');

    fireEvent.click(insertButton);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('# 标题'));

    logSpy.mockRestore();
  });

  it('clears markdown content when "清空" button is clicked', () => {
    render(<EmptyComponent />);
    const clearButton = screen.getByText('清空');

    const logSpy = vi.spyOn(console, 'log');

    fireEvent.click(clearButton);

    expect(logSpy).toHaveBeenCalledWith(expect.anything(), '');

    logSpy.mockRestore();
  });
});
