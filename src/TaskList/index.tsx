import {
  ChevronDown,
  ChevronUp,
  CircleDashed,
  InfoOutlined,
  SuccessFill,
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Loading } from '../components/Loading';
import styles from './index.module.less';

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
  const [reFresh, setReFresh] = useState(false);
  const itemsCollpaseStatus = useRef(new Map());
  useEffect(() => {
    return () => {
      itemsCollpaseStatus.current.clear();
    };
  }, []);
  useEffect(() => {
    console.log(itemsCollpaseStatus.current.size);
    let flag = false;
    items.forEach((item) => {
      const oldStatus = itemsCollpaseStatus.current.has(item.key);
      if (oldStatus) {
        // 如果旧状态存在，则设置为旧状态
        itemsCollpaseStatus.current.set(
          item.key,
          !!itemsCollpaseStatus.current.get(item.key),
        );
      } else {
        flag = true;
        itemsCollpaseStatus.current.set(item.key, true);
      }
    });
    if (flag) {
      setReFresh(!reFresh);
    }
  }, [items]);
  const OnClickArrow = (key: string) => {
    itemsCollpaseStatus.current.set(key, !itemsCollpaseStatus.current.get(key));
    setReFresh(!reFresh);
  };
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={item.key} className={styles.thoughtChainItem}>
          <div className={styles.left}>
            <div className={styles.status}>
              {item.status === 'success' ? (
                <SuccessFill />
              ) : item.status === 'error' ? (
                <InfoOutlined />
              ) : (
                <CircleDashed />
              )}
            </div>
            <div className={styles['content-left']}>
              {index !== items.length - 1 && (
                <div className={styles['dash-line']}></div>
              )}
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.top} onClick={() => OnClickArrow(item.key)}>
              <div className={styles.title}>{item.title}</div>
              {item.status === 'pending' ? (
                <div className={styles.loading}>
                  <Loading />
                </div>
              ) : null}
              {item.content
                ? typeof item.content === 'object' &&
                  item.content.length > 0 &&
                  (itemsCollpaseStatus.current.get(item.key) ? (
                    <div className={styles.arrowContainer}>
                      <ChevronUp className={styles.arrow} />
                    </div>
                  ) : (
                    <div className={styles.arrowContainer}>
                      <ChevronDown className={styles.arrow} />
                    </div>
                  ))
                : null}
            </div>
            {itemsCollpaseStatus.current.get(item.key) && (
              <div className={styles.body}>
                <div className={styles.content}>{item.content}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
