import { Divider, IconButton, Stack } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { Handle, NodeToolbar, Position, type NodeProps } from '@xyflow/react';
import type { ProcessNode } from '../types/nodes.types';
import InsertNodeButton from './components/InsertNodeButton';

const ConditionalNodeComponent = (props: NodeProps<ProcessNode>) => {
  return (
    <>
      <Stack
        sx={{
          width: 300,
          border: '1px solid #363636',
          borderRadius: 2,
          ':hover': {
            border: '1px solid dodgerblue',
          },
          pb: 2,
        }}>
        <Stack sx={{ px: 1, pt: 1, pb: 0.5 }} alignItems='start'>
          Process Node
        </Stack>
        <Divider />
        <Stack sx={{ p: 1 }}>{props.data.label}</Stack>
      </Stack>
      <NodeToolbar isVisible position={Position.Top} align='end'>
        <IconButton>
          <IconTrash size={25} />
        </IconButton>
      </NodeToolbar>
      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: 'blue',
        }}
      />
      <InsertNodeButton
        onClick={() => {
          console.log('inserting');
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
          background: 'red',
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
          background: 'green',
        }}
      />
      <Handle
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
