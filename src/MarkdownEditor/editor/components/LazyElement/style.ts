import {
  GenerateStyle,
  genComponentStyleHook,
} from '../../../utils/genComponentStyleHook';

/**
 * LazyElement 样式生成器
 */
const genLazyElementStyle: GenerateStyle<'LazyElement'> = (token) => {
  const { componentCls } = token;

  return {
    [`${componentCls}`]: {
      position: 'relative',
      width: '100%',
    },
  };
};

/**
 * LazyElement 组件样式 Hook
 */
export const useStyle = genComponentStyleHook('LazyElement', (token) => [
  genLazyElementStyle(token),
]);
