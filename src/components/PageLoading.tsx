import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const PageLoading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
