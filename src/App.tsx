import { Stack } from '@mui/material';
import './App.css';
import DynamicForm from './components/Form/DynamicForm';

function App() {
  // const { isPending, isLoading, error, data } = useQuery<User[]>({
  //   queryKey: ['users'],
  //   queryFn: async () => {
  //     return await fetch('https://jsonplaceholder.typicode.com/users').then(
  //       (res) => res.json()
  //     );
  //   },
  // });

  // const mutation = useMutation<{ id: number }, Error, User>({
  //   mutationFn: async (user: User) => {
  //     console.log(user);
  //     const res: { id: number } = await fetch(
  //       'https://jsonplaceholder.typicode.com/users',
  //       {
  //         method: 'POST',
  //         body: JSON.stringify(user),
  //       }
  //     ).then((res) => res.json());
  //     return res;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //   },
  // });

  const saveToDB = (closeModal: () => void) => {
    console.log('save');
    console.log(closeModal());
  };

  return (
    <Stack
      component='main'
      width='100%'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '90vh',
      }}>
      <DynamicForm />
      {/* <CustomPopover>
        <PopoverTrigger asChild>
          <Button variant='contained' size='small'>
            Hello World
          </Button>
        </PopoverTrigger>
        <PopoverContent component='menu'>
          <Box>
            <MenuItem>Item1</MenuItem>
            <MenuItem>Item1</MenuItem>
            <MenuItem>Item1</MenuItem>
          </Box>
        </PopoverContent>
      </CustomPopover> */}
      {/* <Stack direction='row' width='100%' height='100%'> */}
      {/* {isPending || isLoading ? (
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
        )} */}
      {/* <CoolModal>
        <Trigger asChild>
          <Button variant='outlined'>Share</Button>
        </Trigger>
        <Content>
          {(closeModal) => {
            return (
              <>
                <Button onClick={() => saveToDB(closeModal)}>Save</Button>
                <LoaderWrapper />
              </>
            );
          }}
        </Content>
      </CoolModal> */}
      {/* <DropApp /> */}
      {/* <CompoundMenu>
        <Trigger>
          <Button>Menu</Button>
        </Trigger>
        <MenuContent
          sx={{
            [`& .${menuClasses.paper}`]: {
              width: 180,
            },
            [`& .${menuClasses.list}`]: {
              py: 0,
            },
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <CustomMenuItem>
            <ListItemText>Control</ListItemText>
          </CustomMenuItem>
          <CompoundMenu>
            <Trigger>
              <CustomMenuItem>
                <ListItemIcon>
                  <IconArrowDown />
                </ListItemIcon>
                <ListItemText>More</ListItemText>
              </CustomMenuItem>
            </Trigger>
            <MenuContent
              sx={{
                [`& .${menuClasses.paper}`]: {
                  width: 180,
                },
                [`& .${menuClasses.list}`]: {
                  py: 0,
                },
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}>
              <CustomMenuItem>
                <ListItemIcon>
                  <IconCopy />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </CustomMenuItem>
            </MenuContent>
          </CompoundMenu>
        </MenuContent>
      </CompoundMenu> */}
      {/* <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider> */}
      {/* <Editor /> */}
      {/* </Stack> */}
    </Stack>
  );
}

export default App;
