import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { DocMeta, WhiteBoxProcessInterface } from '.';
import { DeepThink } from './DeepThink';
import { RagRetrievalInfo } from './RagRetrievalInfo';
import { TableSql } from './TableSql';
import { TitleInfo } from './TitleInfo';
import { ToolCall } from './ToolCall';
import { WebSearch } from './WebSearch';

/**
 * 任务列表组件
 * @component
 * @param {Object} props - 组件属性
 * @param {string[]} props.taskList - 任务列表
 * @param {boolean} props.loading - 加载状态
 * @returns {JSX.Element} 任务列表组件
 */
export const ThoughtChainListItem: React.FC<{
  chatItem?: {
    isFinished: boolean;
    endTime?: number;
    createAt: number;
  };
  hashId: string;
  prefixCls: string;
  index: number;
  thoughtChainListItem: WhiteBoxProcessInterface & {
    icon: React.ReactNode;
  };
  isFinished?: boolean;
  setDocMeta: (meta: Partial<DocMeta>) => void;
}> = (props) => {
  const [collapse, setCollapse] = React.useState<boolean>(false);
  const { thoughtChainListItem, prefixCls, hashId, setDocMeta } = props;

  const detailDom = useMemo(() => {
    return (
      <>
        {thoughtChainListItem.category === 'RagRetrieval' ? (
          <RagRetrievalInfo
            {...thoughtChainListItem}
            onMetaClick={function (meta: DocMeta): void {
              setDocMeta(meta);
            }}
            key={thoughtChainListItem.runId}
            isFinished={!!props?.chatItem?.isFinished || !!props.isFinished}
          />
        ) : null}
        {thoughtChainListItem.category === 'TableSql' ? (
          <TableSql
            {...thoughtChainListItem}
            isFinished={!!props?.chatItem?.isFinished || !!props.isFinished}
            key={thoughtChainListItem.runId}
          />
        ) : null}
        {thoughtChainListItem.category === 'ToolCall' ? (
          <ToolCall
            {...thoughtChainListItem}
            key={thoughtChainListItem.runId}
            isFinished={!!props?.chatItem?.isFinished || !!props.isFinished}
          />
        ) : null}

        {thoughtChainListItem.category === 'DeepThink' ? (
          <DeepThink
            {...thoughtChainListItem}
            isFinished={!!props?.chatItem?.isFinished || !!props.isFinished}
            key={thoughtChainListItem.runId}
          />
        ) : null}

        {thoughtChainListItem.category === 'WebSearch' ? (
          <WebSearch
            {...thoughtChainListItem}
            key={thoughtChainListItem.runId}
            isFinished={!!props?.chatItem?.isFinished || !!props.isFinished}
          />
        ) : null}
      </>
    );
  }, [
    thoughtChainListItem.category,
    thoughtChainListItem.input,
    thoughtChainListItem.output,
    props.chatItem?.isFinished,
  ]);

  return (
    <motion.div
      className={classNames(
        `${props.prefixCls}-content-list-item`,
        props.hashId,
      )}
      variants={{
        hidden: {
          y: 8,
          opacity: 0,
        },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            delay: 0.1 * props.index,
            duration: 0.3,
          },
        },
      }}
    >
      <motion.div
        className={classNames(
          `${props.prefixCls}-content-list-item-icon`,
          {
            [`${props.prefixCls}-content-list-item-icon-loading`]:
              !thoughtChainListItem.output,
            [`${props.prefixCls}-content-list-item-icon-success`]:
              thoughtChainListItem.output,
          },
          props.hashId,
        )}
      >
        {thoughtChainListItem.icon}
      </motion.div>
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
        <TitleInfo
          title={thoughtChainListItem.info!}
          costMillis={thoughtChainListItem.costMillis}
          category={thoughtChainListItem.category!}
          prefixCls={prefixCls}
          hashId={hashId}
          setCollapse={(change) => setCollapse(change)}
          collapse={collapse}
          meta={thoughtChainListItem.meta?.data || {}}
          onMetaClick={(meta) => {
            setDocMeta(meta);
          }}
        />
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
          {detailDom}
        </div>
      </div>
    </motion.div>
  );
};
