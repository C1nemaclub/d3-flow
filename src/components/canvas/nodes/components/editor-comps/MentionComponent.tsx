import { Tooltip } from '@mui/material';
import { IconUser } from '@tabler/icons-react';
import { NodeViewWrapper, type NodeViewWrapperProps } from '@tiptap/react';
import type { FC } from 'react';

const MentionComponent: FC<NodeViewWrapperProps> = ({ node }) => {
  console.log(node.attrs);

  return (
    <NodeViewWrapper as='span'>
      <Tooltip title={node.attrs.type} arrow>
        <span
          className='mention'
          data-id={node.attrs.id}
          // style={{
          //   display: 'flex',
          //   alignItems: 'center',
          //   width: 'fit-content',
          //   gap: 2,
          // }}
        >
          <IconUser />@{node.attrs.label ?? node.attrs.id}
        </span>
      </Tooltip>
    </NodeViewWrapper>
  );
};

export default MentionComponent;
