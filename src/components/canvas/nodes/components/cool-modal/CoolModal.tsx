import { Button, Dialog } from '@mui/material';
import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';
import Slot from './Slot';

type ModalContextProps = {
  isOpen: boolean;
  updateState: (val: boolean) => void;
};

const modalContext = createContext<ModalContextProps>({
  isOpen: false,
  updateState: () => {},
});

interface CoolModalProps {
  children: ReactNode;
}

export const CoolModal: FC<CoolModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateState = (val: boolean) => {
    setIsOpen(val);
  };

  return (
    <modalContext.Provider value={{ isOpen, updateState }}>
      {children}
    </modalContext.Provider>
  );
};

interface TriggerProps {
  asChild?: boolean;
}

export const Trigger: FC<PropsWithChildren<TriggerProps>> = ({
  asChild,
  children,
}) => {
  const { updateState } = useContext(modalContext);

  const handleState = () => {
    updateState(true);
  };

  if (asChild) {
    return <Slot onClick={handleState}>{children as ReactElement}</Slot>;
  }

  return <Button onClick={handleState}>{children}</Button>;
};

interface ContentProps {
  children: ReactNode | ((close: () => void) => ReactNode);
}

export const Content: FC<ContentProps> = ({ children }) => {
  const { isOpen, updateState } = useContext(modalContext);
  const closeModal = () => {
    updateState(false);
  };
  const content =
    typeof children === 'function' ? children(closeModal) : children;
  return (
    <Dialog open={isOpen} onClose={() => updateState(false)}>
      {content}
    </Dialog>
  );
};

export default CoolModal;
