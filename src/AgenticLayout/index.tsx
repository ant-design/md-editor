import { ConfigProvider } from 'antd';
import { useMergedState } from 'rc-util';
import React, { ReactNode, useContext } from 'react';
import { useAgenticLayoutStyle } from './style';

export interface AgenticLayoutProps {
  /** 左侧内容 */
  left?: ReactNode;
  /** 中间内容 */
  center: ReactNode;
  /** 右侧内容 */
  right?: ReactNode;
  /** 左侧是否可折叠 */
  leftCollapsible?: boolean;
  /** 右侧是否可折叠 */
  rightCollapsible?: boolean;
  /** 左侧折叠状态（受控） */
  leftCollapsed?: boolean;
  /** 右侧折叠状态（受控） */
  rightCollapsed?: boolean;
  /** 左侧默认折叠状态（非受控时使用） */
  leftDefaultCollapsed?: boolean;
  /** 右侧默认折叠状态（非受控时使用） */
  rightDefaultCollapsed?: boolean;
  /** 左侧折叠状态变化回调 */
  onLeftCollapse?: (collapsed: boolean) => void;
  /** 右侧折叠状态变化回调 */
  onRightCollapse?: (collapsed: boolean) => void;
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
 * @param {boolean} [props.leftCollapsible=true] - 左侧是否可折叠
 * @param {boolean} [props.rightCollapsible=true] - 右侧是否可折叠
 * @param {boolean} [props.leftDefaultCollapsed=false] - 左侧默认折叠状态
 * @param {boolean} [props.rightDefaultCollapsed=false] - 右侧默认折叠状态
 * @param {(collapsed: boolean) => void} [props.onLeftCollapse] - 左侧折叠状态变化回调
 * @param {(collapsed: boolean) => void} [props.onRightCollapse] - 右侧折叠状态变化回调
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
 *   center={<ChatFlowContainer />}
 *   right={<Workspace />}
 *   leftCollapsible={true}
 *   rightCollapsible={true}
 *   onLeftCollapse={(collapsed) => console.log('左侧折叠:', collapsed)}
 *   onRightCollapse={(collapsed) => console.log('右侧折叠:', collapsed)}
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
  leftCollapsed: controlledLeftCollapsed,
  rightCollapsed: controlledRightCollapsed,
  leftDefaultCollapsed = false,
  rightDefaultCollapsed = false,
  onLeftCollapse,
  onRightCollapse,
  style,
  className,
  leftWidth = 256,
  rightWidth = 540,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('agentic-layout');
  const { wrapSSR, hashId } = useAgenticLayoutStyle(prefixCls);

  // 使用 useMergedState 管理左侧折叠状态
  const [leftCollapsed] = useMergedState(leftDefaultCollapsed, {
    value: controlledLeftCollapsed,
    onChange: onLeftCollapse,
  });

  // 使用 useMergedState 管理右侧折叠状态
  const [rightCollapsed] = useMergedState(rightDefaultCollapsed, {
    value: controlledRightCollapsed,
    onChange: onRightCollapse,
  });

  return wrapSSR(
    <div className={`${prefixCls} ${className || ''} ${hashId}`} style={style}>
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
          <div className={`${prefixCls}-sidebar-content ${hashId}`}>{left}</div>
        </div>
      )}

      {/* 中间内容区域 */}
      <div
        className={`${prefixCls}-main ${hashId}`}
        style={{
          flex: 1,
          display: 'flex',
          minWidth: 0,
        }}
      >
        {center}
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
