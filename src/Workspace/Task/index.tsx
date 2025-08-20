import { ConfigProvider } from 'antd';
import React, { type FC, useContext } from 'react';
import {
  ThoughtChainList,
  ThoughtChainListProps,
  WhiteBoxProcessInterface,
} from '../../ThoughtChainList';
import { useTaskStyle } from './style';

export interface TaskItemInput {
  content: WhiteBoxProcessInterface[];
  thoughtChainListProps?: Partial<ThoughtChainListProps>;
}

/**
 * TaskList 组件 - 任务列表组件
 *
 * 该组件用于在工作空间中显示任务列表，基于ThoughtChainList构建，
 * 提供任务执行过程的可视化展示，支持思维链和工具调用的显示。
 *
 * @component
 * @description 任务列表组件，显示任务执行过程
 * @param {Object} props - 组件属性
 * @param {TaskItemInput} props.data - 任务数据
 * @param {WhiteBoxProcessInterface[]} props.data.content - 任务内容（思维链数据）
 * @param {Partial<ThoughtChainListProps>} [props.data.thoughtChainListProps] - 思维链列表配置
 *
 * @example
 * ```tsx
 * <TaskList
 *   data={{
 *     content: [
 *       { info: '分析问题', status: 'done' },
 *       { info: '执行任务', status: 'running' }
 *     ],
 *     thoughtChainListProps: {
 *       finishAutoCollapse: true
 *     }
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的任务列表组件
 *
 * @remarks
 * - 基于ThoughtChainList构建
 * - 显示任务执行过程
 * - 支持思维链可视化
 * - 提供工具调用展示
 * - 支持自定义配置
 * - 提供默认样式优化
 * - 支持任务状态管理
 */
export const TaskList: FC<{ data: TaskItemInput }> = ({ data }) => {
  // 默认的ThoughtChainList配置
  const getDefaultProps = (): Partial<ThoughtChainListProps> => ({
    style: { width: '100%' },
    finishAutoCollapse: false,
    titleRender: () => <></>,
  });

  // 合并默认配置和用户传入的配置
  const getMergedProps = (
    defaultProps: Partial<ThoughtChainListProps>,
  ): Partial<ThoughtChainListProps> => {
    return {
      ...defaultProps,
      ...data.thoughtChainListProps,
    };
  };

  // 使用 ConfigProvider 获取前缀类名
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace-task');

  const { wrapSSR, hashId } = useTaskStyle(prefixCls);

  return wrapSSR(
    <div className={`${prefixCls} ${hashId}`}>
      <ThoughtChainList
        {...getMergedProps(getDefaultProps())}
        thoughtChainList={data.content}
        style={{
          padding: 0,
          borderRadius: 0,
          boxShadow: 'none',
        }}
      />
    </div>,
  );
};
