import { useController, useFormContext } from 'react-hook-form';

const SingleBranch = ({ actionProps, formPath, renderField }) => {
  const form = useFormContext();
  const { field } = useController({
    control: form.control,
    name: `${formPath}.value`,
  });

  return renderField({
    value: field.value,
    onChange: field.onChange,
  });
};

export default SingleBranch;
