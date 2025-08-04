import { IconButton } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import type { FC } from 'react';

interface InsertNodeButtonProps {
  onClick: () => void;
}

const InsertNodeButton: FC<InsertNodeButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      color='primary'
      sx={{
        backgroundColor: ({ palette }) => palette.primary.light,
        color: ({ palette }) => palette.common.white,
        '&:hover': {
          backgroundColor: ({ palette }) => palette.primary.light,
          p: 1.25,
        },
        transition: 'ease-in-out 0.1s padding',
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      <IconPlus />
    </IconButton>
  );
};

export default InsertNodeButton;
