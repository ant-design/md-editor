import { motion, useTransform } from 'framer-motion';
import React from 'react';

const ANGLE_STEP = 15;
const RADIUS = 2000;
const TICKS_PATH = Array.from({ length: 480 }, (_, index) => {
  const angle = index * 0.75 * (Math.PI / 180);
  const innerRadius = RADIUS - 14;
  const outerRadius = RADIUS + 14;
  return `M${2200 + innerRadius * Math.sin(angle)},${2200 - innerRadius * Math.cos(angle)}L${2200 + outerRadius * Math.sin(angle)},${2200 - outerRadius * Math.cos(angle)}`;
}).join('');

interface CarouselWheelProps {
  smoothIndex: any;
}

export const CarouselWheel: React.FC<CarouselWheelProps> = ({
  smoothIndex,
}) => {
  const rotate = useTransform(smoothIndex, (v: number) => -v * ANGLE_STEP);

  return (
    <motion.div
      style={{
        rotate,
        y: RADIUS + 56,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    >
      <svg
        width="4400"
        height="4400"
        viewBox="0 0 4400 4400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#9ca3af' }}
      >
        {/* Decorative ticks */}
        <path d={TICKS_PATH} stroke="currentColor" strokeWidth={1} />
      </svg>
    </motion.div>
  );
};
