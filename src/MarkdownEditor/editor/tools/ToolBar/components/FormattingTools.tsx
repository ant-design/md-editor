import classnames from 'classnames';
import React from 'react';
import { ToolBarItem } from './ToolBarItem';

interface FormattingToolsProps {
  baseClassName: string;
  hashId?: string;
  i18n: any;
  tools: Array<{
    key: string;
    type: string;
    title: string;
    icon: React.ReactNode;
    onClick?: (editor: any) => void;
    isActive?: (editor: any) => boolean;
  }>;
  editor: any;
  isCodeNode: boolean;
  onToolClick: (tool: any) => void;
  isFormatActive: (type: string) => boolean;
}

export const FormattingTools = React.memo<FormattingToolsProps>(
  ({
    baseClassName,
    hashId,
    i18n,
    tools,
    editor,
    isCodeNode,
    onToolClick,
    isFormatActive,
  }) => {
    return (
      <>
        {tools.map((tool) => {
          const isActive = tool.isActive
            ? tool.isActive(editor)
            : isFormatActive(tool.type);

          return (
            <ToolBarItem
              key={tool.key}
              title={
                (i18n?.locale?.[
                  tool.key as keyof typeof i18n.locale
                ] as string) || tool.title
              }
              icon={tool.icon}
              onClick={() => !isCodeNode && onToolClick(tool)}
              className={classnames(`${baseClassName}-item`, hashId)}
              style={{
                color: isActive ? '#1677ff' : undefined,
              }}
            />
          );
        })}
      </>
    );
  },
);

FormattingTools.displayName = 'FormattingTools';
