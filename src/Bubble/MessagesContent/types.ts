import { TooltipProps } from 'antd';

/**
 * 聊天项的自定义配置接口
 * @interface CustomConfig
 */
export interface CustomConfig {
  /**
   * 提示框配置
   * @description 用于配置聊天项中的提示框属性
   * @optional
   */
  TooltipProps?: TooltipProps;

  /**
   * 弹出框配置
   * @description 用于配置聊天项中的弹出框属性
   */
  PopoverProps?: {
    /**
     * 弹出框标题的样式
     * @description 用于自定义弹出框标题的样式
     * @optional
     */
    titleStyle?: React.CSSProperties;

    /**
     * 弹出框内容的样式
     * @description 用于自定义弹出框内容的样式
     * @optional
     */
    contentStyle?: React.CSSProperties;
  };
}
