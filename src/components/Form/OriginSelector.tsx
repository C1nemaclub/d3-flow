import { Autocomplete, Stack, TextField } from '@mui/material';

const OriginSelector = ({ origin, value, onNewOrigin }) => {
  const origins = Object.keys(origin);

  return (
    <Stack
      width='100%'
      sx={{
        maxWidth: 200,
      }}>
      <Autocomplete
        disableClearable
        options={origins}
        fullWidth
        value={value}
        onChange={(_, v) => {
          onNewOrigin(v);
        }}
        renderInput={(params) => {
          {
            return <TextField {...params} size='small' />;
          }
        }}
      />
    </Stack>
  );
};

export default OriginSelector;
