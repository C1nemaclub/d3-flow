import { Tooltip } from '@mui/material';
import { IconUser } from '@tabler/icons-react';
import { NodeViewWrapper, type NodeViewWrapperProps } from '@tiptap/react';
import type { FC } from 'react';

const MentionComponent: FC<NodeViewWrapperProps> = ({ node }) => {
  return (
    <NodeViewWrapper as='span'>
      <Tooltip title={node.attrs.type} arrow>
        <span
          className='mention'
          data-id={node.attrs.id}
          style={{
            backgroundColor: 'rgba(182, 147, 253, 0.1)',
            color: '#5800cc',
          }}>
          <IconUser />@{node.attrs.label ?? node.attrs.id}
        </span>
      </Tooltip>
    </NodeViewWrapper>
  );
};

export default MentionComponent;
