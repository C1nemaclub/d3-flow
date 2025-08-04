import { IconButton, Stack } from '@mui/material';
import { IconKey } from '@tabler/icons-react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useReactFlow,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { interpolate } from 'd3-interpolate';
import { useCallback, useState } from 'react';
import { getExecutionPath, getLayoutedElements } from './utils/layout';
import { nodeTypes } from './utils/nodes';
const ANIMATION_DURATION = 300;

const complexNodes = [
  {
    type: 'processNode',
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Start' },
  },
  {
    type: 'conditionalNode',
    id: 'n4',
    position: { x: 0, y: 180 },
    data: { label: 'Condition A' },
  },
  {
    type: 'processNode',
    id: 'n5',
    position: { x: -400, y: 350 },
    data: { label: 'A - False' },
  },
  {
    type: 'processNode',
    id: 'n6',
    position: { x: 400, y: 350 },
    data: { label: 'A - True' },
  },
  {
    type: 'processNode',
    id: 'n2',
    position: { x: 0, y: 350 },
    data: { label: 'A - Finally' },
  },

  {
    type: 'processNode',
    id: 'n30',
    position: { x: -600, y: 500 },
    data: { label: 'A - False Extra' },
  },
  // {
  //   type: 'ghostNode',
  //   id: 'n31',
  //   position: { x: -600, y: 650 },
  //   data: { label: 'A - False End' },
  // },

  // {
  //   type: 'ghostNode',
  //   id: 'n3',
  //   position: { x: 0, y: 650 },
  //   data: { label: 'End A' },
  // },
  {
    type: 'conditionalNode',
    id: 'n10',
    position: { x: 400, y: 650 },
    data: { label: 'Condition B 👽' },
  },
  {
    type: 'processNode',
    id: 'b1',
    position: { x: 400, y: 650 },
    data: { label: 'Condition B 👽 Child 1' },
  },
  {
    type: 'processNode',
    id: 'b2',
    position: { x: 400, y: 650 },
    data: { label: 'Condition B 👽 Child 2' },
  },
  {
    type: 'processNode',
    id: 'b3',
    position: { x: 400, y: 650 },
    data: { label: 'Condition B 👽 Child 3' },
  },

  // {
  //   type: 'ghostNode',
  //   id: 'n11',
  //   position: { x: 600, y: 800 },
  //   data: { label: 'B - True 👻' },
  // },
  // {
  //   type: 'ghostNode',
  //   id: 'n12',
  //   position: { x: 200, y: 800 },
  //   data: { label: 'B - False 👻' },
  // },
  // {
  //   type: 'ghostNode',
  //   id: 'n13',
  //   position: { x: 400, y: 800 },
  //   data: { label: 'B - Finally 👻' },
  // },

  {
    type: 'conditionalNode',
    id: 'n20',
    position: { x: 600, y: 950 },
    data: { label: 'Condition C 🔁' },
  },
  {
    type: 'processNode',
    id: 'n21',
    position: { x: 800, y: 1100 },
    data: { label: 'C - True ✔' },
  },
  {
    type: 'processNode',
    id: 'n22',
    position: { x: 600, y: 1100 },
    data: { label: 'C - False ❌' },
  },
  {
    type: 'processNode',
    id: 'c1',
    position: { x: 600, y: 1100 },
    data: { label: 'Some Node' },
  },
  // {
  //   type: 'ghostNode',
  //   id: 'n23',
  //   position: { x: 700, y: 1250 },
  //   data: { label: 'End C 🧊' },
  // },
];

