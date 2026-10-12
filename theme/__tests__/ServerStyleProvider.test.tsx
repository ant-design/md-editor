import { useHead } from '@rspress/core/runtime';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { styled } from 'styled-components';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ServerStyleProvider from '../ServerStyleProvider';

vi.mock('@rspress/core/runtime', () => ({ useHead: vi.fn() }));

const FirstPage = styled.div`
  color: rgb(20, 30, 40);
`;
const SecondPage = styled.div`
  padding: 37px;
`;

function getCollectedStyles(index = 0) {
  const input = vi.mocked(useHead).mock.calls[index][0];
  if (!input || typeof input.style !== 'function') {
    throw new Error('Expected deferred styles');
  }
  return { style: input.style() };
}

beforeEach(() => vi.clearAllMocks());

describe('server page styles', () => {
  it('includes styles rendered after the head entry was registered', () => {
    const html = renderToString(
      <ServerStyleProvider>
        <FirstPage>Ready on first paint</FirstPage>
      </ServerStyleProvider>,
    );
    const head = getCollectedStyles();
    expect(head?.style?.[0]).toMatchObject({ 'data-styled': 'true' });
    const css = head?.style?.[0]?.innerHTML;
    expect(css).toMatch(/color:\s*rgb\(20,\s*30,\s*40\)/);
    const className = html.match(/class="[^"]* ([^"]+)"/)?.[1];
    expect(className).toBeTruthy();
    expect(css).toContain(`.${className}`);
  });

  it('isolates styles between page renders', () => {
    renderToString(
      <ServerStyleProvider>
        <FirstPage />
      </ServerStyleProvider>,
    );
    renderToString(
      <ServerStyleProvider>
        <SecondPage />
      </ServerStyleProvider>,
    );
    expect(getCollectedStyles()?.style?.[0]?.innerHTML).not.toContain('37px');
    expect(getCollectedStyles(1)?.style?.[0]?.innerHTML).toContain('37px');
    expect(getCollectedStyles(1)?.style?.[0]?.innerHTML).not.toContain(
      'color:',
    );
  });
});
