import { Stack } from '@mui/material';
import { IconSlideshow } from '@tabler/icons-react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ControlButton,
  Controls,
  ReactFlow,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import Header from './nodes/components/Header';
import Sidebar from './nodes/components/Sidebar';
import { useSettingsStore } from './store/useNodesStore';
import type { CustomEdgeType, NodeType } from './types/nodes.types';
import { nodeBuilder } from './utils/builder';
import { edgeTypes, nodeTypes } from './utils/nodes';

const complexNodes: NodeType[] = [
  {
    id: '1',
    type: 'processNode',
    position: { x: -300, y: 50 },
    data: {
      label: 'Process',
    },
  },
  {
    id: '2',
    type: 'processNode',
    position: { x: 300, y: 50 },
    data: {
      label: 'Process',
    },
  },
  {
    id: '3',
    type: 'conditionalNode',
    position: { x: 0, y: -140 },
    data: {
      label: 'Condition',
    },
  },
  {
    id: '4',
    type: 'processNode',
    position: { x: 0, y: -340 },
    data: {
      label: 'Start',
    },
  },
];
const complexEdges: CustomEdgeType[] = [
  {
    id: 'true',
    type: 'customEdge',
    source: '3',
    target: '2',
    sourceHandle: 'true',
    animated: true,
  },
  {
    id: 'false',
    type: 'customEdge',
    source: '3',
    target: '1',
    sourceHandle: 'false',
    animated: true,
  },
  {
    id: 'start',
    type: 'customEdge',
    source: '4',
    target: '3',
    animated: true,
  },
];
const Canvas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodes, setNodes] = useState(complexNodes);
  const [edges, setEdges] = useState(complexEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const reactFlowInstance = useReactFlow();
  const isFullscreen = useSettingsStore((state) => state.fullscreen);

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeType>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<CustomEdgeType>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) return;

      const dragData = JSON.parse(type);

      if (dragData.type === 'nodeDrag') {
        // Handle the drag of multiple nodes
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // You'll need to implement logic to move all the nodes
        // This might involve updating the positions of all nodes in dragData.nodeIds
      }
    },
    [reactFlowInstance]
  );

  const doStuff = () => {
    const builder = nodeBuilder(nodes);
    const updatedNodes = builder
      .add({
        type: 'ghostNode',
        id: 'built',
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: '',
        },
      })
      .add({
        type: 'ghostNode',
        id: 'built2',
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: '',
        },
      })
      .get();
  };

  const ui = () => {
    return (
      <Stack
        width='100%'
        height='100vh'
        sx={{
          position: 'relative',
        }}>
        <ReactFlow
          onDragOver={onDragOver}
          onDrop={onDrop}
          colorMode='dark'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // nodesDraggable={false}
          fitView
          onNodeClick={(_, { id }) => {
            setSelectedNodeId(id);
          }}
          fitViewOptions={
            {
              // duration: 500,
            }
          }>
          <Background gap={[30, 30]} size={1} />
          <Controls
            position='bottom-left'
            style={{
              bottom: 5,
              gap: 3,
            }}>
            <ControlButton onClick={() => setIsOpen(true)} title='Open Sidebar'>
              <IconSlideshow />
            </ControlButton>
          </Controls>
        </ReactFlow>
        {/* <div>{createPortal(<Header />, document.body)}</div> */}
        <Header />
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Stack>
    );
  };

  const finalUi = ui();

  // const canvasUi = isFullscreen ? createPortal(ui(), document.body) : ui();
  const canvasUi = isFullscreen
    ? createPortal(
        <Stack
          sx={{
            position: 'fixed',
            transform: 'translate(-50%, -50%)',
            top: '50%',
            left: '50%',
            zIndex: 100,
            width: '100%',
            height: '100%',
          }}>
          <Stack>Fullscreen Mode</Stack>
          {finalUi}
        </Stack>,
        document.getElementById('root')!
      )
    : finalUi;

  return canvasUi;
};

export default Canvas;
