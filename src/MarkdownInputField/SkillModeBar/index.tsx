import { CloseOutlined } from '@ant-design/icons';
import { Divider, Flex } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

/**
 * 技能模式配置接口
 * @interface SkillModeConfig
 * @property {boolean} [open] - 是否打开技能模式
 * @property {React.ReactNode} [title] - 技能模式标题，支持字符串或React节点
 * @property {React.ReactNode[]} [rightContent] - 右侧自定义内容数组
 * @property {boolean} [closable] - 是否显示默认关闭按钮
 * @property {React.CSSProperties} [style] - 技能模式容器样式
 * @property {string} [className] - 技能模式容器类名
 */
export interface SkillModeConfig {
  /**
   * 是否打开技能模式
   * @description 控制技能模式的显示与隐藏状态
   * @default false
   * @example open={skillModeEnabled}
   */
  open?: boolean;

  /**
   * 技能模式标题
   * @description 支持字符串或React节点
   * @example title="AI助手模式"
   * @example title={<Space><Icon />助手模式</Space>}
   */
  title?: React.ReactNode;

  /**
   * 右侧自定义内容数组
   * @description 在技能模式右侧显示的自定义内容，如标签、按钮等
   * @example rightContent={[<Tag key="version">v2.0</Tag>, <Button key="settings">设置</Button>]}
   */
  rightContent?: React.ReactNode[];

  /**
   * 是否显示默认关闭按钮
   * @description 控制是否在右侧显示默认的关闭按钮，点击后会触发onSkillModeClose回调
   * @default true
   * @example closable={false} // 不显示关闭按钮
   */
  closable?: boolean;

  /**
   * 技能模式容器样式
   * @description 应用于技能模式容器的内联样式
   */
  style?: React.CSSProperties;

  /**
   * 技能模式容器类名
   * @description 应用于技能模式容器的CSS类名
   */
  className?: string;
}

export interface SkillModeBarProps {
  /**
   * 技能模式配置
   */
  skillMode?: SkillModeConfig;

  /**
   * 技能模式开关状态变化时触发的回调函数
   * @description 监听技能模式 open 状态的所有变化，包括用户点击关闭按钮和外部直接修改状态
   * @param open 新的开关状态
   * @example onSkillModeOpenChange={(open) => {
   *   console.log(`技能模式${open ? '打开' : '关闭'}`);
   *   setSkillModeEnabled(open);
   * }}
   */
  onSkillModeOpenChange?: (open: boolean) => void;

  /**
   * 基础类名前缀
   */
  baseCls?: string;

  /**
   * Hash ID 用于样式作用域
   */
  hashId?: string;
}

/**
 * 技能模式条组件
 * @description 用于显示技能模式的标题栏，包含标题、右侧内容和关闭按钮
 * @param props - 组件属性
 * @returns React 组件
 */
export const SkillModeBar: React.FC<SkillModeBarProps> = ({
  skillMode,
  onSkillModeOpenChange,
  baseCls = 'ant-md-input-field',
  hashId = '',
}) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // 触发状态变化回调
    onSkillModeOpenChange?.(false);
  };

  return (
    <AnimatePresence>
      {skillMode?.open && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: 'auto', opacity: 1, marginBottom: 9 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ overflow: 'hidden' }}
          className={classNames(`${baseCls}-skill-mode-container`, hashId)}
          data-testid="skill-mode-bar"
        >
          <motion.div
            initial={{
              padding: '0px',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            animate={{
              padding: '12px',
              backgroundColor: 'var(--color-gray-bg-page)',
              borderColor: 'rgba(0, 16, 64, 0.0627)',
            }}
            exit={{
              padding: '0px',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              borderWidth: '0px 0px 1px 0px',
              width: '100%',
              height: 'fit-content',
              minHeight: '48px',
              alignSelf: 'stretch',
              borderStyle: 'solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...skillMode?.style,
            }}
            className={classNames(
              `${baseCls}-skill-mode`,
              hashId,
              skillMode?.className,
            )}
          >
            {/* 左侧区域 - 技能模式标题 */}
            <div
              style={{
                font: 'var(--font-text-h5-base)',
                letterSpacing: 'var(--letter-spacing-h5-base, normal)',
                color: 'var(--color-primary-control-fill-primary)',
              }}
            >
              {skillMode?.title}
            </div>

            {/* 右侧区域 */}
            <Flex
              justify="flex-end"
              align="center"
              gap={8}
              style={{
                font: 'var(--font-text-body-sm)',
                letterSpacing: 'var(--letter-spacing-body-sm, normal)',
                color: 'var(--color-gray-text-secondary)',
              }}
            >
              {/* 右侧自定义内容 */}
              {skillMode?.rightContent &&
                skillMode.rightContent.map((content, index) => {
                  // 尝试从React元素中提取key，如果没有则使用index
                  const key =
                    React.isValidElement(content) && content.key
                      ? content.key
                      : index;
                  return <React.Fragment key={key}>{content}</React.Fragment>;
                })}

              {/* 分割线 - 只有当有右侧内容且可关闭时才显示 */}
              {skillMode?.rightContent &&
                skillMode.rightContent.length > 0 &&
                skillMode.closable !== false && (
                  <Divider
                    type="vertical"
                    style={{
                      margin: '0',
                    }}
                  />
                )}

              {/* 技能模式关闭按钮 */}
              {skillMode?.closable !== false && (
                <CloseOutlined
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={handleCloseClick}
                  data-testid="skill-mode-close"
                />
              )}
            </Flex>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
