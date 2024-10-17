import { MarkdownEditor } from '@ant-design/md-editor';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('EmptyComponent', () => {
  it('renders the MarkdownEditor component', () => {
    const init = render(<MarkdownEditor />);
    expect(init.asFragment()).toMatchSnapshot();
  });

  // it('inserts markdown content when "插入一个markdown" button is clicked', () => {
  //   render(<MarkdownEditor />);
  //   const insertButton = screen.getAllByText('插入一个markdown')[0];
  //   fireEvent.click(insertButton);
  //   const heading = screen.getByText(/标题/i);
  //   expect(heading).toBeInTheDocument();
  // });

  // it('clears markdown content when "清空" button is clicked', () => {
  //   render(<MarkdownEditor />);
  //   const clearButton = screen.getByText('清空');
  //   fireEvent.click(clearButton);
  //   const heading = screen.queryByText(/标题/i);
  //   expect(heading).not.toBeInTheDocument();
  // });
});
