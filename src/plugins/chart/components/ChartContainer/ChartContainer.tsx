import classNames from 'classnames';
import React from 'react';
import { useStyle } from './style';

export interface ChartContainerProps {
  /** 自定义CSS类名 */
  className?: string;

  /** 样式对象 */
  style?: React.CSSProperties;
  /** 图表主题 */
  theme?: 'light' | 'dark';
  /** 是否为移动端 */
  isMobile?: boolean;
  /** 图表变体 */
  variant?: 'outline' | 'borderless';
}

export interface ChartContainerRef {
  hashId: string;
}

/**
 * ChartContainer 组件 - 图表容器组件
 *
 * 该组件用于统一管理图表组件的 className 逻辑，包括 baseClassName、hashId 和自定义 className 的组合。
 * 提供一致的样式管理和 SSR 支持。
 *
 * @component
 * @description 图表容器组件，统一管理图表组件的样式类名
 * @param {ChartContainerProps} props - 组件属性
 * @param {string} props.baseClassName - 基础类名
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.ReactNode} props.children - 子元素
 * @param {React.CSSProperties} [props.style] - 样式对象
 * @param {'light' | 'dark'} [props.theme='light'] - 图表主题
 * @param {boolean} [props.isMobile=false] - 是否为移动端
 *
 * @example
 * ```tsx
 * <ChartContainer
 *   baseClassName="area-chart-container"
 *   className="custom-chart"
 *   theme="light"
 *   isMobile={false}
 *   style={{ width: 600, height: 400 }}
 * >
 *   <div>图表内容</div>
 * </ChartContainer>
 * ```
 *
 * @returns {React.ReactElement} 渲染的图表容器组件
 *
 * @remarks
 * - 自动处理 baseClassName、hashId 和自定义 className 的组合
 * - 提供 SSR 支持
 * - 支持样式隔离
 * - 统一的样式管理
 */
const ChartContainer: React.FC<
  ChartContainerProps & {
    baseClassName: string;
    /** 子元素 */
    children: React.ReactNode;
  }
> = ({
  baseClassName,
  className,
  children,
  style,
  theme = 'light',
  variant = 'default',
  isMobile = false,
  ...restProps
}) => {
  const { wrapSSR, hashId } = useStyle(baseClassName);

  // 构建动态类名
  const combinedClassName = classNames(
    baseClassName,
    hashId,
    {
      [`${baseClassName}-light-theme`]: theme === 'light',
      [`${baseClassName}-dark-theme`]: theme === 'dark',
      [`${baseClassName}-mobile`]: isMobile,
      [`${baseClassName}-desktop`]: !isMobile,
      [`${baseClassName}-outline`]: variant === 'outline',
      [`${baseClassName}-borderless`]: variant === 'borderless',
    },
    className,
  );

  return wrapSSR(
    <div className={combinedClassName} style={style} {...restProps}>
      {children}
    </div>,
  );
};

export default ChartContainer;