const complexEdges: Edge[] = [
  {
    id: 'n1-n4',
    source: 'n1',
    target: 'n4',
  },
  { id: 'n4-n2', source: 'n4', target: 'n2' }, // A - finally
  { id: 'n4-n5', source: 'n4', target: 'n5', sourceHandle: 'false' },
  { id: 'n4-n6', source: 'n4', target: 'n6', sourceHandle: 'true' },
  { id: 'n2-n3', source: 'n2', target: 'n3' },

  // A - false path
  { id: 'n5-n30', source: 'n5', target: 'n30' },
  { id: 'n30-n31', source: 'n30', target: 'n31' },

  // A - true → Condition B
  { id: 'n6-n10', source: 'n6', target: 'n10' },
  { id: 'n10-n11', source: 'n10', target: 'n11', sourceHandle: 'true' },
  { id: 'n10-n12', source: 'n10', target: 'n12', sourceHandle: 'false' },
  { id: 'n10-n13', source: 'n10', target: 'n13' }, // B - finally

  // Nested C condition under B - true
  { id: 'n11-n20', source: 'n11', target: 'n20' },
  { id: 'n20-n21', source: 'n20', target: 'n21', sourceHandle: 'true' },
  { id: 'n20-n22', source: 'n20', target: 'n22', sourceHandle: 'false' },
  { id: 'n20-n23', source: 'n20', target: 'c1' }, // C - finally
  // Nested under condition B
  { id: 'n10-b1', source: 'n10', target: 'b1', sourceHandle: 'true' },
  { id: 'n10-b2', source: 'n10', target: 'b2', sourceHandle: 'false' },
  { id: 'n10-b3', source: 'n10', target: 'b3' }, // C - finally

  //
  { id: 'n30-n20', source: 'n30', target: 'n20' }, // C - finally
];
const Canvas = () => {
  const [nodes, setNodes] = useState(complexNodes);
  const [edges, setEdges] = useState(complexEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const { fitView } = useReactFlow();

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

  const onLayout = useCallback(() => {
    const prevNodeMap = new Map(nodes.map((n) => [n.id, n]));

    const res = getLayoutedElements({ nodes, edges });

    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / ANIMATION_DURATION);

      const interpolatedNodes = res.nodes.map((newNode) => {
        const prevNode = prevNodeMap.get(newNode.id);
        const interpX = interpolate(
          prevNode?.position.x ?? newNode.position.x,
          newNode.position.x
        )(t);
        const interpY = interpolate(
          prevNode?.position.y ?? newNode.position.y,
          newNode.position.y
        )(t);

        return {
          ...newNode,
          position: { x: interpX, y: interpY },
        };
      });

      setNodes(interpolatedNodes);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation done
        setNodes(res.nodes); // Final positions, just to be sure
        setEdges(res.edges); // In case edges updated
      }
    };

    requestAnimationFrame(animate);
  }, [nodes, edges]);

  const exPath = getExecutionPath({ nodes, edges, nodeId: selectedNodeId });
  const mappedNodes = nodes.map((n) => {
    if (exPath.includes(n.id)) {
      return {
        ...n,
        data: {
          ...n.data,
          selected: true,
        },
      };
    }
    return {
      ...n,
      data: {
        ...n.data,
        selected: false,
      },
    };
  });

  const mappedEges = edges.map((e) => {
    if (exPath.includes(e.target) && exPath.includes(e.source)) {
      return {
        ...e,
        animated: true,
        style: {
          stroke: 'dodgerblue',
          strokeWidth: 3,
        },
      };
    }
    return {
      ...e,
      // animated: false,
      // style: {
      //   stroke: 'blue',
      // },
    };
  });

  return (
    <Stack width='100%' height='90vh'>
      <ReactFlow
        nodes={nodes}
        edges={mappedEges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, { id }) => {
          setSelectedNodeId(id);
        }}
        fitViewOptions={{
          duration: 500,
        }}>
        <Background variant={BackgroundVariant.Lines} />
        <Controls position='top-left'>
          <IconButton onClick={onLayout} sx={{ p: 0, background: 'white' }}>
            <IconKey />
          </IconButton>
        </Controls>
      </ReactFlow>
    </Stack>
  );
};

export default Canvas;
