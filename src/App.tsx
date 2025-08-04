import { Button, CircularProgress, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import './App.css';
import Canvas from './components/canvas/Canvas';
import { queryClient } from './main';
import type { User } from './utils/types';

function App() {
  const { isPending, isLoading, error, data } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return await fetch('https://jsonplaceholder.typicode.com/users').then(
        (res) => res.json()
      );
    },
  });

  const mutation = useMutation<{ id: number }, Error, User>({
    mutationFn: async (user: User) => {
      console.log(user);
      const res: { id: number } = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'POST',
          body: JSON.stringify(user),
        }
      ).then((res) => res.json());
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <Stack component='main' width='100%' sx={{ p: 2 }}>
      <Stack direction='row' width='100%' height='100%'>
        {isPending || isLoading ? (
          'Loading'
        ) : (
          <Stack>
            <div>
              {data?.map((item) => {
                return <div key={item.id}>{item.name}</div>;
              })}
            </div>
            <div className='card'>
              <Button
                onClick={() => {
                  mutation.mutate({
                    id: Date.now(),
                    name: 'Hello Name',
                  });
                }}
                startIcon={
                  mutation.isPending && (
                    <CircularProgress size={20} color='inherit' />
                  )
                }
                variant='contained'>
                Create
              </Button>
            </div>
          </Stack>
        )}
        <ReactFlowProvider>
          <Canvas />
        </ReactFlowProvider>
      </Stack>
    </Stack>
  );
}

export default App;
