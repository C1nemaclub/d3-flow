import { Divider, List, Typography } from '@mui/material';
import type { SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CustomListButton from './CustomListButton';

export interface KeyHandle {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<KeyHandle, SuggestionProps<string>>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectItem = (index: number, type: string) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item, index: selectedIndex, type });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex, 'boolean');
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <List
        dense
        disablePadding
        sx={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'text.secondary',
          width: '100%',
          backgroundColor: 'background.paper',
        }}>
        {props.items.length ? (
          props.items.map((item, index) => {
            return (
              <>
                <CustomListButton
                  onClick={() => selectItem(index, 'string')}
                  selected={index === selectedIndex}
                  text={item}
                />
                <Divider
                  flexItem
                  sx={{
                    borderColor: 'divider',
                  }}
                />
              </>
            );
          })
        ) : (
          <Typography>No Result</Typography>
        )}
      </List>
    );
  }
);

export default MentionList;
