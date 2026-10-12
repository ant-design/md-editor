import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAnimationVisibility } from '../../../../../../hooks/useAnimationVisibility';
import { CardAnimationContext } from '../../../CardAnimationContext';

interface MakeCanvasRevealEffectProps {
  colors?: number[][];
  dotSize?: number;
  containerClassName?: string;
  animationSpeed?: number;
}

function getColorVariants(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta) {
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
  }

  const lightness = Math.min(100, ((max + min) / 2) * 130);
  return [0, -20, 20].map(
    (offset) => `hsla(${(hue + offset + 360) % 360}, 100%, ${lightness}%,`,
  );
}

interface CanvasAnimationSurface {
  key: string;
  elapsed: number;
  revealDuration: number;
  draw: (elapsed: number, settled: boolean) => boolean;
}

function createSurface(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  colorString: string,
  dotSize: number,
  animationSpeed: number,
  key: string,
): CanvasAnimationSurface | undefined {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const gridSize = Math.max(1, dotSize);
  const totalSize = gridSize + 1;
  const diffusionSpeed = 500 / Math.max(0.01, animationSpeed);
  const cols = Math.ceil(canvas.width / totalSize);
  const rows = Math.ceil(canvas.height / totalSize);
  const originX = (cols * totalSize) / 2;
  const originY = (rows * totalSize) / 2;
  const finalRadius = Math.hypot(originX / 1.2, originY / 0.9) + 50 / 0.9;
  const [r, g, b] = colorString.split(',').map(Number);
  const variants = getColorVariants(r, g, b);
  const data = new Float32Array(cols * rows * 3);
  const flickeringIndices: number[] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cell = i + j * cols;
      const index = cell * 3;
      const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      const value = hash - Math.floor(hash);
      if (value < 0.2) {
        data[index] = 1;
        flickeringIndices.push(cell);
      } else {
        const normalized = (value - 0.2) / 0.8;
        data[index + 1] =
          normalized < 0.5
            ? 0.1 + normalized * 0.4
            : 0.3 + (normalized - 0.5) * 1.4;
      }
      data[index + 2] = (i + j) % 3;
    }
  }

  let staticLayer: HTMLCanvasElement | undefined;

  const drawParticle = (
    target: CanvasRenderingContext2D,
    cell: number,
    timeStep: number,
    radius?: number,
  ) => {
    const i = cell % cols;
    const j = Math.floor(cell / cols);
    const x = i * totalSize;
    const y = j * totalSize;
    const index = cell * 3;
    let edgeOpacity = 1;

    if (radius !== undefined) {
      const distance = Math.hypot((x - originX) / 1.2, (y - originY) / 0.9);
      if (distance >= radius) return;
      edgeOpacity = Math.min(1, ((radius - distance) * 0.9) / 50);
    }

    let opacity = data[index + 1];
    if (data[index]) {
      const hash =
        Math.sin(i * 12.9898 + j * 78.233 + timeStep * 43758.5453) * 43758.5453;
      opacity = 0.1 + (hash - Math.floor(hash)) * 0.9;
    }
    opacity *= (1 - (j / rows) ** 2) * edgeOpacity;
    if (opacity <= 0.05) return;
    target.fillStyle = variants[data[index + 2]] + opacity + ')';
    target.fillRect(x, y, gridSize, gridSize);
  };

  const draw = (elapsed: number, settled: boolean) => {
    const radius = settled ? finalRadius : (elapsed / 1000) * diffusionSpeed;
    const revealed = radius >= finalRadius;
    const timeStep = Math.floor(elapsed / (1000 / 6));
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (revealed) {
      // The other 80% of the dots never change after the reveal.
      if (!staticLayer) {
        staticLayer = document.createElement('canvas');
        staticLayer.width = canvas.width;
        staticLayer.height = canvas.height;
        const staticContext = staticLayer.getContext('2d', { alpha: true });
        if (staticContext) {
          for (let cell = 0; cell < cols * rows; cell++) {
            if (!data[cell * 3]) drawParticle(staticContext, cell, timeStep);
          }
        } else {
          staticLayer = undefined;
        }
      }
      if (staticLayer) context.drawImage(staticLayer, 0, 0);
      else {
        for (let cell = 0; cell < cols * rows; cell++) {
          if (!data[cell * 3]) drawParticle(context, cell, timeStep);
        }
      }
      for (const cell of flickeringIndices) {
        drawParticle(context, cell, timeStep);
      }
    } else {
      const startCol = Math.max(
        0,
        Math.floor((originX - radius * 1.2) / totalSize),
      );
      const endCol = Math.min(
        cols,
        Math.ceil((originX + radius * 1.2) / totalSize),
      );
      const startRow = Math.max(
        0,
        Math.floor((originY - radius * 0.9) / totalSize),
      );
      const endRow = Math.min(
        rows,
        Math.ceil((originY + radius * 0.9) / totalSize),
      );
      for (let j = startRow; j < endRow; j++) {
        for (let i = startCol; i < endCol; i++) {
          drawParticle(context, i + j * cols, timeStep, radius);
        }
      }
    }

    return revealed;
  };
  return {
    key,
    elapsed: 0,
    revealDuration: (finalRadius / diffusionSpeed) * 1000,
    draw,
  };
}

export const MakeCanvasRevealEffect: React.FC<MakeCanvasRevealEffectProps> = ({
  colors = [[91, 59, 159]],
  dotSize = 3,
  containerClassName = '',
  animationSpeed = 5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<CanvasAnimationSurface | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { isVisible, reducedMotion } = useAnimationVisibility(canvasRef);
  const { frontActive } = useContext(CardAnimationContext);
  const colorString = (colors[0] ?? [91, 59, 159]).join(',');

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    const updateDimensions = () => {
      // Layout dimensions are stable while the card rotates and scales.
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      setDimensions((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    };
    updateDimensions();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      !dimensions.width ||
      !dimensions.height ||
      !isVisible ||
      !frontActive
    )
      return;

    const key = `${dimensions.width}:${dimensions.height}:${colorString}:${dotSize}:${animationSpeed}`;
    if (surfaceRef.current?.key !== key) {
      surfaceRef.current = createSurface(
        canvas,
        dimensions.width,
        dimensions.height,
        colorString,
        dotSize,
        animationSpeed,
        key,
      );
    }
    const surface = surfaceRef.current;
    if (!surface) return;

    let frameId = 0;
    let timerId = 0;
    const startTime = performance.now();
    const previousElapsed = surface.elapsed;
    const render = (time: number) => {
      surface.elapsed = reducedMotion
        ? Math.max(previousElapsed, surface.revealDuration)
        : previousElapsed + Math.max(0, time - startTime);
      const revealed = surface.draw(surface.elapsed, reducedMotion);
      if (reducedMotion) return;
      // Expansion needs smooth motion; the settled effect only changes at 6 fps.
      timerId = window.setTimeout(
        () => {
          frameId = requestAnimationFrame(render);
        },
        1000 / (revealed ? 6 : 30),
      );
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [
    colorString,
    dimensions,
    dotSize,
    animationSpeed,
    isVisible,
    reducedMotion,
    frontActive,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={containerClassName}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
};
