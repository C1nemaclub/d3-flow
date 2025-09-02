import { Stack } from '@mui/material';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { type FC } from 'react';
import type { CustomEdgeType } from '../types/nodes.types';

const CustomEdge: FC<EdgeProps<CustomEdgeType>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  animated,
  pathOptions,
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

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: animated ? '3px' : '2px',
          stroke: animated ? 'dodgerblue' : 'gray',
        }}
      />
      <EdgeLabelRenderer>
        <Stack
          sx={{}}
          onDragEnd={(e) => {
            console.log(e, 'dragged');
          }}
          onDragOver={(e) => {
            e.preventDefault();
            console.log(e, ' dragover');
          }}
          onDrop={(e) => {
            e.preventDefault();
            console.log('drop', e);
          }}>
          {/* <IconButton
            sx={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              position: 'absolute',
              background: ({ palette }) => palette.primary.dark,
              zIndex: 10,
            }}>
            <IconProgress />
          </IconButton> */}
        </Stack>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
