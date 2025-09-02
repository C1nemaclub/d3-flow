import { Divider, IconButton, Stack } from '@mui/material';
import { IconPlug, IconTrash } from '@tabler/icons-react';
import {
  getConnectedEdges,
  Handle,
  NodeToolbar,
  Position,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { useState } from 'react';
import type { ProcessNode } from '../types/nodes.types';

type HandleInfo = {
  id: string;
  type: 'source' | 'target';
};

const ProcessNodeComponent = (props: NodeProps<ProcessNode>) => {
  const [onTop, setOnTop] = useState(false);
  const [colored, setColored] = useState('');
  const scaleFactor = useStore((state) => state.transform[2]);
  const rf = useReactFlow();

  const createGhostOnEmptySource = () => {
    const int = rf.getInternalNode(props.id);
    const node = rf.getNode(props.id);
    if (!node) return;
    const connectedEdgesSourceHandles = getConnectedEdges([node], rf.getEdges())
      .map((edge) => {
        return edge.source ?? null;
      })
      .filter((item) => Boolean(item));
    console.log(connectedEdgesSourceHandles);

    const sourceHandles = int?.internals.handleBounds?.source;
    console.log(sourceHandles);
    const emptySourceHandles = sourceHandles?.filter((handle) => {
      if (!connectedEdgesSourceHandles.includes(handle.nodeId ?? ''))
        return true;
      return false;
    });

    console.log(emptySourceHandles, 'emt');

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    emptySourceHandles?.forEach((item) => {
      const newNode: ProcessNode = {
        type: 'processNode',
        data: {
          label: 'From Empty handle',
        },
        position: node.position,
        id: crypto.randomUUID(),
      };
      const connectingEdge: Edge = {
        type: 'customEdge',
        id: `${node.id}>${newNode.id}`,
        source: node.id,
        target: newNode.id,
        ...(item.id ? { sourceHandle: item.id } : {}),
      };
      nodes.push(newNode);
      edges.push(connectingEdge);
    });
    rf.addNodes(nodes);
    rf.addEdges(edges);
  };

  return (
    <>
      <Stack
        sx={{
          width: props.width,
          border: `2px solid #363636`,
          borderRadius: 2,
          ':hover': {
            border: '1px solid dodgerblue',
          },
          position: 'relative',
          pb: 2,
          alignItems: 'center',
          borderColor: onTop ? 'red' : '#363636',
          backgroundColor: '#363636',
          ...(colored ? { backgroundColor: colored } : {}),
          p: 1,
        }}
        onDragOver={(e) => {
          e.preventDefault(); // required for drop
          setOnTop(true);
        }}
        onDragLeave={() => {
          setOnTop(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setOnTop(false);
          const droppedData = e.dataTransfer.getData('text/plain');
          console.log('Dropped data:', droppedData);
          setColored(droppedData);
        }}>
        <Stack sx={{ px: 1, pt: 1, pb: 0.5 }} alignItems='start'>
          Process Node {props.id} {props.width}
        </Stack>
        <Divider />
        <Stack sx={{ p: 1 }}>{props.data.label}</Stack>
        <IconButton sx={{ p: 1 }} onClick={createGhostOnEmptySource}>
          <IconPlug />
        </IconButton>
      </Stack>
      <NodeToolbar
        isVisible
        position={Position.Top}
        align='end'
        className='toolbar-x'>
        <IconButton
          sx={{
            scale: scaleFactor,
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
            background: 'transparent',
          }}
        />
      </>
      <Handle
        id='target'
        type='target'
        position={Position.Top}
        style={{
          // left: '50%',
          width: 10,
          height: 10,
          background: 'blue',
        }}
      />
    </>
  );
};

export default ProcessNodeComponent;
