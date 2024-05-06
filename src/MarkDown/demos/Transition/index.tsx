import { motion } from 'framer-motion';
import React from 'react';

/**
 * A component that applies a transition effect to its children.
 *
 * @param {React.ReactNode} children - The children elements to apply the transition effect to.
 * @returns {React.ReactNode} The component with the transition effect applied to its children.
 */
export const InvertTransition = ({
  children,
  delay,
  style,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        flex: 1,
        ...style,
      }}
      transition={{ ease: 'easeInOut', duration: 0.75, delay }}
    >
      {React.cloneElement(children as React.ReactElement, {
        ...rest,
        ...(children as React.ReactElement).props,
      })}
    </motion.div>
  );
};
