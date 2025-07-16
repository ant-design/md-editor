import { Dropdown } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { ToolBarItem } from './ToolBarItem';

const HeatTextMap = {
  1: '大标题',
  2: '段落标题',
  3: '小标题',
  4: '正文',
  Text: '正文',
} as const;

interface HeadingDropdownProps {
  baseClassName: string;
  hashId?: string;
  i18n: any;
  node: any;
  hideTools?: string[];
  onHeadingChange: (level: number) => void;
}

export const HeadingDropdown = React.memo<HeadingDropdownProps>(
  ({ baseClassName, hashId, i18n, node, hideTools, onHeadingChange }) => {
    const headingItems = React.useMemo(
      () =>
        ['H1', 'H2', 'H3', 'Text']
          .map((item, index) => {
            if (hideTools?.includes(item)) {
              return null;
            }
            return {
              label: HeatTextMap[item.replace('H', '') as '1'] || item,
              key: `head-${item}`,
              onClick: () => onHeadingChange(index + 1),
            };
          })
          .filter(Boolean),
      [hideTools, onHeadingChange],
    );

    const currentText = React.useMemo(() => {
      if (node?.[0]?.level) {
        return HeatTextMap[(node[0].level + '') as '1'] || `H${node[0].level}`;
      }
      return '正文';
    }, [node]);

    return (
      <Dropdown menu={{ items: headingItems }}>
        <ToolBarItem
          title={i18n?.locale?.heading || '标题'}
          icon={null}
          className={classnames(`${baseClassName}-item`, hashId)}
          style={{
            minWidth: 36,
            textAlign: 'center',
            fontSize: 12,
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {currentText}
        </ToolBarItem>
      </Dropdown>
    );
  },
);

HeadingDropdown.displayName = 'HeadingDropdown';
