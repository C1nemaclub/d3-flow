import CustomEdge from '../edges/CustomEdge';
import ConditionalNodeComponent from '../nodes/ConditionalNodeComponent';
import GhostNodeComponent from '../nodes/GhostNodeComponent';
import ParentLoopComponent from '../nodes/ParentLoopComponent';
import ProcessNodeComponent from '../nodes/ProcessNodeComponent';

export const nodeTypes = {
  processNode: ProcessNodeComponent,
  ghostNode: GhostNodeComponent,
  conditionalNode: ConditionalNodeComponent,
  parentLoopNode: ParentLoopComponent,
};

export const edgeTypes = {
  customEdge: CustomEdge,
};
