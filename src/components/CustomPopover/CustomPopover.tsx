import {
  Button,
  ClickAwayListener,
  Popover,
  type PopoverProps,
} from '@mui/material';
import {
  createContext,
  useContext,
  useState,
  type FC,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import Slot from '../canvas/nodes/components/cool-modal/Slot';

interface PopoverContext {
  handleOpen: (e: MouseEvent) => void;
  close: () => void;
  anchorEl: Element | null;
}

const PopoverContext = createContext({} as PopoverContext);

interface CustomPopoverProps {
  children: ReactNode;
}

const CustomPopover: FC<CustomPopoverProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpen = (e: MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const close = () => {
    setAnchorEl(null);
  };

  return (
    <PopoverContext.Provider value={{ handleOpen, close, anchorEl }}>
      {children}
    </PopoverContext.Provider>
  );
};

interface TriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

export const PopoverTrigger: FC<TriggerProps> = ({ asChild, children }) => {
  const { handleOpen } = useContext(PopoverContext);

  if (asChild) {
    return <Slot onClick={handleOpen}>{children as ReactElement}</Slot>;
  }

  return <Button onClick={handleOpen}>{children}</Button>;
};

interface PopoverContentProps
  extends Omit<PopoverProps, 'children' | 'open' | 'anchorEl'> {
  asChild?: boolean;
  children: ReactElement;
}

export const PopoverContent: FC<PopoverContentProps> = ({
  children,
  //   asChild,
}) => {
  const { anchorEl, close } = useContext(PopoverContext);

  //   const content = asChild ? (
  //     <Slot>{children as ReactElement}</Slot>
  //   ) : (
  //     <Box>{children}</Box>
  //   );

  return (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl}>
      <ClickAwayListener onClickAway={close}>{children}</ClickAwayListener>
    </Popover>
  );
};

export default CustomPopover;
