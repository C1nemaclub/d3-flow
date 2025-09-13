export const inputs = {
  // age: {
  //   label: 'Age',
  //   origin: { fixed: true, output: true },
  //   required: true,
  //   dataTypes: [
  //     {
  //       isList: false,
  //       type: 'text',
  //     },
  //   ],
  // },
  // emails: {
  //   label: 'List Of Emails',
  //   origin: { fixed: true, output: true, variable: true },
  //   required: true,
  //   dataTypes: [
  //     {
  //       isList: true,
  //       type: 'text',
  //     },
  //   ],
  // },
  address: {
    label: 'User Data',
    origin: { fixed: true, output: true, variable: true },
    required: true,
    dataTypes: [
      {
        isList: true,
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
        },
      },
    ],
  },
};

export const getInitialDatatype = (params) => {
  const firstDataType = params.dataTypes[0];
  if (firstDataType) return firstDataType;
  return null;
};

export const getInitialProps = (props) => {
  const { type, isList } = props;
  switch (type) {
    case 'text':
      return {
        value: isList ? [] : '',
        origin: 'fixed',
        type: 'text',
      };
    case 'integer':
      return {
        value: isList ? [] : null,
        origin: 'fixed',
        type: 'integer',
      };
    case 'json': {
      return {
        value: isList ? [] : inputsToForm(props.keys),
        origin: 'fixed',
        type: 'json',
      };
    }
  }
};

export const inputsToForm = (action: typeof inputs) => {
  return Object.entries(action).reduce((acc, input) => {
    const [inputName, inputProps] = input;
    const initialDataType = getInitialDatatype(inputProps);
    acc[inputName] = getInitialProps(initialDataType);
    return acc;
  }, {} as any);
};

// console.log(inputsToForm(inputs));
