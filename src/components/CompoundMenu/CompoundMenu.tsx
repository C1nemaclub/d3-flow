import {
  Box,
  ClickAwayListener,
  Fade,
  Menu,
  MenuItem,
  Typography,
  type MenuItemProps,
  type MenuProps,
} from '@mui/material';
import {
  createContext,
  useContext,
  useState,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
} from 'react';

const MenuContext = createContext(
  {} as {
    handleClick: (e: MouseEvent<HTMLElement>) => void;
    anchor: HTMLElement | null;
    close: () => void;
  }
);

export const CompoundMenu: FC<PropsWithChildren> = ({ children }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : e.currentTarget);
  };

  const close = () => {
    setAnchor(null);
  };

  console.log(anchor, 'anchor');

  return (
    <MenuContext.Provider value={{ handleClick, anchor, close }}>
      {children}
    </MenuContext.Provider>
  );
};

export const Trigger: FC<PropsWithChildren> = ({ children }) => {
  const { handleClick } = useContext(MenuContext);
  return <Typography onClick={handleClick}>{children}</Typography>;
};

export const MenuContent: FC<Omit<MenuProps, 'open' | 'anchorEl'>> = ({
  children,
  ...rest
}) => {
  const { anchor, close } = useContext(MenuContext);
  return (
    <Menu open={Boolean(anchor)} anchorEl={anchor} {...rest}>
      <ClickAwayListener onClickAway={close}>
        <Fade in={Boolean(anchor)}>
          <Box>{children}</Box>
        </Fade>
      </ClickAwayListener>
    </Menu>
  );
};

export const CustomMenuItem: FC<MenuItemProps> = ({ children, ...rest }) => {
  return <MenuItem {...rest}>{children}</MenuItem>;
};
