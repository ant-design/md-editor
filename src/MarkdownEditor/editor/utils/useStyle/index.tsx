import type { CSSInterpolation } from '@ant-design/cssinjs';
import { useStyleRegister as useDefaultStyleRegister } from '@ant-design/cssinjs';

import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antd';
import type { GlobalToken } from 'antd/lib/theme/interface';
import type React from 'react';
import { useContext } from 'react';

export type GenerateStyle<
  ComponentToken extends object = GlobalToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken, ...rest: any[]) => ReturnType;

export type UseStyleResult = {
  wrapSSR: (node: React.ReactElement) => React.ReactElement;
  hashId: string;
};

export type ChatTokenType = GlobalToken & {
  themeId: number;
  /**
   * prochat 的 className
   * @type {string}
   * @example .ant-pro
   */
  chatCls: string;
  /**
   * antd 的 className
   * @type {string}
   * @example .ant
   */
  antCls: string;
  /**
   * 组件的 className
   */
  componentCls: string;

  titlePlaceholderContent?: string;
};

export const resetComponent: GenerateStyle<ChatTokenType> = (
  token: ChatTokenType,
) => ({
  [`${token.componentCls}`]: {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    color: token.colorText,
    fontSize: '1em',
    lineHeight: token.lineHeight,
    listStyle: 'none',
  },
});

/**
 * 封装了一下 antd 的 useStyle，支持了一下antd@4
 * @param componentName {string} 组件的名字
 * @param styleFn {GenerateStyle} 生成样式的函数
 * @returns UseStyleResult
 */
export function useEditorStyleRegister(
  componentName: string,
  styleFn: (token: ChatTokenType) => CSSInterpolation,
) {
  const { token, theme, hashId } = antdTheme.useToken();
  const chatToken = {
    ...token,
    chatCls: '',
    antCls: '',
    titlePlaceholderContent: '"Please enter a title"',
  };
  const { getPrefixCls } = useContext(AntdConfigProvider.ConfigContext);

  chatToken.chatCls = `.${getPrefixCls('md-editor')}`;
  chatToken.antCls = `.${getPrefixCls()}`;

  chatToken.titlePlaceholderContent = '"Please enter a title"';

  return {
    wrapSSR: useDefaultStyleRegister(
      {
        theme: theme as any,
        token,
        hashId,
        path: [`MD-Editor-${componentName}`],
      },
      () => styleFn(token as ChatTokenType),
    ),
    hashId,
  };
}
