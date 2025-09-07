import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconCamera,
  IconClock,
  IconPlayerEject,
  IconSettings,
} from '@tabler/icons-react';
import { useShallow } from 'zustand/react/shallow';
import { useSettingsStore } from '../../store/useNodesStore';

const Header = () => {
  const [x, fullscreen, toggle] = useSettingsStore(
    useShallow((state) => [state.isDragging, state.fullscreen, state.toggle])
  );

  return (
    <Stack
      direction='row'
      alignItems='center'
      sx={{
        position: 'absolute',
        top: 20,
        // right: 20,
        height: 50,
        borderRadius: 2,
        gap: 1,
        // border: '1px solid red',
        width: '100%',
        px: 2,
        bgcolor: x ? 'red' : 'inherit',
      }}>
      <Typography variant='h6'>Process</Typography>
      <IconButton
        onClick={() => {
          toggle();
        }}
        sx={{
          bgcolor: blue[900],
          color: blue[400],
          border: `1px solid ${blue[600]}`,
          borderRadius: 2,
          p: 0.5,
          ml: 'auto',
        }}>
        {fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
      </IconButton>
      <IconButton
        sx={{
          bgcolor: ({ palette }) => palette.grey[600],
          borderRadius: 2,
          p: 0.5,
        }}>
        <IconCamera />
      </IconButton>
      <Divider
        orientation='vertical'
        flexItem
        variant='middle'
        sx={{
          borderColor: ({ palette }) => palette.grey[600],
          borderWidth: 1,
        }}
      />
      <Button
        size='small'
        startIcon={<IconPlayerEject />}
        variant='contained'
        color='inherit'>
        Run
      </Button>
      <Divider
        orientation='vertical'
        flexItem
        variant='middle'
        sx={{
          borderColor: ({ palette }) => palette.grey[600],
          borderWidth: 1,
        }}
      />
      <IconButton
        sx={{
          bgcolor: ({ palette }) => palette.grey[600],
          borderRadius: 2,
          p: 0.5,
        }}>
        <IconSettings />
      </IconButton>
      <IconButton
        sx={{
          bgcolor: ({ palette }) => palette.grey[600],
          borderRadius: 2,
          p: 0.5,
        }}>
        <IconClock />
      </IconButton>
    </Stack>
  );
};

export default Header;
