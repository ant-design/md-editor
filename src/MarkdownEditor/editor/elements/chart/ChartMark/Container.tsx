import { Chart } from '@antv/g2';
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef } from 'react';

export const Container: React.FC<{
  chartRef: React.MutableRefObject<Chart | undefined>;
  htmlRef: React.MutableRefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}> = (props) => {
  const { chartRef, htmlRef } = props;
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const newSize = {
      width: htmlRef.current?.clientWidth || 0,
      height: htmlRef.current?.clientHeight || 200,
    };
    sizeRef.current = newSize;
  }, [htmlRef.current]);
  return (
    <ResizeObserver
      onResize={() => {
        const chart = chartRef.current;
        if (!chart) return;
        const preSize = sizeRef.current;
        const newSize = {
          width: htmlRef.current?.clientWidth || 0,
          height: Math.min(
            htmlRef.current?.clientWidth || 200,
            htmlRef.current?.clientHeight || 200,
            200,
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
      }}
    >
      {props.children}
    </ResizeObserver>
  );
};
