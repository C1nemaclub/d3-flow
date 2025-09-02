import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import {
  IconCamera,
  IconClock,
  IconPlayerEject,
  IconSettings,
} from '@tabler/icons-react';

const Header = () => {
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
      }}>
      <Typography variant='h6'>Process</Typography>
      <IconButton
        sx={{
          bgcolor: ({ palette }) => palette.grey[600],
          borderRadius: 2,
          p: 0.5,
          ml: 'auto',
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
