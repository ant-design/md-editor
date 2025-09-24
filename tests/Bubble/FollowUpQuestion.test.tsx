import { BookOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FollowUpQuestion } from '../../src/Bubble/FollowUpQuestion';

describe('FollowUpQuestion', () => {
  it('renders items vertically and respects max count 6', async () => {
    const items = Array.from({ length: 8 }).map((_, i) => ({
      key: i,
      text: `问${i}`,
    }));
    const { getAllByRole } = render(<FollowUpQuestion items={items as any} />);

    // Should render at most 6
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(6);
  });

  it('fires onAsk when item has no onClick', async () => {
    const onAsk = vi.fn();
    const { getByRole } = render(
      <FollowUpQuestion items={[{ text: '举个例子' }]} onAsk={onAsk} />,
    );
    await userEvent.click(getByRole('button'));
    expect(onAsk).toHaveBeenCalledWith('举个例子');
  });

  it('prefers item.onClick over onAsk', async () => {
    const onAsk = vi.fn();
    const onClick = vi.fn();
    const { getByRole } = render(
      <FollowUpQuestion
        onAsk={onAsk}
        items={[{ text: '详细步骤', onClick }]}
      />,
    );
    await userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('详细步骤');
    expect(onAsk).not.toHaveBeenCalled();
  });

  it('renders icon and tooltip and disables when disabled=true', async () => {
    const onAsk = vi.fn();
    const { getByRole } = render(
      <FollowUpQuestion
        onAsk={onAsk}
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
    expect(onAsk).not.toHaveBeenCalled();
  });
});
