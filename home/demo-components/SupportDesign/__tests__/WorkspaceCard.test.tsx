import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnimationVisibility } from '../../../hooks/useAnimationVisibility';
import { useSiteI18n } from '../../../i18n';
import WorkspaceCard from '../components/WorkspaceCard';

vi.mock('../../../hooks/useAnimationVisibility', () => ({
  useAnimationVisibility: vi.fn(),
}));

vi.mock('@ant-design/agentic-ui', () => ({
  Workspace: Object.assign(
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
    {
      Realtime: ({ data }: { data: { content: string } }) => (
        <pre data-testid="workspace-content">{data.content}</pre>
      ),
      Task: () => null,
      Browser: () => null,
      File: () => null,
    },
  ),
}));

describe('homepage Workspace streaming demo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(useAnimationVisibility).mockReturnValue({
      isVisible: false,
      reducedMotion: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('batches visible updates, pauses offscreen, and cancels work on unmount', () => {
    const { rerender, unmount } = render(<WorkspaceCard />);
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByTestId('workspace-content')).toBeEmptyDOMElement();

    vi.mocked(useAnimationVisibility).mockReturnValue({
      isVisible: true,
      reducedMotion: false,
    });
    rerender(<WorkspaceCard />);
    act(() => vi.advanceTimersByTime(40));
    const firstBatch = screen.getByTestId('workspace-content').textContent;
    expect(Array.from(firstBatch ?? '')).toHaveLength(4);

    vi.mocked(useAnimationVisibility).mockReturnValue({
      isVisible: false,
      reducedMotion: false,
    });
    rerender(<WorkspaceCard />);
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByTestId('workspace-content').textContent).toBe(
      firstBatch,
    );

    vi.mocked(useAnimationVisibility).mockReturnValue({
      isVisible: true,
      reducedMotion: false,
    });
    rerender(<WorkspaceCard />);
    act(() => vi.advanceTimersByTime(40));
    expect(
      Array.from(screen.getByTestId('workspace-content').textContent ?? ''),
    ).toHaveLength(8);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('shows complete content immediately when reduced motion is preferred', () => {
    vi.mocked(useAnimationVisibility).mockReturnValue({
      isVisible: true,
      reducedMotion: true,
    });
    let expected = '';
    const Demo = () => {
      expected = useSiteI18n().messages.support.workspaceDemo.mdContent;
      return <WorkspaceCard />;
    };
    render(<Demo />);

    expect(screen.getByTestId('workspace-content').textContent).toBe(expected);
    expect(vi.getTimerCount()).toBe(0);
  });
});
