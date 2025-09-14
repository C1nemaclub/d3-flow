import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormProvider, get, useForm } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import AdaptableField from './AdaptableField';
import FieldBranch from './FieldBranch';
import FieldWrapper from './FieldWrapper';
import OriginSelector from './OriginSelector';
import { inputs, inputsToForm } from './types/constants';
import type {
  ActionInputs,
  BaseInputProps,
  DateInput,
  DynamicFormValues,
  DynamicInputProps,
} from './types/types';
const DynamicForm = () => {
  const form = useForm<DynamicFormValues>({
    defaultValues: inputsToForm(inputs),
    mode: 'onChange',
  });

  const values = form.getValues();

  const handleNewOrigin = (newOrigin: 'fixed' | 'output', formPath: string) => {
    if (newOrigin !== 'fixed') {
      form.setValue(`${formPath}.origin`, newOrigin);
      form.setValue(`${formPath}.value`, '');
      return;
    }
    form.setValue(`${formPath}.origin`, newOrigin);
    // form.setValue(`${formPath}.value`, newValue);
  };

  const getActionProps = (action: ActionInputs, path: string) => {
    const otherpath = path.split('.').join('.dataTypes.0.keys.');
    console.log(otherpath);

    const result = get(action, path.split('.').join('.dataTypes.0.keys.'));
    if (!result) {
      console.log('Si me viste F ❌❌❌❌');
    }
    return result;
  };

  const renderField = ({
    formPath,
    actionPath,
  }: {
    formPath: string;
    actionPath: string;
  }) => {
    const formProps: DynamicInputProps | undefined = get(values, formPath);
    const actionProps: BaseInputProps = getActionProps(inputs, actionPath);

    if (!formProps) {
      return `No formProps found Path: ${formPath}`;
    }
    if (!actionProps) {
      return `No actionProps found Path: ${actionPath}`;
    }

    const activeType = actionProps.dataTypes.find(
      (t) => t.type === formProps.type
    );
    if (!activeType) {
      return `No active type found for ${formPath}`;
    }

    const isFlexible = formProps.origin !== 'fixed';

    if (isFlexible)
      return (
        <FieldWrapper
          label={actionProps.label}
          endAdornment={
            <OriginSelector
              value={formProps.origin}
              origin={actionProps.origin}
              onNewOrigin={(newOrigin: 'fixed' | 'output') =>
                handleNewOrigin(newOrigin, formPath)
              }
            />
          }>
          <AdaptableField />
        </FieldWrapper>
      );

    console.log(actionProps.dataTypes);

    switch (formProps.type) {
      case 'integer':
      case 'text':
        return (
          <FieldWrapper
            label={`${actionProps.label} - ${activeType.type}`}
            endAdornment={
              <Stack
                direction='row'
                alignItems='center'
                gap={1}
                sx={{
                  width: '100%',
                  maxWidth: 500,
                }}>
                <Autocomplete
                  disableClearable
                  options={actionProps.dataTypes}
                  value={activeType}
                  getOptionLabel={(opt) => opt.type}
                  fullWidth
                  onChange={(_, v) => {
                    console.log(v);
                    form.setValue(`${formPath}.type`, v.type);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size='small' />
                  )}
                />
                <OriginSelector
                  value={formProps.origin}
                  origin={actionProps.origin}
                  onNewOrigin={(newOrigin: 'fixed' | 'output') =>
                    handleNewOrigin(newOrigin, formPath)
                  }
                />
              </Stack>
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
      case 'date':
        return (
          <FieldWrapper
            label={actionProps.label}
            endAdornment={
              <Stack
                direction='row'
                alignItems='center'
                gap={1}
                sx={{
                  width: '100%',
                  maxWidth: 500,
                }}>
                <Autocomplete
                  disableClearable
                  options={actionProps.dataTypes}
                  value={activeType}
                  getOptionLabel={(opt) => opt.type}
                  fullWidth
                  onChange={(_, v) => {
                    console.log(v);
                    form.setValue(`${formPath}.type`, v.type);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size='small' />
                  )}
                />
                <OriginSelector
                  value={formProps.origin}
                  origin={actionProps.origin}
                  onNewOrigin={(newOrigin: 'fixed' | 'output') =>
                    handleNewOrigin(newOrigin, formPath)
                  }
                />
              </Stack>
            }>
            <FieldBranch
              actionPath={actionPath}
              activeType={activeType}
              formPath={formPath}
              actionProps={actionProps}
              renderField={({ value, onChange }) => {
                return (
                  <DatePicker
                    value={value as DateInput['value']}
                    onChange={(newValue) => onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                );
              }}
            />
          </FieldWrapper>
        );
      case 'json': {
        const firstDt = actionProps.dataTypes[0].keys;
        const nestedInputs = inputsToForm(firstDt);
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
                onNewOrigin={(newOrigin: 'fixed' | 'output') => {
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
                  return Object.keys(nestedInputs).map((key) => {
                    const itemPath = `${formPath}.value.${key}`;
                    return (
                      <Fragment key={itemPath}>
                        {/* {String(`${formPath}.value.${index}`)} */}
                        {/* <pre>{JSON.stringify({ key }, null, 2)}</pre> */}
                        {renderField({
                          // formPath: itemPath,
                          formPath:
                            index !== undefined
                              ? `${formPath}.value.${index}.value.${key}`
                              : `${formPath}.value.${key}`,
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

  const onSubmit = (values: DynamicFormValues) => {
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
