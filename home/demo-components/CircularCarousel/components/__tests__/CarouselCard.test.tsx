import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motionValue } from 'framer-motion';
import React, { useContext } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardAnimationContext } from '../CardAnimationContext';
import { CarouselCard } from '../CarouselCard';

vi.mock('../cardStates', () => ({
  ActiveCard: () => {
    const { frontActive } = useContext(CardAnimationContext);
    return (
      <div data-testid="front" data-animating={frontActive}>
        Summary
      </div>
    );
  },
  InactiveCard: () => <div>Inactive</div>,
  BacksideCardState: () => {
    const { backActive } = useContext(CardAnimationContext);
    return (
      <div data-testid="back" aria-hidden={!backActive}>
        Details
      </div>
    );
  },
}));

afterEach(cleanup);

const feature = {
  id: 'intro',
  label: '原则',
  title: '设计原则',
  description: '描述',
  subFeatures: [],
  color: '40, 118, 255',
};

function card(isActive = true, isSettled = true) {
  return (
    <CarouselCard
      feature={feature}
      index={0}
      smoothIndex={motionValue(0)}
      isActive={isActive}
      isSettled={isSettled}
      onCardClick={vi.fn()}
      themeColor={feature.color}
    />
  );
}

describe('carousel card interaction', () => {
  it('keeps the summary still on hover and flips only from the explicit button', () => {
    const { container } = render(card());
    fireEvent.mouseEnter(screen.getByTestId('front'));
    expect(screen.queryByTestId('back')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '查看卡片详情' }));
    expect(
      screen.getByRole('button', { name: '返回卡片概览' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('back')).toHaveAttribute('aria-hidden', 'false');
    expect(container.querySelector('[data-carousel-card]')).toHaveAttribute(
      'data-flipped',
      'true',
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    expect(screen.getByRole('button', { name: '查看卡片详情' })).toHaveFocus();
    expect(screen.getByTestId('back')).toHaveAttribute('aria-hidden', 'true');
  });

  it('returns to the summary when a different card is selected', () => {
    const { rerender } = render(card());
    fireEvent.click(screen.getByRole('button'));
    rerender(card(false));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(card());
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('waits for wheel movement to finish before starting the decorative canvas', () => {
    const { rerender } = render(card(true, false));
    expect(screen.getByTestId('front')).toHaveAttribute(
      'data-animating',
      'false',
    );
    rerender(card());
    expect(screen.getByTestId('front')).toHaveAttribute(
      'data-animating',
      'true',
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('front')).toHaveAttribute(
      'data-animating',
      'false',
    );
  });
});
