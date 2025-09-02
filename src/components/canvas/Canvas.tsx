import { Box, Button, Stack } from '@mui/material';
import { IconSlideshow, IconWand } from '@tabler/icons-react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ControlButton,
  Controls,
  ReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import Header from './nodes/components/Header';
import Sidebar from './nodes/components/Sidebar';
import type { CustomEdgeType, NodeType } from './types/nodes.types';
import { getExecutionPath } from './utils/layout';
import layoutElements from './utils/layout.children';
import { getLayoutedNodes } from './utils/layout.elk';
import { edgeTypes, nodeTypes } from './utils/nodes';
const ANIMATION_DURATION = 300;

const complexNodes: NodeType[] = [
  // {
  //   type: 'parentLoopNode',
  //   id: '1',
  //   position: { x: 0, y: 0 },
  //   data: { label: 'Loop Node' },
  // },
  {
    type: 'parentLoopNode',
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Loop Node' },
    // parentId: '1',
    expandParent: true,
    // extent: 'parent',
    height: 100,
    width: 300,
  },
  {
    type: 'parentLoopNode',
    id: '2',
    position: { x: 0, y: 0 },
    data: { label: 'Loop Node' },
    // parentId: '1',
    expandParent: true,
    // extent: 'parent',
  },
  {
    type: 'processNode',
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Get me to true' },
    parentId: '2',
    // extent: 'parent',
    expandParent: true,
  },
  {
    type: 'processNode',
    id: 'n2',
    position: { x: 0, y: 0 },
    data: { label: 'Get me to false' },
    parentId: '2',
    // extent: 'parent',
    expandParent: true,
  },
  {
    type: 'processNode',
    id: 'n3',
    position: { x: 0, y: 0 },
    data: { label: 'Start' },
    parentId: '2',
    // extent: 'parent',
    expandParent: true,
  },
  {
    type: 'processNode',
    id: 'n4',
    position: { x: 0, y: 0 },
    data: { label: 'Start' },
    parentId: '1',
    // extent: 'parent',
    expandParent: true,
  },
  {
    type: 'conditionalNode',
    id: 'conditional',
    position: { x: 0, y: 180 },
    data: { label: 'Condition A' },
    parentId: '2',
    expandParent: true,
  },
  // {
  //   type: 'processNode',
  //   id: 'n5',
  //   position: { x: -400, y: 350 },
  //   data: { label: 'A - False' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n6',
  //   position: { x: 400, y: 350 },
  //   data: { label: 'A - True' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n2',
  //   position: { x: 0, y: 350 },
  //   data: { label: 'A - Finally' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n2-finally',
  //   position: { x: 0, y: 350 },
  //   data: { label: 'A - Finally' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n3-finally',
  //   position: { x: 0, y: 350 },
  //   data: { label: 'A - Finally' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n30',
  //   position: { x: -600, y: 500 },
  //   data: { label: 'A - False Extra' },
  // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n31',
  // //   position: { x: -600, y: 650 },
  // //   data: { label: 'A - False End' },
  // // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n3',
  // //   position: { x: 0, y: 650 },
  // //   data: { label: 'End A' },
  // // },
  // {
  //   type: 'conditionalNode',
  //   id: 'n10',
  //   position: { x: 400, y: 650 },
  //   data: { label: 'Condition B 👽' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'b1',
  //   position: { x: 400, y: 650 },
  //   data: { label: 'Condition B 👽 Child 1' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'b2',
  //   position: { x: 400, y: 650 },
  //   data: { label: 'Condition B 👽 Child 2' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'b3',
  //   position: { x: 400, y: 650 },
  //   data: { label: 'Condition B 👽 Child 3' },
  // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n11',
  // //   position: { x: 600, y: 800 },
  // //   data: { label: 'B - True 👻' },
  // // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n12',
  // //   position: { x: 200, y: 800 },
  // //   data: { label: 'B - False 👻' },
  // // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n13',
  // //   position: { x: 400, y: 800 },
  // //   data: { label: 'B - Finally 👻' },
  // // },
  // {
  //   type: 'conditionalNode',
  //   id: 'n20',
  //   position: { x: 600, y: 950 },
  //   data: { label: 'Condition C 🔁' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n21',
  //   position: { x: 800, y: 1100 },
  //   data: { label: 'C - True ✔' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'n22',
  //   position: { x: 600, y: 1100 },
  //   data: { label: 'C - False ❌' },
  // },
  // {
  //   type: 'processNode',
  //   id: 'c1',
  //   position: { x: 600, y: 1100 },
  //   data: { label: 'Some Node' },
  // },
  // // {
  // //   type: 'ghostNode',
  // //   id: 'n23',
  // //   position: { x: 700, y: 1250 },
  // //   data: { label: 'End C 🧊' },
  // // },
];

