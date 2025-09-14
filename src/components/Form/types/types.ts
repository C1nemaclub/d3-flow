import type { Dayjs } from 'dayjs';

type ArrayedInput<T> = {
  id: string;
  value: T;
}[];

// Generic input type
type BaseInput<T, Type extends string, IsList extends boolean> = {
  origin: 'fixed';
  type: Type;
  isList: IsList;
  value: IsList extends true ? ArrayedInput<T> : T;
};

// Specializations
export type TextInput = BaseInput<string, 'text', false>;
export type ListTextInput = BaseInput<string, 'text', true>;

export type NumberInput = BaseInput<number | null, 'integer', false>;
export type ListNumberInput = BaseInput<number | null, 'integer', true>;

export type DateInput = BaseInput<Dayjs | null, 'date', false>;
export type ListDateInput = BaseInput<Dayjs | null, 'date', true>;

export type JsonInput = BaseInput<DynamicFormValues, 'json', false>;
export type ListJsonInput = BaseInput<DynamicFormValues, 'json', true>;

// External
export type OutputInput = {
  origin: 'output';
  value: string;
  type: string;
};

export type DynamicInputProps =
  | TextInput
  | ListTextInput
  | NumberInput
  | ListNumberInput
  | DateInput
  | ListDateInput
  | JsonInput
  | ListJsonInput
  | OutputInput;

export type DynamicFormValues = { [inputName: string]: DynamicInputProps };

// const values: DynamicFormValues = {
//   email: {
//     value: '',
//     origin: 'fixed',
//     type: 'text',
//     isList: false,
//   },
//   user_data: {
//     isList: true,
//     origin: 'fixed',
//     type: 'json',
//     value: [
//       {
//         id: '123',
//         value: {
//           first_name: {
//             value: '',
//             origin: 'fixed',
//             type: 'text',
//             isList: false,
//           },
//         },
//       },
//     ],
//   },
// };

export interface DataType {
  isList: boolean;
  type: 'text' | 'integer' | 'json' | 'date';
  keys?: ActionInputs;
}

export interface BaseInputProps {
  label: string;
  origin: Record<string, boolean>;
  required: boolean;
  dataTypes: DataType[];
}
export type ActionInputs = { [inputName: string]: BaseInputProps };
