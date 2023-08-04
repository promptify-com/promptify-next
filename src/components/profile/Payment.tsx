import React from 'react';
import { Box, Typography } from '@mui/material';

export const Payment = () => {
  return (
    <section id="payment" style={{ scrollMarginTop: '100px', marginTop: '8rem', height: '90vh' }}>
      <Box>
        <Typography
          fontWeight={500}
          fontSize={{ xs: '1.5rem', sm: '2rem' }}
          textAlign={{ xs: 'center', sm: 'start' }}
        >
          Payment Info
        </Typography>
        <Box display="flex" justifyContent="center">
          <Typography
            fontWeight={500}
            fontSize="1rem"
            mt={{ xs: '1rem', sm: '2rem' }}
            textAlign={{ xs: 'center', sm: 'start' }}
            width={{ xs: '80%', sm: '100%' }}
          >
            Choose what you want to share blah balh blah, short description in
          </Typography>
        </Box>
        <Box
          height="70px"
          border="1px solid #BCBCBC"
          borderRadius="15px"
          display="flex"
          alignItems="center"
          mt={{ xs: '1rem', sm: '0.5rem' }}
        >
          <Typography
            ml="3rem"
            fontWeight={500}
            fontSize={{ xs: '1rem', sm: '2rem' }}
            color="#B8B8B8"
          >
            Selling Pro for free users here
          </Typography>
        </Box>
      </Box>
    </section>
  );
};
