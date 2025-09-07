import { alpha, IconButton, Stack, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { IconSitemap, IconTrash } from '@tabler/icons-react';
import {
  Handle,
  NodeToolbar,
  Position,
  useStore,
  type NodeProps,
} from '@xyflow/react';
import type { ProcessNode } from '../types/nodes.types';

const ConditionalNodeComponent = (props: NodeProps<ProcessNode>) => {
  const scaleFactor = useStore((state) => state.transform[2]);

  return (
    <>
      <Stack
        component='div'
        draggable
        // className='nopan nodrag'
        sx={{
          border: `1px solid ${deepPurple[700]}`,
          borderRadius: 2,
          minWidth: 250,
          bgcolor: alpha(deepPurple[900], 0.5),
        }}>
        <Stack
          sx={{
            p: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 1,
          }}>
          <IconSitemap />
          <Typography>
            {props.data.label} id {props.id}
          </Typography>
        </Stack>
      </Stack>
      <NodeToolbar
        isVisible
        position={Position.Top}
        align='end'
        nodeId={props.id}>
        <IconButton
          sx={{
            scale: scaleFactor,
          }}>
          <IconTrash size={25} />
        </IconButton>
      </NodeToolbar>
      <Handle
        id='source'
        type='source'
        position={Position.Bottom}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: 'red',
        }}
      />
      <Handle
        id='false'
        type='source'
        position={Position.Left}
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: 'blue',
        }}
      />
      <Handle
        type='source'
        id='true'
        position={Position.Right}
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: 'blue',
        }}
      />
      <Handle
        id='target'
        type='target'
        position={Position.Top}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: 'blue',
        }}
      />
    </>
  );
};

export default ConditionalNodeComponent;
