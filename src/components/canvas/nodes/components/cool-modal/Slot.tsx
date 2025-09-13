import {
  cloneElement,
  type FC,
  isValidElement,
  type ReactElement,
} from 'react';

export interface SlotProps extends Record<string, unknown> {
  children: ReactElement;
}

const Slot: FC<SlotProps> = ({ children, ...props }) => {
  if (!isValidElement(children)) return null;

  // Type guard to ensure children is a ReactElement with known props
  const element = children as ReactElement<{ className?: string }>;

  return cloneElement(element, {
    ...props,
    className: [element.props.className, props.className]
      .filter(Boolean)
      .join(' '),
  });
};

export default Slot;
