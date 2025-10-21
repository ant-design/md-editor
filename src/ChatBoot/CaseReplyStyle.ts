import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      width: '330px',
      background: '#fdfdfd',
      margin: '4px',
      borderRadius: '20px',
      boxShadow: 'inset 0 0 1px 0 rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',

      '&:hover': {
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.08)',
        transform: 'scale(1.02)',
      },

      '&:active': {
        transform: 'scale(0.95)',
      },

      // cover 区域
      '&-cover': {
        WebkitMaskImage: '-webkit-linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 0',
      },

      // coverContent 白色子卡片
      '&-cover-content': {
        width: '80%',
        marginTop: '32px',
        borderRadius: '16px',
        boxShadow:
          '0px 0px 1px 0px rgba(71, 98, 234, 0.05), 0px 6px 16px 0px rgba(71, 98, 234, 0.12)',
        background: '#ffffff',
        padding: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'rotate(0deg) translateY(0)',
      },

      // coverContent 悬停状态
      '&-cover-content-hovered': {
        transform: 'rotate(8deg) translateY(16px)',
      },

      // 引号图标
      '&-quote-icon': {
        width: '24px',
        height: '24px',
        marginBottom: '12px',
        transform: 'rotate(180deg)',
        
        '& svg': {
          width: '24px',
          height: '24px',
          transform: 'rotate(180deg)',
        },
      },

      // 引用文字
      '&-quote-text': {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '22px',
        color: 'rgba(0, 25, 61, 0.33)',
        maxHeight: '88px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
      },

      // 底部内容区域
      '&-bottom': {
        position: 'relative',
        padding: '20px',
      },

      // 标题
      '&-title': {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '24px',
        color: '#343A45',
        marginBottom: '8px',
      },

      // 描述
      '&-description': {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        color: '#767E8B',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      // buttonBar 按钮区域
      '&-button-bar': {
        position: 'absolute',
        textAlign: 'right',
        bottom: '8px',
        left: '16px',
        right: '16px',
        marginBottom: 0,
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #ffffff 40%)',
        borderRadius: '4px',
        padding: '8px',
        width: 'auto',
        opacity: 0,
        transform: 'translateY(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
      },

      // buttonBar 显示状态
      '&-button-bar-visible': {
        opacity: 1,
        transform: 'translateY(0)',
        pointerEvents: 'auto',
      },
    },
  };
};

/**
 * CaseReply 组件样式
 */
export const useStyle = (prefixCls?: string) => {
  return useEditorStyleRegister('ChatBootCaseReply', (token) => {
    const caseReplyToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(caseReplyToken)];
  });
};
