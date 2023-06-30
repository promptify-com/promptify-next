import React, { PropsWithChildren } from 'react';
import { SxProps, Typography } from '@mui/material';

interface SubtitleProps extends PropsWithChildren {
  sx?: SxProps;
}

export const Subtitle: React.FC<SubtitleProps> = ({ sx, children }) => {
  return (
    <Typography
      sx={{
        color: 'grey.500',
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: 13,
        letterSpacing: '0.1em',
        ...sx,
      }}
      variant={'h6'}
    >
      {children}
    </Typography>
  );
};
