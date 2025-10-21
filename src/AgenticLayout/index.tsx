import { ConfigProvider } from 'antd';
import React, { ReactNode, useContext } from 'react';
import {
  LayoutHeader,
  type LayoutHeaderConfig,
} from '../components/LayoutHeader';
import { useAgenticLayoutStyle } from './style';

export interface AgenticLayoutProps {
  /** 左侧内容 */
  left?: ReactNode;
  /** 中间内容 */
  center: ReactNode;
  /** 右侧内容 */
  right?: ReactNode;
  /** 头部配置 */
  header?: LayoutHeaderConfig;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 左侧宽度 */
  leftWidth?: number;
  /** 右侧宽度 */
  rightWidth?: number;
  /** 最小高度 */
  minHeight?: string | number;
}

/**
 * AgenticLayout 组件 - 智能体布局组件
 *
 * 该组件提供一个三栏布局的容器，支持左中右三个区域的灵活配置。
 * 左右侧栏支持折叠功能，中间区域自适应宽度。
 *
 * @component
 * @description 智能体布局组件，提供左中右三栏布局
 * @param {AgenticLayoutProps} props - 组件属性
 * @param {ReactNode} [props.left] - 左侧内容
 * @param {ReactNode} props.center - 中间内容
 * @param {ReactNode} [props.right] - 右侧内容
 * @param {LayoutHeaderConfig} [props.header] - 头部配置
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义CSS类名
 * @param {number} [props.leftWidth=256] - 左侧宽度
 * @param {number} [props.rightWidth=256] - 右侧宽度
 * @param {string | number} [props.minHeight='600px'] - 最小高度
 *
 * @example
 * ```tsx
 * <AgenticLayout
 *   left={<History />}
 *   center={<ChatLayout />}
 *   right={<Workspace />}
 *   header={{
 *     title: "智能体助手",
 *     showShare: true,
 *     showLeftCollapse: true,
 *     showRightCollapse: true,
 *     onLeftCollapse: (collapsed) => console.log('左侧折叠:', collapsed),
 *     onRightCollapse: (collapsed) => console.log('右侧折叠:', collapsed),
 *     onShare: () => console.log('分享')
 *   }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的布局组件
 *
 * @remarks
 * - 支持左右侧栏的独立折叠控制
 * - 中间区域自适应剩余宽度
 * - 提供响应式布局适配
 * - 支持自定义宽度和高度
 * - 集成 Ant Design 主题系统
 */
export const AgenticLayout: React.FC<AgenticLayoutProps> = ({
  left,
  center,
  right,
  header,
  style,
  className,
  leftWidth = 256,
  rightWidth = 540,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('agentic-layout');
  const { wrapSSR, hashId } = useAgenticLayoutStyle(prefixCls);

  // 从 header 配置中获取折叠状态
  const leftCollapsed =
    header?.leftCollapsed ?? header?.leftDefaultCollapsed ?? false;
  const rightCollapsed =
    header?.rightCollapsed ?? header?.rightDefaultCollapsed ?? false;

  return wrapSSR(
    <div className={`${prefixCls} ${className || ''} ${hashId}`} style={style}>
      {/* 主体内容区域 */}
      <div
        className={`${prefixCls}-body ${hashId}`}
        style={{ display: 'flex', flex: 1 }}
      >
        {/* 左侧边栏 */}
        {left && (
          <div
            className={`${prefixCls}-sidebar ${prefixCls}-sidebar-left ${
              leftCollapsed ? `${prefixCls}-sidebar-left-collapsed` : ''
            } ${hashId}`}
            style={{
              width: leftCollapsed ? 0 : leftWidth,
              minWidth: leftCollapsed ? 0 : leftWidth,
              maxWidth: leftCollapsed ? 0 : leftWidth,
            }}
          >
            <div className={`${prefixCls}-sidebar-content ${hashId}`}>
              {left}
            </div>
          </div>
        )}

        {/* 中间内容区域 */}
        <div
          className={`${prefixCls}-main ${hashId}`}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {header && (
            <LayoutHeader
              {...header}
              leftCollapsible={header.leftCollapsible ?? !!left}
              rightCollapsible={header.rightCollapsible ?? !!right}
            />
          )}
          <div className={`${prefixCls}-main-content ${hashId}`}>{center}</div>
        </div>
      </div>
      {/* 右侧边栏 */}
      {right && (
        <div
          className={`${prefixCls}-sidebar ${prefixCls}-sidebar-right ${
            rightCollapsed ? `${prefixCls}-sidebar-right-collapsed` : ''
          } ${hashId}`}
          style={{
            width: rightCollapsed ? 0 : rightWidth,
            minWidth: rightCollapsed ? 0 : rightWidth,
            maxWidth: rightCollapsed ? 0 : rightWidth,
          }}
        >
          <div className={`${prefixCls}-sidebar-content ${hashId}`}>
            {right}
          </div>
        </div>
      )}
    </div>,
  );
};
