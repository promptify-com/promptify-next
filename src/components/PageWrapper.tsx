import React, { PropsWithChildren } from 'react';
import Protected from './Protected';
import { Box } from '@mui/material';

interface PageWrapperProps extends PropsWithChildren {
  showLoadingPage?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ showLoadingPage, children }) => {
  return (
    <Protected showLoadingPage={showLoadingPage}>
      <Box sx={{ minHeight: '100vh', width: '100vw' }} flexDirection="column" alignItems="center">
        {children}
      </Box>
    </Protected>
  );
};
