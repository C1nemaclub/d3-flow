import { Button, Stack, TextField, Typography } from '@mui/material';
import { FormProvider, get, useForm } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import AdaptableField from './AdaptableField';
import FieldBranch from './FieldBranch';
import FieldWrapper from './FieldWrapper';
import OriginSelector from './OriginSelector';
import { inputs, inputsToForm } from './types/constants';
const DynamicForm = () => {
  const form = useForm({
    defaultValues: inputsToForm(inputs),
    mode: 'onChange',
  });

  const values = form.getValues();

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

  const renderField = ({
    formPath,
    actionPath,
  }: {
    formPath: string;
    actionPath: string;
  }) => {
    const formProps = get(values, formPath);
    const actionProps = getActionProps(inputs, actionPath);

    if (!formProps) {
      console.log(formPath);
      console.log(formProps);
      return `No formProps found Path: ${formProps}`;
    }
    if (!actionProps) {
      console.log(actionPath);
      return `No actionProps found Path: ${actionPath}`;
    }

    const activeType = actionProps.dataTypes.find(
      (t) => t.type === formProps.type
    );

    const isFlexible = formProps.origin !== 'fixed';

    if (isFlexible)
      return (
        <FieldWrapper
          label={actionProps.label}
          endAdornment={
            <OriginSelector
              value={formProps.origin}
              origin={actionProps.origin}
              onNewOrigin={(newOrigin) => handleNewOrigin(newOrigin, formPath)}
            />
          }>
          <AdaptableField />
        </FieldWrapper>
      );

    switch (formProps.type) {
      case 'integer':
      case 'text':
        return (
          <FieldWrapper
            label={actionProps.label}
            endAdornment={
              <OriginSelector
                value={formProps.origin}
                origin={actionProps.origin}
                onNewOrigin={(newOrigin) =>
                  handleNewOrigin(newOrigin, formPath)
                }
              />
            }>
            <FieldBranch
              actionPath={actionPath}
              activeType={activeType}
              formPath={formPath}
              actionProps={actionProps}
              renderField={({ value, onChange }) => {
                return (
                  <TextField
                    value={value}
                    onChange={(v) => onChange(v.target.value)}
                    fullWidth
                    size='small'
                  />
                );
              }}
            />
          </FieldWrapper>
        );
      case 'json': {
        const nestedProps = get(values, `${formPath}.value`);
        return (
          <Stack component='fieldset'>
            <Stack
              component='legend'
              direction='row'
              gap={1}
              alignItems='center'
              width='100%'
              justifyContent='center'>
              <Typography>{actionProps.label}</Typography>
              <OriginSelector
                value={formProps.origin}
                origin={actionProps.origin}
                onNewOrigin={(newOrigin) => {
                  handleNewOrigin(newOrigin, formPath);
                }}
              />
            </Stack>
            <FieldBranch
              activeType={activeType}
              formPath={formPath}
              actionProps={actionProps}
              actionPath={actionPath}
              renderField={({ index }) => {
                {
                  return Object.keys(nestedProps).map((key) => {
                    const itemPath = `${formPath}.value.${key}`;
                    return (
                      <Fragment key={itemPath}>
                        {/* {String(`${formPath}.value.${index}`)} */}
                        {renderField({
                          formPath: itemPath,
                          // formPath:
                          //   index !== undefined
                          //     ? `${formPath}.value.${index}.${key}`
                          //     : `${formPath}.value.${key}`,
                          actionPath: `${actionPath}.${key}`,
                        })}
                      </Fragment>
                    );
                  });
                }
              }}
            />
          </Stack>
        );
      }
      default:
        return `No input defined for ${formProps.type}`;
    }
  };

  const onSubmit = (values) => {
    console.log(values);
  };

  // console.log(form.watch());

  return (
    <Stack width='100%' alignItems='center' gap={1}>
      <Typography
        variant='h2'
        color='text.primary'
        fontSize={'1.5rem'}
        gutterBottom>
        Form
      </Typography>
      <Stack
        component='form'
        direction='column'
        gap={1}
        width={'100%'}
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{
          maxWidth: 'md',
        }}>
        <FormProvider {...form}>
          {Object.keys(values).map((inputName) => {
            return (
              <Stack key={inputName}>
                {renderField({ formPath: inputName, actionPath: inputName })}
              </Stack>
            );
          })}
          <pre>{JSON.stringify({ v: form.watch() }, null, 2)}</pre>
          <Button type='submit' variant='contained' color='warning'>
            Save
          </Button>
        </FormProvider>
      </Stack>
    </Stack>
  );
};

export default DynamicForm;
