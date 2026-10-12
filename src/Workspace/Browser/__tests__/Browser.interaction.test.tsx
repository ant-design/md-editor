import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Browser, {
  BrowserList,
  type BrowserItem,
  type BrowserSuggestion,
} from '../index';

afterEach(cleanup);

const suggestions: BrowserSuggestion[] = [
  { id: 'first', label: 'First search', count: 1 },
  { id: 'second', label: 'Second search', count: 1 },
];
const firstResult: BrowserItem = {
  id: 'first',
  title: 'First result',
  url: 'https://example.com/first',
  site: 'example.com',
};

describe('Browser interactions and list updates', () => {
  it('opens a suggestion with the keyboard and does not request results while viewing suggestions', () => {
    const request = vi.fn(() => ({ items: [firstResult] }));
    const { rerender } = render(
      <Browser suggestions={suggestions} request={request} />,
    );
    expect(request).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole('button', { name: /First search/ }), {
      key: 'Enter',
    });
    expect(
      screen.getByRole('link', { name: 'First result' }),
    ).toBeInTheDocument();
    expect(request).toHaveBeenCalledTimes(1);

    const backButton = document.querySelector(
      '.ant-browser-header-left button',
    );
    expect(backButton).not.toBeNull();
    fireEvent.click(backButton!);
    const nextRequest = vi.fn(() => ({ items: [firstResult] }));
    rerender(<Browser suggestions={suggestions} request={nextRequest} />);
    expect(nextRequest).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole('button', { name: /Second search/ }), {
      key: ' ',
    });
    expect(nextRequest).toHaveBeenCalledWith(suggestions[1]);
  });

  it('keeps an existing result node and its focus when a result is prepended', () => {
    const { rerender } = render(
      <BrowserList items={[firstResult]} activeLabel="Search" />,
    );
    const link = screen.getByRole('link', { name: 'First result' });
    link.focus();
    rerender(
      <BrowserList
        items={[
          { ...firstResult, id: 'second', title: 'New result' },
          firstResult,
        ]}
        activeLabel="Search"
      />,
    );
    expect(screen.getByRole('link', { name: 'First result' })).toBe(link);
    expect(link).toHaveFocus();
  });

  it('uses the latest open callback after memoized result props change', () => {
    const firstOpen = vi.fn();
    const nextOpen = vi.fn();
    const { rerender } = render(
      <BrowserList
        items={[firstResult]}
        activeLabel="Search"
        onOpen={firstOpen}
      />,
    );
    rerender(
      <BrowserList
        items={[firstResult]}
        activeLabel="Search"
        onOpen={nextOpen}
      />,
    );
    fireEvent.click(screen.getByRole('link', { name: 'First result' }));
    expect(firstOpen).not.toHaveBeenCalled();
    expect(nextOpen).toHaveBeenCalledWith(firstResult);
  });
});
