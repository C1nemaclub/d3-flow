import ListBranch from './ListBranch';
import SingleBranch from './SingleBranch';

const FieldBranch = ({
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
