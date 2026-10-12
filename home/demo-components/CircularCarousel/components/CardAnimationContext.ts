import { createContext } from 'react';

interface CardAnimationState {
  frontActive: boolean;
  backActive: boolean;
  reducedMotion?: boolean;
}

/** A rotated back face still intersects the viewport, so visibility alone is insufficient. */
export const CardAnimationContext = createContext<CardAnimationState>({
  frontActive: true,
  backActive: true,
});
