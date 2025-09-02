import { Box, Stack, Typography } from '@mui/material';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ParentLoopNode } from '../types/nodes.types';

const ParentLoopComponent = (props: NodeProps<ParentLoopNode>) => {
  return (
    <>
      {/* <NodeResizeControl autoScale shouldResize={shouldResize} /> */}
      {/* <NodeResizer /> */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          //   minWidth: 500,
          //   minHeight: 300,
          //   borderRadius: [20, 1, 1, 20],
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
          borderBottom: '1px dashed rgb(10, 168, 255)',
          borderRight: '1px dashed rgb(10, 168, 255)',
          borderLeft: '1px dashed rgb(10, 168, 255)',
          position: 'relative',
        }}>
        <Stack
          direction='row'
          sx={{
            py: 1,
            px: 2,
            alignItems: 'center',
            justifyContent: 'start',
            backgroundColor: 'rgb(10, 168, 255, 0.2)',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            border: '1px solid rgb(10, 168, 255)',
            // Appendix
            position: 'absolute',
            width: '100%',
            bottom: '100%',
          }}>
          <Typography>
            {props.data.label} Height: {props.height}
          </Typography>
        </Stack>
      </Box>
      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          left: '50%',
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type='target'
        position={Position.Top}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          top: '-45px',
        }}
      />
    </>
  );
};

export default ParentLoopComponent;
