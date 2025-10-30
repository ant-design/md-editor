import { BackBottom } from './BackBottom';
import { BackTop } from './BackTop';

export type { BackBottomProps } from './BackBottom';
export type { BackTopProps } from './BackTop';

/**
 * BackTo 组件集合 - 页面滚动导航组件
 *
 * 该对象导出包含返回顶部和返回底部两个组件，提供便捷的页面滚动导航功能。
 *
 * @namespace BackTo
 * @property {React.FC<BackTopProps>} Top - 返回顶部按钮组件
 * @property {React.FC<BackBottomProps>} Bottom - 返回底部按钮组件
 *
 * @example
 * ```tsx
 * import { BackTo } from 'agentic-ui';
 *
 * // 使用返回顶部组件
 * <BackTo.Top duration={300} />
 *
 * // 使用返回底部组件
 * <BackTo.Bottom duration={300} />
 * ```
 */
export const BackTo = {
  Top: BackTop,
  Bottom: BackBottom,
};
