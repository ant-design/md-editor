import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { TaskList } from '..';

describe('TaskList', () => {
  const mockItems = [
    {
      key: '1',
      title: 'Success Task',
      content: 'Success content',
      status: 'success' as const,
    },
    {
      key: '2',
      title: 'Pending Task',
      content: [
        <div key="1">Pending content 1</div>,
        <div key="2">Pending content 2</div>,
      ],
      status: 'pending' as const,
    },
    {
      key: '3',
      title: 'Another Pending Task',
      content: 'Another pending content',
      status: 'pending' as const,
    },
  ];

  it('renders all tasks with correct status icons', () => {
    render(<TaskList items={mockItems} />);

    // Check titles are rendered
    expect(screen.getByText('Success Task')).toBeInTheDocument();
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('Another Pending Task')).toBeInTheDocument();

    // Check that tasks are rendered with correct structure
    const taskItems = document.querySelectorAll('.task-list-thoughtChainItem');
    expect(taskItems).toHaveLength(3);
  });

  it('shows content for tasks with array content', () => {
    render(<TaskList items={mockItems} />);

    // Check if array content items are rendered
    expect(screen.getByText('Pending content 1')).toBeInTheDocument();
    expect(screen.getByText('Pending content 2')).toBeInTheDocument();
  });

  it('toggles content visibility when clicked', () => {
    render(<TaskList items={mockItems} />);

    // Get the first task's title element
    const taskTitle = screen.getByText('Success Task');
    const taskContent = 'Success content';

    // Content should be visible initially
    expect(screen.getByText(taskContent)).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(taskTitle);
    expect(screen.queryByText(taskContent)).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(taskTitle);
    expect(screen.getByText(taskContent)).toBeInTheDocument();
  });

  it('renders array content correctly', () => {
    render(<TaskList items={mockItems} />);

    // Check if both content items are rendered
    expect(screen.getByText('Pending content 1')).toBeInTheDocument();
    expect(screen.getByText('Pending content 2')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const customClass = 'custom-task-list';
    render(<TaskList items={mockItems} className={customClass} />);

    const container = document.querySelector(`.${customClass}`);
    expect(container).toBeInTheDocument();
  });

  it('maintains collapse state for each task independently', () => {
    render(<TaskList items={mockItems} />);

    const successTask = screen.getByText('Success Task');
    const pendingTask = screen.getByText('Pending Task');

    // Collapse first task
    fireEvent.click(successTask);
    expect(screen.queryByText('Success content')).not.toBeInTheDocument();
    expect(screen.getByText('Pending content 1')).toBeInTheDocument();

    // Collapse second task
    fireEvent.click(pendingTask);
    expect(screen.queryByText('Success content')).not.toBeInTheDocument();
    expect(screen.queryByText('Pending content 1')).not.toBeInTheDocument();
  });

  it('shows arrow icon for tasks with content', () => {
    render(<TaskList items={mockItems} />);

    // Check that arrow containers exist for tasks with content
    const arrowContainers = document.querySelectorAll(
      '.task-list-arrowContainer',
    );
    expect(arrowContainers.length).toBeGreaterThan(0);
  });

  it('handles empty content gracefully', () => {
    const itemsWithEmptyContent = [
      {
        key: '1',
        title: 'Empty Content Task',
        content: [],
        status: 'pending' as const,
      },
    ];

    render(<TaskList items={itemsWithEmptyContent} />);

    expect(screen.getByText('Empty Content Task')).toBeInTheDocument();
  });
});
