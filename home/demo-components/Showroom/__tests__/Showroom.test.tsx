import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import Showroom from '..';

afterEach(cleanup);

const getControls = () => {
  const [carousel, navigation] = screen.getAllByRole('group', {
    name: '样板间',
  });
  return {
    cards: within(carousel).getAllByRole('button'),
    navigation: within(navigation).getAllByRole('button'),
  };
};

describe('homepage showroom interaction', () => {
  it('responds to every card click while the previous transition is running', () => {
    render(<Showroom />);
    const { cards } = getControls();

    fireEvent.click(cards[0]);
    fireEvent.click(cards[4]);
    fireEvent.click(cards[1]);

    expect(cards[1]).toHaveAttribute('aria-pressed', 'true');
    expect(cards[0]).toHaveAttribute('aria-pressed', 'false');
    expect(cards[4]).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports direction keys, wrapping and first/last card navigation', () => {
    render(<Showroom />);
    const { cards } = getControls();
    expect(cards[2]).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(cards[2], { key: 'ArrowRight' });
    expect(cards[3]).toHaveFocus();
    expect(cards[3]).toHaveAttribute('aria-pressed', 'true');
    expect(cards[2]).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(cards[3], { key: 'End' });
    expect(cards[4]).toHaveFocus();
    fireEvent.keyDown(cards[4], { key: 'ArrowRight' });
    expect(cards[0]).toHaveFocus();
    fireEvent.keyDown(cards[0], { key: 'ArrowLeft' });
    expect(cards[4]).toHaveFocus();
    fireEvent.keyDown(cards[4], { key: 'Home' });
    expect(cards[0]).toHaveFocus();
    expect(cards[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows direct selection through the compact mobile navigation', () => {
    render(<Showroom />);
    const { cards, navigation } = getControls();
    expect(navigation[2]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(navigation[0]);
    fireEvent.click(navigation[4]);

    expect(cards[4]).toHaveAttribute('aria-pressed', 'true');
    expect(navigation[4]).toHaveAttribute('aria-current', 'true');
    expect(navigation[0]).not.toHaveAttribute('aria-current');
    expect(cards[4]).toHaveAccessibleName('样板间 5');
  });
});
