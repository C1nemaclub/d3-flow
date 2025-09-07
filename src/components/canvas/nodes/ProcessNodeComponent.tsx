import { IconButton, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { IconRouteSquare2, IconTrash } from '@tabler/icons-react';
import {
  Handle,
  NodeToolbar,
  Position,
  useStore,
  type NodeProps,
} from '@xyflow/react';
import { useSettingsStore } from '../store/useNodesStore';
import type { ProcessNode } from '../types/nodes.types';

const ProcessNodeComponent = (props: NodeProps<ProcessNode>) => {
  const scaleFactor = useStore((state) => state.transform[2]);
  const updateDrag = useSettingsStore((state) => state.updateDrag);

  return (
    <>
      <Stack
        component='div'
        draggable
        className='nopan nodrag'
        onDragStart={() => {
          updateDrag(true);
        }}
        onDragEnd={() => {
          updateDrag(false);
        }}
        sx={{
          width: 250,
          border: `2px solid #363636`,
          borderRadius: 2,
          position: 'relative',
          alignItems: 'center',
          backgroundColor: blue[900],
          borderColor: blue[700],
        }}>
        <Stack
          sx={{
            p: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 1,
          }}>
          <IconRouteSquare2 />
          <Typography>
            {props.data.label} id {props.id}
          </Typography>
        </Stack>
      </Stack>
      <NodeToolbar
        isVisible
        position={Position.Top}
        align='end'
        className='toolbar-x'>
        <IconButton
          sx={{
            scale: Math.max(scaleFactor, 0.8),
          }}>
          <IconTrash size={25} />
        </IconButton>
      </NodeToolbar>
      <>
        <Handle
          id='source'
          type='source'
          position={Position.Bottom}
          style={{
            left: '50%',
            width: 10,
            height: 10,
            background: 'green',
          }}
        />
      </>
      <Handle
        id='target'
        type='target'
        position={Position.Top}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: 'red',
        }}
      />
    </>
  );
};

export default ProcessNodeComponent;
