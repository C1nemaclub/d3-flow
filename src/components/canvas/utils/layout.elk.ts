import type { Edge, Node } from '@xyflow/react';
import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

type X = ElkNode;

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.layered.spacing.edgeNodeBetweenLayers': '40',
  'elk.spacing.nodeNode': '40',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
};

const getSide = (portId: string) => {
  if (portId === 'target') return 'NORTH';
  if (portId === 'source') return 'SOUTH';
};

export const getLayoutedNodes = async (nodes: Node[], edges: Edge[]) => {
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

  const graph = {
    id: 'root',
    layoutOptions,
    children: nodes.map((n) => {
      const portIds = nodePortsMap.get(n.id) ?? new Set();
      return {
        id: n.id,
        width: n.measured?.width ?? 150,
        height: n.measured?.height ?? 50,
        properties: {
          'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
        },
        ports: Array.from(portIds).map((portId) => {
          const side = getSide(portId);
          return {
            id: `${n.id}.${portId}`,
            width: 20,
            height: 20,
            properties: {
              'elk.port.side': side,
            },
          };
        }),
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source!],
      targets: [e.target!],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );
    return {
      ...node,
      data: {
        ...node.data,
      },
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  console.log(layoutedGraph);

  return layoutedNodes.map((n) => {
    if (n.type === 'parentLoopNode') {
      let lowestY = 0;
      layoutedNodes
        .filter((x) => x.parentId === n.id)
        .forEach((x) => {
          if (x.position.y > lowestY)
            lowestY = x.position.y + (x.measured?.height ?? 0);
        });
      return {
        ...n,
        height: lowestY,
      };
    }
    return n;
  });
};
