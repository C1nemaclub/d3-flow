import { useQuery } from '@tanstack/react-query';

const useUsers = () => {
  const getUsers = async () => {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e, 'there was an error 👽');
    }
  };

  const usersQuery = useQuery({
    queryKey: ['users'],
    enabled: true,
    queryFn: getUsers,
  });

  return { usersQuery };
};

export default useUsers;
