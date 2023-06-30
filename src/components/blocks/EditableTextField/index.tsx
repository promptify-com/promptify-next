import { Popover, TextField, Typography } from '@mui/material';
import * as React from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { CommonProps } from '@mui/material/OverridableComponent';
import { useEffect } from 'react';

interface ITextField extends CommonProps {
  value: string;
  setValue: (value: string) => void;
  fontSize?: string;
  color?: string;
  multiline?: boolean;
}

export const EditableTextField = ({
  value,
  setValue,
  fontSize = '1rem',
  color = 'white',
  multiline = true,
}: ITextField) => {
  const [name, setName] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setName(value);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValue(name);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Typography
        fontSize={fontSize}
        color={color}
        onClick={handleClick}
        display="flex"
        alignItems="center"
        alignContent="center"
        fontFamily="Space Mono"
      >
        {name} <ModeEditIcon sx={{ fontSize, ml: '10px' }} />
      </Typography>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <TextField
          multiline={multiline}
          autoFocus
          inputProps={{ style: { fontSize, color: 'white', backgroundColor: '#373737' } }}
          value={name}
          onChange={event => setName(event.target.value)}
          onBlur={() => setValue(name)}
          sx={{ width: '300px', color: 'black', bgcolor: '#373737', fontFamily: 'Space Mono' }}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              setValue(name);
              handleClose();
            }
          }}
        />
      </Popover>
    </>
  );
};
