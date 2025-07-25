﻿import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { DocMeta, ThoughtChainListProps, WhiteBoxProcessInterface } from '.';
import { MarkdownEditorProps } from '../MarkdownEditor';
import { DeepThink } from './DeepThink';
import { RagRetrievalInfo } from './RagRetrievalInfo';
import { TableSql } from './TableSql';
import { TitleInfo } from './TitleInfo';
import { ToolCall } from './ToolCall';
import { WebSearch } from './WebSearch';

// 详情内容组件 - 独立 memo
const ThoughtChainItemDetail = React.memo<{
  category?: string;
  thoughtChainListItem: WhiteBoxProcessInterface;
  isFinished: boolean;
  markdownRenderProps?: MarkdownEditorProps;
  onMetaClick: (meta: DocMeta) => void;
}>(
  ({
    category,
    thoughtChainListItem,
    isFinished,
    markdownRenderProps,
    onMetaClick,
  }) => {
    switch (category) {
      case 'RagRetrieval':
        return (
          <RagRetrievalInfo
            {...thoughtChainListItem}
            onMetaClick={onMetaClick}
            key={thoughtChainListItem.runId}
            isFinished={isFinished}
            markdownRenderProps={markdownRenderProps}
          />
        );
      case 'TableSql':
        return (
          <TableSql
            {...thoughtChainListItem}
            isFinished={isFinished}
            key={thoughtChainListItem.runId}
            markdownRenderProps={markdownRenderProps}
            data-testid="table-sql"
          />
        );
      case 'ToolCall':
        return (
          <ToolCall
            {...thoughtChainListItem}
            key={thoughtChainListItem.runId}
            markdownRenderProps={markdownRenderProps}
            isFinished={isFinished}
            data-testid="tool-call"
          />
        );
      case 'DeepThink':
        return (
          <DeepThink
            {...thoughtChainListItem}
            isFinished={isFinished}
            key={thoughtChainListItem.runId}
            markdownRenderProps={markdownRenderProps}
            data-testid="deep-think"
          />
        );
      case 'WebSearch':
        return (
          <WebSearch
            {...thoughtChainListItem}
            key={thoughtChainListItem.runId}
            isFinished={isFinished}
            markdownRenderProps={markdownRenderProps}
          />
        );
      default:
        return null;
    }
  },
);

// 图标容器组件 - 独立 memo
const ThoughtChainItemIcon = React.memo<{
  prefixCls: string;
  hashId: string;
  hasOutput: boolean;
  icon: React.ReactNode;
}>(({ prefixCls, hashId, hasOutput, icon }) => {
  return (
    <motion.div
      className={classNames(
        `${prefixCls}-content-list-item-icon`,
        {
          [`${prefixCls}-content-list-item-icon-loading`]: !hasOutput,
          [`${prefixCls}-content-list-item-icon-success`]: hasOutput,
        },
        hashId,
      )}
    >
      {icon}
    </motion.div>
  );
});

// 动画容器组件 - 独立 memo
const ThoughtChainItemMotion = React.memo<{
  prefixCls: string;
  hashId: string;
  index: number;
  children: React.ReactNode;
}>(({ prefixCls, hashId, index, children }) => {
  const variants = useMemo(() => {
    if (process.env.NODE_ENV === 'test') return undefined;

    return {
      hidden: {
        y: 8,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          delay: 0.1 * index,
          duration: 0.3,
        },
      },
    };
  }, [index]);

  return (
    <motion.div
      role="listitem"
      className={classNames(`${prefixCls}-content-list-item`, hashId)}
      variants={variants}
    >
      {children}
    </motion.div>
  );
});

/**
 * 任务列表组件
 * @component
 * @param {Object} props - 组件属性
 * @param {string[]} props.taskList - 任务列表
 * @param {boolean} props.loading - 加载状态
 * @returns {JSX.Element} 任务列表组件
 */
export const ThoughtChainListItem: React.FC<
  {
    bubble?: {
      isFinished?: boolean;
      endTime?: number;
      createAt?: number;
    };
    hashId: string;
    prefixCls: string;
    index: number;
    thoughtChainListItem: WhiteBoxProcessInterface & {
      icon: React.ReactNode;
    };
    isFinished?: boolean;
    setDocMeta: (meta: Partial<DocMeta>) => void;
    markdownRenderProps?: MarkdownEditorProps;
  } & ThoughtChainListProps['thoughtChainItemRender']
> = React.memo((props) => {
  const [collapse, setCollapse] = React.useState<boolean>(false);
  const { thoughtChainListItem, prefixCls, hashId, setDocMeta } = props;

  const markdownRenderProps = useMemo(() => {
    return (
      props.markdownRenderProps || {
        codeProps: {
          showLineNumbers: false,
        },
      }
    );
  }, [props.markdownRenderProps]);

  const isFinished = useMemo(() => {
    return !!props?.bubble?.isFinished || !!props.isFinished;
  }, [props?.bubble?.isFinished, props.isFinished]);

  const handleMetaClick = React.useCallback(
    (meta: DocMeta) => {
      setDocMeta(meta);
    },
    [setDocMeta],
  );

  const handleCollapseChange = React.useCallback((change: boolean) => {
    setCollapse(change);
  }, []);

  const titleDom = (
    <TitleInfo
      title={thoughtChainListItem.info!}
      costMillis={thoughtChainListItem.costMillis}
      category={thoughtChainListItem.category!}
      prefixCls={prefixCls}
      hashId={hashId}
      isFinished={isFinished}
      setCollapse={handleCollapseChange}
      collapse={collapse}
      titleExtraRender={
        props.titleExtraRender
          ? (titleDom) =>
              props?.titleExtraRender?.(thoughtChainListItem, titleDom)
          : undefined
      }
      meta={thoughtChainListItem.meta?.data || {}}
      onMetaClick={handleMetaClick}
    />
  );

  const content = (
    <ThoughtChainItemDetail
      category={thoughtChainListItem.category}
      thoughtChainListItem={thoughtChainListItem}
      isFinished={isFinished}
      markdownRenderProps={markdownRenderProps}
      onMetaClick={handleMetaClick}
    />
  );

  return (
    <ThoughtChainItemMotion
      prefixCls={prefixCls}
      hashId={hashId}
      index={props.index}
    >
      <ThoughtChainItemIcon
        prefixCls={prefixCls}
        hashId={hashId}
        hasOutput={!!thoughtChainListItem.output}
        icon={thoughtChainListItem.icon}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        {props.titleRender
          ? props.titleRender(thoughtChainListItem!, titleDom)
          : titleDom}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: !collapse ? 'auto' : '0px',
            overflow: 'hidden',
            gap: 8,
            transition: 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionBehavior: 'allow-discrete',
          }}
        >
          {props.contentRender
            ? props.contentRender(thoughtChainListItem, content)
            : content}
        </div>
      </div>
    </ThoughtChainItemMotion>
  );
});
