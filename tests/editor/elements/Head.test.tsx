import { render, screen } from '@testing-library/react';
import React from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Head } from '../../../src/MarkdownEditor/editor/elements/Head';
import { useEditorStore } from '../../../src/MarkdownEditor/editor/store';

// Mock the store
vi.mock('../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(),
}));

// Mock the hooks
vi.mock('../../../src/MarkdownEditor/editor/hooks/editor', () => ({
  useSelStatus: vi.fn(),
}));

vi.mock('../../../src/MarkdownEditor/editor/slate-react', () => ({
  useSlate: vi.fn(),
}));

describe('Head Component', () => {
  const mockUseEditorStore = useEditorStore as ReturnType<typeof vi.fn>;
  const mockUseSelStatus = vi.mocked(
    require('../../../src/MarkdownEditor/editor/hooks/editor').useSelStatus,
  );
  const mockUseSlate = vi.mocked(
    require('../../../src/MarkdownEditor/editor/slate-react').useSlate,
  );

  const mockElement = {
    type: 'head',
    level: 1,
    align: 'left',
    children: [{ text: 'Test Heading' }],
  };

  const mockAttributes = {
    'data-slate-node': 'element',
    'data-slate-inline': true,
    'data-slate-void': true,
    dir: 'rtl',
  };

  const mockChildren = <span>Test Content</span>;

  const mockEditor = withReact(createEditor());

  beforeEach(() => {
    mockUseEditorStore.mockReturnValue({
      store: {
        isLatestNode: jest.fn().mockReturnValue(false),
        dragStart: jest.fn(),
      },
      markdownContainerRef: { current: document.createElement('div') },
      typewriter: false,
    });

    mockUseSelStatus.mockReturnValue([false, [0]]);

    mockUseSlate.mockReturnValue({
      children: [{ children: [{ text: 'Test Heading' }] }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render heading with correct level', () => {
    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('data-be', 'head');
    expect(heading).toHaveAttribute('data-head', 'test-heading');
  });

  it('should render heading with correct level 2', () => {
    const h2Element = { ...mockElement, level: 2 };

    render(
      <Slate editor={mockEditor} value={[h2Element]}>
        <Head element={h2Element} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading with correct level 3', () => {
    const h3Element = { ...mockElement, level: 3 };

    render(
      <Slate editor={mockEditor} value={[h3Element]}>
        <Head element={h3Element} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading with correct level 4', () => {
    const h4Element = { ...mockElement, level: 4 };

    render(
      <Slate editor={mockEditor} value={[h4Element]}>
        <Head element={h4Element} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading with correct level 5', () => {
    const h5Element = { ...mockElement, level: 5 };

    render(
      <Slate editor={mockEditor} value={[h5Element]}>
        <Head element={h5Element} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading with correct level 6', () => {
    const h6Element = { ...mockElement, level: 6 };

    render(
      <Slate editor={mockEditor} value={[h6Element]}>
        <Head element={h6Element} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading).toBeInTheDocument();
  });

  it('should apply correct alignment', () => {
    const alignedElement = { ...mockElement, align: 'center' };

    render(
      <Slate editor={mockEditor} value={[alignedElement]}>
        <Head element={alignedElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('data-align', 'center');
  });

  it('should handle empty heading when selected', () => {
    const emptyElement = { ...mockElement, children: [{ text: '' }] };
    mockUseSelStatus.mockReturnValue([true, [0]]);

    render(
      <Slate editor={mockEditor} value={[emptyElement]}>
        <Head element={emptyElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('data-empty', 'true');
  });

  it('should not show empty attribute when not selected', () => {
    const emptyElement = { ...mockElement, children: [{ text: '' }] };
    mockUseSelStatus.mockReturnValue([false, [0]]);

    render(
      <Slate editor={mockEditor} value={[emptyElement]}>
        <Head element={emptyElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).not.toHaveAttribute('data-empty');
  });

  it('should apply typewriter class when isLatest and typewriter is enabled', () => {
    mockUseEditorStore.mockReturnValue({
      store: {
        isLatestNode: jest.fn().mockReturnValue(true),
        dragStart: jest.fn(),
      },
      markdownContainerRef: { current: document.createElement('div') },
      typewriter: true,
    });

    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typewriter');
  });

  it('should not apply typewriter class when not latest', () => {
    mockUseEditorStore.mockReturnValue({
      store: {
        isLatestNode: jest.fn().mockReturnValue(false),
        dragStart: jest.fn(),
      },
      markdownContainerRef: { current: document.createElement('div') },
      typewriter: true,
    });

    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).not.toHaveClass('typewriter');
  });

  it('should handle drag start event', () => {
    const mockDragStart = jest.fn();
    mockUseEditorStore.mockReturnValue({
      store: {
        isLatestNode: jest.fn().mockReturnValue(false),
        dragStart: mockDragStart,
      },
      markdownContainerRef: { current: document.createElement('div') },
      typewriter: false,
    });

    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    const dragEvent = new DragEvent('dragstart');

    heading.dispatchEvent(dragEvent);

    expect(mockDragStart).toHaveBeenCalledWith(
      dragEvent,
      expect.any(HTMLDivElement),
    );
  });

  it('should set title attribute for first heading', () => {
    mockUseSelStatus.mockReturnValue([false, [0]]);

    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('data-title', 'true');
  });

  it('should not set title attribute for non-first heading', () => {
    mockUseSelStatus.mockReturnValue([false, [1]]);

    render(
      <Slate editor={mockEditor} value={[mockElement]}>
        <Head element={mockElement} attributes={mockAttributes}>
          {mockChildren}
        </Head>
      </Slate>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).not.toHaveAttribute('data-title');
  });
});
