import { Divider, Fade, IconButton, Stack, Typography } from '@mui/material';
import { IconBrandNodejs, IconX } from '@tabler/icons-react';
import { type FC } from 'react';
import Editor from './Editor';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <Fade in={isOpen} timeout={300} appear>
      <Stack
        sx={{
          border: ({ palette }) => `1px solid ${palette.divider}`,
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 500,
          borderRadius: 2,
          backgroundColor: ({ palette }) => palette.background.paper,
          height: 'calc(100% - 100px)',
        }}>
        <Stack direction='row' gap={1} alignItems='center' p={2}>
          <IconBrandNodejs />
          <Typography fontWeight={500}>Node 3</Typography>
          <IconButton sx={{ p: 0, ml: 'auto' }} onClick={onClose}>
            <IconX />
          </IconButton>
        </Stack>
        <Divider
          sx={{
            borderColor: ({ palette }) => palette.divider,
            mb: 1,
          }}
        />
        <Editor />
        <div
          onDragStart={(e) => {
            console.log('dragStart');
            e.dataTransfer.setData('text/plain', 'red');
          }}
          draggable='true'
          style={{
            cursor: 'pointer',
            userSelect: 'none',
          }}>
          red
        </div>
        <div
          onDragStart={(e) => {
            console.log('dragStart');
            e.dataTransfer.setData('text/plain', 'green');
          }}
          draggable='true'
          style={{
            cursor: 'pointer',
            userSelect: 'none',
          }}>
          Green
        </div>
      </Stack>
    </Fade>
  );
};

export default Sidebar;
