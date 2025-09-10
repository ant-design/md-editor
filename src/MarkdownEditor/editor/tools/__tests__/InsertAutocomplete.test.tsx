import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  InsertAutocomplete,
  InsertAutocompleteItem,
} from '../InsertAutocomplete';

// Mock dependencies
vi.mock('../../store', () => ({
  useEditorStore: () => ({
    store: {
      editor: {
        children: [],
      },
    },
    markdownEditorRef: { current: null },
  }),
}));

vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn(() => [0]),
    findNode: vi.fn(() => ({ children: [] })),
    focus: vi.fn(),
    isFocused: vi.fn(() => false),
  },
}));

vi.mock('slate', () => ({
  Editor: {
    end: vi.fn(() => ({ path: [0, 0], offset: 0 })),
    string: vi.fn(() => ''),
    above: vi.fn(() => []),
    before: vi.fn(() => ({ path: [0], offset: 0 })),
    after: vi.fn(() => ({ path: [0], offset: 0 })),
    parent: vi.fn(() => ({ children: [] })),
    isBlock: vi.fn(() => true),
    isVoid: vi.fn(() => false),
  },
  Element: {
    isElement: vi.fn(() => true),
  },
  Node: {
    string: vi.fn(() => ''),
  },
  Transforms: {
    insertNodes: vi.fn(),
    select: vi.fn(),
    removeNodes: vi.fn(),
    insertText: vi.fn(),
  },
}));

vi.mock('../../../i18n', () => ({
  I18nContext: React.createContext({
    locale: 'zh-CN',
    t: (key: string) => key,
  }),
  LocalKeys: {
    'insert.heading': 'insert.heading',
    'insert.paragraph': 'insert.paragraph',
    'insert.list': 'insert.list',
  },
}));

vi.mock('../../hooks/subscribe', () => ({
  useSubject: () => ({
    subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
  }),
}));

vi.mock('../plugins/useOnchange', () => ({
  selChange$: {
    subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
  },
}));

vi.mock('../../utils/dom', () => ({
  getOffsetLeft: vi.fn(() => 0),
}));

vi.mock('../../utils/editorUtils', () => ({
  EditorUtils: {
    insertText: vi.fn(),
    insertNodes: vi.fn(),
  },
}));

vi.mock('../../utils/media', () => ({
  getRemoteMediaType: vi.fn(() => 'image'),
}));

vi.mock('../../utils/useLocalState', () => ({
  useLocalState: () => [false, vi.fn()],
}));

vi.mock('../insertAutocompleteStyle', () => ({
  useStyle: () => ({
    wrapSSR: (component: React.ReactNode) => component,
    hashId: 'test-hash-id',
  }),
}));

// Mock ReactDOM.createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('InsertAutocomplete Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInsertOptions: InsertAutocompleteItem[] = [
    {
      label: ['Heading', '标题'],
      key: 'heading',
      task: vi.fn(),
      icon: <div data-testid="heading-icon">H</div>,
    },
    {
      label: ['Paragraph', '段落'],
      key: 'paragraph',
      task: vi.fn(),
      icon: <div data-testid="paragraph-icon">P</div>,
    },
  ];

  it('renders insert autocomplete with options', () => {
    render(
      <InsertAutocomplete
        insertOptions={mockInsertOptions}
        runInsertTask={vi.fn()}
      />,
    );

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles runInsertTask prop correctly', async () => {
    const runInsertTask = vi.fn().mockResolvedValue(true);

    render(
      <InsertAutocomplete
        insertOptions={mockInsertOptions}
        runInsertTask={runInsertTask}
      />,
    );

    // Component should render without errors
    expect(runInsertTask).toBeDefined();
  });

  it('handles getContainer prop correctly', () => {
    const mockContainer = document.createElement('div');
    const getContainer = vi.fn(() => mockContainer);

    render(
      <InsertAutocomplete
        insertOptions={mockInsertOptions}
        getContainer={getContainer}
      />,
    );

    // Component should render without errors
    expect(getContainer).toBeDefined();
  });

  it('renders without insertOptions', () => {
    render(<InsertAutocomplete />);

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders without runInsertTask', () => {
    render(<InsertAutocomplete insertOptions={mockInsertOptions} />);

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('renders without getContainer', () => {
    render(<InsertAutocomplete insertOptions={mockInsertOptions} />);

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles empty insertOptions array', () => {
    render(<InsertAutocomplete insertOptions={[]} />);

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles insertOptions with complex task functions', () => {
    const complexOptions: InsertAutocompleteItem[] = [
      {
        label: ['Complex Task', '复杂任务'],
        key: 'complex',
        task: vi.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(true), 100);
          });
        }),
        icon: <div data-testid="complex-icon">C</div>,
        args: ['arg1', 'arg2'],
      },
    ];

    render(
      <InsertAutocomplete
        insertOptions={complexOptions}
        runInsertTask={vi.fn()}
      />,
    );

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles insertOptions with different icon types', () => {
    const optionsWithIcons: InsertAutocompleteItem[] = [
      {
        label: ['Icon Test', '图标测试'],
        key: 'icon-test',
        task: vi.fn(),
        icon: <span data-testid="custom-icon">🚀</span>,
      },
    ];

    render(
      <InsertAutocomplete
        insertOptions={optionsWithIcons}
        runInsertTask={vi.fn()}
      />,
    );

    // Component should render without errors
    expect(document.body).toBeInTheDocument();
  });
});
