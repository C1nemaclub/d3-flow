import type { Node } from '@xyflow/react';

// Process Node
export type ProcessNodeProps = {
  label: string;
};

export type ProcessNode = Node<ProcessNodeProps, 'processNode'>;

// Ghost Node
export type GhostNodeProps = {
  label: string;
};

export type GhostNode = Node<GhostNodeProps, 'ghostNode'>;

// Conditional Node
export type ConditionalNodeProps = {
  label: string;
};

export type ConditionalNode = Node<ConditionalNodeProps, 'conditionalNode'>;

export type NodeType = ProcessNode | GhostNode | ConditionalNode;
