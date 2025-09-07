import { IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { IconPlus } from '@tabler/icons-react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { useEffect, useRef, useState, type FC } from 'react';
import { useSettingsStore } from '../store/useNodesStore';
import type { CustomEdgeType } from '../types/nodes.types';
import { usePointOnPath } from './usePointOnPath';

function EdgeLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        padding: '5px 10px',
        border: `2px solid ${grey[800]}`,
        backgroundColor: grey[900],
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 5,
        transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
      }}
      className='nodrag nopan'>
      {label}
    </div>
  );
}

const PARTICLE_COUNT = 10;
const ANIMATE_DURATION = 5;

const CustomEdge: FC<EdgeProps<CustomEdgeType>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  animated,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 25,
  });

  // const [edgePath] = getSineWavePath(
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  //   { amplitude: 60, frequency: 2 } // tweak to taste
  // );

  // const [edgePath] = getZigZagPath(
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  //   { amplitude: 20, segments: 2 } // tweak to taste
  // );

  // const [edgePath] = getSpiralPath(
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  //   { turns: 10, radius: 200 } // tweak to taste
  // );
  const isDragging = useSettingsStore((state) => state.isDragging);
  const pathRef = useRef<SVGPathElement>(null);
  const [percentPoint, setPercentPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [percentPoint2, setPercentPoint2] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      const point70 = pathRef.current.getPointAtLength(totalLength * 0.8); // 70%
      const point40 = pathRef.current.getPointAtLength(totalLength * 0.4); // 40%
      setPercentPoint({ x: point70.x, y: point70.y });
      setPercentPoint2({ x: point40.x, y: point40.y });
    }
  }, [edgePath]);

  const getPositionAtPercentage = (percentage: number) => {
    const x = sourceX + (targetX - sourceX) * percentage;
    const y = sourceY + (targetY - sourceY) * percentage;
    return { x, y };
  };

  // const quant = Number(
  //   ((pathRef.current?.getTotalLength() ?? 0) / PARTICLE_COUNT / 2).toFixed(0)
  // );

  const position40 = getPositionAtPercentage(0.4);
  const position80 = getPositionAtPercentage(0.8);

  const pathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  pathElement.setAttribute('d', edgePath);

  const pathLength = pathElement.getTotalLength();
  const point40 = usePointOnPath(edgePath, 0.2);
  const point80 = usePointOnPath(edgePath, 0.8);

  return (
    <>
      {/* invisible path reference */}
      <path ref={pathRef} d={edgePath} fill='none' stroke='none' />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: animated ? '3px' : '2px',
          stroke: '#363636',
        }}
      />

      <svg>
        <defs>
          {/* 🌈 Neon gradient fill */}
          <linearGradient id='neonGradient' gradientTransform='rotate(90)'>
            <stop offset='0%' stopColor='#ff00cc' />
            <stop offset='50%' stopColor='#00f0ff' />
            <stop offset='100%' stopColor='#39ff14' />
          </linearGradient>

          {/* ⚡ Multi-layer glow filter */}
          <filter
            id='multi-glow'
            x='-200%'
            y='-200%'
            width='400%'
            height='400%'>
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation='2'
              result='blur1'
            />
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation='6'
              result='blur2'
            />
            <feMerge>
              <feMergeNode in='blur2' />
              <feMergeNode in='blur1' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          {/* 🌀 Energy warp filter (optional: comment out if too strong) */}
          <filter id='warp-glow' x='-200%' y='-200%' width='400%' height='400%'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.02'
              numOctaves='8'
              result='turb'
            />
            <feDisplacementMap in='SourceGraphic' in2='turb' scale='5' />
            <feGaussianBlur stdDeviation='3' />
          </filter>
        </defs>

        {/* 🔥 Animated neon ellipses */}
        {[...Array(PARTICLE_COUNT)].map((_, i) => {
          const phase = i / PARTICLE_COUNT;
          const begin = `-${(phase * ANIMATE_DURATION).toFixed(3)}s`;

          return (
            <ellipse
              key={`particle-${i}`}
              rx='5'
              ry='1.2'
              fill='url(#neonGradient)' // rainbow gradient
              filter='url(#multi-glow)' // glowing halo
              // Try this instead for plasma flicker:
              // filter="url(#warp-glow)"
            >
              {/* Motion along the path */}
              <animateMotion
                begin={begin}
                dur={`${ANIMATE_DURATION}s`}
                repeatCount='indefinite'
                rotate='auto'
                path={edgePath}
                calcMode='linear'
              />

              {/* Shimmering opacity pulse */}
              <animate
                attributeName='opacity'
                values='1;0.6;1'
                dur='0.25s'
                repeatCount='indefinite'
                begin={begin}
              />
            </ellipse>
          );
        })}
      </svg>
      {/* <circle cy={0} cx={0} r={10} fill='#FDBA74'>
        <animateMotion
          begin={'0s'}
          dur={'1s'}
          repeatCount='indefinite'
          path={edgePath}
          calcMode='linear'
        />
      </circle> */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${percentPoint.x}px,${percentPoint.y}px)`,
          }}>
          <IconButton
            sx={{
              border: ({ palette }) => `2px solid ${palette.divider}`,
              bgcolor: isDragging ? 'red' : grey[900],
            }}>
            <IconPlus />
          </IconButton>
        </div>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${point40.x}px,${point40.y}px)`,
            pointerEvents: 'all',
          }}>
          Label 20%
        </div>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${point80.x}px,${point80.y}px)`,
            pointerEvents: 'all',
          }}>
          Label 80%
        </div>

        {/* Example second label */}
        {/* <EdgeLabel x={percentPoint2.x} y={percentPoint2.y} label={'30%'} /> */}
        <EdgeLabel
          x={percentPoint2.x}
          y={percentPoint2.y}
          label={(
            (pathRef.current?.getTotalLength() ?? 0) / PARTICLE_COUNT
          ).toFixed(0)}
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
