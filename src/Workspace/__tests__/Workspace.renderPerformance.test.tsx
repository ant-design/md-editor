import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { SegmentedProps } from 'antd';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Workspace from '..';
import { buildFileNodeRelativePathIndex } from '../File/buildFileNodeRelativePathIndex';
import { FileComponent } from '../File/FileComponent';
import type { FileNode } from '../types';

const { renderNavigation } = vi.hoisted(() => ({ renderNavigation: vi.fn() }));

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    Segmented: (props: SegmentedProps) => {
      renderNavigation();
      return <actual.Segmented {...props} />;
    },
  };
});

vi.mock('../File/buildFileNodeRelativePathIndex', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../File/buildFileNodeRelativePathIndex')
    >();
  return {
    ...actual,
    buildFileNodeRelativePathIndex: vi.fn(
      actual.buildFileNodeRelativePathIndex,
    ),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Workspace update and loading budgets', () => {
  const panels = (
    content: string,
    onTabChange: (key: string) => void,
    count = 1,
    title = 'Draft',
  ) => (
    <Workspace defaultActiveTabKey="draft" onTabChange={onTabChange}>
      <Workspace.Custom
        tab={{ key: 'draft', title: <span>{title}</span>, count }}
      >
        {content}
      </Workspace.Custom>
      <Workspace.Custom tab={{ key: 'files', title: 'Files' }}>
        File panel
      </Workspace.Custom>
    </Workspace>
  );

  it('updates streamed panel bodies without rendering navigation, using the latest callback', () => {
    const firstCallback = vi.fn();
    const latestCallback = vi.fn();
    const { rerender } = render(panels('First chunk', firstCallback));
    renderNavigation.mockClear();

    for (let index = 0; index < 10; index += 1) {
      rerender(panels(`Chunk ${index}`, latestCallback));
    }

    expect(screen.getByTestId('workspace-content')).toHaveTextContent(
      'Chunk 9',
    );
    expect(renderNavigation).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('radio', { name: 'Files' }));
    expect(screen.getByTestId('workspace-content')).toHaveTextContent(
      'File panel',
    );
    expect(latestCallback).toHaveBeenCalledWith('files');
    expect(firstCallback).not.toHaveBeenCalled();
  });

  it('refreshes navigation when titles or counts change', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(panels('Body', onTabChange));
    renderNavigation.mockClear();

    rerender(panels('Updated body', onTabChange, 12, 'Updated draft'));

    expect(renderNavigation).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Updated draft')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-tab-count--draft')).toHaveTextContent(
      '12',
    );
    expect(screen.getByTestId('workspace-content')).toHaveTextContent(
      'Updated body',
    );
  });

  it('only indexes file paths when the tree view is active', () => {
    const nodes: FileNode[] = Array.from({ length: 1000 }, (_, index) => ({
      id: `src/file-${index}.txt`,
      name: `file-${index}.txt`,
      canPreview: false,
      canDownload: false,
    }));
    const { rerender } = render(<FileComponent nodes={nodes} />);

    expect(buildFileNodeRelativePathIndex).not.toHaveBeenCalled();
    expect(
      screen.getAllByRole('button', { name: /^文件：file-/ }),
    ).toHaveLength(50);
    rerender(<FileComponent nodes={nodes} fileTreeSwitch={{ view: 'list' }} />);
    expect(buildFileNodeRelativePathIndex).not.toHaveBeenCalled();

    rerender(<FileComponent nodes={nodes} fileTreeSwitch={{ view: 'tree' }} />);
    expect(buildFileNodeRelativePathIndex).toHaveBeenCalledTimes(1);
    expect(buildFileNodeRelativePathIndex).toHaveBeenCalledWith(nodes);
  });

  it('refreshes custom icon props while panel keys stay the same', () => {
    const content = (label: string) => (
      <Workspace defaultActiveTabKey="draft">
        <Workspace.Custom
          tab={{
            key: 'draft',
            title: 'Draft',
            icon: <span role="img" aria-label={label} />,
          }}
        >
          Body
        </Workspace.Custom>
        <Workspace.Custom tab={{ key: 'files', title: 'Files' }} />
      </Workspace>
    );
    const { rerender } = render(content('Original icon'));
    renderNavigation.mockClear();

    rerender(content('Updated icon'));

    expect(renderNavigation).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('img', { name: 'Original icon' })).toBeNull();
    expect(
      screen.getByRole('img', { name: 'Updated icon' }),
    ).toBeInTheDocument();
  });
});
