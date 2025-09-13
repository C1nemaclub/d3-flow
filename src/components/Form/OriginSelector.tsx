import { Autocomplete, Stack, TextField } from '@mui/material';

const OriginSelector = ({ origin, value, onNewOrigin }) => {
  const origins = Object.entries(origin)
    .filter(([, value]) => value === true)
    .map(([name]) => name);

  if (origins.length <= 1) return null;

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
