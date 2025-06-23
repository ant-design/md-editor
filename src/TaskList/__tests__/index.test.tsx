import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import TaskList from '..';

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
      title: 'Error Task',
      content: 'Error content',
      status: 'error' as const,
    },
  ];

  it('renders all tasks with correct status icons', () => {
    render(<TaskList items={mockItems} />);

    // Check titles are rendered
    expect(screen.getByText('Success Task')).toBeInTheDocument();
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('Error Task')).toBeInTheDocument();

    // Check status icons
    const successIcon = document.querySelector('.anticon-check-circle');
    const errorIcon = document.querySelector('.anticon-close-circle');
    const loadingIcon = document.querySelector('.anticon-loading');

    expect(successIcon).toBeInTheDocument();
    expect(errorIcon).toBeInTheDocument();
    expect(loadingIcon).toBeInTheDocument();
  });

  it('shows loading component for pending tasks', () => {
    render(<TaskList items={mockItems} />);
    const pendingTask = mockItems.find((item) => item.status === 'pending');
    const taskElement = screen.getByText(pendingTask!.title);
    const loadingComponent =
      taskElement.parentElement?.querySelector('.loading-container');
    expect(loadingComponent).toBeInTheDocument();
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
});
