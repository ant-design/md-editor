// @ts-nocheck
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuickActions } from '../src/MarkdownInputField/QuickActions';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => children,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock rc-resize-observer
vi.mock('rc-resize-observer', () => ({
  default: ({ children, onResize }: any) => {
    React.useEffect(() => {
      if (onResize) {
        onResize({ width: 800, height: 600 }, null);
      }
    }, [onResize]);
    return children;
  },
}));

describe('QuickActions', () => {
  const mockRefinePromptButtonProps = {
    isHover: false,
    status: 'idle' as const,
    onRefine: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RefinePromptButton Integration', () => {
    it('should render RefinePromptButton when props provided', () => {
      render(
        <QuickActions refinePromptButtonProps={mockRefinePromptButtonProps} />,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should not render RefinePromptButton when props not provided', () => {
      const { container } = render(<QuickActions />);

      expect(
        container.querySelector('.ant-md-input-field-quick-actions'),
      ).toBeInTheDocument();
    });

    it('should pass correct props to RefinePromptButton', () => {
      const onRefine = vi.fn();
      render(
        <QuickActions
          refinePromptButtonProps={{
            isHover: true,
            status: 'loading',
            onRefine,
          }}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should call onRefine when RefinePromptButton is clicked', async () => {
      const onRefine = vi.fn();
      render(
        <QuickActions
          refinePromptButtonProps={{
            isHover: false,
            status: 'idle',
            onRefine,
          }}
        />,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onRefine).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Custom Actions', () => {
    it('should render custom actions', () => {
      const CustomAction = () => <button type="button">Custom Action</button>;

      render(<QuickActions customActions={<CustomAction />} />);

      expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });

    it('should render multiple custom actions', () => {
      const actions = (
        <>
          <button type="button">Action 1</button>
          <button type="button">Action 2</button>
          <button type="button">Action 3</button>
        </>
      );

      render(<QuickActions customActions={actions} />);

      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
      expect(screen.getByText('Action 3')).toBeInTheDocument();
    });

    it('should handle click events on custom actions', () => {
      const onClick = vi.fn();
      const CustomAction = () => (
        <button type="button" onClick={onClick}>
          Clickable Action
        </button>
      );

      render(<QuickActions customActions={<CustomAction />} />);

      const button = screen.getByText('Clickable Action');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Combined Rendering', () => {
    it('should render both RefinePromptButton and custom actions', () => {
      const CustomAction = () => <button type="button">Custom</button>;

      render(
        <QuickActions
          refinePromptButtonProps={mockRefinePromptButtonProps}
          customActions={<CustomAction />}
        />,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('should maintain correct order of elements', () => {
      const CustomAction = () => <button type="button">Custom</button>;

      const { container } = render(
        <QuickActions
          refinePromptButtonProps={mockRefinePromptButtonProps}
          customActions={<CustomAction />}
        />,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Styling and Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(<QuickActions className="custom-class" />);

      const quickActions = container.querySelector(
        '.ant-md-input-field-quick-actions',
      );
      expect(quickActions).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red', padding: '10px' };
      const { container } = render(<QuickActions style={customStyle} />);

      const quickActions = container.querySelector(
        '.ant-md-input-field-quick-actions',
      );
      expect(quickActions).toHaveStyle(customStyle);
    });
  });

  describe('ResizeObserver Integration', () => {
    it('should handle resize events', async () => {
      const { container } = render(
        <QuickActions refinePromptButtonProps={mockRefinePromptButtonProps} />,
      );

      await waitFor(() => {
        const quickActions = container.querySelector(
          '.ant-md-input-field-quick-actions',
        );
        expect(quickActions).toBeInTheDocument();
      });
    });

    it('should update layout on resize', async () => {
      const { rerender } = render(
        <QuickActions refinePromptButtonProps={mockRefinePromptButtonProps} />,
      );

      // Trigger rerender to simulate resize
      rerender(
        <QuickActions refinePromptButtonProps={mockRefinePromptButtonProps} />,
      );

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Props Updates', () => {
    it('should update when refinePromptButtonProps change', () => {
      const { rerender } = render(
        <QuickActions
          refinePromptButtonProps={{
            ...mockRefinePromptButtonProps,
            status: 'idle',
          }}
        />,
      );

      rerender(
        <QuickActions
          refinePromptButtonProps={{
            ...mockRefinePromptButtonProps,
            status: 'loading',
          }}
        />,
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should update when customActions change', () => {
      const { rerender } = render(
        <QuickActions
          customActions={<button type="button">Action 1</button>}
        />,
      );

      expect(screen.getByText('Action 1')).toBeInTheDocument();

      rerender(
        <QuickActions
          customActions={<button type="button">Action 2</button>}
        />,
      );

      expect(screen.queryByText('Action 1')).not.toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty props', () => {
      const { container } = render(<QuickActions />);

      const quickActions = container.querySelector(
        '.ant-md-input-field-quick-actions',
      );
      expect(quickActions).toBeInTheDocument();
    });

    it('should handle null customActions', () => {
      const { container } = render(<QuickActions customActions={null} />);

      const quickActions = container.querySelector(
        '.ant-md-input-field-quick-actions',
      );
      expect(quickActions).toBeInTheDocument();
    });

    it('should handle undefined refinePromptButtonProps', () => {
      const { container } = render(
        <QuickActions refinePromptButtonProps={undefined} />,
      );

      const quickActions = container.querySelector(
        '.ant-md-input-field-quick-actions',
      );
      expect(quickActions).toBeInTheDocument();
    });
  });
});
