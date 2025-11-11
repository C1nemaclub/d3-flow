import { CircularProgress, Stack, Typography } from '@mui/material';
import useUsers from './hooks/useUsers';

const ManualQuery = () => {
  const { usersQuery } = useUsers();

  return (
    <Stack alignContent='center' alignItems='center' gap={2}>
      <Typography variant='h5'>ManualQuery</Typography>
      {usersQuery.isLoading ? (
        <CircularProgress />
      ) : (
        usersQuery.data.map((user: { name: string; phone: string }) => {
          return (
            <Stack>
              <Typography>Name: {user.name}</Typography>
              <Typography>Phone: {user.phone}</Typography>
            </Stack>
          );
        })
      )}
    </Stack>
  );
};

export default ManualQuery;
