import { BookOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SuggestionList } from '../../src/Bubble/SuggestionList';

describe('SuggestionList', () => {
  it('renders items vertically and respects max count 6', async () => {
    const items = Array.from({ length: 8 }).map((_, i) => ({
      key: i,
      text: `问${i}`,
    }));
    const { getAllByRole } = render(<SuggestionList items={items as any} />);

    // Should render at most 6
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(6);
  });

  it('fires onItemClick when item has no onClick', async () => {
    const onItemClick = vi.fn();
    const { getByRole } = render(
      <SuggestionList
        items={[{ text: '举个例子' }]}
        onItemClick={onItemClick}
      />,
    );
    await userEvent.click(getByRole('button'));
    expect(onItemClick).toHaveBeenCalledWith('举个例子');
  });

  it('prefers item.onClick over onItemClick', async () => {
    const onItemClick = vi.fn();
    const onClick = vi.fn();
    const { getByRole } = render(
      <SuggestionList
        onItemClick={onItemClick}
        items={[{ text: '详细步骤', onClick }]}
      />,
    );
    await userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('详细步骤');
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('renders icon and tooltip and disables when disabled=true', async () => {
    const onItemClick = vi.fn();
    const { getByRole } = render(
      <SuggestionList
        onItemClick={onItemClick}
        items={[
          {
            text: '带图标',
            icon: <BookOutlined />,
            tooltip: '提示',
            disabled: true,
          },
        ]}
      />,
    );
    const btn = getByRole('button');
    expect(btn).toHaveClass('ant-follow-up-suggestion-disabled');
    await userEvent.click(btn);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('renders horizontal layout when layout="horizontal"', () => {
    const items = Array.from({ length: 3 }).map((_, i) => ({
      key: i,
      text: `建议${i}`,
    }));
    const { container } = render(
      <SuggestionList items={items} layout="horizontal" />,
    );

    // 检查根元素是否有正确的类名
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass('ant-follow-up-horizontal');
  });

  it('respects maxItems prop', () => {
    const items = Array.from({ length: 10 }).map((_, i) => ({
      key: i,
      text: `建议${i}`,
    }));
    const { getAllByRole } = render(
      <SuggestionList items={items} maxItems={3} />,
    );

    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(3);
  });
});
