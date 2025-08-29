import { Keyframes } from '@ant-design/cssinjs';
import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../hooks/useStyle';

// 定义旋转动画关键帧
const spin = new Keyframes('spin', {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    // 主容器样式
    '.schema-editor': {
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },

    '.schema-editor-container': {
      display: 'flex',
      flex: 1,
      minHeight: 0,
    },

    '.schema-editor-left': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
      borderRight: '1px solid #e1e5e9',
    },

    '.schema-editor-right': {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    },

    // HTML编辑器样式
    '.schema-editor-html': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid #e1e5e9',
    },

    '.schema-editor-html-header': {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    '.schema-editor-html-header h3': {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    '.schema-editor-html-content': {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },

    '.schema-editor-html-content .ace_editor': {
      height: '100% !important',
      fontSize: '13px',
    },

    // JSON编辑器样式
    '.schema-editor-json': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },

    '.schema-editor-json-header': {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    '.schema-editor-json-header h3': {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    '.schema-editor-json-content': {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },

    '.schema-editor-json-content .ace_editor': {
      height: '100% !important',
      fontSize: '13px',
    },

    // 预览区域样式
    '.schema-editor-preview': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },

    '.schema-editor-preview-header': {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    '.schema-editor-preview-header h3': {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    '.schema-editor-error': {
      background: '#fff5f5',
      border: '1px solid #fed7d7',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      color: '#c53030',
      maxWidth: '300px',
      wordBreak: 'break-word',
    },

    '.schema-editor-preview-content': {
      flex: 1,
      padding: '16px',
      overflow: 'auto',
      background: '#ffffff',
    },

    '.schema-editor-fallback': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6c757d',
      textAlign: 'center',
    },

    '.schema-editor-fallback p': {
      margin: '4px 0',
      fontSize: '14px',
    },

    // 响应式设计
    '@media (max-width: 768px)': {
      '.schema-editor-container': {
        flexDirection: 'column',
      },

      '.schema-editor-left': {
        borderRight: 'none',
        borderBottom: '1px solid #e1e5e9',
      },

      '.schema-editor-html, .schema-editor-json': {
        minHeight: '200px',
      },
    },

    // 滚动条样式
    '.schema-editor-preview-content::-webkit-scrollbar': {
      width: '6px',
    },

    '.schema-editor-preview-content::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },

    '.schema-editor-preview-content::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px',
    },

    '.schema-editor-preview-content::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },

    // 编辑器主题适配
    '.schema-editor .ace_editor': {
      background: '#ffffff',
      color: '#333333',
    },

    '.schema-editor .ace_editor.ace_dark': {
      background: '#2d3748',
      color: '#e2e8f0',
    },

    // 焦点状态
    '.schema-editor-html-content:focus-within, .schema-editor-json-content:focus-within': {
      boxShadow: 'inset 0 0 0 2px #3182ce',
    },

    // 加载状态
    '.schema-editor-loading': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6c757d',
    },

    '.schema-editor-loading::after': {
      content: "''",
      width: '20px',
      height: '20px',
      border: '2px solid #e1e5e9',
      borderTop: '2px solid #3182ce',
      borderRadius: '50%',
      animation: `${spin.getName()} 1s linear infinite`,
      marginLeft: '8px',
    },
  };
};

/**
 * SchemaEditor 样式 Hook
 * @param prefixCls 样式前缀
 * @returns 样式对象
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('SchemaEditor', (token: ChatTokenType) => {
    const componentToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(componentToken)];
  });
}
