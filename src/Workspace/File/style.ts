import type { ChatTokenType, GenerateStyle } from '../../hooks/useStyle';
import { useEditorStyleRegister } from '../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    // 文件组件样式
    [`${token.componentCls}-container`]: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      // 分组展示模式
      [`&--group`]: {
        [`${token.componentCls}-group`]: {
          // 分组标题栏
          [`&-header`]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            padding: '8px 12px 8px 0px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',

            [`&-left, &-right`]: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',

              [`.ant-btn, .ant-btn .anticon`]: {
                color: '#767E8B',
              },
              [`.ant-btn:hover, .ant-btn:focus, .ant-btn:active, .ant-btn:hover .anticon, .ant-btn:focus .anticon, .ant-btn:active .anticon`]:
                {
                  color: '#767E8B',
                },
            },
          },

          // 展开收起图标
          [`&-toggle-icon`]: {
            fontSize: 'var(--font-size-sm)',
            color: '#6c757d',
            transition: 'transform 0.2s ease',
          },

          // 文件类型图标
          [`&-type-icon`]: {
            display: 'flex',
            alignItems: 'center',

            svg: {
              width: '16px',
              height: '16px',
            },
          },

          // 文件类型名称
          [`&-type-name`]: {
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 'var(--font-size-base)',
            fontWeight: 500,
            color: '#343a40',
          },

          // 文件数量
          [`&-count`]: {
            fontSize: 'var(--font-size-sm)',
            color: '#6c757d',
            background: 'rgba(20, 22, 28, 0.06)',
            padding: '2px 6px',
            borderRadius: '200px',
            minWidth: '20px',
            textAlign: 'center',
          },

          // 分组内容区域
          [`&-content`]: {
            paddingLeft: '12px',
          },

          // 分组动作按钮（下载等）图标颜色保持一致
          [`&-action-btn`]: {
            [`.anticon`]: {
              color: '#767E8B',
            },
            ['&:hover .anticon, &:focus .anticon, &:active .anticon']: {
              color: '#767E8B',
            },
          },
        },
      },
    },

    // 文件项样式
    [`${token.componentCls}-item`]: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginBottom: '4px',
      padding: '4px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',

      '&:last-child': {
        marginBottom: 0,
      },

      '&:hover': {
        background: 'rgba(20, 22, 28, 0.03)',
        boxSizing: 'border-box',
        border: '0px solid rgba(20, 22, 28, 0.07)',

        // 鼠标悬浮时显示操作区
        [`${token.componentCls}-item-actions`]: {
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'auto',
        },
      },

      // 键盘聚焦时也显示操作区，提升可访问性
      '&:focus-within': {
        [`${token.componentCls}-item-actions`]: {
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'auto',
        },
      },

      // 文件图标
      [`&-icon`]: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,

        svg: {
          width: '40px',
          height: '40px',
        },
      },

      // 文件信息
      [`&-info`]: {
        flex: 1,
        minWidth: 0,
      },

      // 文件名
      [`&-name`]: {
        fontSize: '13px',
        color: '#343a40',
        fontWeight: 400,
        lineHeight: 1.4,
        wordBreak: 'break-all',
      },

      // 文件详情容器
      [`&-details`]: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      },

      // 文件类型、大小、时间
      [`&-type, &-size, &-time`]: {
        fontSize: '12px',
        color: '#959da8',
      },

      // 分割符
      [`&-separator`]: {
        fontSize: 'var(--font-size-xs)',
        color: 'rgba(20, 22, 28, 0.07)',
        margin: '0 4px',
      },

      [`&-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        // 默认隐藏，仅在 hover/focus 时显示
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease, visibility 0.2s ease',

        // 保持图标按钮颜色一致
        [`.ant-btn, .ant-btn .anticon`]: {
          color: '#767E8B',
        },
        [`.ant-btn:hover, .ant-btn:focus, .ant-btn:active, .ant-btn:hover .anticon, .ant-btn:focus .anticon, .ant-btn:active .anticon`]:
          {
            color: '#767E8B',
          },
      },

      // 文件项动作按钮（预览/下载等）图标颜色保持一致
      [`&-action-btn`]: {
        [`.anticon`]: {
          color: '#767E8B',
        },
        ['&:hover .anticon, &:focus .anticon, &:active .anticon']: {
          color: '#767E8B',
        },
      },
    },

    // 空状态
    [`${token.componentCls}-empty`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24,
      minHeight: 200,
      flex: 1,
      // 让空状态在有搜索栏等头部时也能占据剩余空间
    },

    // 预览组件样式
    [`${token.componentCls}-preview`]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fff',
      position: 'relative',

      // 预览头部
      [`&-header`]: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px 8px 0',
        borderBottom: '1px solid rgba(20, 22, 28, 0.07)',
        background: '#fff',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      },

      // 返回按钮
      [`&-back-button`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#767e8b',
        transition: 'all 0.2s ease',
        borderRadius: '4px',

        '&:hover': {
          background: '#f0f0f0',
        },
      },

      // 返回图标
      [`&-back-icon`]: {
        fontSize: 'var(--font-size-xl)',
      },

      // 文件信息容器
      [`&-file-info`]: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      },

      // 文件标题行
      [`&-file-title`]: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      },

      // 文件图标
      [`&-file-icon`]: {
        display: 'flex',
        alignItems: 'center',

        svg: {
          width: '20px',
          height: '20px',
        },
      },

      // 文件名
      [`&-file-name`]: {
        fontSize: '13px',
        fontWeight: 500,
        color: '#343a40',
      },

      // 生成时间
      [`&-generate-time`]: {
        fontSize: '12px',
        color: '#767e8b',
      },

      // 操作按钮容器
      [`&-actions`]: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',

        // 保持预览头部操作按钮的图标颜色一致
        [`.ant-btn, .ant-btn .anticon`]: {
          color: '#767E8B',
        },
        [`.ant-btn:hover, .ant-btn:focus, .ant-btn:active, .ant-btn:hover .anticon, .ant-btn:focus .anticon, .ant-btn:active .anticon`]:
          {
            color: '#767E8B',
          },
      },

      // 预览内容区域
      [`&-content`]: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        minHeight: 0, // 确保 flex 子项可以收缩
      },

      // iframe 预览
      [`&-iframe`]: {
        width: '100%',
        height: '100%',
        border: 'none',
        flex: 1,
      },

      // 占位符
      [`&-placeholder`]: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      },

      // 占位符内容
      [`&-placeholder-content`]: {
        textAlign: 'center',
        color: '#8c8c8c',

        p: {
          margin: '8px 0',
          fontSize: '13px',
        },
      },
    },
  };
};

export function useFileStyle(prefixCls?: string) {
  return useEditorStyleRegister('WorkspaceFile', (token) => {
    const fileToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(fileToken)];
  });
}
