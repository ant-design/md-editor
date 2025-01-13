import { Chart } from '@antv/g2';
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '../../../utils';

export const Container: React.FC<{
  chartRef: React.MutableRefObject<Chart | undefined>;
  htmlRef: React.MutableRefObject<HTMLDivElement | null>;
  onShow: () => void;
  onHidden: () => void;
  index: number;
}> = (props) => {
  const { chartRef, htmlRef } = props;
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [inView, setInView] = useState(false);

  const onSize = debounce(() => {
    if (!inView) return;
    const chart = chartRef.current;
    if (!chart) return;
    const preSize = sizeRef.current;
    const newSize = {
      width: htmlRef.current?.clientWidth || 0,
      height: Math.min(
        htmlRef.current?.clientWidth || 400,
        htmlRef.current?.clientHeight || 400,
      ),
    };

    if (
      Math.abs(preSize.width - newSize.width) > 20 ||
      Math.abs(preSize.height - newSize.height) > 20
    ) {
      chart.changeSize(newSize.width, newSize.height);
      sizeRef.current = newSize;
      return;
    }
  }, 160 + props.index * 16);

  useEffect(() => {
    if (inView) {
      onSize();
      setTimeout(() => {
        props.onShow?.();
      }, 100 * props.index);
    } else {
      props.onHidden?.();
      setInView(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    if (!htmlRef.current) return;
    const newSize = {
      width: htmlRef.current?.clientWidth || 0,
      height: htmlRef.current?.clientHeight || 200,
    };
    sizeRef.current = newSize;
  }, [htmlRef.current]);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return <div ref={htmlRef}>chart</div>;
  }

  return (
    <ResizeObserver onResize={onSize}>
      <div
        ref={htmlRef}
        onClick={onSize}
        style={{
          maxHeight: htmlRef.current?.clientWidth || '400px',
        }}
      />
    </ResizeObserver>
  );
};
