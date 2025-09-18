import type {
  ActionInputs,
  BaseInputProps,
  DataType,
  DynamicFormValues,
  DynamicInputProps,
} from './types';

export const inputs: ActionInputs = {
  age: {
    label: 'Age',
    origin: { fixed: true, output: true },
    required: true,
    dataTypes: [
      {
        isList: false,
        type: 'text',
      },
      {
        isList: true,
        type: 'integer',
      },
    ],
  },
  // emails: {
  //   label: 'List Of Emails',
  //   origin: { fixed: true, output: false, variable: true },
  //   required: true,
  //   dataTypes: [
  //     {
  //       isList: true,
  //       type: 'text',
  //     },
  //     {
  //       isList: true,
  //       type: 'date',
  //     },
  //   ],
  // },
  // schedule: {
  //   label: 'A Date',
  //   origin: { fixed: true, output: false, variable: true },
  //   required: true,
  //   dataTypes: [
  //     {
  //       isList: false,
  //       type: 'date',
  //     },
  //   ],
  // },
  user_data: {
    label: 'User Data',
    origin: { fixed: true, output: true, variable: true },
    required: true,
    dataTypes: [
      {
        isList: false,
        type: 'text',
      },
      {
        isList: false,
        type: 'json',
        keys: {
          first_name: {
            label: 'First Name',
            origin: { fixed: true, output: true, variable: true },
            required: true,
            dataTypes: [
              {
                type: 'text',
                isList: false,
              },
            ],
          },
          role: {
            label: 'Role',
            origin: { fixed: true, output: true, variable: true },
            required: true,
            dataTypes: [
              {
                type: 'text',
                isList: false,
              },
            ],
          },
          address: {
            label: 'Address',
            origin: { fixed: true, output: true, variable: true },
            required: true,
            dataTypes: [
              {
                isList: false,
                type: 'json',
                keys: {
                  primary: {
                    label: 'Primary',
                    origin: { fixed: true, output: true, variable: true },
                    required: true,
                    dataTypes: [
                      {
                        type: 'text',
                        isList: false,
                      },
                    ],
                  },
                  secondary: {
                    label: 'Secondary',
                    origin: { fixed: true, output: true, variable: true },
                    required: true,
                    dataTypes: [
                      {
                        type: 'text',
                        isList: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
};

export const getInitialDatatype = (params: BaseInputProps) => {
  const firstDataType = params.dataTypes[0];
  if (firstDataType) return firstDataType;
  return null;
};

export const getInitialProps = (props: DataType): DynamicInputProps => {
  const { type, isList } = props;
  switch (type) {
    case 'text':
      if (isList) {
        return {
          value: [],
          type: 'text',
          origin: 'fixed',
          isList: true,
        };
      }
      return {
        value: '',
        type: 'text',
        origin: 'fixed',
        isList: false,
      };
    case 'integer':
      if (isList) {
        return {
          value: [],
          type: 'integer',
          origin: 'fixed',
          isList: true,
        };
      }
      return {
        value: null,
        origin: 'fixed',
        type: 'integer',
        isList: false,
      };
    case 'date':
      if (isList) {
        return {
          value: [],
          type: 'date',
          origin: 'fixed',
          isList: true,
        };
      }
      return {
        value: null,
        origin: 'fixed',
        type: 'date',
        isList: false,
      };
    case 'json': {
      if (isList) {
        return {
          value: [],
          origin: 'fixed',
          type: 'json',
          isList: true,
        };
      }
      return {
        value: inputsToForm(props.keys ?? {}),
        origin: 'fixed',
        type: 'json',
        isList: false,
      };
    }
  }
};

export const inputsToForm = (action: ActionInputs) => {
  return Object.entries(action).reduce((acc, input) => {
    const [inputName, inputProps] = input;
    const initialDataType = getInitialDatatype(inputProps);
    if (!initialDataType) return acc;
    acc[inputName] = getInitialProps(initialDataType);
    return acc;
  }, {} as DynamicFormValues);
};
