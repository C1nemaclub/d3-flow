import { Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

const LoaderWrapper = () => {
  return (
    <Stack
      sx={{
        width: 300,
        height: 100,
        border: `1px solid ${blue[800]}`,
        borderRadius: 3,
        my: 3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        bgcolor: 'black',
        overflow: 'hidden',
        zIndex: 1,
        backgroundColor: 'white',
      }}>
      <Stack
        className='overlay'
        component='div'
        sx={{
          bgcolor: 'white',
          overflow: 'hidden',
          position: 'absolute',
          width: 'calc(100% - 4px)',
          height: 'calc(100% - 4px)',
          borderRadius: 2.5,
          color: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography fontSize='2rem'>Loading...</Typography>
      </Stack>
      <Stack
        component='div'
        className='spinner'
        sx={{
          backgroundImage:
            'conic-gradient(from 0deg at 50% 50%,rgb(42,67,233) 0deg,rgba(42,138,246,0) 1turn)',
          border: '1px solid red',
          zIndex: -1,
          borderRadius: 9999,
        }}></Stack>
    </Stack>
  );
};

export default LoaderWrapper;
