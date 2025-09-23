import { DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Popconfirm, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { I18nContext } from '../../i18n';
import { StarIcon } from '../../icons';
import { ActionIconBox } from '../../index';
import { HistoryActionsBoxProps } from '../types';

/**
 * HistoryActionsBox 组件 - 历史记录操作按钮容器组件
 *
 * 该组件提供一个操作按钮容器，支持收藏、删除等操作。
 * 在悬停时显示操作按钮，提供良好的用户体验。
 *
 * @component
 * @description 历史记录操作按钮容器组件，提供收藏、删除等操作功能
 * @param {HistoryActionsBoxProps} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件，通常是时间显示
 * @param {() => void} [props.onDeleteItem] - 删除操作回调
 * @param {Object} [props.agent] - Agent配置
 * @param {boolean} [props.agent.enabled] - 是否启用agent模式
 * @param {HistoryDataType} [props.item] - 历史数据项
 * @param {(sessionId: string, isFavorite: boolean) => void} [props.onFavorite] - 收藏操作回调
 *
 * @example
 * ```tsx
 * <HistoryActionsBox
 *   onDeleteItem={() => handleDelete(item.sessionId)}
 *   onFavorite={(sessionId, isFavorite) => handleFavorite(sessionId, isFavorite)}
 *   item={historyItem}
 *   agent={{ enabled: true }}
 * >
 *   <span>2024-01-01 12:00</span>
 * </HistoryActionsBox>
 * ```
 *
 * @returns {React.ReactElement} 渲染的历史记录操作按钮容器组件
 *
 * @remarks
 * - 支持悬停显示操作按钮
 * - 提供收藏和删除功能
 * - 集成确认对话框
 * - 支持加载状态显示
 * - 响应式布局
 * - 国际化支持
 */
export const HistoryActionsBox: React.FC<HistoryActionsBoxProps> = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls();
  const { locale: i18nLocale } = useContext(I18nContext);
  const [isHover, setIsHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        if (!open) {
          setIsHover(false);
        }
      }}
      style={{
        color: 'rgba(0, 0, 0, 0.25)',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'max-content',
        maxWidth: 'min(860px,100%)',
      }}
    >
      {isHover || props.agent?.enabled ? (
        <Space size={4}>
          {props.agent?.enabled && props.item && props?.agent?.onFavorite && (
            <ActionIconBox
              scale
              loading={favoriteLoading}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                try {
                  setFavoriteLoading(true);
                  await props.onFavorite?.(
                    props.item!.sessionId!,
                    !props.item!.isFavorite,
                  );
                } catch (error) {
                  // 处理错误
                } finally {
                  setFavoriteLoading(false);
                }
              }}
              title={
                props.item!.isFavorite
                  ? i18nLocale?.['chat.history.unfavorite'] || '取消收藏'
                  : i18nLocale?.['chat.history.favorite'] || '收藏'
              }
              style={{
                width: 20,
                height: 20,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(props.item!.isFavorite
                  ? {
                      borderRadius: 'var(--radius-control-sm)',
                      background: 'var(--color-gray-control-fill-active)',
                      border: '1px solid var(--color-gray-border-light)',
                    }
                  : {}),
              }}
            >
              <StarIcon
                style={{
                  fontSize: 14,
                  color: 'var(--color-gray-text-disabled)',
                }}
              />
            </ActionIconBox>
          )}
          {props?.onDeleteItem && props.item && (
            <Popconfirm
              open={open}
              onOpenChange={(visible) => {
                setOpen(visible);
              }}
              getPopupContainer={() =>
                (document.getElementsByClassName(
                  `${prefixCls}-agent-chat-history-menu`,
                )[0] as HTMLDivElement) ||
                (document.getElementsByClassName(
                  `${prefixCls}-agent-chat`,
                )[0] as HTMLDivElement) ||
                document.body
              }
              placement="left"
              title={
                i18nLocale?.['chat.history.delete.popconfirm'] ||
                '确定删除该消息吗？'
              }
              onConfirm={async (e) => {
                e?.stopPropagation();
                e?.preventDefault();
                try {
                  setDeleteLoading(true);
                  await props?.onDeleteItem?.();
                } catch (error) {
                  // 处理错误
                } finally {
                  setDeleteLoading(false);
                }
              }}
              onCancel={(e) => {
                e?.stopPropagation();
                e?.preventDefault();
              }}
            >
              <ActionIconBox
                scale
                loading={deleteLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                title={i18nLocale?.['chat.history.delete'] || '删除'}
                style={{
                  padding: 0,
                  width: 20,
                  height: 20,
                }}
              >
                <DeleteOutlined
                  style={{
                    fontSize: 14,
                    color: 'var(--color-gray-text-disabled)',
                  }}
                />
              </ActionIconBox>
            </Popconfirm>
          )}
        </Space>
      ) : !props.agent?.enabled ? (
        props.children
      ) : (
        <span style={{ width: 24, height: 24 }}></span>
      )}
    </div>
  );
};
