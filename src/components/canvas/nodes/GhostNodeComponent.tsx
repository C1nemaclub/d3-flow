import { Stack } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import {
  getConnectedEdges,
  Handle,
  Position,
  useReactFlow,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import type { GhostNode, ProcessNode } from '../types/nodes.types';

const GhostNodeComponent = (props: NodeProps<GhostNode>) => {
  const utils = useReactFlow();
  const handleClick = () => {
    const node = utils.getNode(props.id);
    if (!node) return;
    const edges = utils.getEdges();
    const connectedEdges = getConnectedEdges([node], edges);
    utils.deleteElements({ nodes: [{ id: props.id }], edges: connectedEdges });
    const edge = connectedEdges[0];
    const newNode: ProcessNode = {
      id: crypto.randomUUID(),
      type: 'processNode',
      position: node.position,
      data: { label: 'Added Node!' },
    };
    const newEdge: Edge = {
      id: crypto.randomUUID(),
      source: edge.source,
      target: newNode.id,
    };
    const newGhost: GhostNode = {
      id: crypto.randomUUID(),
      type: 'ghostNode',
      position: {
        ...node.position,
        y: node.position.y + 120,
      },
      data: { label: 'Added Node!' },
    };
    const newGhostEdge: Edge = {
      id: crypto.randomUUID(),
      source: newNode.id,
      target: newGhost.id,
    };
    utils.addNodes([newNode, newGhost]);
    utils.addEdges([newEdge, newGhostEdge]);
    setTimeout(() => {
      utils.fitView({
        nodes: [newNode, newGhost],
        duration: 500,
      });
    }, 0); // Next tick
  };

  return (
    <>
      <Stack
        sx={{
          width: 300,
          border: '2px dashed #757575cc',
          borderRadius: 2,
          ':hover': {
            border: '2px dashed #575757cc',
          },
          p: 2,
          py: 3,
          pb: 2,
        }}
        alignItems='center'
        role='button'
        tabIndex={0}
        onClick={handleClick}>
        <IconPlus />
      </Stack>
      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          left: '50%',
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
          background: 'purple',
        }}
      />
    </>
  );
};

export default GhostNodeComponent;
