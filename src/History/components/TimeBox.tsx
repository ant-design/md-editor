import { DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Popconfirm, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { ActionIconBox, BubbleConfigContext } from '../../index';
import { StarFilledIcon, StarIcon } from '../icons';
import { TimeBoxProps } from '../types';

/**
 * TimeBox 组件 - 显示时间并提供操作按钮
 */
export const TimeBox: React.FC<TimeBoxProps> = (props) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls();
  const { locale } = useContext(BubbleConfigContext) || {};
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
      }}
    >
      {isHover || props.agent?.enabled ? (
        <Space>
          {props.agent?.enabled && props.item && props.onFavorite && (
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
              title={props.item!.isFavorite ? '取消收藏' : '收藏'}
            >
              {props.item!.isFavorite ? (
                <StarFilledIcon
                  style={{
                    color: '#1D7AFC',
                  }}
                />
              ) : (
                <StarIcon
                  style={{
                    color: '--color-icon-secondary',
                  }}
                />
              )}
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
                locale?.['chat.history.delete.popconfirm'] ||
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
                title={locale?.['chat.history.delete'] || '删除'}
              >
                <DeleteOutlined />
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
