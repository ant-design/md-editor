import classNames from 'classnames';
import { motion, Variants } from 'framer-motion';
import React from 'react';

interface FlipTextProps {
  word: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

/**
 * Component to display a word with a flip animation for each character.
 *
 * @param {string} word - The word to be displayed with the flip animation.
 * @param {number} [duration=0.5] - The duration of the flip animation for each character.
 * @param {number} [delayMultiple=0.08] - The delay multiplier for staggering the animation of each character.
 * @param {object} [framerProps] - The animation properties for the framer-motion component.
 * @param {object} [framerProps.hidden] - The initial state of the animation.
 * @param {number} [framerProps.hidden.rotateX=-90] - The initial rotation on the X-axis.
 * @param {number} [framerProps.hidden.opacity=0] - The initial opacity.
 * @param {object} [framerProps.visible] - The visible state of the animation.
 * @param {number} [framerProps.visible.rotateX=0] - The final rotation on the X-axis.
 * @param {number} [framerProps.visible.opacity=1] - The final opacity.
 * @param {string} [className] - Additional CSS classes to apply to each character.
 *
 * @returns {JSX.Element} The JSX element representing the animated word.
 */
export function FlipText({
  word,
  duration = 0.5,
  delayMultiple = 0.08,
  framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  className,
}: FlipTextProps) {
  return (
    <div className="flex justify-center space-x-2">
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={framerProps}
          transition={{ duration, delay: i * delayMultiple }}
          className={classNames('origin-center drop-shadow-sm', className)}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
