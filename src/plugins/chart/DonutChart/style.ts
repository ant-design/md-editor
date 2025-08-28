import {
  ChatTokenType,
  GenerateStyle,
  useEditorStyleRegister,
} from '../../../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      display: 'grid',
      gap: 16,
      gridTemplateColumns:
        'repeat(auto-fit, minmax(var(--donut-item-min-width, 200px), 1fr))',

      '&-toolbar': {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
      },

      '&-row': {
        display: 'flex',
        alignItems: 'center',
      },

      '&-chart': {
        width: 'var(--donut-chart-width, 200px)',
        height: 'var(--donut-chart-height, 200px)',
      },

      '&-single': {
        width: '100%',
        height: 'var(--donut-chart-height, 200px)',
      },

      '&-legend': {
        marginLeft: 12,
      },

      '&-legend-item': {
        display: 'flex',
        alignItems: 'center',
        fontSize: 12,
        marginBottom: 6,
      },

      '&-legend-color': {
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: 4,
        background: 'var(--donut-legend-color, #ccc)',
        marginRight: 6,
      },

      '&-legend-label': {
        flex: 1,
        color: '#767E8B',
        fontSize: 13,
      },

      '&-legend-value': {
        color: '#343A45',
        fontSize: 13,
        fontWeight: 500,
        marginLeft: 15,
      },

      '&-legend-percent': {
        marginLeft: 8,
      },
    },
  };
};

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('DonutChart', (token) => {
    const donutToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(donutToken)];
  });
} 
