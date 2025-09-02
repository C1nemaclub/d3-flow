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
  // 'elk.layered.spacing.edgeNodeBetweenLayers': '400',
  // 'elk.layered.spacing.nodeNode': '400',
  // 'elk.layered.spacing.nodeEdge': '1000',
  // 'elk.layered.spacing.edgeNode': '1000',
  // 'elk.layered.spacing.edgeEdge': '1000',
  // 'elk.spacing.nodeNode': '200',
  // 'elk.padding': '[top=20, left=20, bottom=20, right=20]',
  'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
  'org.eclipse.elk.alignment': 'CENTER',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
};

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

  const lay = async <T extends NodeType & { children?: NodeType[] }>(
    targetNodes: T[]
  ) => {
    const graph = {
      id: 'root',
      layoutOptions,
      children: targetNodes.map((n) => {
        const portIds = nodePortsMap.get(n.id) ?? new Set();
        return {
          id: n.id,
          width: n.measured?.width ?? 120,
          height: 120,
          properties: {
            'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
            'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
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
                'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
                'org.eclipse.elk.alignment': 'CENTER',
              },
            };
          }),
          children: (n.children || []).map((item) => {
            const childrenPorts = nodePortsMap.get(item.id) ?? new Set();
            return {
              id: item.id,
              width: 300,
              height: 120,
              ports: Array.from(childrenPorts).map((portId) => {
                const childSide = getSide(portId);
                return {
                  id: `${n.id}-${portId}`,
                  width: 20,
                  height: 20,
                  properties: {
                    'elk.port.side': childSide,
                    'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
                    'org.eclipse.elk.alignment': 'CENTER',
                  },
                };
              }),
              layoutOptions: {
                'elk.spacing.nodeNode': '60', // Spacing between child nodes
                'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
                'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
                'org.eclipse.elk.alignment': 'CENTER',
              },
            };
          }),
          edges: getConnectedEdges(n.children || [], edges).map((edge) => ({
            id: edge.id,
            sources: [edge.source!],
            targets: [edge.target!],
          })),
          layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'DOWN',
            'elk.padding': '[top=40, left=40, bottom=40, right=40]',
            'elk.spacing.nodeNode': '80', // Spacing if this container has siblings
            'elk.spacing.edgeNode': '40',
            'elk.layered.spacing.baseValue': '120',
            // 'elk.contentAlignment': 'H_CENTER V_CENTER', // Center children in container
            // 'elk.layered.contentAlignment': 'H_RIGHT V',
            'elk.layered.edgeRouting': 'POLYLINE',
            // // 'elk.layered.nodePlacement.strategy': 'SIMPLE',
            // 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
            'org.eclipse.elk.layered.nodePlacement.favorStraightEdges': 'true',
            'elk.layered.contentAlignment': '[H_CENTER, V_CENTER]', // Align children to center-middle
            'org.eclipse.elk.alignment': 'CENTER',
            'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
            'elk.layered.nodePlacement.bk.edgeStraightening':
              'IMPROVE_STRAIGHTNESS',
            'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          },
        };
      }),
      edges: getConnectedEdges(targetNodes, edges).map((edge) => ({
        id: edge.id,
        sources: [edge.sourceHandle || edge.source],
        targets: [edge.targetHandle || edge.target],
      })),
    };

    return await elk.layout(graph);
  };

  const elkNodes = nodes
    .filter((n) => !n.parentId)
    .map((n) => {
      if (n.type === 'parentLoopNode') {
        const children = nodes.filter((child) => child.parentId === n.id);
        return {
          ...n,
          children,
        };
      }
      return n;
    });

  const surfaceLayoutedNodes = await lay(elkNodes);

  const finalNodes = elkNodes.map((n) => {
    const layoutedNode = surfaceLayoutedNodes.children?.find(
      (ln) => ln.id === n.id
    );

    return {
      ...n,
      height: layoutedNode?.height,
      width: layoutedNode?.width,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
      children: layoutedNode?.children.map((child: ElkNode) => {
        const flowChild = nodes.find((item) => item.id === child.id);
        return {
          ...flowChild,
          height: child.height,
          width: child.width,
          position: {
            x: child.x,
            y: child.y,
          },
        };
      }),
    };
  });

  return finalNodes.flatMap((n) => [n, ...(n.children ?? [])]);
};

export default layoutElements;
