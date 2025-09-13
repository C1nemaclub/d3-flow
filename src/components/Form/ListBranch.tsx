import { Button, IconButton, Stack } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import {
  Controller,
  get,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import AdaptableField from './AdaptableField';
import OriginSelector from './OriginSelector';
import { inputs, inputsToForm } from './types/constants';

const ListBranch = ({ actionProps, formPath, renderField, actionPath }) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${formPath}.value`,
  });

  const appendItem = () => {
    const firstDt = actionProps.dataTypes[0].keys;
    if (firstDt) {
      const nestedInputs = inputsToForm(firstDt);
      if (nestedInputs) {
        append({
          id: crypto.randomUUID(),
          value: nestedInputs,
          origin: 'fixed',
        });
        return;
      }
    }
    append({ id: crypto.randomUUID(), value: '', origin: 'fixed' });
  };

  // const handleNewOrigin = (newOrigin, formPath) => {
  //   form.setValue(`${formPath}.origin`, newOrigin);
  // };

  const handleNewOrigin = (newOrigin, formPath) => {
    if (newOrigin !== 'fixed') {
      form.setValue(`${formPath}.origin`, newOrigin);
      form.setValue(`${formPath}.value`, '');
      return;
    }
    form.setValue(`${formPath}.origin`, newOrigin);
    // form.setValue(`${formPath}.value`, newValue);
  };
  const getActionProps = (action, path) => {
    return get(action, path.split('.').join('.dataTypes.0.keys.'));
  };

  const act = getActionProps(inputs, actionPath);

  return (
    <Stack gap={1}>
      {fields.map((item, index) => {
        const itemPath = `${formPath}.value.${index}`;
        return (
          <Controller
            key={item.id}
            control={form.control}
            name={`${itemPath}.value`}
            render={({ field }) => {
              const formProps = get(form.getValues(), itemPath);
              return (
                <Stack
                  direction='row'
                  gap={1}
                  justifyContent='space-between'
                  key={item.id}>
                  {formProps.origin !== 'fixed' ? (
                    <AdaptableField />
                  ) : (
                    renderField({
                      value: field.value,
                      onChange: field.onChange,
                      index: index,
                    })
                  )}

                  <OriginSelector
                    value={formProps.origin}
                    origin={actionProps.origin}
                    onNewOrigin={(newOrigin) =>
                      handleNewOrigin(newOrigin, itemPath)
                    }
                  />
                  <IconButton onClick={() => remove(index)}>
                    <IconTrash />
                  </IconButton>
                </Stack>
              );
            }}
          />
        );
      })}
      <Button variant='contained' onClick={appendItem}>
        Add
      </Button>
    </Stack>
  );
};

export default ListBranch;
