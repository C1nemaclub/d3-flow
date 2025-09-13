import { FormLabel, Stack } from '@mui/material';

const FieldWrapper = ({ label, endAdornment, children }) => {
  return (
    <Stack width='100%' gap={1}>
      <Stack width='100%' direction='row' justifyContent='space-between'>
        <FormLabel>{label}</FormLabel>
        {endAdornment}
      </Stack>
      {children}
    </Stack>
  );
};

export default FieldWrapper;
