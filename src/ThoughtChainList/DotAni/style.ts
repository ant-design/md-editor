import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// 定义加载动画关键帧
const l3 = new Keyframes('l3', {
  '20%': {
    backgroundPosition: '0% 0%, 50% 50%, 100% 50%',
  },
  '40%': {
    backgroundPosition: '0% 100%, 50% 0%, 100% 50%',
  },
  '60%': {
    backgroundPosition: '0% 50%, 50% 100%, 100% 0%',
  },
  '80%': {
    backgroundPosition: '0% 50%, 50% 50%, 100% 100%',
  },
});

const genStyle: GenerateStyle<ChatTokenType> = () => {
  return {
    // 加载器样式
    '.md-editor-loader': {
      width: '20px',
      display: 'inline-flex',
      aspectRatio: 2,
      marginLeft: '8px',
      '--_g':
        'no-repeat radial-gradient(circle closest-side, rgb(102, 111, 141) 90%, #0000)',
      background: [
        'var(--_g) 0% 50%',
        'var(--_g) 50% 50%',
        'var(--_g) 100% 50%',
      ].join(', '),
      backgroundSize: 'calc(100% / 3) 50%',
      animation: `${l3.getName()} 1s infinite linear`,
    },
  };
};

/**
 * DotAni 样式 Hook
 * @param prefixCls 样式前缀
 * @returns 样式对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('DotAni', (token: ChatTokenType) => {
    const componentToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(componentToken)];
  });
}
