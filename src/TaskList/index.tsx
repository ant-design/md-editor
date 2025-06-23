import {
  CheckCircleFilled,
  DownOutlined,
  InfoOutlined,
  LoadingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Loading } from '../components/Loading';
import { useStyle } from './style';

type ThoughtChainProps = {
  items: {
    key: string;
    title: string;
    content: React.ReactNode | React.ReactNode[];
    status: 'success' | 'error' | 'pending';
  }[];
  className?: string;
};

export default ({ items, className }: ThoughtChainProps) => {
  const prefixCls = 'task-list';
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [reFresh, setReFresh] = useState(false);
  const itemsCollapseStatus = useRef(new Map());

  useEffect(() => {
    return () => {
      itemsCollapseStatus.current.clear();
    };
  }, []);

  useEffect(() => {
    let flag = false;
    items.forEach((item) => {
      const oldStatus = itemsCollapseStatus.current.has(item.key);
      if (oldStatus) {
        itemsCollapseStatus.current.set(
          item.key,
          !!itemsCollapseStatus.current.get(item.key),
        );
      } else {
        flag = true;
        itemsCollapseStatus.current.set(item.key, true);
      }
    });
    if (flag) {
      setReFresh(!reFresh);
    }
  }, [items]);

  const OnClickArrow = (key: string) => {
    itemsCollapseStatus.current.set(key, !itemsCollapseStatus.current.get(key));
    setReFresh(!reFresh);
  };

  return wrapSSR(
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={item.key}
          className={`${prefixCls}-thoughtChainItem ${hashId}`}
        >
          <div className={`${prefixCls}-left ${hashId}`}>
            <div className={`${prefixCls}-status ${hashId}`}>
              {item.status === 'success' ? (
                <CheckCircleFilled />
              ) : item.status === 'error' ? (
                <InfoOutlined />
              ) : (
                <LoadingOutlined />
              )}
            </div>
            <div className={`${prefixCls}-content-left ${hashId}`}>
              {index !== items.length - 1 && (
                <div className={`${prefixCls}-dash-line ${hashId}`}></div>
              )}
            </div>
          </div>
          <div className={`${prefixCls}-right ${hashId}`}>
            <div
              className={`${prefixCls}-top ${hashId}`}
              onClick={() => OnClickArrow(item.key)}
            >
              <div className={`${prefixCls}-title ${hashId}`}>{item.title}</div>
              {item.status === 'pending' ? (
                <div className={`${prefixCls}-loading ${hashId}`}>
                  <Loading />
                </div>
              ) : null}
              {item.content
                ? Array.isArray(item.content) &&
                  item.content.length > 0 &&
                  (itemsCollapseStatus.current.get(item.key) ? (
                    <div className={`${prefixCls}-arrowContainer ${hashId}`}>
                      <UpOutlined className={`${prefixCls}-arrow ${hashId}`} />
                    </div>
                  ) : (
                    <div className={`${prefixCls}-arrowContainer ${hashId}`}>
                      <DownOutlined
                        className={`${prefixCls}-arrow ${hashId}`}
                      />
                    </div>
                  ))
                : null}
            </div>
            {itemsCollapseStatus.current.get(item.key) && (
              <div className={`${prefixCls}-body ${hashId}`}>
                <div className={`${prefixCls}-content ${hashId}`}>
                  {item.content}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>,
  );
};
