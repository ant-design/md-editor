import { createContext } from 'react';

/** A rotated back face still intersects the viewport, so visibility alone is insufficient. */
export const CardAnimationContext = createContext({
  frontActive: true,
  backActive: true,
});
