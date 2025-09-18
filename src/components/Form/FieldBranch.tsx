import ListBranch from './ListBranch';
import SingleBranch from './SingleBranch';
import type {
  BaseInputProps,
  DataType,
  DynamicInputProps,
} from './types/types';

interface FieldBranchProps<T extends DynamicInputProps> {
  actionProps: BaseInputProps;
  activeType: DataType;
  formPath: string;
  actionPath: string;
  renderField: ({
    value,
    onChange,
    index,
  }: {
    value: T['value'];
    onChange: (value: T['value']) => void;
    index?: boolean;
  }) => void;
}

const FieldBranch = <T extends DynamicInputProps>({
  actionProps,
  formPath,
  renderField,
  activeType,
  actionPath,
}: FieldBranchProps<T>) => {
  const { isList } = activeType;

  if (isList) {
    return (
      <ListBranch
        renderField={renderField}
        actionProps={actionProps}
        formPath={formPath}
        actionPath={actionPath}
      />
    );
  }

  return (
    <SingleBranch
      renderField={renderField}
      actionProps={actionProps}
      formPath={formPath}
    />
  );
};

export default FieldBranch;
