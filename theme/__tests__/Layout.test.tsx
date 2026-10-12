import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Layout } from '../index';

const route = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('@rspress/core/runtime', () => ({
  useLocation: () => route,
  Content: () => <div>Demo content</div>,
}));

vi.mock('@rspress/core/theme-original', () => ({
  Layout: ({ top }: { top?: React.ReactNode }) => (
    <>
      <header>Site navigation</header>
      {top}
    </>
  ),
  useSetup: vi.fn(),
  useScrollReset: vi.fn(),
}));

afterEach(cleanup);

describe('standalone demo layout', () => {
  it.each([
    '/~demos/docs-demos-suggestion-list-basic',
    '/zh/~demos/docs-demos-button',
    '/preview/~demos/docs-demos-button/',
  ])(
    'renders only demo content for %s without relying on page metadata',
    (pathname) => {
      route.pathname = pathname;
      render(<Layout />);
      expect(screen.getByText('Demo content')).toBeInTheDocument();
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    },
  );

  it.each(['/', '/components/SuggestionList', '/components/~demos-api'])(
    'retains the site layout and its slots for %s',
    (pathname) => {
      route.pathname = pathname;
      render(<Layout top={<div>Layout slot</div>} />);
      expect(screen.getByRole('banner')).toHaveTextContent('Site navigation');
      expect(screen.getByText('Layout slot')).toBeInTheDocument();
      expect(screen.queryByText('Demo content')).not.toBeInTheDocument();
    },
  );
});