const complexEdges: CustomEdgeType[] = [
  {
    id: 'n1-conditional',
    source: 'n1',
    target: 'conditional',
    type: 'customEdge',
  },
  {
    id: 'conditional-n2',
    source: 'conditional',
    target: 'n2',
    sourceHandle: 'false',
    type: 'customEdge',
    data: { edgeLabel: 'False', edgeType: 'false' },
  },
  {
    id: 'conditional-n3',
    source: 'conditional',
    target: 'n3',
    sourceHandle: 'true',
    type: 'customEdge',
    data: { edgeLabel: 'True', edgeType: 'true' },
  },
  // {
  //   id: 'papa-2',
  //   source: 'papa',
  //   target: '2',
  //   sourceHandle: 'false',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'False', edgeType: 'false' },
  // },
  //   id: 'n4-n5',
  //   source: 'n4',
  //   target: 'n5',
  //   sourceHandle: 'false',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'False', edgeType: 'false' },
  // },
  // {
  //   id: 'n2-n3',
  //   source: 'n2',
  //   target: 'n3',
  //   type: 'customEdge',
  // },
  {
    id: '1-2',
    source: '1',
    target: '2',
    type: 'customEdge',
  },
  // {
  //   id: 'n1-n4',
  //   source: 'n1',
  //   target: 'n4',
  //   type: 'customEdge',
  // },
  // { id: 'n4-n2', source: 'n4', target: 'n2', type: 'customEdge' }, // A - finally
  // {
  //   id: 'n4-n5',
  //   source: 'n4',
  //   target: 'n5',
  //   sourceHandle: 'false',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'False', edgeType: 'false' },
  // },
  // {
  //   id: 'n4-n6',
  //   source: 'n4',
  //   target: 'n6',
  //   sourceHandle: 'true',
  //   type: 'customEdge',
  //   data: { edgeType: 'true', edgeLabel: 'True' },
  // },
  // // { id: 'n2-n3', source: 'n2', target: 'n3' },
  // // A - false path
  // { id: 'n5-n30', source: 'n5', target: 'n30', type: 'customEdge' },
  // // { id: 'n30-n31', source: 'n30', target: 'n31' },
  // // A - true → Condition B
  // { id: 'n6-n10', source: 'n6', target: 'n10', type: 'customEdge' },
  // // { id: 'n10-n11', source: 'n10', target: 'n11', sourceHandle: 'true' },
  // // { id: 'n10-n12', source: 'n10', target: 'n12', sourceHandle: 'false' },
  // // { id: 'n10-n13', source: 'n10', target: 'n13' }, // B - finally
  // // Nested C condition under B - true
  // { id: 'n11-n20', source: 'n11', target: 'n20', type: 'customEdge' },
  // {
  //   id: 'n20-n21',
  //   source: 'n20',
  //   target: 'n21',
  //   sourceHandle: 'true',
  //   type: 'customEdge',
  //   data: { edgeType: 'true', edgeLabel: 'True' },
  // },
  // {
  //   id: 'n20-n22',
  //   source: 'n20',
  //   target: 'n22',
  //   sourceHandle: 'false',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'False', edgeType: 'false' },
  // },
  // {
  //   id: 'n20-n23',
  //   source: 'n20',
  //   target: 'c1',
  //   type: 'customEdge',
  //   // data: { label: 'Test' },
  // }, // C - finally
  // // Nested under condition B
  // {
  //   id: 'n10-b1',
  //   source: 'n10',
  //   target: 'b1',
  //   sourceHandle: 'true',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'True', edgeType: 'true' },
  // },
  // {
  //   id: 'n10-b2',
  //   source: 'n10',
  //   target: 'b2',
  //   sourceHandle: 'false',
  //   type: 'customEdge',
  //   data: { edgeLabel: 'False', edgeType: 'false' },
  // },
  // { id: 'n10-b3', source: 'n10', target: 'b3', type: 'customEdge' }, // C - finally
  // //
  // { id: 'n30-n20', source: 'n30', target: 'n20', type: 'customEdge' }, // C - finally
  // {
  //   id: 'n2-n2-finally',
  //   source: 'n2',
  //   target: 'n2-finally',
  //   type: 'customEdge',
  // }, // C - finally
  // {
  //   id: 'n2-n3-finally',
  //   source: 'n2-finally',
  //   target: 'n3-finally',
  //   type: 'customEdge',
  // }, // C - finally
];
const Canvas = () => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [isOpen, setIsOpen] = useState(false);
  const [nodes, setNodes] = useState(complexNodes);
  const [edges, setEdges] = useState(complexEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('');

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onLayout = useCallback(async () => {
    const x = await getLayoutedNodes(nodes, edges);
    // const nodeIds = newNodes.map(({ id }) => id);
    // updateNodeInternals(nodeIds);

    setNodes(x);
    // setEdges(newN.edges);
  }, [nodes, edges]);

  const exPath = getExecutionPath({ nodes, edges, nodeId: selectedNodeId });

  const lay = async () => {
    const layoutNodes = await layoutElements({ nodes, edges });
    setNodes(layoutNodes);
  };

  return (
    <Stack
      width='100%'
      height='100vh'
      sx={{
        position: 'relative',
      }}>
      <ReactFlow
        colorMode='dark'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onNodeClick={(_, { id }) => {
          setSelectedNodeId(id);
        }}
        fitViewOptions={{
          duration: 500,
        }}>
        <Background gap={[30, 30]} size={1} />
        <Controls
          position='bottom-left'
          style={{
            bottom: 5,
            gap: 3,
          }}>
          <Box component={ControlButton} onClick={onLayout} title='Reorganize'>
            <IconWand />
          </Box>
          <ControlButton onClick={() => setIsOpen(true)} title='Open Sidebar'>
            <IconSlideshow />
          </ControlButton>
        </Controls>
      </ReactFlow>
      <Button onClick={lay}>Layout</Button>
      <Header />
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Stack>
  );
};

export default Canvas;
