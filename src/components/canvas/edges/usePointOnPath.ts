import { useMemo } from 'react';

export interface PathPoint {
  x: number;
  y: number;
}

export function usePointOnPath(path: string, percentage: number): PathPoint {
  return useMemo(() => {
    // if (!path || percentage < 0 || percentage > 1) return null;

    const temp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    temp.setAttribute('d', path);

    const length = temp.getTotalLength();
    const point = temp.getPointAtLength(length * percentage);

    return { x: point.x, y: point.y };
  }, [path, percentage]);
}
