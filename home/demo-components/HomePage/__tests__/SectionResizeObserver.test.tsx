import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SiteLanguageProvider, useSiteI18n } from '../../../i18n';
import EnhanceDesign from '../../EnhanceDesign';
import SupportDesign from '../../SupportDesign';

vi.mock('../LocaleBridge', () => ({
  default: ({ children }: { children: React.ReactNode }) => {
    const { locale } = useSiteI18n();
    return <React.Fragment key={locale}>{children}</React.Fragment>;
  },
}));

vi.mock('../DeferredSection', () => ({ default: () => null }));
vi.mock('../../SupportDesign/components', () => ({
  DialogFlowCard: () => null,
  SuggestionCard: () => null,
  SuperInputCard: () => null,
  WelcomeCard: () => null,
  WorkspaceCard: () => null,
}));
vi.mock('../../EnhanceDesign/components/SchemaTab', () => ({
  default: () => null,
}));

interface ObservedSection {
  element: Element | null;
  resize: () => void;
  disconnect: ReturnType<typeof vi.fn>;
}

const observers: ObservedSection[] = [];

beforeEach(() => {
  observers.length = 0;
  window.localStorage.setItem('agentic-ui-site-language', 'zh-CN');
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observation: ObservedSection;

      constructor(callback: () => void) {
        this.observation = {
          element: null,
          resize: callback,
          disconnect: vi.fn(),
        };
        observers.push(this.observation);
      }

      observe(element: Element) {
        this.observation.element = element;
      }

      disconnect() {
        this.observation.disconnect();
      }
    },
  );
});

afterEach(() => {
  cleanup();
  window.localStorage.removeItem('agentic-ui-site-language');
  vi.unstubAllGlobals();
});

function LanguageToggle() {
  const { toggleLocale } = useSiteI18n();
  return <button onClick={toggleLocale}>Switch language</button>;
}

describe('homepage section border resizing', () => {
  it.each([
    { name: 'support', Component: SupportDesign, widthOffset: 0 },
    { name: 'enhance', Component: EnhanceDesign, widthOffset: 32 },
  ])(
    'rebinds the $name observer after a language switch',
    async ({ Component, widthOffset }) => {
      const { container } = render(
        <SiteLanguageProvider>
          <LanguageToggle />
          <div data-section-with-borders>
            <Component />
          </div>
        </SiteLanguageProvider>,
      );
      const previous = observers.at(-1)!;
      expect(previous.element?.isConnected).toBe(true);

      await act(async () => {
        fireEvent.click(
          screen.getByRole('button', { name: 'Switch language' }),
        );
      });

      const current = observers.at(-1)!;
      expect(previous.disconnect).toHaveBeenCalledOnce();
      expect(current).not.toBe(previous);
      expect(previous.element?.isConnected).toBe(false);
      expect(current.element?.isConnected).toBe(true);
      Object.defineProperty(current.element, 'offsetWidth', { value: 1200 });
      act(() => current.resize());
      expect(
        container
          .querySelector<HTMLElement>('[data-section-with-borders]')
          ?.style.getPropertyValue('--scrollable-content-width'),
      ).toBe(`${1200 + widthOffset}px`);
    },
  );
});
