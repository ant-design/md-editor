import { render, screen } from '@testing-library/react';
import React from 'react';
import type { RenderElementProps } from 'slate-react';
import { describe, expect, it, vi } from 'vitest';
import { MElement } from '../index';

vi.mock('../Paragraph', () => ({
  Paragraph: ({ attributes, children }: RenderElementProps) => (
    <p {...attributes} data-testid="paragraph" data-mode="editable">
      {children}
    </p>
  ),
}));
vi.mock('../Paragraph/ReadonlyParagraph', () => ({
  ReadonlyParagraph: ({ attributes, children }: RenderElementProps) => (
    <p {...attributes} data-testid="paragraph" data-mode="readonly">
      {children}
    </p>
  ),
}));

const props: RenderElementProps = {
  element: { type: 'paragraph', hash: 'stable', children: [{ text: 'body' }] },
  attributes: { 'data-slate-node': 'element', ref: vi.fn() },
  children: 'body',
};

describe('MElement Slate bridge', () => {
  it('switches rendering mode for an unchanged document node', () => {
    const view = render(<MElement {...props} readonly={false} />);
    view.rerender(<MElement {...props} readonly />);
    expect(screen.getByTestId('paragraph')).toHaveAttribute(
      'data-mode',
      'readonly',
    );
  });

  it('refreshes Slate children even when a readonly node hash is unchanged', () => {
    const view = render(<MElement {...props} readonly />);
    view.rerender(
      <MElement {...props} readonly>
        updated decoration
      </MElement>,
    );
    expect(screen.getByTestId('paragraph')).toHaveTextContent(
      'updated decoration',
    );
  });

  it('forwards updated DOM attributes for an unchanged node', () => {
    const view = render(<MElement {...props} />);
    view.rerender(
      <MElement {...props} attributes={{ ...props.attributes, dir: 'rtl' }} />,
    );
    expect(screen.getByTestId('paragraph')).toHaveAttribute('dir', 'rtl');
  });
});
