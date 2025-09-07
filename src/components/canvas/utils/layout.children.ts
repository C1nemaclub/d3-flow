import { getConnectedEdges } from '@xyflow/react';
import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';
import type { CustomEdgeType, NodeType } from '../types/nodes.types';

const elk = new ELK();

const getSide = (portId: string) => {
  if (portId === 'target') return 'NORTH';
  if (portId === 'source') return 'SOUTH';
  if (portId === 'false') return 'WEST';
  if (portId === 'true') return 'EAST';
};

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.layered.spacing.baseValue': '100',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.spacing.nodeNode': '80',
  'elk.spacing.edgeNode': '50',
  'elk.spacing.edgeEdge': '30',
  'elk.layered.edgeRouting': 'POLYLINE',
  'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]',
  'org.eclipse.elk.alignment': 'CENTER',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
};

type RecursiveNode = NodeType & { children?: RecursiveNode[] };

const layoutElements = async ({
  nodes,
  edges,
}: {
  nodes: NodeType[];
  edges: CustomEdgeType[];
}) => {
  const nodePortsMap = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (edge.sourceHandle) {
      if (!nodePortsMap.has(edge.source))
        nodePortsMap.set(edge.source, new Set());
      nodePortsMap.get(edge.source)?.add(edge.sourceHandle);
    }
    if (edge.targetHandle) {
      if (!nodePortsMap.has(edge.target))
        nodePortsMap.set(edge.target, new Set());
      nodePortsMap.get(edge.target)?.add(edge.targetHandle);
    }
  }

  /** Build ELK graph recursively */
  const buildElkNode = (n: RecursiveNode): ElkNode => {
    const portIds = nodePortsMap.get(n.id) ?? new Set();

    return {
      id: n.id,
      width: n.measured?.width ?? 120,
      height: 120,
      properties: {
        'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
        'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]',
        'org.eclipse.elk.alignment': 'CENTER',
      },
      ports: Array.from(portIds).map((portId) => {
        const side = getSide(portId);
        return {
          id: `${n.id}-${portId}`,
          width: 20,
          height: 20,
          properties: {
            'elk.port.side': side,
            'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]',
            'org.eclipse.elk.alignment': 'CENTER',
          },
        };
      }),
      children: (n.children ?? []).map(buildElkNode),
      edges: getConnectedEdges(n.children ?? [], edges).map((edge) => ({
        id: edge.id,
        sources: [edge.source!],
        targets: [edge.target!],
      })),
      layoutOptions: {
        ...layoutOptions,
        'elk.padding': '[top=40, left=40, bottom=40, right=40]',
      },
    };
  };

  /** Apply ELK layout results recursively back to our NodeType tree */
  const applyLayout = (
    elkNode: ElkNode,
    flowNodes: RecursiveNode[]
  ): RecursiveNode[] =>
    flowNodes.map((n) => {
      const layoutedNode = elkNode.children?.find((ln) => ln.id === n.id);
      if (!layoutedNode) return n;

      return {
        ...n,
        height: layoutedNode.height,
        width: layoutedNode.width,
        position: { x: layoutedNode.x ?? 0, y: layoutedNode.y ?? 0 },
        children: applyLayout(layoutedNode, n.children ?? []),
      };
    });

  /** Build tree structure (parent/child relationship) */
  const buildTree = (rootNodes: NodeType[]): RecursiveNode[] =>
    rootNodes.map((n) => {
      if (n.type === 'parentLoopNode') {
        const children = nodes.filter((child) => child.parentId === n.id);
        return { ...n, children: buildTree(children) };
      }
      return { ...n };
    });

  // 1. Build recursive tree
  const rootNodes = buildTree(nodes.filter((n) => !n.parentId));

  // 2. Build ELK graph
  const elkGraph = {
    id: 'root',
    layoutOptions,
    children: rootNodes.map(buildElkNode),
    edges: getConnectedEdges(rootNodes, edges).map((edge) => ({
      id: edge.id,
      sources: [edge.sourceHandle || edge.source],
      targets: [edge.targetHandle || edge.target],
    })),
  };

  // 3. Layout with ELK
  const layouted = await elk.layout(elkGraph);

  // 4. Apply layout recursively
  const finalTree = applyLayout(layouted, rootNodes);

  // 5. Flatten for ReactFlow
  const flatten = (tree: RecursiveNode[]): RecursiveNode[] =>
    tree.flatMap((n) => [n, ...flatten(n.children ?? [])]);

  return flatten(finalTree);
};

export default layoutElements;
