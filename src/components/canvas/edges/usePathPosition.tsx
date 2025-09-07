import { useEffect, useState } from 'react';

interface UsePathPositionProps {
  values: number[];
  path: string;
}

export const usePathPosition = (params: UsePathPositionProps) => {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    []
  );

  useEffect(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('d', params.path);
    const pathLength = svg.getTotalLength();
    const points = [];
    params.values.forEach((percentage) => {
      const point = svg.getPointAtLength(pathLength * percentage);
      points.push({
        x: point.x,
        y: point.y,
      });
    });
    setPositions(positions);
  }, [params.path, params.values, positions]);

  return positions;
};
