import { getIncomers, type Edge, type Node } from '@xyflow/react';
import { hierarchy, tree } from 'd3-hierarchy';

interface GetLayoutedElementsProps {
  nodes: Node[];
  edges: Edge[];
}

const layoutTree = tree();

export const getLayoutedElements = ({
  edges,
  nodes,
}: GetLayoutedElementsProps) => {
  if (nodes.length === 0) return { nodes, edges };

  const nodeSize = 100;
  const horizontalSpacing = 310;
  const verticalSpacing = 300;

  // Map of edges by source node
  const outgoingEdgesMap: Record<string, Edge[]> = {};
  edges.forEach((edge) => {
    if (!outgoingEdgesMap[edge.source]) {
      outgoingEdgesMap[edge.source] = [];
    }
    outgoingEdgesMap[edge.source].push(edge);
  });

  console.log(outgoingEdgesMap);

  // Create map of node ID to mutable node
  const nodeMap = new Map(
    nodes.map((n) => [n.id, { ...n, children: [] as any[] }])
  );

  // Sort conditional node edges properly
  const handleOrder = { false: 0, source: 1, true: 2 };

  nodes.forEach((node) => {
    const edgesFromNode = outgoingEdgesMap[node.id] || [];
    let sortedEdges = edgesFromNode;

    if (node.type === 'conditionalNode') {
      sortedEdges = [...edgesFromNode].sort((a, b) => {
        const aKey = a.sourceHandle || 'source';
        const bKey = b.sourceHandle || 'source';
        return (handleOrder as any)[aKey] - (handleOrder as any)[bKey];
      });
    }

    sortedEdges.forEach((edge) => {
      const child = nodeMap.get(edge.target);
      if (child) {
        (nodeMap.get(node.id)?.children || []).push(child);
      }
    });
  });

  // Find root node (not a target)
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));
  if (!rootNode) return { nodes, edges };

  const root = hierarchy(nodeMap.get(rootNode.id)!);
  tree().nodeSize([horizontalSpacing, verticalSpacing])(root);

  const layoutedNodes = root.descendants().map((d) => {
    return {
      ...d.data,
      position: { x: d.x, y: d.y },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};

interface GetExecutionPathProps {
  nodes: Node[];
  edges: Edge[];
  nodeId: string;
}
interface GetExecutionPathProps {
  nodes: Node[];
  edges: Edge[];
  nodeId: string;
}

export const getExecutionPath = ({
  nodes,
  edges,
  nodeId,
}: GetExecutionPathProps): string[] => {
  const nodeIds: string[] = [];
  const visited = new Set<string>();

  const traverse = (currentNodeId: string) => {
    if (visited.has(currentNodeId)) return;
    visited.add(currentNodeId);
    nodeIds.push(currentNodeId);

    const incomers = getIncomers({ id: currentNodeId }, nodes, edges);
    for (const incomer of incomers) {
      traverse(incomer.id);
    }
  };

  traverse(nodeId);
  return nodeIds;
};
