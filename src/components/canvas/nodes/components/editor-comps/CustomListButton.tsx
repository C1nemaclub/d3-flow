import {
  Box,
  Fade,
  ListItemButton,
  ListItemIcon,
  listItemIconClasses,
  ListItemText,
  Popper,
} from '@mui/material';
import type { FC } from 'react';
import { useRef } from 'react';

interface CustomListButtonProps {
  onClick: () => void;
  text: string;
  selected: boolean;
}

const CustomListButton: FC<CustomListButtonProps> = ({
  onClick,
  text,
  selected,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <ListItemButton onClick={onClick} selected={selected} ref={listRef}>
        <ListItemIcon
          sx={{
            [`&.${listItemIconClasses.root}`]: {
              minWidth: 'fit-content',
              mr: 2,
            },
          }}>
          📁
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
      <Popper
        open
        anchorEl={listRef.current}
        placement='right'
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4], // [x, y] -> 8px to the right
            },
          },
        ]}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350} in={selected}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              The content of the Popper for {text}.
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default CustomListButton;
