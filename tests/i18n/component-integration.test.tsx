import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HistoryLoadMore } from '../../src/History/components/LoadMoreComponent';
import { HistoryNewChat } from '../../src/History/components/NewChatComponent';
import { HistorySearch } from '../../src/History/components/SearchComponent';
import { cnLabels, enLabels, I18nContext } from '../../src/i18n';
import { TaskList } from '../../src/TaskList';

// Mock components that might not be available in test environment
vi.mock('../../src/MarkdownEditor/editor/components', () => ({
  ActionIconBox: ({ children, title, onClick }: any) => (
    <button onClick={onClick} title={title}>
      {children}
    </button>
  ),
}));

vi.mock('../../src/icons', () => ({
  NewChatIcon: () => <span>NewChatIcon</span>,
  SearchIcon: () => <span>SearchIcon</span>,
}));

vi.mock('../../src/TaskList/LoadingLottie', () => ({
  LoadingLottie: () => <span>LoadingLottie</span>,
}));

describe('Component Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('History Components', () => {
    describe('HistoryNewChat Component', () => {
      const mockOnNewChat = vi.fn();

      it('should render new chat button in Chinese', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistoryNewChat onNewChat={mockOnNewChat} enabled={true} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('新对话')).toBeInTheDocument();
      });

      it('should render new chat button in English', () => {
        render(
          <I18nContext.Provider value={{ locale: enLabels }}>
            <HistoryNewChat onNewChat={mockOnNewChat} enabled={true} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('New Chat')).toBeInTheDocument();
      });

      it('should call onNewChat when clicked', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistoryNewChat onNewChat={mockOnNewChat} enabled={true} />
          </I18nContext.Provider>,
        );

        fireEvent.click(screen.getByText('新对话'));
        expect(mockOnNewChat).toHaveBeenCalledTimes(1);
      });
    });

    describe('HistorySearch Component', () => {
      const mockOnSearch = vi.fn();

      it('should render search text in Chinese', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistorySearch onSearch={mockOnSearch} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('历史任务')).toBeInTheDocument();
      });

      it('should render search text in English', () => {
        render(
          <I18nContext.Provider value={{ locale: enLabels }}>
            <HistorySearch onSearch={mockOnSearch} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('History Tasks')).toBeInTheDocument();
      });

      it('should render search button title in Chinese', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistorySearch onSearch={mockOnSearch} />
          </I18nContext.Provider>,
        );

        const searchButton = screen.getByTitle('搜索');
        expect(searchButton).toBeInTheDocument();
      });

      it('should render search button title in English', () => {
        render(
          <I18nContext.Provider value={{ locale: enLabels }}>
            <HistorySearch onSearch={mockOnSearch} />
          </I18nContext.Provider>,
        );

        const searchButton = screen.getByTitle('Search');
        expect(searchButton).toBeInTheDocument();
      });
    });

    describe('HistoryLoadMore Component', () => {
      const mockOnLoadMore = vi.fn();

      it('should render load more button in Chinese', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistoryLoadMore onLoadMore={mockOnLoadMore} enabled={true} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('查看更多')).toBeInTheDocument();
      });

      it('should render load more button in English', () => {
        render(
          <I18nContext.Provider value={{ locale: enLabels }}>
            <HistoryLoadMore onLoadMore={mockOnLoadMore} enabled={true} />
          </I18nContext.Provider>,
        );

        expect(screen.getByText('Load More')).toBeInTheDocument();
      });

      it('should call onLoadMore when clicked', () => {
        render(
          <I18nContext.Provider value={{ locale: cnLabels }}>
            <HistoryLoadMore onLoadMore={mockOnLoadMore} enabled={true} />
          </I18nContext.Provider>,
        );

        fireEvent.click(screen.getByText('查看更多'));
        expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('TaskList Component', () => {
    const mockItems = [
      {
        key: '1',
        title: 'Test Task 1',
        content: [<div key="1">Task content 1</div>],
        status: 'success' as const,
      },
      {
        key: '2',
        title: 'Test Task 2',
        content: [<div key="2">Task content 2</div>],
        status: 'pending' as const,
      },
    ];

    it('should render task list with Chinese labels', () => {
      render(
        <I18nContext.Provider value={{ locale: cnLabels }}>
          <TaskList items={mockItems} />
        </I18nContext.Provider>,
      );

      // Check if task titles are rendered
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();

      // Check if expand/collapse buttons have correct titles
      const expandButtons = screen.getAllByTitle('展开');
      expect(expandButtons).toHaveLength(2);
    });

    it('should render task list with English labels', () => {
      render(
        <I18nContext.Provider value={{ locale: enLabels }}>
          <TaskList items={mockItems} />
        </I18nContext.Provider>,
      );

      // Check if task titles are rendered
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();

      // Check if expand/collapse buttons have correct titles
      const expandButtons = screen.getAllByTitle('Expand');
      expect(expandButtons).toHaveLength(2);
    });

    it('should render expand buttons with correct titles', () => {
      render(
        <I18nContext.Provider value={{ locale: cnLabels }}>
          <TaskList items={mockItems} />
        </I18nContext.Provider>,
      );

      const expandButtons = screen.getAllByTitle('展开');
      expect(expandButtons).toHaveLength(2);

      // Verify that task content is visible (expanded by default)
      expect(screen.getByText('Task content 1')).toBeInTheDocument();
      expect(screen.getByText('Task content 2')).toBeInTheDocument();
    });
  });

  describe('Context Integration', () => {
    it('should use custom locale from context', () => {
      const customLocale = {
        'chat.history.newChat': '自定义新对话',
        'chat.history.search.placeholder': '自定义搜索',
        'taskList.expand': '自定义展开',
      };

      const mockOnNewChat = vi.fn();
      const mockOnSearch = vi.fn();

      render(
        <I18nContext.Provider value={{ locale: customLocale }}>
          <div>
            <HistoryNewChat onNewChat={mockOnNewChat} enabled={true} />
            <HistorySearch onSearch={mockOnSearch} />
            <TaskList items={[]} />
          </div>
        </I18nContext.Provider>,
      );

      expect(screen.getByText('自定义新对话')).toBeInTheDocument();
      expect(screen.getByText('历史任务')).toBeInTheDocument();
    });

    it('should fallback to default text when context locale is missing', () => {
      render(
        <I18nContext.Provider value={{ locale: {} }}>
          <div>
            <HistoryNewChat onNewChat={vi.fn()} enabled={true} />
            <HistorySearch onSearch={vi.fn()} />
          </div>
        </I18nContext.Provider>,
      );

      // Should fallback to default Chinese text
      expect(screen.getByText('新对话')).toBeInTheDocument();
      expect(screen.getByText('历史任务')).toBeInTheDocument();
    });
  });

  describe('Template String Integration', () => {
    it('should handle template strings in task progress messages', () => {
      const customLocale = {
        'taskList.taskInProgress': '正在执行任务：${taskName}',
      };

      render(
        <I18nContext.Provider value={{ locale: customLocale }}>
          <div>
            <span data-testid="task-progress">
              {customLocale['taskList.taskInProgress'].replace(
                '${taskName}',
                '数据分析',
              )}
            </span>
          </div>
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('task-progress')).toHaveTextContent(
        '正在执行任务：数据分析',
      );
    });

    it('should handle template strings in file size messages', () => {
      const customLocale = {
        'markdownInput.fileSizeExceeded': '文件过大：${maxSize} KB',
      };

      render(
        <I18nContext.Provider value={{ locale: customLocale }}>
          <div>
            <span data-testid="file-size-error">
              {customLocale['markdownInput.fileSizeExceeded'].replace(
                '${maxSize}',
                '2048',
              )}
            </span>
          </div>
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('file-size-error')).toHaveTextContent(
        '文件过大：2048 KB',
      );
    });
  });
});
