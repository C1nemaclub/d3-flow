export function getSineWavePath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  options: { amplitude?: number; frequency?: number } = {}
): [string, number, number] {
  const { amplitude = 20, frequency = 2 } = options;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.sqrt(dx * dx + dy * dy);

  // angle of line
  const angle = Math.atan2(dy, dx);

  // number of wave points
  const steps = 40;

  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // progress 0 → 1
    const x = sourceX + dx * t;
    const y = sourceY + dy * t;

    // sine offset perpendicular to line
    const offset = Math.sin(t * Math.PI * frequency) * amplitude;

    const offsetX = x + Math.cos(angle + Math.PI / 2) * offset;
    const offsetY = y + Math.sin(angle + Math.PI / 2) * offset;

    points.push([offsetX, offsetY]);
  }

  // build SVG path string
  const d = points.reduce(
    (acc, [px, py], i) => acc + (i === 0 ? `M${px},${py}` : `L${px},${py}`),
    ''
  );

  // label in the middle
  const midIndex = Math.floor(points.length / 2);
  const [labelX, labelY] = points[midIndex];

  return [d, labelX, labelY];
}

export function getZigZagPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  options: { segments?: number; amplitude?: number } = {}
): [string, number, number] {
  const { segments = 6, amplitude = 15 } = options;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const steps = segments * 2;

  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = sourceX + dx * t;
    const y = sourceY + dy * t;

    const offset = (i % 2 === 0 ? 1 : -1) * amplitude;
    // perpendicular offset
    const angle = Math.atan2(dy, dx);
    const offsetX = x + Math.cos(angle + Math.PI / 2) * offset;
    const offsetY = y + Math.sin(angle + Math.PI / 2) * offset;

    points.push([offsetX, offsetY]);
  }

  const d = points.reduce(
    (acc, [px, py], i) => acc + (i === 0 ? `M${px},${py}` : `L${px},${py}`),
    ''
  );

  const mid = points[Math.floor(points.length / 2)];
  return [d, mid[0], mid[1]];
}

export function getArcPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  options: { curvature?: number } = {}
): [string, number, number] {
  const { curvature = 0.5 } = options;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  // midpoint
  const mx = (sourceX + targetX) / 2;
  const my = (sourceY + targetY) / 2;

  // offset perpendicular for arc
  const angle = Math.atan2(dy, dx);
  const offsetX = mx + Math.cos(angle + Math.PI / 2) * curvature * dx;
  const offsetY = my + Math.sin(angle + Math.PI / 2) * curvature * dx;

  const d = `M${sourceX},${sourceY} Q${offsetX},${offsetY} ${targetX},${targetY}`;

  return [d, offsetX, offsetY];
}

export function getSpiralPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  options: { turns?: number; radius?: number } = {}
): [string, number, number] {
  const { turns = 2, radius = 30 } = options;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const steps = 80;

  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = turns * Math.PI * 2 * t;
    const r = radius * (1 - t); // shrink radius as we approach target
    const x = sourceX + dx * t + Math.cos(angle) * r;
    const y = sourceY + dy * t + Math.sin(angle) * r;
    points.push([x, y]);
  }

  const d = points.reduce(
    (acc, [px, py], i) => acc + (i === 0 ? `M${px},${py}` : `L${px},${py}`),
    ''
  );

  const mid = points[Math.floor(points.length / 2)];
  return [d, mid[0], mid[1]];
}
