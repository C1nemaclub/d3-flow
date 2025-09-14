import type { FC } from 'react';
import ListBranch from './ListBranch';
import SingleBranch from './SingleBranch';
import type {
  BaseInputProps,
  DataType,
  DynamicInputProps,
} from './types/types';

interface FieldBranchProps {
  actionProps: BaseInputProps;
  activeType: DataType;
  formPath: string;
  actionPath: string;
  renderField: ({
    value,
    onChange,
    index,
  }: {
    value: DynamicInputProps['value'];
    onChange: (value: DynamicInputProps['value']) => void;
    index?: boolean;
  }) => void;
}

const FieldBranch: FC<FieldBranchProps> = ({
  actionProps,
  formPath,
  renderField,
  activeType,
  actionPath,
}) => {
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
