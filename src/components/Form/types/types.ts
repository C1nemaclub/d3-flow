type ArrayedInput<T> = {
  id: string;
  value: T;
}[];

export type TextInput = {
  value: string | ArrayedInput<string>;
  origin: 'fixed' | 'output';
  type: 'text';
};

export type IntegerInput = {
  value: number | null | ArrayedInput<number | null>;
  origin: 'fixed' | 'output';
  type: 'integer';
};
