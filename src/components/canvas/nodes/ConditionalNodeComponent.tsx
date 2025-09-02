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
import type { ProcessNode } from '../types/nodes.types';

const ConditionalNodeComponent = (props: NodeProps<ProcessNode>) => {
  const scaleFactor = useStore((state) => state.transform[2]);
  const rf = useReactFlow();

  const createGhostOnEmptySource = () => {
    const int = rf.getInternalNode(props.id);
    const node = rf.getNode(props.id);
    if (!node) return;
    const connectedEdgesSourceHandles = getConnectedEdges([node], rf.getEdges())
      .map((edge) => {
        return edge.sourceHandle ?? null;
      })
      .filter((item) => Boolean(item));
    const sourceHandles = int?.internals.handleBounds?.source;
    const emptySourceHandles = sourceHandles?.filter((handle) => {
      if (!connectedEdgesSourceHandles.includes(handle.id ?? '')) return true;
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
        sx={
          {
            // width: props.width,
            // border: '1px solid #363636',
            // borderRadius: 2,
            // ':hover': {
            //   border: '1px solid dodgerblue',
            // },
            // pb: 2,
            // alignItems: 'center',
          }
        }>
        <Stack sx={{ px: 1, pt: 1, pb: 0.5 }} alignItems='start'>
          Process Node {props.id} {props.width}
          {/* <pre>{JSON.stringify({ d: props.data._debug }, null, 2)}</pre> */}
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
        nodeId={props.id}>
        <IconButton
          sx={{
            scale: scaleFactor,
          }}>
          <IconTrash size={25} />
        </IconButton>
      </NodeToolbar>
      {/* <Handle
        id='source'
        type='source'
        position={Position.Bottom}
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: 'red',
        }}
      /> */}
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
