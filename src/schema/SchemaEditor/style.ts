import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    // 主容器样式
    [`${token.componentCls}`]: {
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },

    [`${token.componentCls}-container`]: {
      display: 'flex',
      flex: 1,
      minHeight: 0,
    },

    [`${token.componentCls}-left`]: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
      borderRight: '1px solid #e1e5e9',
    },

    [`${token.componentCls}-right`]: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    },

    // HTML编辑器样式
    [`${token.componentCls}-html`]: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid #e1e5e9',
    },

    [`${token.componentCls}-html-header`]: {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    [`${token.componentCls}-html-header h3`]: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    [`${token.componentCls}-html-content`]: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },

    [`${token.componentCls}-html-content .ace_editor`]: {
      height: '100% !important',
      fontSize: '13px',
    },

    // JSON编辑器样式
    [`${token.componentCls}-json`]: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },

    [`${token.componentCls}-json-header`]: {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    [`${token.componentCls}-json-header h3`]: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    [`${token.componentCls}-json-content`]: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },

    [`${token.componentCls}-json-content .ace_editor`]: {
      height: '100% !important',
      fontSize: '13px',
    },

    // 预览区域样式
    [`${token.componentCls}-preview`]: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },

    [`${token.componentCls}-preview-header`]: {
      padding: '12px 16px',
      background: '#f8f9fa',
      borderBottom: '1px solid #e1e5e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    [`${token.componentCls}-preview-header h3`]: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: '#495057',
    },

    [`${token.componentCls}-error`]: {
      background: '#fff5f5',
      border: '1px solid #fed7d7',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      color: '#c53030',
      maxWidth: '300px',
      wordBreak: 'break-word',
    },

    [`${token.componentCls}-preview-content`]: {
      flex: 1,
      padding: '16px',
      overflow: 'auto',
      background: '#ffffff',
    },

    [`${token.componentCls}-fallback`]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6c757d',
      textAlign: 'center',
    },

    [`${token.componentCls}-fallback p`]: {
      margin: '4px 0',
      fontSize: '14px',
    },

    // 响应式设计
    '@media (max-width: 768px)': {
      [`${token.componentCls}-container`]: {
        flexDirection: 'column',
      },

      [`${token.componentCls}-left`]: {
        borderRight: 'none',
        borderBottom: '1px solid #e1e5e9',
      },

      [`${token.componentCls}-html, ${token.componentCls}-json`]: {
        minHeight: '200px',
      },
    },

    // 滚动条样式
    [`${token.componentCls}-preview-content::-webkit-scrollbar`]: {
      width: '6px',
    },

    [`${token.componentCls}-preview-content::-webkit-scrollbar-track`]: {
      background: '#f1f1f1',
      borderRadius: '3px',
    },

    [`${token.componentCls}-preview-content::-webkit-scrollbar-thumb`]: {
      background: '#c1c1c1',
      borderRadius: '3px',
    },

    [`${token.componentCls}-preview-content::-webkit-scrollbar-thumb:hover`]: {
      background: '#a8a8a8',
    },

    // 编辑器主题适配
    [`${token.componentCls} .ace_editor`]: {
      background: '#ffffff',
      color: '#333333',
    },

    [`${token.componentCls} .ace_editor.ace_dark`]: {
      background: '#2d3748',
      color: '#e2e8f0',
    },

    // 焦点状态
    [`${token.componentCls}-html-content:focus-within, ${token.componentCls}-json-content:focus-within`]:
      {
        boxShadow: 'inset 0 0 0 2px #3182ce',
      },

    // 加载状态
    [`${token.componentCls}-loading`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6c757d',
    },

    [`${token.componentCls}-loading::after`]: {
      content: "''",
      width: '20px',
      height: '20px',
      border: '2px solid #e1e5e9',
      borderTop: '2px solid #3182ce',
      borderRadius: '50%',
      animationName: 'spin',
      animationDuration: '1s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      marginLeft: '8px',
    },
  };
};

export function useSchemaEditorStyle(prefixCls?: string) {
  return useEditorStyleRegister('SchemaEditor', (token: ChatTokenType) => {
    const schemaEditorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(schemaEditorToken)];
  });
}
