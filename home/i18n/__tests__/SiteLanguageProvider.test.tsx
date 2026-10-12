import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SiteLanguageProvider, useSiteI18n } from '..';

function LanguageContent() {
  const { messages, toggleLocale } = useSiteI18n();
  return <button onClick={toggleLocale}>{messages.hero.title}</button>;
}

const app = (
  <SiteLanguageProvider>
    <LanguageContent />
  </SiteLanguageProvider>
);

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('homepage language hydration', () => {
  it('hydrates the SSG content before applying a saved language', async () => {
    window.localStorage.setItem('agentic-ui-site-language', 'en-US');
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = renderToString(app);
    expect(container.textContent).toBe('让模糊，变精准');
    const originalButton = container.querySelector('button');
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;

    await act(async () => {
      root = hydrateRoot(container, app, { onRecoverableError });
    });

    expect(container.querySelector('button')).toBe(originalButton);
    expect(container.textContent).not.toBe('让模糊，变精准');
    expect(document.documentElement.lang).toBe('en-US');
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps language switching available when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    render(app);
    const initialTitle = screen.getByRole('button').textContent;
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).not.toBe(initialTitle);
  });
});
