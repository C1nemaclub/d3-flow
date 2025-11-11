import type { Node } from '@xyflow/react';

interface NodeBuilderParams<T extends Node> {
  get: () => T[];
  remove: (nodeId: string) => NodeBuilderParams<T>;
  add: (node: T) => NodeBuilderParams<T>;
  updateData: (nodeId: string, data: T['data']) => NodeBuilderParams<T>;
}

export const nodeBuilder = <T extends Node>(initialNodes: T[]) => {
  let nodes = [...initialNodes];

  const api: NodeBuilderParams<T> = {
    get: () => nodes,
    remove: (nodeId) => {
      nodes = nodes.filter((n) => n.id !== nodeId);
      return api;
    },
    add: (node: T) => {
      nodes = [...nodes, node];
      return api;
    },
    updateData: (nodeId: string, data: T['data']) => {
      nodes = nodes.map((n) => {
        if (n.id === nodeId) return { ...n, data: data };
        return n;
      });
      return api;
    },
  };

  return api;
};
